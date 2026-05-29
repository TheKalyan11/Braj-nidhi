"use client";

import React, { useState, useEffect, useCallback } from "react";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface ChatLog {
  id: string;
  ip: string;
  userMessage: string;
  botReply: string;
  tokens: number;
  timestamp: string;
}

interface ChatStats {
  totalChats: number;
  todayChats: number;
  totalTokens: number;
  topQuestions: { q: string; count: number }[];
}

interface TrainingEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

/* ─── Constants ──────────────────────────────────────────────────────── */

const CATEGORIES = [
  "rooms",
  "temples",
  "dining",
  "rules",
  "booking",
  "transport",
  "pricing",
  "amenities",
  "general",
];

/* ─── Component ──────────────────────────────────────────────────────── */

export default function AdminChatbotPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);

  // Accounting state
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);

  // Training state
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [trainLoading, setTrainLoading] = useState(false);

  // Training form
  const [editId, setEditId] = useState<string | null>(null);
  const [formQ, setFormQ] = useState("");
  const [formA, setFormA] = useState("");
  const [formCat, setFormCat] = useState("general");

  // Test chat
  const [testMessages, setTestMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [testInput, setTestInput] = useState("");
  const [testLoading, setTestLoading] = useState(false);

  // Active tab
  const [tab, setTab] = useState<"accounting" | "training" | "test">(
    "accounting"
  );

  /* ─── Auth ───────────────────────────────────────────────────────── */

  const headers = useCallback(
    () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` }),
    [token]
  );

  async function handleLogin() {
    if (!token.trim()) return;
    try {
      const res = await fetch("/api/chat/logs?limit=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAuthed(true);
      } else {
        alert("Invalid admin token");
      }
    } catch {
      alert("Connection error");
    }
  }

  /* ─── Load data ─────────────────────────────────────────────────── */

  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/chat/logs?limit=200", { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs ?? []);
        setStats(data.stats ?? null);
      }
    } catch (e) {
      console.error("Failed to load logs:", e);
    } finally {
      setLogsLoading(false);
    }
  }, [headers]);

  const loadTraining = useCallback(async () => {
    setTrainLoading(true);
    try {
      const res = await fetch("/api/chat/training", { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries ?? []);
      }
    } catch (e) {
      console.error("Failed to load training:", e);
    } finally {
      setTrainLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    if (authed) {
      loadLogs();
      loadTraining();
    }
  }, [authed, loadLogs, loadTraining]);

  /* ─── Training CRUD ────────────────────────────────────────────── */

  async function saveEntry() {
    if (!formQ.trim() || !formA.trim()) return alert("Question and Answer are required");
    try {
      const res = await fetch("/api/chat/training", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          id: editId || undefined,
          question: formQ,
          answer: formA,
          category: formCat,
        }),
      });
      if (res.ok) {
        setFormQ("");
        setFormA("");
        setFormCat("general");
        setEditId(null);
        loadTraining();
      } else {
        alert("Failed to save");
      }
    } catch {
      alert("Connection error");
    }
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this training entry?")) return;
    try {
      await fetch("/api/chat/training", {
        method: "DELETE",
        headers: headers(),
        body: JSON.stringify({ id }),
      });
      loadTraining();
    } catch {
      alert("Failed to delete");
    }
  }

  function editEntry(e: TrainingEntry) {
    setEditId(e.id);
    setFormQ(e.question);
    setFormA(e.answer);
    setFormCat(e.category);
    setTab("training");
  }

  /* ─── Test Chat ────────────────────────────────────────────────── */

  async function sendTestMessage() {
    if (!testInput.trim()) return;
    const userMsg = testInput.trim();
    setTestInput("");
    const newMsgs = [...testMessages, { role: "user" as const, content: userMsg }];
    setTestMessages(newMsgs);
    setTestLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs.slice(-8),
          systemPrompt:
            "You are Braj Nidhi Guesthouse's AI assistant. Help guests with room info, bookings, temple visits, and local guidance in Vrindavan.",
        }),
      });
      const data = await res.json();
      setTestMessages([...newMsgs, { role: "assistant", content: data.reply || "No response" }]);
    } catch {
      setTestMessages([
        ...newMsgs,
        { role: "assistant", content: "Error: Could not get response" },
      ]);
    } finally {
      setTestLoading(false);
    }
  }

  /* ─── Render — Login ────────────────────────────────────────────── */

  if (!authed) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Chatbot Admin</h2>
          <p style={{ color: "#94a3b8", marginBottom: 16 }}>
            Enter admin token to continue
          </p>
          <input
            type="password"
            placeholder="Admin Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={styles.input}
          />
          <button onClick={handleLogin} style={styles.btnPrimary}>
            Login
          </button>
        </div>
      </div>
    );
  }

  /* ─── Render — Dashboard ─────────────────────────────────────── */

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>AI Chatbot Admin</h1>
        <div style={styles.tabBar}>
          {(["accounting", "training", "test"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...styles.tabBtn,
                ...(tab === t ? styles.tabActive : {}),
              }}
            >
              {t === "accounting"
                ? "Accounting"
                : t === "training"
                ? "Training"
                : "Test Chat"}
            </button>
          ))}
        </div>
      </div>

      {/* ── ACCOUNTING TAB ─────────────────────────────────────── */}
      {tab === "accounting" && (
        <div style={styles.section}>
          {/* Stats cards */}
          <div style={styles.statsRow}>
            <StatCard label="Total Chats" value={stats?.totalChats ?? 0} color="#3b82f6" />
            <StatCard label="Today" value={stats?.todayChats ?? 0} color="#10b981" />
            <StatCard label="Total Tokens" value={stats?.totalTokens ?? 0} color="#f59e0b" />
          </div>

          {/* Top questions */}
          {stats && stats.topQuestions.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Top Questions</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Question</th>
                      <th style={{ ...styles.th, width: 80, textAlign: "center" }}>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topQuestions.map((q, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{q.q}</td>
                        <td style={{ ...styles.td, textAlign: "center", fontWeight: 600 }}>
                          {q.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Chat logs */}
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={styles.cardTitle}>Conversation Logs</h3>
              <button onClick={loadLogs} disabled={logsLoading} style={styles.btnSmall}>
                {logsLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
            {logs.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>
                No chat logs yet
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Time</th>
                      <th style={styles.th}>IP</th>
                      <th style={styles.th}>User Message</th>
                      <th style={styles.th}>Bot Reply</th>
                      <th style={{ ...styles.th, width: 70, textAlign: "center" }}>Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ ...styles.td, whiteSpace: "nowrap", fontSize: 12 }}>
                          {fmtTime(log.timestamp)}
                        </td>
                        <td style={{ ...styles.td, fontSize: 12, fontFamily: "monospace" }}>
                          {log.ip.slice(0, 15)}
                        </td>
                        <td style={{ ...styles.td, maxWidth: 250 }}>
                          <div style={styles.truncate}>{log.userMessage}</div>
                        </td>
                        <td style={{ ...styles.td, maxWidth: 300 }}>
                          <div style={styles.truncate}>{log.botReply}</div>
                        </td>
                        <td style={{ ...styles.td, textAlign: "center", fontWeight: 600 }}>
                          {log.tokens}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TRAINING TAB ───────────────────────────────────────── */}
      {tab === "training" && (
        <div style={styles.section}>
          {/* Form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              {editId ? "Edit Training Entry" : "Add Training Entry"}
            </h3>
            <div style={styles.formGrid}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={styles.label}>Category</label>
                <select
                  value={formCat}
                  onChange={(e) => setFormCat(e.target.value)}
                  style={styles.input}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={styles.label}>Question / Trigger</label>
                <input
                  value={formQ}
                  onChange={(e) => setFormQ(e.target.value)}
                  placeholder="e.g. What are the room rates?"
                  style={styles.input}
                />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={styles.label}>Answer</label>
                <textarea
                  value={formA}
                  onChange={(e) => setFormA(e.target.value)}
                  placeholder="The ideal response the chatbot should give..."
                  rows={4}
                  style={{ ...styles.input, resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveEntry} style={styles.btnPrimary}>
                  {editId ? "Update" : "Add Entry"}
                </button>
                {editId && (
                  <button
                    onClick={() => {
                      setEditId(null);
                      setFormQ("");
                      setFormA("");
                      setFormCat("general");
                    }}
                    style={styles.btnSmall}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Existing entries */}
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={styles.cardTitle}>
                Training Data ({entries.length} entries)
              </h3>
              <button onClick={loadTraining} disabled={trainLoading} style={styles.btnSmall}>
                {trainLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
            {entries.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>
                No training entries yet. Add some above.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {entries.map((e) => (
                  <div key={e.id} style={styles.entryCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={styles.catBadge}>{e.category}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => editEntry(e)} style={styles.iconBtn} title="Edit">
                          &#9998;
                        </button>
                        <button onClick={() => deleteEntry(e.id)} style={{ ...styles.iconBtn, color: "#ef4444" }} title="Delete">
                          &#10005;
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <strong style={{ color: "#e2e8f0" }}>Q:</strong>{" "}
                      <span style={{ color: "#cbd5e1" }}>{e.question}</span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <strong style={{ color: "#e2e8f0" }}>A:</strong>{" "}
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>{e.answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TEST CHAT TAB ─────────────────────────────────────── */}
      {tab === "test" && (
        <div style={styles.section}>
          <div style={{ ...styles.card, display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", minHeight: 400 }}>
            <h3 style={{ ...styles.cardTitle, marginBottom: 12 }}>Test Chatbot</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 12 }}>
              Test the chatbot with your training data. Messages go through the real /api/chat endpoint.
            </p>

            {/* Chat window */}
            <div style={styles.chatWindow}>
              {testMessages.length === 0 && (
                <p style={{ color: "#64748b", textAlign: "center", marginTop: 40 }}>
                  Send a message to start testing...
                </p>
              )}
              {testMessages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.chatBubble,
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    background: m.role === "user" ? "#3b82f6" : "#1e293b",
                    color: "#fff",
                  }}
                >
                  {m.content}
                </div>
              ))}
              {testLoading && (
                <div style={{ ...styles.chatBubble, alignSelf: "flex-start", background: "#1e293b", color: "#94a3b8" }}>
                  Thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !testLoading && sendTestMessage()}
                placeholder="Type a test message..."
                style={{ ...styles.input, flex: 1 }}
                disabled={testLoading}
              />
              <button
                onClick={sendTestMessage}
                disabled={testLoading || !testInput.trim()}
                style={styles.btnPrimary}
              >
                Send
              </button>
            </div>

            <button
              onClick={() => setTestMessages([])}
              style={{ ...styles.btnSmall, alignSelf: "flex-end", marginTop: 8 }}
            >
              Clear Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ ...styles.statCard, borderTop: `3px solid ${color}` }}>
      <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700 }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function fmtTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/* ─── Styles ──────────────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  /* Login */
  loginWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
  },
  loginCard: {
    background: "#1e293b",
    borderRadius: 12,
    padding: "32px 28px",
    width: "100%",
    maxWidth: 380,
    textAlign: "center",
  },
  loginTitle: {
    color: "#f1f5f9",
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },

  /* Page */
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "24px 16px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  header: {
    maxWidth: 1200,
    margin: "0 auto 24px",
  },
  headerTitle: {
    color: "#f1f5f9",
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 16,
  },
  tabBar: {
    display: "flex",
    gap: 4,
    background: "#1e293b",
    borderRadius: 8,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    padding: "10px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.2s",
  },
  tabActive: {
    background: "#3b82f6",
    color: "#fff",
  },

  /* Section */
  section: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  /* Cards */
  card: {
    background: "#1e293b",
    borderRadius: 12,
    padding: "20px 20px",
  },
  cardTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
  },

  /* Stats */
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  },
  statCard: {
    background: "#1e293b",
    borderRadius: 10,
    padding: "18px 20px",
  },

  /* Table */
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid #334155",
    color: "#94a3b8",
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #1e293b",
    color: "#cbd5e1",
    fontSize: 13,
  },
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "inherit",
  },

  /* Training */
  formGrid: {
    display: "grid",
    gap: 12,
    marginTop: 12,
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 4,
  },
  entryCard: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: 14,
  },
  catBadge: {
    display: "inline-block",
    background: "#3b82f620",
    color: "#60a5fa",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: 16,
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: 4,
  },

  /* Chat */
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    background: "#0f172a",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  chatBubble: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },

  /* Inputs & Buttons */
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "#e2e8f0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  btnPrimary: {
    padding: "10px 24px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  btnSmall: {
    padding: "6px 14px",
    background: "#334155",
    color: "#cbd5e1",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
};
