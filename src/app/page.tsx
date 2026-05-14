
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [flippedCards, setFlippedCards] = useState<boolean[]>(new Array(8).fill(false));

  const attractions = [
    {
      title: "Banke Bihari Temple",
      dist: "3.69 km",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Banke_Bihari_Vrindavan.jpg/960px-Banke_Bihari_Vrindavan.jpg",
      rating: "4.9",
      loc: "Bihari Pura, Vrindavan",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6974793!3d27.5815647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736fc201c10711%3A0xbcc1c54b2ce8f41e!2sShri%20Bankey%20Bihari%20Ji%20Temple%2C%20Vrindavan!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin"
    },
    {
      title: "Prem Mandir",
      dist: "0.69 km",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/PremMandirSideViewFromCanteen.jpg/960px-PremMandirSideViewFromCanteen.jpg",
      rating: "5.0",
      loc: "Chattikara Road, Vrindavan",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6774793!3d27.5615647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPrem%20Mandir!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin"
    },
    {
      title: "ISKCON Vrindavan",
      dist: "1.20 km",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Iskon_Temple%2C_Vrindawan.jpg/960px-Iskon_Temple%2C_Vrindawan.jpg",
      rating: "4.8",
      loc: "Raman Reti, Vrindavan",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6874793!3d27.5715647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sISKCON%20Vrindavan!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin"
    },
    {
      title: "Nidhivan",
      dist: "3.55 km",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Nidhivan.jpg/960px-Nidhivan.jpg",
      rating: "4.7",
      loc: "Goshala Nagar, Vrindavan",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6984793!3d27.5825647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNidhivan!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin"
    },
    {
      title: "Radha Raman Temple",
      dist: "3.45 km",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Radha_Raman_Temple_2.jpg/960px-Radha_Raman_Temple_2.jpg",
      rating: "4.9",
      loc: "Pancayatana, Vrindavan",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6994793!3d27.5835647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRadha%20Raman%20Temple!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin"
    },
    {
      title: "Neem Karoli Ashram",
      dist: "2.72 km",
      img: "https://brajnidhi.com/neem_karoli.png",
      rating: "4.9",
      loc: "Mathura Road, Vrindavan",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.6914793!3d27.5845647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNeem%20Karoli%20Baba%20Ashram!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin"
    },
    {
      title: "Raman Reti",
      dist: "15.39 km",
      img: "https://brajnidhi.com/raman_reti.png",
      rating: "4.8",
      loc: "Gokul, Uttar Pradesh",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.7214793!3d27.4845647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRaman%20Reti!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin"
    },
    {
      title: "Shri Nand Baba Temple",
      dist: "31.64 km",
      img: "https://brajnidhi.com/nand_baba.png",
      rating: "4.9",
      loc: "Nandgaon, Mathura",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.8665045058414!2d77.4214793!3d27.7845647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sShri%20Nand%20Baba%20Temple!5e0!3m2!1sen!2sin!4v1714486500000!5m2!1sen!2sin"
    }
  ];

  const toggleCard = (index: number) => {
    setFlippedCards(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };



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
                <path d="M10,75 L90,45" stroke="#DAA520" strokeWidth="12" stroke-linecap="round"/>
                <path d="M12,73 L88,44" stroke="#F0E68C" strokeWidth="6" stroke-linecap="round"/>
                <line x1="20" y1="76" x2="25" y2="63" stroke="#DC143C" strokeWidth="3"/>
                <line x1="23" y1="75" x2="28" y2="62" stroke="#DC143C" strokeWidth="3"/>
                <line x1="75" y1="56" x2="80" y2="43" stroke="#DC143C" strokeWidth="3"/>
                <line x1="78" y1="55" x2="83" y2="42" stroke="#DC143C" strokeWidth="3"/>
                <circle cx="40" cy="62" r="2.5" fill="#3e2723"/>
                <circle cx="50" cy="59" r="2.5" fill="#3e2723"/>
                <circle cx="60" cy="56" r="2.5" fill="#3e2723"/>
                <circle cx="70" cy="53" r="2.5" fill="#3e2723"/>
                <path d="M23,75 Q15,90 30,95" fill="none" stroke="#FFD700" strokeWidth="2"/>
                <path d="M27,74 Q35,90 30,95" fill="none" stroke="#FFD700" strokeWidth="2"/>
                <g transform="translate(55, 10) rotate(15) scale(0.4)">
                    <use href="#peacock-feather" />
                </g>
            </g>
        </defs>
    </svg>

    <header id="main-header" className={scrolled ? "scrolled" : ""}>
        <div className="logo"><img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{height: "60px", width: "auto"}}  loading="lazy" decoding="async" /></div>
        
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
                <h1>Timeless Luxury. Divine Serenity.</h1>
                <p>Experience a refined stay within the sacred atmosphere of Braj Nidhi. Our divine suites offer an oasis of calm amidst the spiritual heart of Vrindavan.</p>
                
                <div className="rating-info liquid-glass">
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
                    <div className="form-group">
                        <label>Check-in</label>
                        <span>May 12, 2026</span>
                    </div>
                    <div className="form-group">
                        <label>Check-out</label>
                        <span>May 18, 2026</span>
                    </div>
                    <div className="form-group">
                        <label>Guests</label>
                        <span>2 Adults, 1 Child</span>
                    </div>
                    <div className="form-group">
                        <label>Room Type</label>
                        <span>Luxury Suite</span>
                    </div>
                    <div className="form-group full-width">
                        <label>Event Type (Optional)</label>
                        <span>Corporate Offsite</span>
                    </div>
                </div>

                <div className="price-row">
                    <div className="price">₹12,500<span>/night</span></div>
                    <div className="occupancy">2-4 guests</div>
                </div>

                <a href="#contact" className="btn-reserve" style={{ display: "block", textAlign: "center", textDecoration: "none", position: "relative", zIndex: 5 }}>Request Reservation</a>
            </div>
        </section>

        <section className="banner-section">
            <div className="scrolling-banner">
                <div className="banner-track">
                    <div className="logo-item"><i className="fas fa-bed"></i> Luxury Suites</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-ring"></i> Scenic Weddings</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-laptop-house"></i> Corporate Offsites</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-landmark"></i> Heritage Living</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-glass-cheers"></i> Grand Banquets</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-video"></i> Modern AV Halls</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-star"></i> Boutique Stays</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-spa"></i> Wellness Retreats</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-bed"></i> Luxury Suites</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-ring"></i> Scenic Weddings</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-laptop-house"></i> Corporate Offsites</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-landmark"></i> Heritage Living</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-glass-cheers"></i> Grand Banquets</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-video"></i> Modern AV Halls</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-star"></i> Boutique Stays</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                    <div className="logo-item"><i className="fas fa-spa"></i> Wellness Retreats</div>
                    <div className="banner-divider"><svg viewBox="0 0 100 100"><use href="#peacock-feather" /></svg></div>
                </div>
            </div>
        </section>

        <section className="split-section" id="rooms">
            <div className="split-container reverse">
                <div className="content-box">
                    <svg className="animated-flute" viewBox="-10 -20 120 120"><use href="#krishna-flute-feather"></use></svg>
                    <h2>Luxury Guestrooms & Divine Suites</h2>
                    <p>Experience a refined stay within the sacred atmosphere of Braj Nidhi. Thoughtfully designed rooms, elegant interiors, and peaceful surroundings come together to offer a truly elevated hospitality experience in the heart of Vrindavan. Whether you are visiting for darshan, weddings, spiritual retreats, or family gatherings, every stay is crafted with warmth, comfort, and timeless elegance.</p>
                    <Link href="/guesthouse" className="liquid-glass-button">Explore Rooms <i className="fas fa-arrow-right"></i></Link>
                </div>
                <div className="image-grid">
                    <img src="guestroom-1.jpg" alt="Luxury Suite" className="main-img" />
                    <img src="guestroom-2.jpg" alt="Modern Bathroom" className="secondary-img" />
                </div>
            </div>
        </section>

        <section className="split-section" id="weddings" style={{background: "#ffffff"}}>
            <div className="split-container">
                <div className="content-box">
                    <svg className="animated-flute" viewBox="-10 -20 120 120"><use href="#krishna-flute-feather"></use></svg>
                    <h2>Weddings & Grand Celebrations</h2>
                    <p>Celebrate your most special moments amidst the divine elegance of Braj Nidhi. From intimate wedding ceremonies to luxurious grand celebrations, our majestic venues, premium hospitality, and serene spiritual atmosphere create experiences that feel truly timeless. With beautifully designed spaces, exceptional accommodations, curated sattvic dining, and personalized event planning, every celebration at Braj Nidhi becomes a cherished memory for generations.</p>
                    <Link href="/weddings" className="liquid-glass-button">Plan Your Wedding <i className="fas fa-arrow-right"></i></Link>
                </div>
                <div className="image-grid">
                    <img src="wedding-1.jpg" alt="Wedding Hall" className="main-img" />
                    <img src="wedding-2.jpg" alt="Wedding Decor" className="secondary-img" />
                </div>
            </div>
        </section>

        <section className="split-section" id="corporate" style={{background: "#f4f6f8"}}>
            <div className="split-container reverse">
                <div className="content-box">
                    <svg className="animated-flute" viewBox="-10 -20 120 120"><use href="#krishna-flute-feather"></use></svg>
                    <h2>Corporate Retreats & Professional Excellence</h2>
                    <p>Host conferences, meetings, leadership retreats, and corporate gatherings in one of Vrindavan’s finest AV venues. Equipped with advanced sound systems, professional setup, elegant interiors, and seamless event support, Braj Nidhi offers a premium experience designed for impactful events. Blending modern facilities with the peaceful atmosphere of Braj, it’s the perfect destination for productive meetings, meaningful retreats, and elevated corporate experiences.</p>
                    <Link href="/corporate" className="liquid-glass-button">Book Corporate Hall <i className="fas fa-arrow-right"></i></Link>
                </div>
                <div className="image-grid">
                    <img src="corporate-1.jpg" alt="AV Hall" className="main-img" />
                    <img src="corporate-2.jpg" alt="Collaborative Space" className="secondary-img" />
                </div>
            </div>
        </section>

        <section className="stats-section">
            <div className="stats-container">
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
                    <span className="krishna-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"></use></svg></span>
                    <span className="divine-text">Exquisite Accommodations</span>
                    <span className="krishna-feather right-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"></use></svg></span>
                </h2>
                <p>Choose the perfect sanctuary for your stay.</p>
            </div>
            <div className="room-grid">
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
                        <a href="booking.html" className="btn-availability" style={{display: "block", textAlign: "center", textDecoration: "none"}}>Book for ₹25,000 <i className="fas fa-chevron-right"></i></a>
                    </div>
                </div>
            </div>
        </section>

        <section className="offers-section">
            <div className="section-header">
                <h2 className="divine-header">
                    <span className="krishna-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"></use></svg></span>
                    <span className="divine-text">Special Offers & Packages</span>
                    <span className="krishna-feather right-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"></use></svg></span>
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
                        <a href="booking.html" className="btn-offer-full" style={{display: "block", textAlign: "center", textDecoration: "none"}}>Claim Offer</a>
                    </div>
                </div>
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
                        <a href="#contact" className="btn-offer-full" style={{display: "block", textAlign: "center", textDecoration: "none"}}>Enquire Now</a>
                    </div>
                </div>
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
                        <a href="#contact" className="btn-offer-full" style={{display: "block", textAlign: "center", textDecoration: "none", marginTop: "15px"}}>Book This Package</a>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="attractions-section">
            <div className="section-header">
                <h2 className="divine-header">
                    <span className="krishna-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"></use></svg></span>
                    <span className="divine-text">Nearby Attractions</span>
                    <span className="krishna-feather right-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"></use></svg></span>
                </h2>
                <p>Discover the divine landmarks and heritage sites around Braj Nidhi. <span className="click-hint">(Click any card to flip for location)</span></p>
            </div>
          <div className="attractions-grid">
            {attractions.map((attraction, index) => (
              <div 
                key={index} 
                className={`attraction-card ${flippedCards[index] ? 'flipped' : ''}`}
                onClick={() => toggleCard(index)}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img src={attraction.img} alt={attraction.title} className="attraction-bg" />
                    <div className="card-overlay-gradient"></div>
                    <div className="distance-pill">{attraction.dist}</div>
                    <div className="attraction-content">
                      <div className="title-row">
                        <h3>{attraction.title}</h3>
                        <span className="rating-pill"><i className="fas fa-star" style={{ color: '#ffd700' }}></i> {attraction.rating}</span>
                      </div>
                      <div className="location-line">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{attraction.loc}</span>
                      </div>
                      <div className="flip-hint-text">
                        <i className="fas fa-sync-alt"></i> Click for Map
                      </div>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <iframe 
                      src={attraction.map} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div className="flip-back-hint"><i className="fas fa-undo"></i> Click to flip back</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        
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
                
                <div className="gallery-nav">
                    <div className="swiper-button-prev-custom"><i className="fas fa-arrow-left"></i></div>
                    <div className="swiper-button-next-custom"><i className="fas fa-arrow-right"></i></div>
                </div>
            </div>
        </section>

        
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

        
        <section className="testimonials-section">
            <div className="section-header center-header">
                <div className="rating-badge">
                    <i className="fas fa-star"></i> Rated 4.8/5 by over 10,000 guests
                </div>
                <h2>Words of praise from others<br />about our presence.</h2>
            </div>
            
            <div className="testimonials-slider swiper">
                <div className="swiper-wrapper">
                
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


        
        <section className="faq-section">
            <div className="faq-container">
                <div className="faq-left">
                    <h2>Frequently Asked<br />Questions</h2>
                    <p>We're here to help you plan your perfect stay in the heart of Vrindavan.</p>
                    <div className="krishna-feather"><svg viewBox="0 0 100 100"><use href="#krishna-flute-feather"></use></svg></div>
                </div>
                <div className="faq-right">
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>What are the check-in and check-out timings?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Check-in starts from 12:00 PM and check-out is until 10:00 AM. Early check-in and late check-out may be available upon request.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>Is Braj Nidhi suitable for weddings and celebrations?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Yes, Braj Nidhi is an ideal destination for weddings, family functions, spiritual gatherings, and grand celebrations with premium hospitality and elegant event spaces.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>Do you provide pure sattvic vegetarian food?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Yes, we serve freshly prepared pure vegetarian sattvic meals crafted with authenticity, devotion, and quality ingredients.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>Is parking available within the premises?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Yes, ample parking space is available for both staying guests and event visitors.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>Do you offer corporate meeting and AV hall facilities?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Yes, Braj Nidhi features a premium AV hall equipped with professional sound systems, presentation setup, and modern facilities for conferences, meetings, seminars, and retreats.</p>
                        </div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={toggleFAQ}>
                            <span>Is Braj Nidhi suitable for spiritual and wellness retreats?</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="faq-answer">
                            <p>Absolutely. The peaceful atmosphere of Braj combined with premium accommodations makes it perfect for spiritual retreats, wellness programs, and group stays.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>



        
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

    <footer className="site-footer">
        <div className="footer-top-links">
            <div className="footer-col">
                <h3>Company</h3>
                <Link href="/">Home</Link>
                <Link href="/#about">Our Story</Link>
                <Link href="/guesthouse">Rooms & Suites</Link>
                <Link href="/#testimonials">Guest Reviews</Link>
            </div>
            <div className="footer-col">
                <h3>Explore Vrindavan</h3>
                <Link href="#">Bankey Bihari Mandir</Link>
                <Link href="#">Prem Mandir</Link>
                <Link href="#">ISKCON Temple</Link>
                <Link href="#">Local Attractions</Link>
            </div>
            <div className="footer-col">
                <h3>Stay & Book</h3>
                <Link href="/booking">Book Your Stay</Link>
                <Link href="/weddings">Wedding Packages</Link>
                <Link href="/corporate">Corporate Stays</Link>
                <Link href="#">Refund Policy</Link>
            </div>
            <div className="footer-col">
                <h3>Help & Support</h3>
                <Link href="#">FAQ</Link>
                <Link href="/#contact">Contact Us</Link>
                <Link href="#">Direction Map</Link>
                <Link href="#">Group Inquiries</Link>
            </div>
            <div className="footer-col">
                <h3>Information</h3>
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Terms of Service</Link>
                <Link href="#">Guest Policy</Link>
                <Link href="#">Cancellation Policy</Link>
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

    {/* Global Floating Features */}
    <div className="whatsapp-container">
        <a href="https://wa.me/910000000000" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
        </a>
    </div>

    <div className="premium-music-player">
        <div className="player-glass">
            <button className="play-btn" onClick={toggleMusic}>
                <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
            </button>
            <div className="liquid-shine"></div>
        </div>
        <audio ref={audioRef} loop preload="auto" crossOrigin="anonymous" src="https://ia601402.us.archive.org/19/items/melodic-hare-krishna/HareKrishnaMahamantra.mp3">
            <source src="https://ia601402.us.archive.org/19/items/melodic-hare-krishna/HareKrishnaMahamantra.mp3" type="audio/mpeg" />
            <source src="https://cdn.pixabay.com/audio/2022/02/22/audio_d0a13e6912.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    </div>

    <div className={`chatbot-container ${isChatOpen ? 'open' : ''}`}>
        <div className="chatbot-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
            <i className="fas fa-robot"></i>
        </div>
        <div className="chat-window" style={{ display: isChatOpen ? 'flex' : 'none' }}>
            <div className="chat-header">
                <div className="bot-img"><i className="fas fa-om"></i></div>
                <div>
                    <h4>Braj Nidhi Guide</h4>
                    <span>Online | AI Assistant</span>
                </div>
                <i className="fas fa-times" onClick={() => setIsChatOpen(false)} style={{ marginLeft: "auto", cursor: "pointer" }}></i>
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
