
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
    const adults = parseInt(guestsStr.match(/(\d+)\s*Adult/)?.[1] || '0');
    const children = parseInt(guestsStr.match(/(\d+)\s*Child/)?.[1] || '0');
    const total = adults + children;
    return `${total} guest${total > 1 ? 's' : ''}`;
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
    alert(`Reservation Requested!\n\nRoom: ${bookingData.roomType}\nPrice: ₹${roomPrices[bookingData.roomType].toLocaleString()}/night\nCheck-in: ${bookingData.checkIn}\nCheck-out: ${bookingData.checkOut}\nGuests: ${bookingData.guests}\nEvent: ${bookingData.eventType}`);
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
      
    {/*  Krishna Feather & Flute SVG Definitions  */}
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
                {/*  Flute Body  */}
                <path d="M10,75 L90,45" stroke="#DAA520" strokeWidth="12" stroke-linecap="round"/>
                <path d="M12,73 L88,44" stroke="#F0E68C" strokeWidth="6" stroke-linecap="round"/>
                
                {/*  Red Details / Bindings  */}
                <line x1="20" y1="76" x2="25" y2="63" stroke="#DC143C" strokeWidth="3"/>
                <line x1="23" y1="75" x2="28" y2="62" stroke="#DC143C" strokeWidth="3"/>
                
                <line x1="75" y1="56" x2="80" y2="43" stroke="#DC143C" strokeWidth="3"/>
                <line x1="78" y1="55" x2="83" y2="42" stroke="#DC143C" strokeWidth="3"/>

                {/*  Flute Holes  */}
                <circle cx="40" cy="62" r="2.5" fill="#3e2723"/>
                <circle cx="50" cy="59" r="2.5" fill="#3e2723"/>
                <circle cx="60" cy="56" r="2.5" fill="#3e2723"/>
                <circle cx="70" cy="53" r="2.5" fill="#3e2723"/>
                
                {/*  Tassel Strings  */}
                <path d="M23,75 Q15,90 30,95" fill="none" stroke="#FFD700" strokeWidth="2"/>
                <path d="M27,74 Q35,90 30,95" fill="none" stroke="#FFD700" strokeWidth="2"/>
                
                {/*  Use Feather  */}
                <g transform="translate(55, 10) rotate(15) scale(0.4)">
                    <use href="#peacock-feather" />
                </g>
            </g>
        </defs>
    </svg>

    <header id="main-header">
        <div className="logo"><img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{height: "60px", width: "auto"}}  /></div>
        
        <nav>
            <ul>
                <li><a href="/guesthouse">Guesthouse</a></li>
                <li><a href="/weddings">Weddings</a></li>
                <li><a href="/corporate">Corporate</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>

        <div className="nav-btns">
            <a href="#contact" className="btn-book">Book Now</a>
        </div>
    </header>

    <main>
        <section className="hero">
            <div className="hero-content">
                <h1>Timeless Luxury, Urban Elegance</h1>
                <p>Experience the finest hospitality in the heart of the city. Our heritage suites offer an oasis of calm amidst the vibrant urban landscape.</p>
                
                <div className="rating-info">
                    <span className="stars"><i className="fas fa-star"></i> 4.9</span>
                    <span className="reviews">from 2,400+ stays</span>
                </div>
            </div>

            <div className="booking-widget">
                <div className="widget-header">
                    <div>
                        <h3>The Royal Heritage Suite</h3>
                        <div className="rating">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                    </div>
                    <div className="edit-icon">
                        <i className="fas fa-pen-to-square"></i>
                    </div>
                </div>

                <div className="booking-form">
                    <div className="form-group"><label>Check-in</label><input type="date" value={bookingData.checkIn} onChange={(e) => handleBookingChange('checkIn', e.target.value)} />
                    </div>
                    <div className="form-group"><label>Check-out</label><input type="date" value={bookingData.checkOut} onChange={(e) => handleBookingChange('checkOut', e.target.value)} />
                    </div>
                    <CustomSelect label="Guests" value={bookingData.guests} options={["1 Adult", "2 Adults", "2 Adults, 1 Child", "2 Adults, 2 Children"]} field="guests" />
                    <CustomSelect label="Room Type" value={bookingData.roomType} options={["Luxury Suite", "Executive Room", "Royal Heritage Suite"]} field="roomType" />
                    <div className="full-width"><CustomSelect label="Event Type (Optional)" value={bookingData.eventType} options={["None", "Corporate Offsite", "Wedding", "Spiritual Retreat"]} field="eventType" /></div>
                </div>

                <div className="price-row">
                    <div className="price">₹{roomPrices[bookingData.roomType].toLocaleString()}<span>/night</span></div>
                    <div className="occupancy">{getGuestCount(bookingData.guests)}</div>
                </div>

                <a href="#contact" className="btn-reserve" style={{"display":"block","textAlign":"center","textDecoration":"none","position":"relative","zIndex":"5"}}>Request Reservation</a>
            </div>
        </section>

        <section className="banner-section">
            <div className="scrolling-banner">
                <div className="banner-track">
                    <div className="logo-item"><i className="fas fa-bed"></i> Luxury Suites</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-ring"></i> Scenic Weddings</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-laptop-house"></i> Corporate Offsites</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-landmark"></i> Heritage Living</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-glass-cheers"></i> Grand Banquets</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-video"></i> Modern AV Halls</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-star"></i> Boutique Stays</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-spa"></i> Wellness Retreats</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    
                    {/*  Duplicate for infinite effect  */}
                    <div className="logo-item"><i className="fas fa-bed"></i> Luxury Suites</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-ring"></i> Scenic Weddings</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-laptop-house"></i> Corporate Offsites</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-landmark"></i> Heritage Living</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-glass-cheers"></i> Grand Banquets</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-video"></i> Modern AV Halls</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-star"></i> Boutique Stays</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                    <div className="logo-item"><i className="fas fa-spa"></i> Wellness Retreats</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather"  /></svg></div>
                </div>
            </div>
        </section>


        <section className="split-section" id="rooms">
            <div className="split-container reverse">
                <div className="content-box">
                    <svg className="animated-flute" viewBox="-10 -20 120 120"><use href="#krishna-flute-feather"  /></svg>
                    <h2>Luxury Guestrooms & Suites</h2>
                    <p>Experience tranquility in our boutique rooms with world-class amenities and personalized service. Each suite is designed to provide a perfect blend of modern comfort and traditional elegance, ensuring a restful stay in the heart of the city.</p>
                    <a href="/guesthouse" className="btn-outline">Explore Rooms <i className="fas fa-arrow-right"></i></a>
                </div>
                <div className="image-grid">
                    <img src="guestroom-1.jpg" alt="Luxury Suite" className="main-img" />
                    <img src="guestroom-2.jpg" alt="Modern Bathroom" className="secondary-img" />
                </div>
            </div>
        </section>

        <section className="split-section" id="weddings" style={{"background":"#ffffff"}}>
            <div className="split-container">
                <div className="content-box">
                    <svg className="animated-flute" viewBox="-10 -20 120 120"><use href="#krishna-flute-feather"  /></svg>
                    <h2>Weddings & Grand Celebrations</h2>
                    <p>Plan your dream wedding in our scenic gardens and opulent banquet halls. From intimate ceremonies to grand receptions, we provide comprehensive planning and bespoke catering to make your special day truly unforgettable.</p>
                    <a href="#" className="btn-outline">Plan Your Wedding <i className="fas fa-arrow-right"></i></a>
                </div>
                <div className="image-grid">
                    <img src="wedding-1.jpg" alt="Wedding Hall" className="main-img" />
                    <img src="wedding-2.jpg" alt="Wedding Decor" className="secondary-img" />
                </div>
            </div>
        </section>

        <section className="split-section" id="corporate" style={{"background":"#f4f6f8"}}>
            <div className="split-container reverse">
                <div className="content-box">
                    <svg className="animated-flute" viewBox="-10 -20 120 120"><use href="#krishna-flute-feather"  /></svg>
                    <h2>Corporate Offsite & AV Hall</h2>
                    <p>Elevate your team's productivity in our high-tech AV halls and collaborative breakout spaces. Our modern facilities are designed for high-impact conferences, seminars, and corporate retreats with full technical support.</p>
                    <a href="/booking" className="btn-outline">Book Corporate Hall <i className="fas fa-arrow-right"></i></a>
                </div>
                <div className="image-grid">
                    <img src="corporate-1.jpg" alt="AV Hall" className="main-img" />
                    <img src="corporate-2.jpg" alt="Collaborative Space" className="secondary-img" />
                </div>
            </div>
        </section>

        <section className="stats-section">
            <div className="stats-container">
                {/*  God Krishna Ornament with Music Animation  */}
                <div className="krishna-ornament-wrapper">
                    <img src="kk.png" alt="God Krishna Playing Flute" className="krishna-image" />
                    <div className="music-notes">
                        <i className="fas fa-music note-1"></i>
                        <i className="fas fa-music note-2"></i>
                        <i className="fas fa-music note-3"></i>
                    </div>
                </div>
                
                <div className="stat-item">
                    <h2 className="counter" data-target="10">0</h2><span>K+</span>
                    <p>Happy Guests</p>
                </div>
                <div className="stat-item">
                    <h2 className="counter" data-target="4.9" data-decimal="true">0</h2>
                    <p>Customer Rating</p>
                </div>
                <div className="stat-item">
                    <h2 className="counter" data-target="18">0</h2>
                    <p>Event Spaces</p>
                </div>
                <div className="stat-item">
                    <h2 className="counter" data-target="20">0</h2><span>+</span>
                    <p>Years of Excellence</p>
                </div>
            </div>
        </section>

        <section className="room-types-section">
            <div className="section-header">
                <h2 className="divine-header">
                    <span className="krishna-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"  /></svg></span>
                    <span className="divine-text">Exquisite Accommodations</span>
                    <span className="krishna-feather right-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"  /></svg></span>
                </h2>
                <p>Choose the perfect sanctuary for your stay.</p>
            </div>
            <div className="room-grid">
                {/*  Room Card 1  */}
                <div className="room-card new-style">
                    <img src="room_deluxe.png" alt="Deluxe Room" className="room-bg-img" />
                    <div className="card-gradient"></div>
                    
                    <div className="room-content">
                        <h3>Deluxe Temple View</h3>
                        <p className="room-location"><i className="fas fa-map-marker-alt"></i> Braj Nidhi Guest House, Vrindavan</p>
                        
                        <div className="room-amenities">
                            <span><i className="fas fa-bed"></i> King Bed</span>
                            <span><i className="fas fa-wifi"></i> Free WiFi</span>
                            <span><i className="fas fa-coffee"></i> Tea/Coffee</span>
                        </div>
                        
                        <button className="btn-availability">Book for ₹8,500 <i className="fas fa-chevron-right"></i></button>
                    </div>
                </div>

                {/*  Room Card 2  */}
                <div className="room-card new-style">
                    <img src="room_executive.png" alt="Executive Suite" className="room-bg-img" />
                    <div className="card-gradient"></div>
                    
                    <div className="room-content">
                        <h3>Executive Suite</h3>
                        <p className="room-location"><i className="fas fa-map-marker-alt"></i> Braj Nidhi Guest House, Vrindavan</p>
                        
                        <div className="room-amenities">
                            <span><i className="fas fa-couch"></i> Living Area</span>
                            <span><i className="fas fa-bath"></i> Deep Tub</span>
                            <span><i className="fas fa-concierge-bell"></i> 24/7 Service</span>
                        </div>
                        
                        <button className="btn-availability">Book for ₹12,500 <i className="fas fa-chevron-right"></i></button>
                    </div>
                </div>

                {/*  Room Card 3  */}
                <div className="room-card new-style">
                    <img src="room_royal.png" alt="Royal Heritage Suite" className="room-bg-img" />
                    <div className="card-gradient"></div>
                    
                    <div className="room-content">
                        <h3>Royal Heritage Suite</h3>
                        <p className="room-location"><i className="fas fa-map-marker-alt"></i> Braj Nidhi Guest House, Vrindavan</p>
                        
                        <div className="room-amenities">
                            <span><i className="fas fa-crown"></i> Four-Poster Bed</span>
                            <span><i className="fas fa-bell"></i> Personal Attendant</span>
                            <span><i className="fas fa-hot-tub"></i> Jacuzzi</span>
                        </div>
                        
                        <a href="/booking" className="btn-availability" style={{"display":"block","textAlign":"center","textDecoration":"none"}}>Book for ₹25,000 <i className="fas fa-chevron-right"></i></a>
                    </div>
                </div>
            </div>
        </section>

        {/*  Offers and Packages Section  */}
        <section className="offers-section">
            <div className="section-header">
                <h2 className="divine-header">
                    <span className="krishna-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"  /></svg></span>
                    <span className="divine-text">Special Offers & Packages</span>
                    <span className="krishna-feather right-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"  /></svg></span>
                </h2>
                <p>Unlock exclusive experiences and divine memories with our curated stays.</p>
            </div>
            <div className="offers-grid">
                <div className="offer-card immersive">
                    <img src="spiritual_retreat.png" alt="Spiritual Retreat" className="offer-bg-img" />
                    <div className="offer-gradient-blur"></div>
                    
                    <div className="offer-content">
                        <h3>Spiritual Retreat</h3>
                        <p className="offer-subtitle">3-Day Experience</p>
                        
                        <div className="offer-inline-tags">
                            <span><i className="fas fa-tag"></i> from <strong>₹14,999</strong></span>
                            <span><i className="fas fa-om"></i> VIP Darshan</span>
                        </div>
                        
                        <a href="/booking" className="btn-offer-full" style={{"display":"block","textAlign":"center","textDecoration":"none"}}>Claim Offer</a>
                    </div>
                </div>

                {/*  Offer Card 2  */}
                <div className="offer-card immersive">
                    <img src="wedding_package.png" alt="Royal Wedding" className="offer-bg-img" />
                    <div className="offer-gradient-blur"></div>
                    
                    <div className="offer-content">
                        <h3>Royal Wedding</h3>
                        <p className="offer-subtitle">Heritage Venue</p>
                        
                        <div className="offer-inline-tags">
                            <span><i className="fas fa-tag"></i> <strong>Custom Pricing</strong></span>
                            <span><i className="fas fa-users"></i> 50 Guests</span>
                        </div>
                        
                        <a href="#contact" className="btn-offer-full" style={{"display":"block","textAlign":"center","textDecoration":"none"}}>Enquire Now</a>
                    </div>
                </div>

                {/*  Offer Card 3  */}
                <div className="offer-card immersive">
                    <img src="corporate_package.png" alt="Weekend Serenity" className="offer-bg-img" />
                    <div className="offer-gradient-blur"></div>
                    
                    <div className="offer-content">
                        <h3>Weekend Serenity</h3>
                        <p className="offer-subtitle">2-Day Getaway</p>
                        
                        <div className="offer-inline-tags">
                            <span><i className="fas fa-tag"></i> from <strong>₹9,500</strong></span>
                            <span><i className="fas fa-bed"></i> Luxury Room</span>
                        </div>
                        
                        <a href="#contact" className="btn-offer-full" style={{"display":"block","textAlign":"center","textDecoration":"none","marginTop":"15px"}}>Book This Package</a>
                    </div>
                </div>
            </div>
        </section>
        
        {/*  Nearby Attractions Section  */}
        <section className="attractions-section">
            <div className="section-header">
                <h2 className="divine-header">
                    <span className="krishna-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"  /></svg></span>
                    <span className="divine-text">Nearby Attractions</span>
                    <span className="krishna-feather right-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"  /></svg></span>
                </h2>
                <p>Discover the divine landmarks and heritage sites around Braj Nidhi. <span className="click-hint">(Click any card to flip for location)</span></p>
            </div>
            <div className="attractions-grid">
                {/*  Attraction 1  */}
                <div className="attraction-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Banke_Bihari_Vrindavan.jpg/960px-Banke_Bihari_Vrindavan.jpg" alt="Banke Bihari Temple" className="attraction-bg" />
                            <div className="card-overlay-gradient"></div>
                            <div className="distance-pill">3.69 km</div>
                            <div className="attraction-content">
                                <div className="title-row">
                                    <h3>Banke Bihari Temple</h3>
                                    <span className="rating-pill"><i className="fas fa-star" style={{"color":"#ffd700"}}></i> 4.9</span>
                                </div>
                                <div className="location-line">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Bihari Pura, Vrindavan</span>
                                </div>
                                <div className="flip-hint-text">
                                    <i className="fas fa-sync-alt"></i> Click for Map
                                </div>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6974793!3d27.5815647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736fc201c10711%3A0xbcc1c54b2ce8f41e!2sShri%20Bankey%20Bihari%20Ji%20Temple%2C%20Vrindavan!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin" width="100%" height="100%" style={{"border":"0"}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                        </div>
                    </div>
                </div>

                {/*  Attraction 2  */}
                <div className="attraction-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/PremMandirSideViewFromCanteen.jpg/960px-PremMandirSideViewFromCanteen.jpg" alt="Prem Mandir" className="attraction-bg" />
                            <div className="card-overlay-gradient"></div>
                            <div className="distance-pill">0.69 km</div>
                            <div className="attraction-content">
                                <div className="title-row">
                                    <h3>Prem Mandir</h3>
                                    <span className="rating-pill"><i className="fas fa-star" style={{"color":"#ffd700"}}></i> 5.0</span>
                                </div>
                                <div className="location-line">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Chattikara Road, Vrindavan</span>
                                </div>
                                <div className="flip-hint-text">
                                    <i className="fas fa-sync-alt"></i> Click for Map
                                </div>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6774793!3d27.5615647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPrem%20Mandir!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin" width="100%" height="100%" style={{"border":"0"}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                        </div>
                    </div>
                </div>

                {/*  Attraction 3  */}
                <div className="attraction-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Iskon_Temple%2C_Vrindawan.jpg/960px-Iskon_Temple%2C_Vrindawan.jpg" alt="ISKCON Temple" className="attraction-bg" />
                            <div className="card-overlay-gradient"></div>
                            <div className="distance-pill">1.20 km</div>
                            <div className="attraction-content">
                                <div className="title-row">
                                    <h3>ISKCON Vrindavan</h3>
                                    <span className="rating-pill"><i className="fas fa-star" style={{"color":"#ffd700"}}></i> 4.8</span>
                                </div>
                                <div className="location-line">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Raman Reti, Vrindavan</span>
                                </div>
                                <div className="flip-hint-text">
                                    <i className="fas fa-sync-alt"></i> Click for Map
                                </div>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6874793!3d27.5715647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sISKCON%20Vrindavan!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin" width="100%" height="100%" style={{"border":"0"}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                        </div>
                    </div>
                </div>

                {/*  Attraction 4  */}
                <div className="attraction-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Nidhivan.jpg/960px-Nidhivan.jpg" alt="Nidhivan" className="attraction-bg" />
                            <div className="card-overlay-gradient"></div>
                            <div className="distance-pill">3.55 km</div>
                            <div className="attraction-content">
                                <div className="title-row">
                                    <h3>Nidhivan</h3>
                                    <span className="rating-pill"><i className="fas fa-star" style={{"color":"#ffd700"}}></i> 4.7</span>
                                </div>
                                <div className="location-line">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Goshala Nagar, Vrindavan</span>
                                </div>
                                <div className="flip-hint-text">
                                    <i className="fas fa-sync-alt"></i> Click for Map
                                </div>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6984793!3d27.5825647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNidhivan!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin" width="100%" height="100%" style={{"border":"0"}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                        </div>
                    </div>
                </div>

                {/*  Attraction 5  */}
                <div className="attraction-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Radha_Raman_Temple_2.jpg/960px-Radha_Raman_Temple_2.jpg" alt="Radha Raman Temple" className="attraction-bg" />
                            <div className="card-overlay-gradient"></div>
                            <div className="distance-pill">3.45 km</div>
                            <div className="attraction-content">
                                <div className="title-row">
                                    <h3>Radha Raman Temple</h3>
                                    <span className="rating-pill"><i className="fas fa-star" style={{"color":"#ffd700"}}></i> 4.9</span>
                                </div>
                                <div className="location-line">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Pancayatana, Vrindavan</span>
                                </div>
                                <div className="flip-hint-text">
                                    <i className="fas fa-sync-alt"></i> Click for Map
                                </div>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6994793!3d27.5835647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRadha%20Raman%20Temple!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin" width="100%" height="100%" style={{"border":"0"}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                        </div>
                    </div>
                </div>

                {/*  Attraction 6  */}
                <div className="attraction-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src="neem_karoli.png" alt="Neem Karoli Ashram" className="attraction-bg" />
                            <div className="card-overlay-gradient"></div>
                            <div className="distance-pill">2.72 km</div>
                            <div className="attraction-content">
                                <div className="title-row">
                                    <h3>Neem Karoli Ashram</h3>
                                    <span className="rating-pill"><i className="fas fa-star" style={{"color":"#ffd700"}}></i> 4.9</span>
                                </div>
                                <div className="location-line">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Mathura Road, Vrindavan</span>
                                </div>
                                <div className="flip-hint-text">
                                    <i className="fas fa-sync-alt"></i> Click for Map
                                </div>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6914793!3d27.5845647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNeem%20Karoli%20Baba%20Ashram!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin" width="100%" height="100%" style={{"border":"0"}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                        </div>
                    </div>
                </div>

                {/*  Attraction 7  */}
                <div className="attraction-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src="raman_reti.png" alt="Raman Reti" className="attraction-bg" />
                            <div className="card-overlay-gradient"></div>
                            <div className="distance-pill">15.39 km</div>
                            <div className="attraction-content">
                                <div className="title-row">
                                    <h3>Raman Reti</h3>
                                    <span className="rating-pill"><i className="fas fa-star" style={{"color":"#ffd700"}}></i> 4.8</span>
                                </div>
                                <div className="location-line">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Gokul, Uttar Pradesh</span>
                                </div>
                                <div className="flip-hint-text">
                                    <i className="fas fa-sync-alt"></i> Click for Map
                                </div>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.7214793!3d27.4845647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRaman%20Reti!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin" width="100%" height="100%" style={{"border":"0"}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                        </div>
                    </div>
                </div>

                {/*  Attraction 8  */}
                <div className="attraction-card" onClick={(e) => e.currentTarget.classList.toggle('flipped')}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src="nand_baba.png" alt="Shri Nand Baba Temple" className="attraction-bg" />
                            <div className="card-overlay-gradient"></div>
                            <div className="distance-pill">31.64 km</div>
                            <div className="attraction-content">
                                <div className="title-row">
                                    <h3>Shri Nand Baba Temple</h3>
                                    <span className="rating-pill"><i className="fas fa-star" style={{"color":"#ffd700"}}></i> 4.9</span>
                                </div>
                                <div className="location-line">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Nandgaon, Mathura</span>
                                </div>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.4214793!3d27.7845647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sShri%20Nand%20Baba%20Temple!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin" width="100%" height="100%" style={{"border":"0"}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/*  Gallery Section  */}
        <section className="gallery-section">
            <div className="gallery-header">
                <h2>&mdash; GALLERY</h2>
            </div>
            <div className="gallery-slider swiper">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <img src="images/temple_darshan.png" alt="Temple Darshan" />
                    </div>
                    <div className="swiper-slide">
                        <img src="images/luxurious_stay.png" alt="Luxurious Stays" />
                    </div>
                    <div className="swiper-slide">
                        <img src="images/sacred_gardens.png" alt="Divine Gardens" />
                    </div>
                    <div className="swiper-slide">
                        <img src="images/spiritual_workshop.png" alt="Spiritual Workshops" />
                    </div>
                    <div className="swiper-slide">
                        <img src="images/evening_aarti.png" alt="Evening Aarti" />
                    </div>
                    <div className="swiper-slide">
                        <img src="images/heritage_architecture.png" alt="Heritage Architecture" />
                    </div>
                </div>
                {/*  Navigation Buttons  */}
                <div className="gallery-nav">
                    <div className="swiper-button-prev-custom"><i className="fas fa-arrow-left"></i></div>
                    <div className="swiper-button-next-custom"><i className="fas fa-arrow-right"></i></div>
                </div>
            </div>
        </section>

        {/*  Amenities Auto-Scrolling Marquee  */}
        <div className="amenities-banner">
            <div className="scroller-container">
                <div className="scroller-content">
                    <div className="scroller-item"><i className="fas fa-parking"></i> Parking Space</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-tv"></i> HD Television</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-concierge-bell"></i> 24-hour Room Service</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-tshirt"></i> Laundry Service</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-mug-hot"></i> Tea/Coffee Maker</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-leaf"></i> Pure Vegetarian Restaurant</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-place-of-worship"></i> 3 km from ISKCON Temple</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-om"></i> 3 km from Prem Mandir</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-bath"></i> Bathtub in Suite Category</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-wifi"></i> Free High-Speed Wi-Fi</div>
                    <div className="scroller-dot">✦</div>
                </div>
                {/*  Duplicate for seamless loop  */}
                <div className="scroller-content" aria-hidden="true">
                    <div className="scroller-item"><i className="fas fa-parking"></i> Parking Space</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-tv"></i> HD Television</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-concierge-bell"></i> 24-hour Room Service</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-tshirt"></i> Laundry Service</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-mug-hot"></i> Tea/Coffee Maker</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-leaf"></i> Pure Vegetarian Restaurant</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-place-of-worship"></i> 3 km from ISKCON Temple</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-om"></i> 3 km from Prem Mandir</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-bath"></i> Bathtub in Suite Category</div>
                    <div className="scroller-dot">✦</div>
                    <div className="scroller-item"><i className="fas fa-wifi"></i> Free High-Speed Wi-Fi</div>
                    <div className="scroller-dot">✦</div>
                </div>
            </div>
        </div>

        {/*  Testimonials Section  */}
        <section className="testimonials-section">
            <div className="section-header center-header">
                <div className="rating-badge">
                    <i className="fas fa-star"></i> Rated 4.8/5 by over 10,000 guests
                </div>
                <h2>Words of praise from others<br />about our presence.</h2>
            </div>
            
            <div className="testimonials-slider swiper">
                <div className="swiper-wrapper">
                {/*  Card 1  */}
                <div className="swiper-slide testimonial-card">
                    <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p className="testimonial-text">"Exceeded our expectations with impeccable service that brought our spiritual journey to life - a truly remarkable stay."</p>
                    <div className="testimonial-user">
                        <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=150&h=150" alt="Anjali Sharma" />
                        <div>
                            <h4>Anjali Sharma</h4>
                            <span>Family Trip</span>
                        </div>
                    </div>
                </div>

                {/*  Card 2  */}
                <div className="swiper-slide testimonial-card">
                    <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p className="testimonial-text">"Their ability to capture the spiritual essence in every detail is unparalleled - an invaluable cultural experience."</p>
                    <div className="testimonial-user">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150" alt="Rajesh Kumar" />
                        <div>
                            <h4>Rajesh Kumar</h4>
                            <span>Spiritual Retreat</span>
                        </div>
                    </div>
                </div>

                {/*  Card 3  */}
                <div className="swiper-slide testimonial-card">
                    <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p className="testimonial-text">"Gracious hosts who listen, understand, and craft captivating experiences - a team that truly understands our needs."</p>
                    <div className="testimonial-user">
                        <img src="https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&q=80&w=150&h=150" alt="Kavita Singh" />
                        <div>
                            <h4>Kavita Singh</h4>
                            <span>Weekend Getaway</span>
                        </div>
                    </div>
                </div>

                {/*  Card 4  */}
                <div className="swiper-slide testimonial-card">
                    <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p className="testimonial-text">"A refreshing and peaceful environment that consistently delivers exceptional comfort - highly recommended for any visit."</p>
                    <div className="testimonial-user">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150" alt="Vikram Verma" />
                        <div>
                            <h4>Vikram Verma</h4>
                            <span>Solo Traveler</span>
                        </div>
                    </div>
                </div>

                {/*  Card 5  */}
                <div className="swiper-slide testimonial-card">
                    <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p className="testimonial-text">"From concept to execution, their hospitality knows no bounds - a game-changer for our family vacation."</p>
                    <div className="testimonial-user">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Priya Patel" />
                        <div>
                            <h4>Priya Patel</h4>
                            <span>Family Vacation</span>
                        </div>
                    </div>
                </div>

                {/*  Card 6  */}
                <div className="swiper-slide testimonial-card">
                    <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p className="testimonial-text">"A truly spiritual experience. The view of the temple from my room was breathtaking, and the hospitality was exceptional."</p>
                    <div className="testimonial-user">
                        <img src="https://images.unsplash.com/photo-1499996860827-1b5edc223c8a?auto=format&fit=crop&q=80&w=150&h=150" alt="Amit Desai" />
                        <div>
                            <h4>Amit Desai</h4>
                            <span>Pilgrimage</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </section>


        {/*  FAQ Section  */}
        <section className="faq-section">
            <div className="faq-container">
                <div className="faq-left">
                    <h2>Frequently Asked<br />Questions</h2>
                    <p>We're here to help you plan your perfect stay in the heart of Vrindavan.</p>
                </div>
                <div className="faq-right">
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>What are the check-in and check-out timings?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Standard Check-in is at 2:00 PM and Check-out is at 11:00 AM. Early check-in or late check-out is subject to availability.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>Is the guesthouse near the Bankey Bihari Temple?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Yes, we are located within 1.5 km of the Bankey Bihari Temple, making it a quick 5-minute e-rickshaw ride or a pleasant walk.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>Do you provide pure vegetarian food?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Absolutely. Braj Nidhi is a pure Satvik vegetarian establishment. We serve traditional Braj cuisine prepared with the highest standards of hygiene.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>Is parking available at the guesthouse?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Yes, we have a dedicated, secure parking area for guests traveling with their own vehicles at no additional cost.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>How can I book a room?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>You can book directly through our 'Reserve Now' buttons on this website or reach out to us at +91 98765 43210 for group bookings and weddings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>



        {/*  CTA Section  */}
        <section className="cta-section" id="contact">
            <div className="cta-card">
                <div className="cta-content">
                    <span className="cta-badge">Get Started Today</span>
                    <h1>Your Divine Journey Starts With<br />a Peaceful Stay</h1>
                    <p>Connect with our hospitality team to find the perfect room for your pilgrimage.<br />We're here to help!</p>
                    <a href="#contact" className="cta-btn">Reserve Your Stay</a>
                </div>
            </div>
        </section>
    </main>

    {/*  Footer  */}
    <footer className="site-footer">
        <div className="footer-top-links">
            <div className="footer-col">
                <h3>Company</h3>
                <a href="/#home">Home</a>
                <a href="/#about">Our Story</a>
                <a href="/guesthouse">Rooms & Suites</a>
                <a href="/#testimonials">Guest Reviews</a>
            </div>
            <div className="footer-col">
                <h3>Explore Vrindavan</h3>
                <a href="#">Bankey Bihari Mandir</a>
                <a href="#">Prem Mandir</a>
                <a href="#">ISKCON Temple</a>
                <a href="#">Local Attractions</a>
            </div>
            <div className="footer-col">
                <h3>Stay & Book</h3>
                <a href="/booking">Book Your Stay</a>
                <a href="/weddings">Wedding Packages</a>
                <a href="/corporate">Corporate Stays</a>
                <a href="#">Refund Policy</a>
            </div>
            <div className="footer-col">
                <h3>Help & Support</h3>
                <a href="#">FAQ</a>
                <a href="/#contact">Contact Us</a>
                <a href="#">Direction Map</a>
                <a href="#">Group Inquiries</a>
            </div>
            <div className="footer-col">
                <h3>Information</h3>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Guest Policy</a>
                <a href="#">Cancellation Policy</a>
            </div>
        </div>
        
        <div className="footer-middle-bar">
            <span>Privacy Policy</span>
            <span>Copyright &copy; BRAJNIDHI 2026</span>
            <span>Terms Of Use</span>
        </div>

        <div className="footer-massive-text">
            BRAJNIDHI
        </div>
    </footer>


    {/*  Swiper JS  */}
    
      
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
