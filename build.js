const fs = require('fs');

let html = fs.readFileSync('design-repo/index.html', 'utf8');

// Extract body content
let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<script src=\"https:\/\/cdn/i);
if (!bodyMatch) {
  bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
}
let content = bodyMatch[1];

// Convert to JSX
content = content.replace(/class=/g, 'className=');
content = content.replace(/stroke-width=/g, 'strokeWidth=');
content = content.replace(/fill-opacity=/g, 'fillOpacity=');
content = content.replace(/onclick=\"this.classList.toggle\('flipped'\)\"/g, "onClick={(e) => e.currentTarget.classList.toggle('flipped')}");
content = content.replace(/onclick=\"[^\"]*\"/g, "onClick={() => {}}");
content = content.replace(/<div className=\"logo\">BRAJ<span>NIDHI<\/span><\/div>/g, '<div className="logo"><img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{height: "60px", width: "auto"}} /></div>');
content = content.replace(/allowfullscreen=\"\"/g, 'allowFullScreen={true}');
content = content.replace(/allowfullscreen/g, 'allowFullScreen={true}');
content = content.replace(/referrerpolicy/g, 'referrerPolicy');
content = content.replace(/style=\"([^\"]*)\"/g, (match, p1) => {
    let styleObj = {};
    p1.split(';').forEach(s => {
        if (!s.trim()) return;
        let [k, v] = s.split(':');
        k = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[k] = v.trim();
    });
    return 'style={' + JSON.stringify(styleObj) + '}';
});

// Self-closing tags - DO THIS BEFORE adding any React {} logic
content = content.replace(/<img([^>]*(?!\/))>/g, '<img$1 />');
content = content.replace(/<br>/g, '<br />');
content = content.replace(/<hr>/g, '<hr />');
content = content.replace(/<input([^>]*(?!\/))>/g, '<input$1 />');
content = content.replace(/<source([^>]*(?!\/))>/g, '<source$1 />');
content = content.replace(/<use([^>]*(?!\/))><\/use>/g, '<use$1 />');
content = content.replace(/<use([^>]*(?!\/))>/g, '<use$1 />');
content = content.replace(/\/\s\/>/g, ' />'); // Fix double slashes

// Replace Booking Spans with CustomSelect
content = content.replace(/<div className=\"form-group\">\s*<label>Check-in<\/label>\s*<span>[^<]*<\/span>/gi, 
    '<div className="form-group"><label>Check-in</label><input type="date" value={bookingData.checkIn} onChange={(e) => handleBookingChange(\'checkIn\', e.target.value)} />');
content = content.replace(/<div className=\"form-group\">\s*<label>Check-out<\/label>\s*<span>[^<]*<\/span>/gi, 
    '<div className="form-group"><label>Check-out</label><input type="date" value={bookingData.checkOut} onChange={(e) => handleBookingChange(\'checkOut\', e.target.value)} />');

content = content.replace(/<div className=\"form-group\">\s*<label>Guests<\/label>\s*<span>[^<]*<\/span>\s*<\/div>/gi, 
    '<CustomSelect label="Guests" value={bookingData.guests} options={["1 Adult", "2 Adults", "2 Adults, 1 Child", "2 Adults, 2 Children"]} field="guests" />');

content = content.replace(/<div className=\"form-group\">\s*<label>Room Type<\/label>\s*<span>[^<]*<\/span>\s*<\/div>/gi, 
    '<CustomSelect label="Room Type" value={bookingData.roomType} options={["Luxury Suite", "Executive Room", "Royal Heritage Suite"]} field="roomType" />');

content = content.replace(/<div className=\"form-group full-width\">\s*<label>Event Type \(Optional\)<\/label>\s*<span>[^<]*<\/span>\s*<\/div>/gi, 
    '<div className="full-width"><CustomSelect label="Event Type (Optional)" value={bookingData.eventType} options={["None", "Corporate Offsite", "Wedding", "Spiritual Retreat"]} field="eventType" /></div>');

// Dynamic Price and Occupancy
content = content.replace(/<div className=\"price\">₹12,500<span>\/night<\/span><\/div>/gi, 
    '<div className="price">₹{roomPrices[bookingData.roomType].toLocaleString()}<span>/night</span></div>');
content = content.replace(/<div className=\"occupancy\">2-4 guests<\/div>/gi, 
    '<div className="occupancy">{getGuestCount(bookingData.guests)}</div>');

// Replace Reservation Button
content = content.replace(/<button className=\"btn-reserve\">Request Reservation<\/button>/gi, 
    '<button className="btn-reserve" onClick={requestReservation}>Request Reservation</button>');


// HTML comments to JSX
content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');


// Clean up chat and music logic inside the extracted HTML
content = content.replace(/<div className=\"premium-music-player\"[^>]*>[\s\S]*?<\/audio>\n    <\/div>/i, '');
content = content.replace(/<div className=\"chatbot-container\">[\s\S]*?<\/div>\n    <\/div>/i, '');

// Fix FAQ onclick
content = content.replace(/<div className=\"faq-question\">/g, '<div className=\"faq-question\" onClick={toggleFAQ}>');

// Content replacements
content = content.replace(/wedding-1\.jpg/gi, 'DSC02591.JPG');
content = content.replace(/wedding-2\.jpg/gi, 'DSC06003-HDR.png');
content = content.replace(/<h2>Weddings & Grand Celebrations<\/h2>\s*<p>Plan your dream wedding in our scenic gardens and opulent banquet halls\. From intimate ceremonies to grand receptions, we provide comprehensive planning and bespoke catering to make your special day truly unforgettable\.<\/p>/gi,
    `<h2>Weddings & Grand Celebrations</h2><p>Celebrate your most special moments amidst the divine elegance of Braj Nidhi. From intimate wedding ceremonies to luxurious grand celebrations, our majestic venues, premium hospitality, and serene spiritual atmosphere create experiences that feel truly timeless.<br /><br />With beautifully designed spaces, exceptional accommodations, curated sattvic dining, and personalized event planning, every celebration at Braj Nidhi becomes a cherished memory for generations.</p>`);
content = content.replace(/guestroom-1\.jpg/gi, 'DSC05818-HDR.png');
content = content.replace(/guestroom-2\.jpg/gi, 'DSC05963-HDR.png');
content = content.replace(/<h2>Luxury Guestrooms & Suites<\/h2>\s*<p>Experience tranquility in our boutique rooms with world-class amenities and personalized service\. Each suite is designed to provide a perfect blend of modern comfort and traditional elegance, ensuring a restful stay in the heart of the city\.<\/p>/gi, 
    `<h2>Luxury Guestrooms & Divine Suites</h2><p>Experience a refined stay within the sacred atmosphere of Braj Nidhi. Thoughtfully designed rooms, elegant interiors, and peaceful surroundings come together to offer a truly elevated hospitality experience in the heart of Vrindavan.<br /><br />Whether you are visiting for darshan, weddings, spiritual retreats, or family gatherings, every stay is crafted with warmth, comfort, and timeless elegance.</p>`);
content = content.replace(/<header id=\"main-header\">/gi, '<header id="main-header" className={scrolled ? "scrolled" : ""}>');
content = content.replace(/<h1>Timeless Luxury, Urban Elegance<\/h1>/gi, '<h1>Timeless Luxury. Divine Serenity.</h1>');
content = content.replace(/href=\"index\.html/g, 'href="/');
content = content.replace(/href=\"guesthouse\.html/g, 'href="/guesthouse');
content = content.replace(/href=\"weddings\.html/g, 'href="/weddings');
content = content.replace(/href=\"corporate\.html/g, 'href="/corporate');
content = content.replace(/href=\"booking\.html/g, 'href="/booking');

// Convert remaining tags to Link components where possible, but href fix is enough for now.


const component = `
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const roomPrices: Record<string, number> = {
    'Luxury Suite': 8500,
    'Executive Room': 6000,
    'Royal Heritage Suite': 12500
  };

  const roomOccupancy: Record<string, string> = {
    'Luxury Suite': '2-3 guests',
    'Executive Room': '1-2 guests',
    'Royal Heritage Suite': '2-4 guests'
  };

  const getGuestCount = (guestsStr: string) => {
    const adults = parseInt(guestsStr.match(/(\\d+)\\s*Adult/)?.[1] || '0');
    const children = parseInt(guestsStr.match(/(\\d+)\\s*Child/)?.[1] || '0');
    const total = adults + children;
    return \`\${total} guest\${total > 1 ? 's' : ''}\`;
  };

  const [bookingData, setBookingData] = useState({
    checkIn: '2026-05-12',
    checkOut: '2026-05-18',
    guests: '2 Adults, 1 Child',
    roomType: 'Royal Heritage Suite',
    eventType: 'Corporate Offsite'
  });

  const handleBookingChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const CustomSelect = ({ label, value, options, field }: { label: string, value: string, options: string[], field: string }) => (
    <div className="custom-select-container">
      <label>{label}</label>
      <div className={"custom-select-trigger " + (openDropdown === field ? "active" : "")} onClick={() => setOpenDropdown(openDropdown === field ? null : field)}>
        <span>{value}</span>
        <i className="fas fa-chevron-down"></i>
      </div>
      {openDropdown === field && (
        <div className="custom-options">
          {options.map(opt => (
            <div key={opt} className={"custom-option " + (value === opt ? "selected" : "")} onClick={() => handleBookingChange(field, opt)}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Swiper) {
      new (window as any).Swiper('.gallery-slider', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        autoplay: { delay: 2000, disableOnInteraction: false },
        coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 2, slideShadows: true },
        navigation: { nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' },
      });
      new (window as any).Swiper('.testimonials-slider', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        loop: true,
        speed: 5000,
        autoplay: { delay: 0, disableOnInteraction: false },
        grabCursor: true,
        freeMode: true,
      });
    }
  }, []);

  useEffect(() => {
    // Stats observer
    const statsContainer = document.querySelector('.stats-container');
    const counters = document.querySelectorAll('.counter');
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated && statsContainer) {
                statsContainer.classList.add('animate-up');
                counters.forEach(counter => {
                    const targetAttr = counter.getAttribute('data-target');
                    if (!targetAttr) return;
                    const target = +targetAttr;
                    const isDecimal = counter.getAttribute('data-decimal') === 'true';
                    const updateCount = () => {
                        const count = +((counter as HTMLElement).innerText);
                        const inc = target / 50; 
                        if(count < target) {
                            if (isDecimal) (counter as HTMLElement).innerText = (count + inc).toFixed(1);
                            else (counter as HTMLElement).innerText = Math.ceil(count + inc).toString();
                            setTimeout(updateCount, 30);
                        } else {
                            (counter as HTMLElement).innerText = target.toString();
                        }
                    };
                    updateCount();
                });
                animated = true;
            }
        });
    }, { threshold: 0.3 });
    if (statsContainer) observer.observe(statsContainer);
  }, []);

  const requestReservation = () => {
    alert(\`Reservation Requested!\\n\\nRoom: \${bookingData.roomType}\\nPrice: ₹\${roomPrices[bookingData.roomType].toLocaleString()}/night\\nCheck-in: \${bookingData.checkIn}\\nCheck-out: \${bookingData.checkOut}\\nGuests: \${bookingData.guests}\\nEvent: \${bookingData.eventType}\`);
  };

  const toggleFAQ = (e: any) => {
    const currentItem = e.currentTarget.parentElement;
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== currentItem) item.classList.remove('active');
    });
    currentItem.classList.toggle('active');
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="index-page">
      ${content}
      
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

      <div className={"chatbot-container " + (isChatOpen ? "active" : "")}>
          <div className="chatbot-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
              <i className="fas fa-robot"></i>
          </div>
          <div className={"chat-window " + (isChatOpen ? "active" : "")}>
              <div className="chat-header">
                  <div className="bot-img"><i className="fas fa-om"></i></div>
                  <div>
                      <h4>Braj Nidhi Guide</h4>
                      <span>Online | AI Assistant</span>
                  </div>
                  <i className="fas fa-times" onClick={() => setIsChatOpen(false)} style={{marginLeft: "auto", cursor: "pointer"}}></i>
              </div>
              <div className="chat-messages">
                  <div className="msg bot">Radhe Radhe! Welcome to Braj Nidhi. I am your AI guide for Vrindavan. How may I help you today?</div>
              </div>
              <div className="chat-input">
                  <input type="text" placeholder="Ask me anything..." />
                  <button><i className="fas fa-paper-plane"></i></button>
              </div>
          </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', component);
