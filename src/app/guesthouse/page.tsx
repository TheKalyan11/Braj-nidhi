
"use client";
import React, { useEffect } from 'react';

export default function Guesthouse() {
  useEffect(() => {
    // Swiper initialization for subpages
    if (typeof window !== 'undefined' && (window as any).Swiper) {
      const swiperElements = document.querySelectorAll('.swiper');
      if (swiperElements.length > 0) {
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
    }
  }, []);

  return (
    <div className="guesthouse-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .guesthouse-hero {
            background-color: #ffffff;
            padding: 120px 0 60px 0;
            display: flex;
            justify-content: center;
        }

        .hero-bento-container {
            width: 100%;
            max-width: 1200px;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
        }

        .hero-title-large {
            font-size: 2.2rem;
            font-weight: 900;
            color: #1a1a1a;
            background-color: #ffffff;
            display: inline-block;
            align-self: center;
            padding: 12px 30px;
            text-transform: uppercase;
            text-align: center;
            line-height: 1;
            margin-bottom: -25px;
            position: relative;
            z-index: 2;
            font-family: 'Arial Black', Impact, sans-serif;
            letter-spacing: 2px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .hero-main-img-wrap {
            position: relative;
            width: 100%;
            height: 500px;
            z-index: 1;
        }

        .hero-main-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .hero-orange-banner {
            position: absolute;
            bottom: 0;
            left: 0;
            background: #e95d35;
            color: #fff;
            padding: 15px 30px;
            font-weight: bold;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.1rem;
            letter-spacing: 1px;
        }

        .hero-bento-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 20px;
        }

        .bento-box {
            padding: 40px 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .bento-green {
            background: #9fe173;
            color: #1a1a1a;
            position: relative;
            overflow: hidden;
        }
        
        .bento-green h3 {
            font-size: 1.8rem;
            font-weight: 900;
            line-height: 1.2;
            text-transform: uppercase;
            margin: 0;
            font-family: 'Arial Black', sans-serif;
        }
        
        .bento-green svg {
            position: absolute;
            bottom: -10px;
            right: 0;
            width: 100%;
            height: 100px;
            opacity: 0.5;
        }

        .bento-pink {
            background: #edd2cc;
            color: #1a1a1a;
        }

        .bento-beige {
            background: #e8dac4;
            color: #1a1a1a;
        }

        .bento-icon {
            font-size: 2rem;
            margin-bottom: 20px;
        }

        .bento-box h4 {
            font-size: 1rem;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 15px;
            font-family: 'Arial Black', sans-serif;
        }

        .bento-box p {
            font-size: 0.95rem;
            line-height: 1.5;
            margin: 0;
        }

        .bento-yellow {
            background: #fbc434;
            color: #1a1a1a;
            position: relative;
            z-index: 3;
            margin-top: -120px;
            padding-top: 80px;
        }

        .bento-yellow h3 {
            font-size: 1.8rem;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 15px;
            font-family: 'Arial Black', sans-serif;
            line-height: 1.1;
        }

        .bento-yellow p {
            margin-bottom: 30px;
        }

        .bento-btn {
            display: inline-block;
            border: 2px solid #1a1a1a;
            color: #1a1a1a;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 0.8rem;
            padding: 12px 20px;
            text-decoration: none;
            transition: all 0.3s;
            width: fit-content;
        }
        
        .bento-btn:hover {
            background: #1a1a1a;
            color: #fbc434;
        }

        @media (max-width: 1024px) {
            .hero-bento-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .bento-yellow {
                margin-top: 0;
                grid-column: span 2;
            }
            .hero-title-large {
                font-size: 8vw;
                margin-bottom: -4vw;
            }
        }

        @media (max-width: 600px) {
            .hero-bento-grid {
                grid-template-columns: 1fr;
            }
            .bento-yellow {
                grid-column: span 1;
            }
            .hero-title-large {
                font-size: 12vw;
                margin-bottom: -6vw;
            }
            .hero-main-img-wrap {
                min-height: 300px;
            }
        }

        .amenities-section {
            padding: 40px 5%;
            background: #fafafa;
        }

        .amenities-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            background: #e5e5e5;
            margin-top: 60px;
            border: 1px solid #e5e5e5;
        }

        .amenity-item {
            text-align: left;
            padding: 50px 40px;
            background: #ffffff;
            transition: all 0.4s ease;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .amenity-item:hover {
            background: #000000;
        }

        .amenity-icon {
            font-size: 2rem;
            color: #000000;
            margin-bottom: 25px;
            transition: 0.4s ease;
        }

        .amenity-title {
            font-size: 1.1rem;
            font-weight: 800;
            color: #000000;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Arial Black', sans-serif;
            transition: 0.4s ease;
        }

        .amenity-item p {
            color: #666666;
            font-size: 0.95rem;
            line-height: 1.6;
            transition: 0.4s ease;
            margin: 0;
        }

        .amenity-item:hover .amenity-icon,
        .amenity-item:hover .amenity-title,
        .amenity-item:hover p {
            color: #ffffff;
        }

        /* --- New Promotional Sections --- */
        .promo-section-1 {
            background: #faf8f5;
            padding: 100px 5%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5%;
            flex-wrap: wrap;
        }
        .promo-col-left {
            flex: 1;
            min-width: 300px;
        }
        .promo-col-left p.lead-text {
            font-size: 1.4rem;
            font-weight: 800;
            line-height: 1.5;
            color: #1a1a1a;
            margin-bottom: 40px;
        }
        .promo-links {
            display: flex;
            gap: 30px;
            margin-bottom: 60px;
        }
        .promo-link {
            font-size: 0.85rem;
            font-weight: 800;
            color: #1a1a1a;
            text-transform: uppercase;
            text-decoration: none;
            border-bottom: 2px solid #1a1a1a;
            padding-bottom: 5px;
            letter-spacing: 1px;
        }
        .promo-tour-card {
            border: 2px solid #1a1a1a;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 20px;
            max-width: 350px;
            background: #fff;
        }
        .promo-tour-img {
            width: 80px;
            height: 100px;
            object-fit: cover;
        }
        .promo-tour-text {
            font-size: 1.1rem;
            font-weight: 800;
            text-transform: uppercase;
            line-height: 1.2;
            color: #1a1a1a;
        }
        .promo-col-center {
            flex: 1;
            min-width: 300px;
            position: relative;
        }
        .promo-col-center img {
            width: 100%;
            height: auto;
            max-height: 600px;
            object-fit: cover;
            display: block;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .promo-col-right {
            flex: 1;
            min-width: 300px;
        }
        .promo-col-right h2 {
            font-size: 3.5rem;
            font-weight: 900;
            line-height: 1.1;
            color: #1a1a1a;
            text-transform: uppercase;
            margin-bottom: 30px;
            font-family: 'Arial Black', sans-serif;
        }
        .promo-col-right .sub-title {
            font-size: 0.9rem;
            font-weight: 800;
            color: #e95d35;
            text-transform: uppercase;
            margin-left: 10px;
            display: inline-block;
            transform: translateY(-15px);
        }
        .promo-col-right p {
            font-size: 1.1rem;
            color: #444;
            line-height: 1.8;
            margin-bottom: 40px;
            font-weight: 500;
        }
        .btn-text-arrow {
            font-size: 0.9rem;
            font-weight: 800;
            color: #1a1a1a;
            text-transform: uppercase;
            text-decoration: none;
            letter-spacing: 1px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        
        .promo-section-2 {
            background: #faf8f5;
            padding: 60px 5%;
            display: flex;
            align-items: center;
            gap: 60px;
            flex-wrap: wrap;
        }
        .promo2-col-left {
            flex: 1;
            min-width: 300px;
        }
        .promo2-col-left .sub-title {
            font-size: 1rem;
            font-weight: 800;
            color: #e95d35;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .promo2-col-left h2 {
            font-size: 3rem;
            font-weight: 900;
            line-height: 1.1;
            color: #1a1a1a;
            text-transform: uppercase;
            margin-bottom: 30px;
            font-family: 'Arial Black', sans-serif;
        }
        .promo2-col-left p {
            font-size: 1.1rem;
            color: #1a1a1a;
            line-height: 1.8;
            margin-bottom: 40px;
            font-weight: 600;
        }
        .promo2-col-left .btn-outline {
            border: 2px solid #1a1a1a;
            padding: 15px 30px;
            font-size: 0.9rem;
            font-weight: 800;
            color: #1a1a1a;
            text-transform: uppercase;
            text-decoration: none;
            letter-spacing: 1px;
            display: inline-block;
            transition: all 0.3s;
        }
        .promo2-col-left .btn-outline:hover {
            background: #1a1a1a;
            color: #fff;
        }
        .promo2-col-right {
            flex: 1;
            min-width: 300px;
            position: relative;
        }
        .promo2-col-right > img {
            width: 100%;
            height: 450px;
            object-fit: cover;
            display: block;
            border-radius: 4px;
        }
        .promo2-price-badge {
            position: absolute;
            bottom: -30px;
            left: -30px;
            background: #fff;
            border: 2px solid #1a1a1a;
            padding: 30px;
            width: 280px;
            z-index: 2;
        }
        .promo2-price-badge .price-top {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            border-bottom: 2px solid #1a1a1a;
            padding-bottom: 20px;
        }
        .promo2-price-badge .price-num {
            font-size: 3.5rem;
            font-weight: 900;
            color: #1a1a1a;
            line-height: 1;
            font-family: 'Arial Black', sans-serif;
        }
        .promo2-price-badge .price-text {
            font-size: 0.85rem;
            font-weight: 800;
            color: #1a1a1a;
            text-transform: uppercase;
            line-height: 1.2;
        }
        .promo2-price-badge .price-bottom {
            font-size: 0.9rem;
            font-weight: 800;
            color: #1a1a1a;
            text-transform: uppercase;
            line-height: 1.4;
        }
        @media (max-width: 900px) {
            .promo-section-1, .promo-section-2 {
                flex-direction: column;
            }
            .promo2-price-badge {
                bottom: 10px;
                left: 10px;
            }
        }

        /* Amenities Banner moved to banner.css */


        /* New Listing Layout Styles */
        .listing-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px 20px;
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 50px;
        }

        /* Sidebar Filters */
        .filter-sidebar {
            background: #fff;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            height: fit-content;
        }

        .filter-sidebar h3 {
            font-size: 1.5rem;
            color: #777;
            margin-bottom: 30px;
            font-weight: 500;
            font-family: serif;
        }

        .filter-group {
            margin-bottom: 25px;
        }

        .filter-group label {
            display: block;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .filter-input-wrap {
            position: relative;
            background: #fdfbf7;
            border-radius: 10px;
            padding: 12px 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .filter-input-wrap input {
            border: none;
            background: transparent;
            font-size: 0.9rem;
            color: #555;
            width: 100%;
            outline: none;
        }
        
        .filter-input-wrap i {
            color: #888;
        }

        .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 12px;
            cursor: pointer;
            text-transform: none;
            font-weight: normal;
        }
        
        .checkbox-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #555;
            cursor: pointer;
            border-radius: 4px;
        }

        .btn-apply {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 30px;
            background: #f4efea;
            color: #555;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
            margin-top: 10px;
        }

        .btn-apply:hover {
            background: #e9e2db;
        }

        /* Main Content area */


        .property-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
        }

        @media (max-width: 900px) {
            .listing-container {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 900px) {
            .listing-container {
                grid-template-columns: 1fr;
            }
        }
    ` }} />
      
    {/* SVG Definitions (Copied from index.html) */}
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
                <circle cx="40" cy="62" r="2.5" fill="#3e2723"/>
                <circle cx="50" cy="59" r="2.5" fill="#3e2723"/>
                <circle cx="60" cy="56" r="2.5" fill="#3e2723"/>
                <circle cx="70" cy="53" r="2.5" fill="#3e2723"/>
                <g transform="translate(55, 10) rotate(15) scale(0.4)">
                    <use href="#peacock-feather" />
                </g>
            </g>
        </defs>
    </svg>

    <header id="main-header" className="scrolled">
        <a href="/" className="logo" style={{textDecoration: "none"}}><img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{height: "60px", width: "auto"}}  /></a>
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

    <main>
        <section className="guesthouse-hero">
            <div className="hero-bento-container">
                <div className="hero-title-large">Luxury Guestrooms & Divine Suites</div>
                
                <div className="hero-main-img-wrap">
                    <img src="DSC05963-HDR.png" alt="Resort View" />
                    <div className="hero-orange-banner">
                        FIND ROOMS FOR A STAY <i className="fas fa-binoculars"></i>
                    </div>
                </div>

                <div className="hero-bento-grid">
                    <div className="bento-box bento-green">
                        <h3>VRINDAVAN.<br />SPIRITUAL.<br />LUXURY.</h3>
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                            <path d="M0,15 Q20,0 50,15 T100,15 M0,20 Q20,5 50,20 T100,20 M0,25 Q20,10 50,25 T100,25" fill="none" stroke="#6aa147" strokeWidth="2"/>
                        </svg>
                    </div>

                    <div className="bento-box bento-pink">
                        <i className="far fa-heart bento-icon"></i>
                        <h4>YOUR DIVINE CELEBRATION</h4>
                        <p>We love orchestrating your spiritual and wedding events</p>
                    </div>

                    <div className="bento-box bento-beige">
                        <i className="fas fa-spa bento-icon"></i>
                        <h4>AYURVEDIC SPA & WELLNESS</h4>
                        <p>Rejuvenate your senses with traditional holistic therapies</p>
                    </div>

                    <div className="bento-box bento-yellow">
                        <h3>VRINDAVAN TEMPLE GUIDE</h3>
                        <p>Plan your Darshan with our exclusive guide to Vrindavan's divine sites.</p>
                        <a href="#" className="bento-btn">VIEW TEMPLE GUIDE <i className="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </section>



        {/* Room Types Section (New Sidebar Layout) */}
        <section className="room-types-section" style={{"background":"#fdfbf7"}}>
            <div className="listing-container">
                {/* Sidebar */}
                <aside className="filter-sidebar">
                    <h3>Filter Stay</h3>
                    
                    <div className="filter-group">
                        <label>CHECK-IN - CHECK-OUT</label>
                        <div className="filter-input-wrap">
                            <input type="text" placeholder="Select Dates" readOnly />
                            <i className="far fa-calendar-alt"></i>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>GUESTS</label>
                        <div className="filter-input-wrap">
                            <input type="text" value="2 Adults, 0 Children" readOnly />
                            <i className="far fa-user"></i>
                        </div>
                    </div>

                    <div className="filter-group checkbox-group">
                        <label style={{"color":"#888","textTransform":"uppercase","fontSize":"0.75rem","fontWeight":"600","marginBottom":"10px"}}>ROOM TYPE</label>
                        <label><input type="checkbox" checked /> Royal Heritage Suite</label>
                        <label><input type="checkbox" checked /> Executive Suite</label>
                        <label><input type="checkbox" checked /> Deluxe Temple View</label>
                    </div>

                    <button className="btn-apply">Apply Filters</button>
                </aside>

                {/* Main Listing */}
                <div className="listing-main">
                    <div className="property-list">
                        {/* Card 1 */}
                        <div className="room-card new-style">
                            <img src="room_deluxe.png" alt="Deluxe Room" className="room-bg-img" />
                            <div className="card-gradient"></div>
                            <button className="favorite-btn"><i className="far fa-heart"></i></button>
                            <div className="room-content">
                                <h3>Deluxe Temple View</h3>
                                <p className="room-location"><i className="fas fa-map-marker-alt"></i> Braj Nidhi Guest House, Vrindavan</p>
                                <div className="room-amenities">
                                    <span><i className="fas fa-bed"></i> King Bed</span>
                                    <span><i className="fas fa-wifi"></i> Free WiFi</span>
                                    <span><i className="fas fa-coffee"></i> Tea/Coffee</span>
                                </div>
                                <a href="/#contact" className="btn-availability" style={{"display":"block","textAlign":"center","textDecoration":"none","color":"#000"}}>Book for ₹8,500 <i className="fas fa-chevron-right"></i></a>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="room-card new-style">
                            <img src="room_executive.png" alt="Executive Suite" className="room-bg-img" />
                            <div className="card-gradient"></div>
                            <button className="favorite-btn"><i className="far fa-heart"></i></button>
                            <div className="room-content">
                                <h3>Executive Suite</h3>
                                <p className="room-location"><i className="fas fa-map-marker-alt"></i> Braj Nidhi Guest House, Vrindavan</p>
                                <div className="room-amenities">
                                    <span><i className="fas fa-couch"></i> Living Area</span>
                                    <span><i className="fas fa-bath"></i> Deep Tub</span>
                                    <span><i className="fas fa-concierge-bell"></i> 24/7 Service</span>
                                </div>
                                <a href="/#contact" className="btn-availability" style={{"display":"block","textAlign":"center","textDecoration":"none","color":"#000"}}>Book for ₹12,500 <i className="fas fa-chevron-right"></i></a>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="room-card new-style">
                            <img src="room_royal.png" alt="Royal Heritage Suite" className="room-bg-img" />
                            <div className="card-gradient"></div>
                            <button className="favorite-btn"><i className="far fa-heart"></i></button>
                            <div className="room-content">
                                <h3>Royal Heritage Suite</h3>
                                <p className="room-location"><i className="fas fa-map-marker-alt"></i> Braj Nidhi Guest House, Vrindavan</p>
                                <div className="room-amenities">
                                    <span><i className="fas fa-crown"></i> Four-Poster Bed</span>
                                    <span><i className="fas fa-user-tie"></i> Personal Attendant</span>
                                    <span><i className="fas fa-hot-tub"></i> Jacuzzi</span>
                                </div>
                                <a href="/#contact" className="btn-availability" style={{"display":"block","textAlign":"center","textDecoration":"none","color":"#000"}}>Book for ₹25,000 <i className="fas fa-chevron-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Amenities Section */}
        <section className="amenities-section">
            <div className="section-header">
                <div className="hero-title-large" style={{"marginBottom":"15px","boxShadow":"none","border":"1.5px solid #000","fontSize":"1.6rem","padding":"10px 25px"}}>PREMIUM AMENITIES</div>
                <p style={{"color":"#666","maxWidth":"600px","margin":"0 auto","fontSize":"1rem"}}>Everything you need for a comfortable and spiritually uplifting stay.</p>
            </div>
            <div className="amenities-grid">
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-wifi"></i></div>
                    <div className="amenity-title">High-Speed Wi-Fi</div>
                    <p>Stay connected with complimentary high-speed internet throughout the property.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-utensils"></i></div>
                    <div className="amenity-title">In-Room Dining</div>
                    <p>Enjoy our curated menu of pure vegetarian delicacies in the comfort of your room.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-spa"></i></div>
                    <div className="amenity-title">Spa & Wellness</div>
                    <p>Rejuvenate your senses with traditional Ayurvedic therapies and massages.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-car"></i></div>
                    <div className="amenity-title">Valet Parking</div>
                    <p>Secure and convenient parking assistance available 24/7 for all our guests.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-praying-hands"></i></div>
                    <div className="amenity-title">Temple Assistance</div>
                    <p>Guided tours and priority darshan arrangements at major Vrindavan temples.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-concierge-bell"></i></div>
                    <div className="amenity-title">24/7 Concierge</div>
                    <p>Dedicated staff ready to assist you with travel plans and special requests anytime.</p>
                </div>
            </div>
        </section>

        {/* Amenities Auto-Scrolling Marquee */}
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
                {/* Duplicate for seamless loop */}
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

        {/* Promo Section 1 */}
        <section className="promo-section-1">
            <div className="promo-col-left">
                <p className="lead-text">We let ourselves be inspired by the divine heritage as well as by the contemporary comforts of the city.</p>
                <div className="promo-links">
                    <a href="#" className="promo-link">FREE WIFI <i className="fas fa-chevron-right"></i></a>
                    <a href="#" className="promo-link">BREAKFAST <i className="fas fa-chevron-right"></i></a>
                </div>
                <div className="promo-tour-card">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Vrindavan_Chandrodaya_Mandir.jpg/400px-Vrindavan_Chandrodaya_Mandir.jpg" alt="Vrindavan Tour" className="promo-tour-img" />
                    <div className="promo-tour-text">TEMPLE TOUR GUIDE</div>
                    <i className="fas fa-cube" style={{"fontSize":"1.5rem","marginLeft":"auto","color":"#1a1a1a"}}></i>
                </div>
            </div>
            
            <div className="promo-col-center">
                <img src="spiritual_wide.png" alt="Spiritual Architecture" />
            </div>

            <div className="promo-col-right">
                <h2>SERVICE <span className="sub-title">OFFERS</span><br />WE PROVIDE</h2>
                <p>Braj Nidhi provides aesthetic spiritual guest houses for our International Tourists, Pilgrims, and Event organizers.</p>
                <a href="#" className="btn-text-arrow">SEE ALL SERVICES <i className="fas fa-arrow-right"></i></a>
            </div>
        </section>

        {/* Promo Section 2 */}
        <section className="promo-section-2">
            <div className="promo2-col-left">
                <div className="sub-title">ROOMS</div>
                <h2>Experience a refined stay within the sacred atmosphere of Braj Nidhi.</h2><p>Thoughtfully designed rooms, elegant interiors, and peaceful surroundings come together to offer a truly elevated hospitality experience in the heart of Vrindavan.<br /><br />Whether you are visiting for darshan, weddings, spiritual retreats, or family gatherings, every stay is crafted with warmth, comfort, and timeless elegance.</p>
                <a href="#" className="btn-outline">SEE ALL ROOMS <i className="fas fa-arrow-right"></i></a>
            </div>
            
            <div className="promo2-col-right">
                <img src="room_deluxe.png" alt="Deluxe Room" />
                <div className="promo2-price-badge">
                    <div className="price-top">
                        <span className="price-num">8.5</span>
                        <span className="price-text">K ₹<br />PER ROOM</span>
                        <i className="fas fa-cube" style={{"fontSize":"1.5rem","marginLeft":"auto","color":"#1a1a1a"}}></i>
                    </div>
                    <div className="price-bottom">
                        START FROM 8,500 ₹ PER NIGHT.
                    </div>
                </div>
            </div>
        </section>
    </main>

    {/* Footer */}
    <footer className="site-footer" id="contact">
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
                <a href="/#contact">Book Your Stay</a>
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


    
        {/* Global Floating Features */}
    <div className="whatsapp-container">
        <a href="https://wa.me/910000000000" className="whatsapp-btn" target="_blank">
            <i className="fab fa-whatsapp"></i>
        </a>
    </div>

    

    

    
    

    </div>
  );
}
