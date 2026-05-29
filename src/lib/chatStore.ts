/**
 * Chat accounting & training store
 *
 * • Vercel: persists in Upstash Redis
 * • Local dev: in-memory (resets on restart)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatLog {
  id: string;
  ip: string;
  userMessage: string;
  botReply: string;
  tokens: number;       // approximate token count
  timestamp: string;    // ISO
}

export interface TrainingEntry {
  id: string;
  question: string;     // trigger pattern / example question
  answer: string;       // ideal response
  category: string;     // rooms, temples, dining, rules, etc.
  createdAt: string;
}

export interface ChatStats {
  totalChats: number;
  todayChats: number;
  totalTokens: number;
  topQuestions: { q: string; count: number }[];
}

// ─── Redis helpers ────────────────────────────────────────────────────────────

function isRedisConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getRedis() {
  const { Redis } = require('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

// ─── In-memory fallback (local dev) ────────────────────────────────────────────

const memLogs: ChatLog[] = [];
const memTraining: TrainingEntry[] = [];

// ─── Chat Logs ────────────────────────────────────────────────────────────────

const LOGS_KEY = 'bn:chat:logs';
const MAX_LOGS = 500; // keep last 500 logs

export async function saveChatLog(log: ChatLog): Promise<void> {
  if (isRedisConfigured()) {
    const redis = getRedis();
    const logs = ((await redis.get(LOGS_KEY)) ?? []) as ChatLog[];
    logs.unshift(log); // newest first
    if (logs.length > MAX_LOGS) logs.length = MAX_LOGS;
    await redis.set(LOGS_KEY, logs);
  } else {
    memLogs.unshift(log);
    if (memLogs.length > MAX_LOGS) memLogs.length = MAX_LOGS;
  }
}

export async function getChatLogs(limit = 50): Promise<ChatLog[]> {
  if (isRedisConfigured()) {
    const redis = getRedis();
    const logs = ((await redis.get(LOGS_KEY)) ?? []) as ChatLog[];
    return logs.slice(0, limit);
  }
  return memLogs.slice(0, limit);
}

export async function getChatStats(): Promise<ChatStats> {
  const logs = await getChatLogs(MAX_LOGS);
  const today = new Date().toISOString().split('T')[0];

  const todayChats = logs.filter(l => l.timestamp.startsWith(today)).length;
  const totalTokens = logs.reduce((sum, l) => sum + (l.tokens ?? 0), 0);

  // Count question frequency (simplified)
  const qMap = new Map<string, number>();
  for (const l of logs) {
    const q = l.userMessage.toLowerCase().trim().slice(0, 60);
    qMap.set(q, (qMap.get(q) ?? 0) + 1);
  }
  const topQuestions = Array.from(qMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([q, count]) => ({ q, count }));

  return {
    totalChats: logs.length,
    todayChats,
    totalTokens,
    topQuestions,
  };
}

// ─── Training Data ────────────────────────────────────────────────────────────

const TRAINING_KEY = 'bn:chat:training';

export async function getTrainingData(): Promise<TrainingEntry[]> {
  if (isRedisConfigured()) {
    const redis = getRedis();
    return ((await redis.get(TRAINING_KEY)) ?? []) as TrainingEntry[];
  }
  return [...memTraining];
}

export async function saveTrainingEntry(entry: TrainingEntry): Promise<void> {
  if (isRedisConfigured()) {
    const redis = getRedis();
    const data = ((await redis.get(TRAINING_KEY)) ?? []) as TrainingEntry[];
    // Update existing or add new
    const idx = data.findIndex(d => d.id === entry.id);
    if (idx >= 0) data[idx] = entry;
    else data.push(entry);
    await redis.set(TRAINING_KEY, data);
  } else {
    const idx = memTraining.findIndex(d => d.id === entry.id);
    if (idx >= 0) memTraining[idx] = entry;
    else memTraining.push(entry);
  }
}

export async function deleteTrainingEntry(id: string): Promise<boolean> {
  if (isRedisConfigured()) {
    const redis = getRedis();
    const data = ((await redis.get(TRAINING_KEY)) ?? []) as TrainingEntry[];
    const filtered = data.filter(d => d.id !== id);
    if (filtered.length === data.length) return false;
    await redis.set(TRAINING_KEY, filtered);
    return true;
  } else {
    const idx = memTraining.findIndex(d => d.id === id);
    if (idx < 0) return false;
    memTraining.splice(idx, 1);
    return true;
  }
}

/** Build a system prompt addon from training data */
export async function buildTrainingPrompt(): Promise<string> {
  const entries = await getTrainingData();
  if (entries.length === 0) return '';

  const lines = entries.map(
    e => `Q: ${e.question}\nA: ${e.answer}`,
  );

  return `\n\nAdditional trained knowledge (use these to answer guest queries):\n${lines.join('\n\n')}`;
}
