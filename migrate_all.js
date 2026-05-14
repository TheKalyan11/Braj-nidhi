const fs = require('fs');
const path = require('path');

const pages = [
  { html: 'index.html', dir: '' },
  { html: 'guesthouse.html', dir: 'guesthouse' },
  { html: 'weddings.html', dir: 'weddings' },
  { html: 'corporate.html', dir: 'corporate' },
  { html: 'booking.html', dir: 'booking' }
];

function convert(htmlFile, outputDir) {
  const html = fs.readFileSync(path.join('design-repo', htmlFile), 'utf8');

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : '';

  // Extract styles from head
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  let pageStyles = '';
  if (headMatch) {
    const styles = headMatch[1].match(/<style>([\s\S]*?)<\/style>/gi);
    if (styles) {
      pageStyles = styles.map(s => s.replace(/<\/?style>/gi, '')).join('\n');
    }
  }

  // Sanitization
  let content = bodyContent
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<div id="chatbot-container">[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="chatbot-toggle"[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="audio-toggle"[\s\S]*?<\/div>/gi, '')
    .replace(/<div id="audioPlayerContainer">[\s\S]*?<\/div>/gi, '')
    .replace(/<div id="musicPlayer"[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="whatsapp-float"[\s\S]*?<\/div>/gi, '')
    .replace(/<header id="main-header"[\s\S]*?<\/header>/gi, '')
    .replace(/<footer>[\s\S]*?<\/footer>/gi, '');

  // JSX replacements
  content = content
    .replace(/class=/g, 'className=')
    .replace(/onclick="([^"]+)"/gi, (match, p1) => {
        if (p1.includes('toggleFAQ')) return 'onClick={toggleFAQ}';
        return `onClick={() => { /* ${p1} */ }}`;
    })
    .replace(/style="([^"]*)"/g, (match, p1) => {
      const styleObj = {};
      p1.split(';').forEach(s => {
        if (!s.trim()) return;
        let [k, v] = s.split(':');
        if (!v) return;
        k = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[k] = v.trim();
      });
      return 'style={' + JSON.stringify(styleObj) + '}';
    })
    .replace(/<img ([^>]+)>/gi, '<img $1 />')
    .replace(/<br>/gi, '<br />')
    .replace(/<input ([^>]+)>/gi, '<input $1 />')
    .replace(/stroke-width/gi, 'strokeWidth')
    .replace(/stroke-linecap/gi, 'strokeLinecap')
    .replace(/href="index\.html"/gi, 'href="/"')
    .replace(/href="index\.html#contact"/gi, 'href="/#contact"')
    .replace(/href="guesthouse\.html"/gi, 'href="/guesthouse"')
    .replace(/href="weddings\.html"/gi, 'href="/weddings"')
    .replace(/href="corporate\.html"/gi, 'href="/corporate"')
    .replace(/href="booking\.html"/gi, 'href="/booking"');

  const pageName = htmlFile.replace('.html', '').charAt(0).toUpperCase() + htmlFile.replace('.html', '').slice(1);

  const component = `"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function ${pageName}Page() {
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
    <div className="${htmlFile.replace('.html', '')}-page">
      <style dangerouslySetInnerHTML={{ __html: \`${pageStyles.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\` }} />
      
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

      <div dangerouslySetInnerHTML={{ __html: \`${content.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\` }} />

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
`;

  const finalOutputDir = path.join('src', 'app', outputDir);
  if (!fs.existsSync(finalOutputDir)) fs.mkdirSync(finalOutputDir, { recursive: true });
  fs.writeFileSync(path.join(finalOutputDir, 'page.tsx'), component);
}

pages.forEach(p => convert(p.html, p.dir));
