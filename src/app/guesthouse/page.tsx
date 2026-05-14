
"use client";
import React, { useEffect, useState } from 'react';

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

  const [activeImage, setActiveImage] = useState(0);
  const [roomImageIdx, setRoomImageIdx] = useState(0);
  const promoImages = ["temple_1.png", "temple_2.png", "temple_3.png", "temple_4.png", "temple_5.png"];

  const [adultsOpen, setAdultsOpen] = useState(false);
  const [childrenOpen, setChildrenOpen] = useState(false);

  const [filters, setFilters] = useState({
    checkIn: '',
    checkOut: '',
    adults: '2',
    children: '0',
    rooms: {
      deluxe2: true,
      deluxe3: true,
      deluxe4: true,
    }
  });

  const [appliedFilters, setAppliedFilters] = useState({
    checkIn: '',
    checkOut: '',
    adults: '2',
    children: '0',
    rooms: {
      deluxe2: true,
      deluxe3: true,
      deluxe4: true,
    }
  });

  const roomsData = [
    {
      id: 'deluxe2',
      name: 'Deluxe 2 – Twin Bedded Room',
      image: 'd2.png',
      images: ['d2.png', 'd2t.png'],
      beds: 'Twin Beds',
      capacity: 'Ideal for 2 Adults',
      maxGuests: 2,
      wifi: 'Free WiFi',
      price: 3500,
    },
    {
      id: 'deluxe3',
      name: 'Deluxe 3 – 3 Bedded Room',
      image: 'room_executive.png',
      beds: '3 Beds',
      capacity: '3 Adults / 2+1 Child',
      maxGuests: 3,
      wifi: 'Free WiFi',
      price: 4500,
    },
    {
      id: 'deluxe4',
      name: 'Deluxe 4 – 4 Bedded Room',
      image: 'room_royal.png',
      beds: '4 Beds',
      capacity: '4 Adults / 3+1 Child',
      maxGuests: 4,
      wifi: 'Free WiFi',
      price: 4999,
    }
  ];

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % promoImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoomImageIdx(prev => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(timer);
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
            height: 650px;
            z-index: 1;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .hero-main-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 10%;
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

        .section-header {
            text-align: center;
            margin-bottom: 0;
        }

        .amenities-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            background: #e5e5e5;
            margin-top: 25px;
            border: 1px solid #e5e5e5;
        }

        .amenity-item {
            text-align: left;
            padding: 40px 30px;
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
            font-size: 1.7rem;
            color: #000000;
            margin-bottom: 20px;
            transition: 0.4s ease;
        }

        .amenity-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: #000000;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Arial Black', sans-serif;
            transition: 0.4s ease;
        }

        .amenity-item p {
            color: #666666;
            font-size: 0.9rem;
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

        .btn-liquid-glass {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 16px 35px;
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 50px;
            color: #1a1a1a;
            font-weight: 800;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-size: 0.9rem;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            width: fit-content;
        }

        .btn-liquid-glass:hover {
            background: rgba(0, 0, 0, 0.05);
            border-color: #000;
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .btn-liquid-glass i {
            font-size: 1rem;
            transition: transform 0.3s ease;
            animation: arrowMove 1.2s infinite alternate ease-in-out;
        }

        .btn-liquid-glass:hover i {
            animation-duration: 0.6s;
        }

        @keyframes arrowMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(8px); }
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
        .promo-tour-card i {
            animation: rounding 3s linear infinite;
            display: inline-block;
        }
        @keyframes rounding {
            0% { transform: rotate(0deg) translateX(4px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(4px) rotate(-360deg); }
        }
        .promo-col-center {
            flex: 1;
            min-width: 300px;
            position: relative;
            height: 500px;
            overflow: hidden;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .promo-col-center img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            opacity: 0;
            transition: opacity 1.5s ease-in-out, transform 6s ease-in-out;
            transform: scale(1.1);
        }
        .promo-col-center img.active {
            opacity: 1;
            transform: scale(1);
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
            transition: all 0.3s ease;
        }

        .btn-text-arrow i {
            animation: arrowMove 1.2s infinite alternate ease-in-out;
        }

        .btn-text-arrow:hover i {
            animation-duration: 0.6s;
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
            color: #fbc434;
        }

        .promo2-col-left .btn-outline i {
            animation: arrowMove 1.2s infinite alternate ease-in-out;
        }

        .promo2-col-left .btn-outline:hover i {
            animation-duration: 0.6s;
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
        .promo2-price-badge i {
            animation: rounding 3s linear infinite;
            display: inline-block;
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px 20px;
            display: grid;
            grid-template-columns: 380px 1fr; /* Increased to 380px */
            gap: 50px;
        }

        /* Sidebar Filters */
        .filter-sidebar {
            background: rgba(13, 42, 31, 0.8); /* Translucent Dark Green */
            backdrop-filter: blur(25px) saturate(180%);
            -webkit-backdrop-filter: blur(25px) saturate(180%);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            height: fit-content;
            color: #ffffff;
            border: 1px solid rgba(212, 175, 55, 0.4); /* Gold glass border */
        }

        .filter-sidebar h3 {
            font-size: 1.6rem;
            color: #d4af37; /* Gold */
            margin-bottom: 30px;
            font-weight: 700;
            font-family: serif;
            border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            padding-bottom: 15px;
            letter-spacing: 0.5px;
        }

        .filter-group {
            margin-bottom: 25px;
        }

        .filter-group label {
            display: block;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #e95d35; /* Orange */
            margin-bottom: 10px;
            font-weight: 700;
        }

        .filter-input-wrap {
            position: relative;
            background: rgba(255, 255, 255, 0.08); /* Semi-transparent */
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 10px;
            padding: 12px 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s;
        }
        
        .filter-input-wrap:focus-within {
            border-color: #d4af37;
            background: rgba(255, 255, 255, 0.12);
        }

        .filter-input-wrap input {
            border: none;
            background: transparent;
            font-size: 0.95rem;
            color: #fff;
            width: 100%;
            outline: none;
        }
        
        .filter-input-wrap input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            opacity: 0.6;
            cursor: pointer;
        }
        
        .filter-input-wrap select {
            border: none;
            background: transparent;
            font-size: 0.95rem;
            color: #fff;
            width: 100%;
            outline: none;
            appearance: none;
            cursor: pointer;
        }

        .filter-input-wrap select option {
            color: #000;
        }
        
        /* Custom Select Styling */
        .custom-select-container {
            position: relative;
            flex: 1;
        }

        .custom-select-trigger {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            padding: 0 10px; /* Reduced from 12px */
            color: #fff;
            font-size: 0.85rem; /* Slightly smaller for better fit */
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: all 0.3s;
            height: 52px;
            user-select: none;
            width: 100%;
            box-sizing: border-box;
            gap: 5px;
        }

        .custom-select-trigger:hover {
            border-color: #d4af37;
            background: rgba(255, 255, 255, 0.1);
        }

        .custom-select-container.open .custom-select-trigger {
            border-color: #d4af37;
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
        }

        .custom-select-options {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            background: #0d2a1f;
            border: 1px solid #d4af37;
            border-radius: 12px;
            z-index: 1000;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0,0,0,0.5);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .custom-select-container.open .custom-select-options {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .custom-select-option {
            padding: 12px 15px;
            color: #fff;
            cursor: pointer;
            transition: 0.2s;
            font-size: 0.9rem;
            border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .custom-select-option:last-child {
            border-bottom: none;
        }

        .custom-select-option:hover {
            background: #d4af37;
            color: #0d2a1f;
        }

        .custom-select-option.selected {
            background: rgba(212, 175, 55, 0.15);
            color: #d4af37;
            font-weight: 600;
        }

        .filter-input-wrap i {
            color: #d4af37; /* Gold */
        }

        .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.95rem;
            color: #fff;
            margin-bottom: 14px;
            cursor: pointer;
            text-transform: none;
            font-weight: 500;
        }
        
        .checkbox-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #d4af37; /* Gold */
            cursor: pointer;
            border-radius: 4px;
            outline: none;
        }

        .btn-apply {
            width: 100%;
            padding: 15px;
            background: rgba(212, 175, 55, 0.15);
            backdrop-filter: blur(15px) saturate(180%);
            -webkit-backdrop-filter: blur(15px) saturate(180%);
            color: #d4af37;
            border: 1px solid rgba(212, 175, 55, 0.4);
            border-radius: 30px;
            font-weight: 700;
            font-size: 1rem;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            margin-top: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
        }

        .btn-apply:hover {
            background: rgba(212, 175, 55, 0.25);
            color: #ffffff;
            border-color: rgba(212, 175, 55, 0.6);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.2);
            transform: translateY(-3px);
        }

        .btn-apply::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            transition: 0.6s;
        }

        .btn-apply:hover::before {
            left: 100%;
        }

        /* Main Content area */


        .property-list {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
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
        <a href="/" className="logo" style={{textDecoration: "none"}}><img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{height: "60px", width: "auto"}}  loading="lazy" decoding="async" /></a>
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
                <div className="hero-title-large">Experience Divine Luxury in the Heart of Vrindavan</div>
                
                <div className="hero-main-img-wrap">
                    <img src="DSC05818-HDR.png" alt="Resort View" loading="lazy" decoding="async" />
                    <div className="hero-orange-banner">
                        FIND ROOMS FOR A STAY <i className="fas fa-binoculars"></i>
                    </div>
                </div>

                <div className="hero-bento-grid">
                    <div className="bento-box bento-green">
                        <h3>Stay Close<br />to the<br />Divine</h3><p style={{marginTop: "15px", fontSize: "0.95rem", lineHeight: "1.4", opacity: "0.9"}}>Wake up to the peaceful energy of Braj with soulful surroundings, premium comfort, and a truly spiritual atmosphere.</p>
                        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                            <path d="M0,15 Q20,0 50,15 T100,15 M0,20 Q20,5 50,20 T100,20 M0,25 Q20,10 50,25 T100,25" fill="none" stroke="#6aa147" strokeWidth="2"/>
                        </svg>
                    </div>

                    <div className="bento-box bento-pink">
                        <i className="far fa-heart bento-icon"></i>
                        <h4>Weddings & Grand Celebrations</h4><p>Host unforgettable weddings, family celebrations, and sacred ceremonies with majestic venues, premium hospitality, and timeless elegance.</p>
                    </div>

                    <div className="bento-box bento-beige">
                        <i className="fas fa-spa bento-icon"></i>
                        <h4>Retreats, Wellness & Spiritual Experiences</h4><p>Reconnect through peaceful retreats, soulful experiences, sattvic hospitality, and the calming energy of Vrindavan.</p>
                    </div>

                    <div className="bento-box bento-yellow">
                        <h3>Discover Divine Vrindavan</h3><p>Explore the divine temples, spiritual landmarks, and timeless beauty of Braj while staying at Braj Nidhi.</p>
                        <a href="#" className="bento-btn">VIEW TEMPLE GUIDE <i className="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </section>
        <section className="room-types-section" style={{"background":"#fdfbf7"}}>
            <div className="listing-container">
                {/* Sidebar */}
                <aside className="filter-sidebar">
                    <h3>Filter Stay</h3>
                    
                    <div className="filter-group">
                        <label>CHECK-IN</label>
                        <div className="filter-input-wrap" style={{marginBottom: '15px'}}>
                            <input 
                                type="date" 
                                value={filters.checkIn}
                                onChange={(e) => setFilters({...filters, checkIn: e.target.value})}
                                style={{color: filters.checkIn ? '#fff' : 'rgba(255,255,255,0.5)'}}
                            />
                        </div>
                        <label>CHECK-OUT</label>
                        <div className="filter-input-wrap">
                            <input 
                                type="date" 
                                value={filters.checkOut}
                                onChange={(e) => setFilters({...filters, checkOut: e.target.value})}
                                min={filters.checkIn || undefined}
                                style={{color: filters.checkOut ? '#fff' : 'rgba(255,255,255,0.5)'}}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>GUESTS</label>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            {/* Adults Custom Select */}
                            <div className={`custom-select-container ${adultsOpen ? 'open' : ''}`}>
                                <div className="custom-select-trigger" onClick={(e) => {
                                    e.stopPropagation();
                                    setAdultsOpen(!adultsOpen);
                                    setChildrenOpen(false);
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'}}>
                                        <i className="far fa-user" style={{fontSize: '0.9rem', color: '#d4af37'}}></i>
                                        <span style={{fontWeight: '500'}}>{filters.adults} {filters.adults === '1' ? 'Adult' : 'Adults'}</span>
                                    </div>
                                    <i className="fas fa-chevron-down" style={{fontSize: '0.7rem', color: '#d4af37', transition: '0.3s', transform: adultsOpen ? 'rotate(180deg)' : 'none'}}></i>
                                </div>
                                <div className="custom-select-options">
                                    {['1', '2', '3', '4'].map(num => (
                                        <div key={num} 
                                             className={`custom-select-option ${filters.adults === num ? 'selected' : ''}`}
                                             onClick={() => {
                                                 setFilters({...filters, adults: num});
                                                 setAdultsOpen(false);
                                             }}>
                                            {num} {num === '1' ? 'Adult' : 'Adults'}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Children Custom Select */}
                            <div className={`custom-select-container ${childrenOpen ? 'open' : ''}`}>
                                <div className="custom-select-trigger" onClick={(e) => {
                                    e.stopPropagation();
                                    setChildrenOpen(!childrenOpen);
                                    setAdultsOpen(false);
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'}}>
                                        <i className="fas fa-child" style={{fontSize: '0.9rem', color: '#d4af37'}}></i>
                                        <span style={{fontWeight: '500'}}>{filters.children} {filters.children === '1' ? 'Child' : 'Children'}</span>
                                    </div>
                                    <i className="fas fa-chevron-down" style={{fontSize: '0.7rem', color: '#d4af37', transition: '0.3s', transform: childrenOpen ? 'rotate(180deg)' : 'none'}}></i>
                                </div>
                                <div className="custom-select-options">
                                    {['0', '1', '2', '3'].map(num => (
                                        <div key={num} 
                                             className={`custom-select-option ${filters.children === num ? 'selected' : ''}`}
                                             onClick={() => {
                                                 setFilters({...filters, children: num});
                                                 setChildrenOpen(false);
                                             }}>
                                            {num} {num === '1' ? 'Child' : 'Children'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="filter-group checkbox-group">
                        <label>ROOM TYPE</label>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={filters.rooms.deluxe2} 
                                onChange={(e) => setFilters({...filters, rooms: {...filters.rooms, deluxe2: e.target.checked}})} 
                            /> Deluxe 2 - Twin Bed
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={filters.rooms.deluxe3} 
                                onChange={(e) => setFilters({...filters, rooms: {...filters.rooms, deluxe3: e.target.checked}})} 
                            /> Deluxe 3 - 3 Bedded
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={filters.rooms.deluxe4} 
                                onChange={(e) => setFilters({...filters, rooms: {...filters.rooms, deluxe4: e.target.checked}})} 
                            /> Deluxe 4 - 4 Bedded
                        </label>
                    </div>

                    <button className="btn-apply" onClick={handleApplyFilters}>Apply Filters</button>
                </aside>

                {/* Main Listing */}
                <div className="listing-main">
                    <div className="property-list">
                        {roomsData.filter(room => {
                            if (!appliedFilters.rooms[room.id as keyof typeof appliedFilters.rooms]) return false;
                            const totalGuests = parseInt(appliedFilters.adults) + parseInt(appliedFilters.children);
                            if (totalGuests > room.maxGuests) return false;
                            return true;
                        }).map(room => (
                            <div className="room-card new-style" key={room.id}>
                                {room.id === 'deluxe2' && room.images ? (
                                    room.images.map((img, idx) => (
                                        <img 
                                            key={idx}
                                            src={img} 
                                            alt={room.name} 
                                            className="room-bg-img" 
                                            loading="lazy" 
                                            decoding="async" 
                                            style={{ 
                                                opacity: roomImageIdx === idx ? 1 : 0,
                                                transition: 'opacity 1.5s ease-in-out',
                                                zIndex: roomImageIdx === idx ? 1 : 0
                                            }}
                                        />
                                    ))
                                ) : (
                                    <img src={room.image} alt={room.name} className="room-bg-img" loading="lazy" decoding="async" />
                                )}
                                <div className="card-gradient"></div>
                                {/* Removed favorite button */}
                                <div className="room-content">
                                    <h3>{room.name}</h3>

                                    <div className="room-amenities">
                                        <span><i className="fas fa-bed"></i> {room.beds}</span>
                                        <span><i className="fas fa-users"></i> {room.capacity}</span>
                                        <span><i className="fas fa-wifi"></i> {room.wifi}</span>
                                    </div>
                                    <a href="/#contact" className="btn-availability">Book for ₹{room.price.toLocaleString()} <i className="fas fa-chevron-right"></i></a>
                                </div>
                            </div>
                        ))}
                        {roomsData.filter(room => {
                            if (!appliedFilters.rooms[room.id as keyof typeof appliedFilters.rooms]) return false;
                            const totalGuests = parseInt(appliedFilters.adults) + parseInt(appliedFilters.children);
                            if (totalGuests > room.maxGuests) return false;
                            return true;
                        }).length === 0 && (
                            <div style={{textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb'}}>
                                <i className="fas fa-search" style={{fontSize: '3.5rem', color: '#e5e7eb', marginBottom: '20px'}}></i>
                                <h3 style={{color: '#0d2a1f', marginBottom: '10px', fontSize: '1.6rem'}}>No rooms match your filters</h3>
                                <p style={{color: '#666', fontSize: '1.1rem'}}>Please try adjusting your guest count or room type selection to see available rooms.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* Amenities Section */}
        <section className="amenities-section">
            <div className="section-header">
                <div className="hero-title-large" style={{"marginBottom":"5px","boxShadow":"none","border":"1.5px solid #000","fontSize":"1.6rem","padding":"10px 25px"}}>PREMIUM AMENITIES</div>
                <p style={{"color":"#666","maxWidth":"600px","margin":"0 auto","fontSize":"1rem"}}>Everything you need for a comfortable and spiritually uplifting stay.</p>
            </div>
            <div className="amenities-grid">
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-wifi"></i></div>
                    <div className="amenity-title">HIGH-SPEED WI-FI</div>
                    <p>Stay connected with seamless high-speed internet access across the entire Braj Nidhi premises.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-leaf"></i></div>
                    <div className="amenity-title">PURE SATTVIC DINING</div>
                    <p>Experience freshly prepared sattvic meals crafted with devotion, purity, and authentic flavors of Braj.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-om"></i></div>
                    <div className="amenity-title">RECREATION & SPIRITUAL EXPERIENCES</div>
                    <p>Experience the essence of Braj with soulful kirtans, a peaceful visit to the gaushala, and a guided visit to Akshaya Patra — the world’s largest kitchen.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-parking"></i></div>
                    <div className="amenity-title">SPACIOUS PARKING FACILITY</div>
                    <p>Convenient and secure parking available for guests, weddings, retreats, and corporate events.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-place-of-worship"></i></div>
                    <div className="amenity-title">DIVINE TEMPLE EXPERIENCE</div>
                    <p>Enjoy easy access to Vrindavan’s sacred temples and immerse yourself in the timeless spiritual energy of Braj.</p>
                </div>
                <div className="amenity-item">
                    <div className="amenity-icon"><i className="fas fa-concierge-bell"></i></div>
                    <div className="amenity-title">PREMIUM HOSPITALITY</div>
                    <p>From comfortable stays to personalized assistance, every experience at Braj Nidhi is designed with warmth and care.</p>
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
                    <img src="temple_tour.png" alt="Vrindavan Tour" className="promo-tour-img" loading="lazy" decoding="async" />
                    <div className="promo-tour-text">TEMPLE TOUR GUIDE</div>
                    <i className="fas fa-cube" style={{"fontSize":"1.5rem","marginLeft":"auto","color":"#1a1a1a"}}></i>
                </div>
            </div>
            
            <div className="promo-col-center">
                {promoImages.map((img, idx) => (
                    <img 
                        key={idx}
                        src={img} 
                        alt={`Braj Nidhi ${idx + 1}`} 
                        className={activeImage === idx ? 'active' : ''}
                        loading="lazy" 
                        decoding="async" 
                    />
                ))}
            </div>

            <div className="promo-col-right">
                <h2 style={{"fontSize":"2.5rem","lineHeight":"1.1","marginBottom":"20px"}}>SERVICES<br />WE PROVIDE</h2>
                <p style={{"fontSize":"1rem","lineHeight":"1.7","color":"#444","marginBottom":"30px"}}>Braj Nidhi offers premium spiritual stays, elegant event spaces, corporate retreat facilities, sattvic dining experiences, and soulful hospitality — thoughtfully curated for pilgrims, families, international travelers, and event guests seeking the true essence of Braj.</p>
                <a href="#" className="btn-outline">EXPLORE SERVICES <i className="fas fa-arrow-right"></i></a>
            </div>
        </section>

        {/* Promo Section 2 */}
        <section className="promo-section-2">
            <div className="promo2-col-left">
                <div className="sub-title">ROOMS</div>
                <h2>Wake Up to the Peace of Braj</h2>
                <p>Experience soulful stays surrounded by the divine atmosphere of Vrindavan. From elegant rooms to premium heritage suites, every space at Braj Nidhi is designed to offer comfort, tranquility, and timeless hospitality.</p>
                <a href="#" className="btn-outline">SEE ALL ROOMS <i className="fas fa-arrow-right"></i></a>
            </div>
            
            <div className="promo2-col-right">
                <img src="DSC05963-HDR.png" alt="Braj Nidhi Rooms" loading="lazy" decoding="async" />
                <div className="promo2-price-badge">
                    <div className="price-top">
                        <span className="price-num">3.5</span>
                        <span className="price-text">K ₹<br />PER ROOM</span>
                        <i className="fas fa-cube" style={{"fontSize":"1.5rem","marginLeft":"auto","color":"#1a1a1a"}}></i>
                    </div>
                    <div className="price-bottom">
                        START FROM 3,500 ₹ PER NIGHT.
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
