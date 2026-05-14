
"use client";
import React, { useEffect } from 'react';

export default function Corporate() {
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
    <div className="corporate-page">
      <style dangerouslySetInnerHTML={{ __html: `
        /* Events specific styles */
        body {
            background-color: #fafafa;
            color: #1a1a1a;
        }

        .events-hero {
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
            border: 2px solid #1a1a1a;
        }

        .hero-single-card {
            position: relative;
            height: 500px;
            overflow: hidden;
            border-radius: 4px;
            margin-top: 20px;
        }

        .hero-single-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .hero-single-content {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 60px 40px;
            background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
            color: #fff;
        }

        .hero-single-content h3 {
            font-family: 'Arial Black', sans-serif;
            font-size: 3rem;
            text-transform: uppercase;
            margin-bottom: 10px;
            line-height: 1.1;
        }

        .hero-single-content p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
        }

        /* Module Sections */
        .module-section {
            padding: 80px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .module-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .module-header h2 {
            font-family: 'Arial Black', sans-serif;
            font-size: 3rem;
            color: #1a1a1a;
            text-transform: uppercase;
            line-height: 1.1;
            margin-bottom: 20px;
        }

        .module-header p {
            font-size: 1.1rem;
            color: #555;
            max-width: 600px;
            margin: 0 auto;
        }

        /* Bento Grids */
        .events-bento {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            background: #e5e5e5;
            border: 1px solid #e5e5e5;
        }

        .bento-item {
            background: #fff;
            padding: 40px;
            transition: all 0.4s ease;
        }

        .bento-item:hover {
            background: #1a1a1a;
            color: #fff;
        }

        .bento-item i {
            font-size: 2rem;
            color: #e95d35;
            margin-bottom: 20px;
            transition: color 0.4s ease;
        }

        .bento-item:hover i {
            color: #fbc434;
        }

        .bento-item h4 {
            font-size: 1.4rem;
            font-weight: 800;
            margin-bottom: 15px;
            text-transform: uppercase;
        }

        .bento-item p {
            color: #666;
            line-height: 1.6;
            font-size: 0.95rem;
            transition: color 0.4s ease;
        }

        .bento-item:hover p {
            color: #ccc;
        }

        /* Package Cards */
        .packages-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-top: 50px;
        }

        .package-card {
            border: 2px solid #1a1a1a;
            padding: 40px;
            background: #fff;
            position: relative;
        }

        .package-badge {
            position: absolute;
            top: -15px;
            right: 30px;
            background: #1a1a1a;
            color: #fff;
            padding: 8px 20px;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
        }

        .package-card h3 {
            font-size: 2rem;
            font-family: 'Arial Black', sans-serif;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        .package-features {
            list-style: none;
            margin-bottom: 30px;
        }

        .package-features li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            color: #444;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .package-features li i {
            color: #e95d35;
        }

        /* Split Section */
        .split-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            align-items: center;
            margin: 80px auto;
            max-width: 1200px;
            padding: 0 20px;
        }

        .split-content h3 {
            font-family: 'Arial Black', sans-serif;
            font-size: 2.5rem;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        .split-content p {
            font-size: 1.1rem;
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .split-image {
            height: 500px;
            border-radius: 4px;
            overflow: hidden;
        }

        .split-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .veg-badge-container {
            width: 100%;
            height: 100%;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 2px dashed #2e7d32;
            border-radius: 8px;
            color: #2e7d32;
            padding: 40px;
            text-align: center;
        }

        .veg-badge-container i {
            font-size: 5rem;
            margin-bottom: 20px;
        }

        .veg-badge-container h4 {
            font-family: 'Arial Black', sans-serif;
            font-size: 2rem;
            text-transform: uppercase;
            margin: 0;
        }

        .veg-badge-container p {
            font-size: 1.2rem;
            font-weight: 600;
            margin-top: 10px;
        }

        .reverse {
            direction: rtl;
        }
        
        .reverse .split-content {
            direction: ltr;
        }

        /* Testimonials */
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-top: 40px;
        }

        .testimonial-card {
            background: #fff;
            padding: 40px;
            border: 1px solid #eee;
            position: relative;
        }

        .testimonial-card i.fa-quote-left {
            font-size: 2rem;
            color: #fbc434;
            margin-bottom: 20px;
        }

        .testimonial-card p {
            font-style: italic;
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .author-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }

        .author-info h5 {
            font-family: 'Arial Black', sans-serif;
            text-transform: uppercase;
        }

        .author-info span {
            font-size: 0.85rem;
            color: #888;
        }

        /* ==============================
           REDESIGNED INQUIRY FORM SECTION
           ============================== */
        .inquiry-form-section {
            background: #ffffff;
            padding: 100px 20px;
            margin-top: 0;
        }

        .inquiry-layout {
            max-width: 1100px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 80px;
            align-items: start;
        }

        /* LEFT PANEL */
        .inquiry-info-panel {
            position: sticky;
            top: 120px;
        }

        .inquiry-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #e8f1ff;
            color: #1a56db;
            font-size: 0.8rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 8px 16px;
            border-radius: 50px;
            margin-bottom: 24px;
        }

        .inquiry-info-panel h2 {
            font-family: 'Arial Black', sans-serif;
            font-size: 2.8rem;
            text-transform: uppercase;
            color: #111;
            line-height: 1.1;
            margin-bottom: 20px;
        }

        .inquiry-info-panel > p {
            font-size: 1.05rem;
            color: #666;
            line-height: 1.7;
            margin-bottom: 40px;
        }

        .inquiry-trust-items {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 40px;
        }

        .trust-item {
            display: flex;
            align-items: flex-start;
            gap: 16px;
        }

        .trust-icon {
            width: 44px;
            height: 44px;
            background: #e8f1ff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .trust-icon i {
            color: #1a56db;
            font-size: 1.1rem;
        }

        .trust-item h5 {
            font-weight: 800;
            color: #111;
            font-size: 0.95rem;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .trust-item p {
            font-size: 0.85rem;
            color: #888;
            line-height: 1.5;
            margin: 0;
        }

        .inquiry-download-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            border: 2px solid #1a1a1a;
            padding: 14px 24px;
            color: #1a1a1a;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s;
        }

        .inquiry-download-link:hover {
            background: #1a1a1a;
            color: #fff;
        }

        /* RIGHT PANEL - FORM CARD */
        .inquiry-form-card {
            background: #f9f9f7;
            border: 1px solid #ebebeb;
            border-radius: 4px;
            padding: 50px 45px;
        }

        .form-card-title {
            font-size: 1.2rem;
            font-weight: 800;
            color: #111;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;
        }

        .inquiry-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .form-group.full-width {
            grid-column: span 2;
        }

        .inquiry-form label {
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #555;
        }

        .inquiry-form input,
        .inquiry-form select,
        .inquiry-form textarea {
            padding: 13px 16px;
            background: #ffffff;
            border: 1.5px solid #e0e0e0;
            border-radius: 3px;
            color: #1a1a1a;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.25s, box-shadow 0.25s;
            font-family: inherit;
        }

        .inquiry-form input::placeholder,
        .inquiry-form textarea::placeholder {
            color: #bbb;
        }

        .inquiry-form select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            cursor: pointer;
        }

        .inquiry-form input:focus,
        .inquiry-form select:focus,
        .inquiry-form textarea:focus {
            border-color: #1a56db;
            box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.08);
        }

        .inquiry-form textarea {
            resize: vertical;
            min-height: 110px;
        }

        .inquiry-form button {
            grid-column: span 2;
            padding: 18px 30px;
            background: #1a1a1a;
            color: #ffffff;
            border: none;
            border-radius: 3px;
            font-family: 'Arial Black', sans-serif;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }

        .inquiry-form button:hover {
            background: #1a56db;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(26, 86, 219, 0.3);
        }

        .form-footer-note {
            text-align: center;
            font-size: 0.8rem;
            color: #aaa;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        @media (max-width: 900px) {
            .inquiry-layout {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            .inquiry-info-panel {
                position: static;
            }
            .inquiry-form-card {
                padding: 35px 25px;
            }
            .events-bento,
            .packages-grid,
            .inquiry-form,
            .split-section,
            .testimonials-grid {
                grid-template-columns: 1fr;
            }
            .form-group.full-width {
                grid-column: span 1;
            }
            .inquiry-form button {
                grid-column: span 1;
            }
        }
    ` }} />
      
    {/* SVG Definitions */}
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
        {/* Hero Section */}
        <section className="events-hero">
            <div className="hero-bento-container">
                <div className="hero-title-large">EXECUTIVE OFFSITES</div>
                
                <div className="hero-single-card">
                    <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop" alt="Corporate Offsites" />
                    <div className="hero-single-content">
                        <h3>Inspire Your Team</h3>
                        <p>State-of-the-art AV halls and serene surroundings designed for focused retreats, strategic planning, and corporate gatherings.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Corporate Offsite Module */}
        <section id="corporate" className="module-section">
            <div className="module-header">
                <h2>Infrastructure & Capabilities</h2>
                <p>Elevate your corporate gatherings with our premium infrastructure, high-speed connectivity, and dedicated AV support.</p>
            </div>

            <div className="events-bento">
                <div className="bento-item">
                    <i className="fas fa-project-diagram"></i>
                    <h4>Executive AV Hall</h4>
                    <p>Theater-style seating for up to 150 pax. Equipped with 4K projectors, surround sound, and high-speed enterprise Wi-Fi.</p>
                </div>
                <div className="bento-item">
                    <i className="fas fa-users"></i>
                    <h4>Boardrooms</h4>
                    <p>Intimate meeting spaces for up to 20 pax with interactive smart boards and video conferencing facilities.</p>
                </div>
                <div className="bento-item">
                    <i className="fas fa-mug-hot"></i>
                    <h4>Networking Lounges</h4>
                    <p>Breakout areas with premium coffee stations and serene garden views to foster organic networking and brainstorming.</p>
                </div>
            </div>

            <div className="packages-grid">
                <div className="package-card">
                    <h3>Day Conference Package</h3>
                    <ul className="package-features">
                        <li><i className="fas fa-check"></i> Executive AV Hall Access (8 Hours)</li>
                        <li><i className="fas fa-check"></i> 4K Projector & PA System</li>
                        <li><i className="fas fa-check"></i> 2 Tea/Coffee Breaks with Snacks</li>
                        <li><i className="fas fa-check"></i> Executive Buffet Lunch</li>
                        <li><i className="fas fa-check"></i> Dedicated IT Support Staff</li>
                    </ul>
                    <a href="#inquiry" className="btn-outline" style={{"border":"2px solid #1a1a1a","padding":"15px 30px","textDecoration":"none","color":"#1a1a1a","fontWeight":"800","textTransform":"uppercase","display":"inline-block"}}>Request Quote</a>
                </div>
                
                <div className="package-card">
                    <div className="package-badge">Premium</div>
                    <h3>Leadership Retreat</h3>
                    <ul className="package-features">
                        <li><i className="fas fa-check"></i> 2 Days Boardroom & AV Hall Access</li>
                        <li><i className="fas fa-check"></i> 10 Executive Suites Included</li>
                        <li><i className="fas fa-check"></i> All Meals + Gala Dinner Setup</li>
                        <li><i className="fas fa-check"></i> Guided Temple Tour Experience</li>
                        <li><i className="fas fa-check"></i> Team Building Activities Space</li>
                    </ul>
                    <a href="#inquiry" className="btn-outline" style={{"border":"2px solid #1a1a1a","padding":"15px 30px","textDecoration":"none","color":"#1a1a1a","fontWeight":"800","textTransform":"uppercase","display":"inline-block"}}>Request Quote</a>
                </div>
            </div>
        </section>

        {/* Why Choose Vrindavan Split Section */}
        <section className="split-section">
            <div className="split-content">
                <h3>The Power of Spiritual Clarity</h3>
                <p>Escape the noise of the city and bring your leadership team to the serene, spiritual atmosphere of Vrindavan. The calm surroundings foster deep focus, innovative thinking, and stress-free strategic planning.</p>
                <p>Our dedicated corporate spaces are designed to blend state-of-the-art technology with a peaceful environment, ensuring your offsite is both highly productive and deeply rejuvenating.</p>
                <ul className="package-features" style={{"marginTop":"20px"}}>
                    <li><i className="fas fa-check"></i> Zero Distractions & Noise-Free Environment</li>
                    <li><i className="fas fa-check"></i> Inspiring Heritage Architecture</li>
                    <li><i className="fas fa-check"></i> Focus-Enhancing Atmosphere</li>
                </ul>
            </div>
            <div className="split-image">
                <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop" alt="Corporate Strategy Meeting" />
            </div>
        </section>

        {/* Executive Dining Split Section (Reverse) */}
        <section className="split-section reverse">
            <div className="split-content">
                <h3>Executive Dining Experiences</h3>
                <p>Nourish your team with premium Sattvic cuisine. Our culinary experts design customized menus that maintain high energy levels throughout your intense strategy sessions.</p>
                <p>From working lunches in the boardroom to elaborate gala dinners in the courtyard, we ensure a seamless dining experience.</p>
                <ul className="package-features" style={{"marginTop":"20px"}}>
                    <li><i className="fas fa-check"></i> Energizing Coffee & Tea Breaks</li>
                    <li><i className="fas fa-check"></i> Premium Buffet Setups</li>
                    <li><i className="fas fa-check"></i> Custom Gala Dinner Themes</li>
                </ul>
            </div>
            <div className="split-image">
                <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop" alt="Executive Dining" />
            </div>
        </section>

        {/* Team Building & Activities */}
        <section className="module-section" style={{"paddingTop":"20px"}}>
            <div className="module-header">
                <h2>Beyond the Boardroom</h2>
                <p>Enhance team cohesion with our curated spiritual and wellness activities.</p>
            </div>
            <div className="events-bento">
                <div className="bento-item">
                    <i className="fas fa-walking"></i>
                    <h4>Heritage Walks</h4>
                    <p>Guided morning tours to the most historic and spiritually significant temples in Vrindavan.</p>
                </div>
                <div className="bento-item">
                    <i className="fas fa-spa"></i>
                    <h4>Yoga & Meditation</h4>
                    <p>Start your day with guided yoga sessions in our tranquil gardens to improve focus and reduce stress.</p>
                </div>
                <div className="bento-item">
                    <i className="fas fa-hands-helping"></i>
                    <h4>Seva Activities</h4>
                    <p>Organize corporate social responsibility (CSR) activities like food distribution (Anna Daan) for team bonding.</p>
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

        {/* Testimonials */}
        <section className="testimonials-section" style={{"background":"#fdfcf8","padding":"100px 0"}}>
            <div style={{"maxWidth":"1200px","margin":"0 auto","padding":"0 20px"}}>
                <div className="section-header center-header">
                    <div className="rating-badge">
                        <i className="fas fa-star"></i> Rated 4.8/5 by industry leaders
                    </div>
                    <h2>Trusted by Leaders</h2>
                    <p>See what companies are saying about their offsite experiences at Braj Nidhi.</p>
                </div>
            </div>

            <div className="testimonials-slider swiper">
                <div className="swiper-wrapper">
                    {/* Card 1 */}
                    <div className="swiper-slide testimonial-card">
                        <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                        <p className="testimonial-text">"Hosting our annual leadership retreat at Braj Nidhi was the best decision. The AV hall was perfectly equipped, and the serene environment led to our most productive strategy session yet."</p>
                        <div className="testimonial-user">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop" alt="CEO" />
                            <div>
                                <h4>Rajesh K.</h4>
                                <span>CEO, TechVision India</span>
                            </div>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="swiper-slide testimonial-card">
                        <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                        <p className="testimonial-text">"The hospitality team went above and beyond for our offsite. The working lunches were fantastic, and the morning meditation sessions completely recharged the team."</p>
                        <div className="testimonial-user">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" alt="HR Director" />
                            <div>
                                <h4>Sneha Sharma</h4>
                                <span>HR Director, GlobalCorp</span>
                            </div>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="swiper-slide testimonial-card">
                        <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                        <p className="testimonial-text">"Braj Nidhi offers a unique blend of modern facilities and spiritual peace. It's the perfect place for team building and deep focus away from the city noise."</p>
                        <div className="testimonial-user">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" alt="Manager" />
                            <div>
                                <h4>Arjun V.</h4>
                                <span>Operations Manager</span>
                            </div>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div className="swiper-slide testimonial-card">
                        <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                        <p className="testimonial-text">"The pure vegetarian catering was a huge hit with our international clients. The attention to detail in the AV setup made our conference seamless."</p>
                        <div className="testimonial-user">
                            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop" alt="Executive" />
                            <div>
                                <h4>Meera Nair</h4>
                                <span>Executive Director</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Lead Capture Form */}
        <section id="inquiry" className="inquiry-form-section">
            <div className="inquiry-layout">

                {/* Left Info Panel */}
                <div className="inquiry-info-panel">
                    <div className="inquiry-eyebrow"><i className="fas fa-briefcase"></i> Corporate Inquiries</div>
                    <h2>Plan Your Corporate Event</h2>
                    <p>Tell us about your event requirements. Our corporate team will craft a tailored proposal and reach out within 24 hours.</p>

                    <div className="inquiry-trust-items">
                        <div className="trust-item">
                            <div className="trust-icon"><i className="fas fa-clock"></i></div>
                            <div>
                                <h5>24-Hour Response</h5>
                                <p>Our corporate events team will review your requirements and respond within one business day.</p>
                            </div>
                        </div>
                        <div className="trust-item">
                            <div className="trust-icon"><i className="fas fa-project-diagram"></i></div>
                            <div>
                                <h5>Dedicated Coordinator</h5>
                                <p>A dedicated events coordinator will be assigned to manage your entire event seamlessly.</p>
                            </div>
                        </div>
                        <div className="trust-item">
                            <div className="trust-icon"><i className="fas fa-building"></i></div>
                            <div>
                                <h5>50+ Corporate Clients</h5>
                                <p>Trusted by leading companies for leadership retreats, conferences, and team offsites.</p>
                            </div>
                        </div>
                    </div>

                    <a href="#" className="inquiry-download-link">
                        <i className="fas fa-file-pdf"></i> Download Corporate Brochure
                    </a>
                </div>

                {/* Right Form Card */}
                <div className="inquiry-form-card">
                    <div className="form-card-title">Fill in Your Details</div>
                    <form className="inquiry-form">
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" placeholder="e.g. Acme Corp" required />
                        </div>
                        <div className="form-group">
                            <label>Contact Person</label>
                            <input type="text" placeholder="e.g. John Doe" required />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="john@company.com" required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="+91 90000 00000" required />
                        </div>
                        <div className="form-group full-width">
                            <label>Event Type</label>
                            <select required>
                                <option value="conference" selected>Day Conference</option>
                                <option value="retreat">Leadership Retreat / Offsite</option>
                                <option value="meeting">Board Meeting</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Estimated Attendees</label>
                            <input type="number" placeholder="e.g. 50" />
                        </div>
                        <div className="form-group">
                            <label>Expected Date</label>
                            <input type="date" />
                        </div>
                        <div className="form-group full-width">
                            <label>Additional Requirements</label>
                            <textarea rows={4} placeholder="Describe your needs — AV setup, accommodation, catering preferences, breakout sessions..."></textarea>
                        </div>
                        <button type="submit">Send Inquiry <i className="fas fa-paper-plane"></i></button>
                    </form>
                    <p className="form-footer-note"><i className="fas fa-lock"></i> Your information is secure and confidential</p>
                </div>

            </div>
        </section>

    </main>

    {/* Footer */}
    <footer className="site-footer" id="contact" style={{"marginTop":"0","background":"#fff","paddingTop":"80px"}}>
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


    {/* Swiper JS */}
    
    </div>
  );
}
