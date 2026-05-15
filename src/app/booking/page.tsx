"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function BookingPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('main-header');
      if (header) {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleFAQ = (e: React.MouseEvent) => {
    const currentItem = (e.currentTarget as HTMLElement).parentElement;
    if (!currentItem) return;
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== currentItem) item.classList.remove('active');
    });
    currentItem.classList.toggle('active');
  };

  return (
    <div className="booking-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .booking-hero {
            height: 60vh;
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('hero-bg.jpg');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #fff;
            padding-top: 80px;
        }

        .booking-container {
            max-width: 1000px;
            margin: -100px auto 100px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
            z-index: 10;
        }

        .booking-steps {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }

        .step {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #777;
            font-weight: 500;
        }

        .step.active {
            color: var(--accent-gold);
        }

        .step-num {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }

        .step.active .step-num {
            background: var(--accent-gold);
            color: #fff;
        }

        .booking-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
        }

        .booking-form-main {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .input-group label {
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }

        .input-group input, 
        .input-group select, 
        .input-group textarea {
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-family: inherit;
            font-size: 16px;
            transition: 0.3s;
        }

        .input-group input:focus {
            border-color: var(--accent-gold);
            outline: none;
            box-shadow: 0 0 0 3px rgba(218, 165, 32, 0.1);
        }

        .room-selection {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .room-card-mini {
            border: 2px solid #eee;
            border-radius: 12px;
            padding: 15px;
            cursor: pointer;
            transition: 0.3s;
            position: relative;
        }

        .room-card-mini:hover {
            border-color: var(--accent-gold);
        }

        .room-card-mini.selected {
            border-color: var(--accent-gold);
            background: rgba(218, 165, 32, 0.05);
        }

        .room-card-mini h4 {
            margin-bottom: 5px;
            color: var(--primary-blue);
        }

        .room-card-mini .price {
            font-weight: 700;
            color: var(--accent-gold);
        }

        .booking-summary {
            background: #f9f9f9;
            padding: 25px;
            border-radius: 15px;
            height: fit-content;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 15px;
        }

        .summary-total {
            border-top: 1px solid #ddd;
            margin-top: 15px;
            padding-top: 15px;
            font-weight: 700;
            font-size: 18px;
            color: var(--primary-blue);
        }

        .btn-confirm {
            width: 100%;
            padding: 15px;
            background: var(--accent-gold);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            transition: 0.3s;
        }

        .btn-confirm:hover {
            background: #b8860b;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .booking-grid {
                grid-template-columns: 1fr;
            }
            .booking-container {
                margin: -50px 20px 50px;
                padding: 20px;
            }
        }
    ` }} />
      
      <header id="main-header" className="scrolled">
        <a href="/" className="logo"><img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{ height: "60px", width: "auto" }} /></a>
        <nav>
            <ul>
                <li><a href="/guesthouse">Guesthouse</a></li>
                <li><a href="/weddings">Weddings</a></li>
                <li><a href="/corporate">Corporate</a></li>
                <li><a href="/#contact">Contact</a></li>
            </ul>
        </nav>
        <div className="nav-btns">
            <a href="/#contact" className="btn-book">Book Now</a>
        </div>
      </header>

      <div dangerouslySetInnerHTML={{ __html: `
    <!-- SVG Definitions (Copied from index.html) -->
    <svg style={{"display":"none"}}>
        <defs>
            <g id="peacock-feather">
                <path d="M50,80 C10,80 0,20 50,0 C100,20 90,80 50,80 Z" fill="#008000" opacity="0.9"/>
                <path d="M50,70 C20,70 15,25 50,10 C85,25 80,70 50,70 Z" fill="#32CD32"/>
                <ellipse cx="50" cy="30" rx="14" ry="20" fill="#00CED1"/>
                <ellipse cx="50" cy="30" rx="8" ry="12" fill="#000080"/>
                <path d="M50,0 L50,95" stroke="#006400" strokeWidth="2"/>
            </g>
            <g id="krishna-flute-feather">
                <path d="M10,75 L90,45" stroke="#DAA520" strokeWidth="12" strokeLinecap="round"/>
                <path d="M12,73 L88,44" stroke="#F0E68C" strokeWidth="6" strokeLinecap="round"/>
                <line x1="20" y1="76" x2="25" y2="63" stroke="#DC143C" strokeWidth="3"/>
                <line x1="23" y1="75" x2="28" y2="62" stroke="#DC143C" strokeWidth="3"/>
                <circle cx="40" cy="62" r="2.5" fill="#3e2723"/>
                <circle cx="50" cy="59" r="2.5" fill="#3e2723"/>
                <circle cx="60" cy="56" r="2.5" fill="#3e2723"/>
                <circle cx="70" cy="53" r="2.5" fill="#3e2723"/>
                <g transform="translate(55, 10) rotate(15) scale(0.4)">
                    <use href="#peacock-feather"/>
                </g>
            </g>
        </defs>
    </svg>

    

    <main>
        <section className="booking-hero">
            <div className="hero-content">
                <svg className="animated-flute" style={{"width":"80px","height":"80px","marginBottom":"20px"}}>
                    <use href="#krishna-flute-feather"></use>
                </svg>
                <h1>Reserve Your Spiritual Oasis</h1>
                <p>Begin your journey of peace and luxury in the holy land of Vrindavan.</p>
            </div>
        </section>

        <section className="booking-section">
            <div className="booking-container">
                <div className="booking-steps">
                    <div className="step active">
                        <div className="step-num">1</div>
                        <span>Details</span>
                    </div>
                    <div className="step">
                        <div className="step-num">2</div>
                        <span>Payment</span>
                    </div>
                    <div className="step">
                        <div className="step-num">3</div>
                        <span>Confirm</span>
                    </div>
                </div>

                <div className="booking-grid">
                    <div className="booking-form-main">
                        <div className="room-selection">
                            <div className="room-card-mini selected">
                                <h4>Royal Heritage Suite</h4>
                                <p className="price">₹4,999 / night</p>
                            </div>
                            <div className="room-card-mini">
                                <h4>Executive Suite</h4>
                                <p className="price">₹3,500 / night</p>
                            </div>
                        </div>

                        <div style={{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"20px"}}>
                            <div className="input-group">
                                <label>Check-in Date</label>
                                <input type="date" value="2026-05-12" />
                            </div>
                            <div className="input-group">
                                <label>Check-out Date</label>
                                <input type="date" value="2026-05-18" />
                            </div>
                        </div>

                        <div style={{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"20px"}}>
                            <div className="input-group">
                                <label>Adults</label>
                                <select>
                                    <option>1 Adult</option>
                                    <option selected>2 Adults</option>
                                    <option>3 Adults</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Children</label>
                                <select>
                                    <option>None</option>
                                    <option selected>1 Child</option>
                                    <option>2 Children</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your full name" />
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="email@example.com" />
                        </div>

                        <div className="input-group">
                            <label>Special Requests (Optional)</label>
                            <textarea rows="4" placeholder="Any specific requirements for your stay?"></textarea>
                        </div>
                    </div>

                    <div className="booking-summary">
                        <h3>Stay Summary</h3>
                        <div style={{"marginTop":"20px"}}>
                            <div className="summary-row">
                                <span>6 Nights x ₹4,999</span>
                                <span>₹29,994</span>
                            </div>
                            <div className="summary-row">
                                <span>Service Charge (5%)</span>
                                <span>₹1,500</span>
                            </div>
                            <div className="summary-row">
                                <span>Taxes (GST 12%)</span>
                                <span>₹3,600</span>
                            </div>
                            <div className="summary-total">
                                <span>Total Amount</span>
                                <span>₹35,094</span>
                            </div>
                        </div>
                        <button className="btn-confirm">Proceed to Payment</button>
                        <p style={{"textAlign":"center","fontSize":"12px","color":"#777","marginTop":"15px"}}>
                            <i className="fas fa-shield-alt"></i> Secure Booking Guaranteed
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer className="site-footer">
        <div className="footer-middle-bar">
            <span>Copyright &copy; BRAJNIDHI 2026</span>
        </div>
    </footer>


    

    <!-- Global Floating Features -->
    <div className="whatsapp-container">
        <a href="https://wa.me/910000000000" className="whatsapp-btn" target="_blank">
            <i className="fab fa-whatsapp"></i>
        </a>
    </div>
    <div className="music-player-container">
        <button className="music-btn" id="musicToggle">
            <i className="fas fa-play"></i>
        </button>
        <span className="music-label">Play Music</span>
        <audio id="bgMusic" loop>
            <source src="https://cdn.pixabay.com/audio/2022/02/22/audio_d0a13e6912.mp3" type="audio/mpeg">
        </audio>
    </div>

    <div className="chatbot-container">
        <div className="chatbot-btn" id="chatbotBtn">
            <i className="fas fa-robot"></i>
        </div>
        <div className="chat-window" id="chatWindow">
            <div className="chat-header">
                <div className="bot-img"><i className="fas fa-om"></i></div>
                <div>
                    <h4>Braj Nidhi Guide</h4>
                    <span>Online | AI Assistant</span>
                </div>
                <i className="fas fa-times" id="closeChat" style={{"marginLeft":"auto","cursor":"pointer"}}></i>
            </div>
            <div className="chat-messages" id="chatMessages">
                <div className="msg bot">Radhe Radhe! Welcome to Braj Nidhi. I am your AI guide for Vrindavan. How may I help you today?</div>
            </div>
            <div className="chat-input">
                <input type="text" id="chatInput" placeholder="Ask me anything..." />
                <button id="sendMessage"><i className="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>

    
` }} />

      {/* Audio Element */}
      <div className="premium-music-player" id="musicPlayer">
          <div className="player-glass">
              <button className={"play-btn " + (isPlaying ? "playing" : "")} onClick={toggleMusic}>
                  <i className={"fas " + (isPlaying ? "fa-pause" : "fa-play")}></i>
              </button>
              <div className="liquid-shine"></div>
          </div>
          <audio ref={audioRef} id="bgMusic" loop preload="auto" crossOrigin="anonymous">
            <source src="https://ia601402.us.archive.org/19/items/melodic-hare-krishna/HareKrishnaMahamantra.mp3" type="audio/mpeg" />
          </audio>
      </div>

      {/* Chatbot Widget */}
      <div className={"chatbot-wrapper " + (isChatOpen ? "active" : "")} id="chatbot-container">
          <div className="chatbot-header">
              <div className="bot-info">
                  <div className="bot-avatar">
                      <i className="fas fa-robot"></i>
                      <span className="online-indicator"></span>
                  </div>
                  <div>
                      <h4>Divine Assistant</h4>
                      <p>Online | Ready to help</p>
                  </div>
              </div>
              <button className="close-chat" onClick={toggleChat}>
                  <i className="fas fa-times"></i>
              </button>
          </div>
          <div className="chat-messages" id="chatMessages">
              <div className="message bot">
                  Radhe Radhe! 🙏 How may I assist you with your divine stay today?
              </div>
          </div>
          <div className="chat-input-area">
              <input type="text" placeholder="Type your message..." id="userInput" />
              <button id="sendMessage"><i className="fas fa-paper-plane"></i></button>
          </div>
      </div>

      <div className="chatbot-toggle" onClick={toggleChat}>
          <i className="fas fa-comment-dots"></i>
          <span className="toggle-label">Assistance</span>
      </div>

      <div className="whatsapp-float">
          <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
              <span className="float-label">WhatsApp</span>
          </a>
      </div>

      <footer>
          <div className="footer-content">
              <div className="footer-brand">
                  <a href="/" className="logo"><img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{ height: "60px", width: "auto" }} /></a>
                  <p>Experience the divine blend of heritage and luxury in the heart of Vrindavan.</p>
                  <div className="social-links">
                      <a href="#"><i className="fab fa-facebook-f"></i></a>
                      <a href="#"><i className="fab fa-instagram"></i></a>
                      <a href="#"><i className="fab fa-youtube"></i></a>
                  </div>
              </div>
              <div className="footer-links">
                  <h4>Quick Links</h4>
                  <ul>
                      <li><a href="/guesthouse">Guesthouse</a></li>
                      <li><a href="/weddings">Weddings</a></li>
                      <li><a href="/corporate">Corporate</a></li>
                      <li><a href="/#contact">Contact</a></li>
                  </ul>
              </div>
              <div className="footer-contact">
                  <h4>Contact Us</h4>
                  <p><i className="fas fa-map-marker-alt"></i> Raman Reti, Vrindavan, UP</p>
                  <p><i className="fas fa-phone"></i> +91 123 456 7890</p>
                  <p><i className="fas fa-envelope"></i> info@brajnidhi.com</p>
              </div>
          </div>
          <div className="footer-bottom">
              <p>&copy; 2024 Braj Nidhi. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
