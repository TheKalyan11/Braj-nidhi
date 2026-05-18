"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Percent, 
  ChevronRight, 
  Check, 
  MapPin, 
  Compass, 
  Car, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  LogOut, 
  Lock,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import FloatingWidgets from '@/components/FloatingWidgets';

// Types for booking details
interface GuestDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gstEnabled: boolean;
  gstNumber: string;
  gstCompany: string;
}

export default function BookingPage() {
  // Page Steps: 1 = Review, 2 = Payment details, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
  // Room Type Selection
  const [roomType, setRoomType] = useState<'deluxe2' | 'deluxe3' | 'deluxe4'>('deluxe2');
  
  // Interactive Dates
  const [checkIn, setCheckIn] = useState<string>('2026-05-18');
  const [checkOut, setCheckOut] = useState<string>('2026-05-20');
  
  // Guests
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  
  // Add-ons
  const [darshanGuide, setDarshanGuide] = useState<boolean>(false);
  const [airportCab, setAirportCab] = useState<boolean>(false);
  
  // Promo codes
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccess, setPromoSuccess] = useState<string>('');

  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Kalyan Sharma');
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  
  // Guest Details Form State
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gstEnabled: false,
    gstNumber: '',
    gstCompany: ''
  });

  // Payment Sim State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [upiId, setUpiId] = useState<string>('');
  const [cardNo, setCardNo] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVV, setCardCVV] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [paymentStepText, setPaymentStepText] = useState<string>('');
  const [bookingRef, setBookingRef] = useState<string>('');

  // Quick special request badges
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const requestBadges = ["Late Check-out (2 hrs)", "Spiritual Literature in Room", "Quiet Room", "Extra Bedding", "Temple Prasadam Delivery"];

  const getRoomPrice = (type: string): number => {
    switch (type) {
      case 'deluxe3': return 4500;
      case 'deluxe4': return 4999;
      case 'deluxe2':
      default:
        return 3500;
    }
  };

  const getRoomTitle = (type: string): string => {
    switch (type) {
      case 'deluxe3': return "Deluxe 3 – 3 Bedded Room";
      case 'deluxe4': return "Deluxe 4 – 4 Bedded Room";
      case 'deluxe2':
      default:
        return "Deluxe 2 – Twin Bedded Room";
    }
  };

  const getRoomImage = (type: string): string => {
    switch (type) {
      case 'deluxe3': return "/d3.webp";
      case 'deluxe4': return "/DSC05963-HDR.webp";
      case 'deluxe2':
      default:
        return "/DSC05818-HDR.webp";
    }
  };

  // Recalculate nights count based on CheckIn and CheckOut
  const getNights = (): number => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = getNights();

  // Price calculations
  const pricePerNight = getRoomPrice(roomType);
  const roomCost = pricePerNight * nights;
  
  // Add-ons Cost
  const darshanCost = darshanGuide ? 1500 : 0;
  const cabCost = airportCab ? 2500 : 0;
  
  // Discounts
  // Member discount is 10% of Room cost if logged in
  const memberDiscount = isLoggedIn ? Math.round(roomCost * 0.10) : 0;
  const baseTotal = roomCost + darshanCost + cabCost;
  const totalDiscount = memberDiscount + promoDiscount;
  
  // Tax calculations
  const taxableAmount = Math.max(0, baseTotal - totalDiscount);
  const gstAmount = Math.round(taxableAmount * 0.12);
  const serviceCharge = Math.round(taxableAmount * 0.05);
  const finalTotal = taxableAmount + gstAmount + serviceCharge;

  // Load URL query parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    
    // 1. Room Type Selection
    const paramRoom = params.get('roomType') || params.get('room') || params.get('room_type') || params.get('hotelId');
    if (paramRoom) {
      const roomLower = paramRoom.toLowerCase();
      if (roomLower.includes('royal') || roomLower.includes('deluxe4') || roomLower.includes('deluxe-4') || roomLower.includes('family')) setRoomType('deluxe4');
      else if (roomLower.includes('deluxe3') || roomLower.includes('deluxe-3') || roomLower.includes('triple')) setRoomType('deluxe3');
      else setRoomType('deluxe2');
    }

    // Helper to parse date
    const parseDateParam = (val: string | null): string | null => {
      if (!val) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
      if (/^\d{8}$/.test(val)) {
        const mm = val.substring(0, 2);
        const dd = val.substring(2, 4);
        const yyyy = val.substring(4, 8);
        return `${yyyy}-${mm}-${dd}`;
      }
      return null;
    };

    // 2. Dates
    const paramCheckIn = params.get('checkin') || params.get('checkIn') || params.get('check_in');
    const parsedCheckIn = parseDateParam(paramCheckIn);
    if (parsedCheckIn) setCheckIn(parsedCheckIn);

    const paramCheckOut = params.get('checkout') || params.get('checkOut') || params.get('check_out');
    const parsedCheckOut = parseDateParam(paramCheckOut);
    if (parsedCheckOut) setCheckOut(parsedCheckOut);

    // 3. Guests
    const paramAdults = params.get('adults');
    if (paramAdults && !isNaN(Number(paramAdults))) {
      setAdults(Math.max(1, Number(paramAdults)));
    }
    const paramChildren = params.get('children');
    if (paramChildren && !isNaN(Number(paramChildren))) {
      setChildren(Math.max(0, Number(paramChildren)));
    }

    // MMT Format e.g., roomStayQualifier=2e0e
    const rsq = params.get('roomStayQualifier') || params.get('rsc');
    if (rsq) {
      const match = rsq.match(/^(\d+)e(\d+)e?/);
      if (match) {
        setAdults(Math.max(1, Number(match[1])));
        setChildren(Math.max(0, Number(match[2])));
      }
    }

    // Load login state from localStorage
    const storedLogin = localStorage.getItem('isLoggedIn') === 'true';
    if (storedLogin) {
      setIsLoggedIn(true);
      const storedName = localStorage.getItem('userName') || 'Kalyan Sharma';
      setUserName(storedName);
      const parts = storedName.split(' ');
      setGuestDetails(prev => ({
        ...prev,
        firstName: parts[0] || 'Kalyan',
        lastName: parts[1] || 'Sharma',
        email: localStorage.getItem('userEmail') || 'kalyan@brajnidhi.com',
        phone: localStorage.getItem('userPhone') || '+91 98765 43210'
      }));
    }
  }, []);

  // Sync scroll class for transparent/solid header
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('main-header');
      if (header) {
        if (window.scrollY > 30) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle auto-fill if user logs in
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone || !loginPassword) {
      setLoginError('Please enter all fields');
      return;
    }
    
    // Simulate API Login
    setIsLoggedIn(true);
    setLoginModalOpen(false);
    setLoginError('');
    
    // Save to localStorage so headers on other pages update
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'Kalyan Sharma');
    setUserName('Kalyan Sharma');
    
    // Auto-populate guest details
    setGuestDetails(prev => ({
      ...prev,
      firstName: 'Kalyan',
      lastName: 'Sharma',
      email: loginEmailOrPhone.includes('@') ? loginEmailOrPhone : 'kalyan@brajnidhi.com',
      phone: !isNaN(Number(loginEmailOrPhone)) ? loginEmailOrPhone : '+91 98765 43210'
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    setUserName('User');
    
    setGuestDetails({
      title: 'Mr',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gstEnabled: false,
      gstNumber: '',
      gstCompany: ''
    });
    setAppliedPromo('');
    setPromoDiscount(0);
  };

  // Promo code trigger
  const handleApplyPromo = (code: string) => {
    const testCode = code.toUpperCase().trim();
    if (testCode === 'VRINDAVAN10') {
      const discount = Math.round(roomCost * 0.10);
      setPromoDiscount(discount);
      setAppliedPromo('VRINDAVAN10');
      setPromoSuccess('Promo applied! 10% discount on Room Cost.');
      setPromoError('');
    } else if (testCode === 'WELCOME500') {
      setPromoDiscount(500);
      setAppliedPromo('WELCOME500');
      setPromoSuccess('Promo applied! Flat ₹500 discount.');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try VRINDAVAN10 or WELCOME500.');
      setPromoSuccess('');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoDiscount(0);
    setPromoSuccess('');
    setPromoError('');
    setPromoInput('');
  };

  const handleRequestBadgeToggle = (badge: string) => {
    if (specialRequests.includes(badge)) {
      setSpecialRequests(prev => prev.filter(b => b !== badge));
    } else {
      setSpecialRequests(prev => [...prev, badge]);
    }
  };

  // Step Navigations
  const proceedToPayment = () => {
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      alert('Please fill out all required guest information fields before proceeding.');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(2);
  };

  // Payment Sim Flow
  const triggerPaymentProcessing = () => {
    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter a valid UPI ID');
      return;
    }
    if (paymentMethod === 'card' && (!cardNo || !cardExpiry || !cardCVV)) {
      alert('Please fill out all card details');
      return;
    }

    setPaymentLoading(true);
    
    const steps = [
      "Contacting payment gateways...",
      "Requesting authorization with your bank...",
      "Securing token handshake...",
      "Payment authorized! Finalizing booking..."
    ];

    let currentStepIdx = 0;
    setPaymentStepText(steps[0]);

    const timer = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setPaymentStepText(steps[currentStepIdx]);
      } else {
        clearInterval(timer);
        // Completed
        const generatedRef = "BNG-" + Math.floor(100000 + Math.random() * 900000);
        setBookingRef(generatedRef);
        setPaymentLoading(false);
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 1200);
  };

  return (
    <div className="booking-page-mmt">
      {/* Dynamic Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .booking-page-mmt {
          background-color: #ffffff; /* Solid premium white background */
          color: #2c2520; /* Dark elegant brown-charcoal */
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
        }

        /* PREMIUM MMT LIGHT HEADER */
        .booking-header-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 80px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-bottom: 1px solid rgba(139, 0, 0, 0.08);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6%;
          transition: all 0.3s ease;
        }
        
        .booking-header-bar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1.5px solid rgba(139, 0, 0, 0.12);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .booking-logo img {
          height: 52px;
          width: auto;
          transition: transform 0.3s;
        }
        .booking-logo img:hover {
          transform: scale(1.03);
        }

        /* STEPPER DESIGN */
        .stepper-container {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .stepper-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(44, 37, 32, 0.5);
          position: relative;
          transition: all 0.3s;
        }

        .stepper-item.active {
          color: #8b0000;
          font-weight: 600;
        }

        .stepper-item.completed {
          color: #16a34a;
        }

        .stepper-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          transition: all 0.3s;
          color: #2c2520;
        }

        .stepper-item.active .stepper-circle {
          background: #8b0000;
          border-color: #8b0000;
          color: #ffffff;
          box-shadow: 0 0 10px rgba(139, 0, 0, 0.25);
        }

        .stepper-item.completed .stepper-circle {
          background: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }

        .stepper-arrow {
          color: rgba(0, 0, 0, 0.15);
        }

        /* LAYOUT DESIGN */
        .booking-grid-mmt {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 8fr 4fr;
          gap: 28px;
          align-items: start;
        }

        /* LEFT SIDE CARDS */
        .mmt-card {
          background: #ffffff;
          border: 1px solid rgba(139, 0, 0, 0.08);
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.02);
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }

        .mmt-card:hover {
          border-color: rgba(139, 0, 0, 0.15);
          box-shadow: 0 8px 35px rgba(139, 0, 0, 0.04);
        }

        .card-header-mmt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .card-header-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1512;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-header-title svg {
          color: #8b0000;
        }

        /* LOGIN INTEGRATION CARD */
        .login-banner-card {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(139, 0, 0, 0.04) 100%);
          border: 1px dashed rgba(139, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .login-banner-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .login-banner-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(139, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b0000;
        }

        .login-banner-text h4 {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 4px;
          color: #1a1512;
        }

        .login-banner-text p {
          font-size: 13px;
          color: rgba(44, 37, 32, 0.6);
          margin: 0;
        }

        .btn-login-mmt {
          padding: 10px 20px;
          background: #8b0000;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-login-mmt:hover {
          background: #a82c2c;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(139, 0, 0, 0.2);
        }

        /* ROOM DETAILS SPLIT CARD */
        .room-review-split {
          display: grid;
          grid-template-columns: 3fr 7fr;
          gap: 22px;
        }

        .room-review-image {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          height: 160px;
        }

        .room-review-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .room-review-split:hover .room-review-image img {
          transform: scale(1.05);
        }

        .room-review-badge {
          position: absolute;
          top: 10px; left: 10px;
          background: rgba(139, 0, 0, 0.9);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .room-review-details h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1512;
          margin: 0 0 8px;
        }

        .room-details-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .badge-pill-mmt {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #2c2520;
        }

        .badge-pill-mmt.accent {
          background: rgba(139, 0, 0, 0.06);
          border-color: rgba(139, 0, 0, 0.2);
          color: #8b0000;
        }

        .badge-pill-mmt.success {
          background: rgba(22, 163, 74, 0.08);
          border-color: rgba(22, 163, 74, 0.2);
          color: #16a34a;
        }

        .stay-dates-strip {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          padding: 14px 20px;
        }

        .stay-date-box h5 {
          font-size: 11px;
          color: rgba(44, 37, 32, 0.5);
          text-transform: uppercase;
          margin: 0 0 4px;
        }

        .stay-date-box p {
          font-size: 15px;
          font-weight: 700;
          color: #1a1512;
          margin: 0;
        }

        .stay-duration-circle {
          padding: 6px 12px;
          background: rgba(139, 0, 0, 0.08);
          border: 1px solid rgba(139, 0, 0, 0.2);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: #8b0000;
          text-align: center;
        }

        /* SUITE SELECTION CARDS */
        .suite-selector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .suite-selector-card {
          border: 1.5px solid rgba(0, 0, 0, 0.08);
          background: #ffffff;
          border-radius: 14px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .suite-selector-card:hover {
          border-color: rgba(139, 0, 0, 0.3);
          background: rgba(0, 0, 0, 0.01);
        }

        .suite-selector-card.selected {
          border-color: #8b0000;
          background: rgba(139, 0, 0, 0.04);
          box-shadow: 0 8px 25px rgba(139, 0, 0, 0.08);
        }

        .suite-selector-card.selected::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 0 35px 35px 0;
          border-color: transparent #8b0000 transparent transparent;
        }

        .suite-selector-card .selected-check {
          position: absolute;
          top: 4px; right: 4px;
          color: #ffffff;
          z-index: 5;
        }

        .suite-selector-card h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1a1512;
          margin: 0 0 6px;
        }

        .suite-selector-card p {
          font-size: 13px;
          color: rgba(44, 37, 32, 0.6);
          margin: 0 0 12px;
        }

        .suite-selector-card .price-tag {
          font-size: 18px;
          font-weight: 800;
          color: #8b0000;
        }

        /* FORM INPUT LABELS MMT */
        .form-grid-mmt {
          display: grid;
          grid-template-columns: 2fr 5fr 5fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .form-grid-dual-mmt {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .input-wrapper-mmt {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .input-wrapper-mmt label {
          font-size: 12px;
          font-weight: 600;
          color: #8b0000;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-wrapper-mmt input, 
        .input-wrapper-mmt select, 
        .input-wrapper-mmt textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 14px;
          color: #1a1512;
          outline: none;
          transition: all 0.2s ease;
          width: 100%;
        }
        .input-wrapper-mmt input:focus,
        .input-wrapper-mmt select:focus,
        .input-wrapper-mmt textarea:focus {
          border-color: #8b0000;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
        }

        /* 9. SPECIAL REQUESTS */
        .special-requests-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        .request-badge-item {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 10px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          color: #2c2520;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .request-badge-item:hover {
          border-color: rgba(139, 0, 0, 0.3);
          background: rgba(0, 0, 0, 0.01);
        }
        .request-badge-item.active {
          border-color: #8b0000;
          background: rgba(139, 0, 0, 0.08);
          color: #8b0000;
          font-weight: 700;
        }

        /* 10. EXTRA VALUES & ADDONS */
        .addons-grid-mmt {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .addon-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 16px 20px;
          transition: all 0.2s ease;
        }
        .addon-item-row:hover {
          background: rgba(0, 0, 0, 0.01);
        }
        .addon-text-group {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .addon-icon-wrapper {
          color: #8b0000;
          background: rgba(139, 0, 0, 0.06);
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .addon-text h5 {
          font-size: 14px;
          font-weight: 800;
          color: #1a1512;
          margin: 0 0 3px;
        }
        .addon-text p {
          font-size: 11px;
          color: rgba(44, 37, 32, 0.6);
          margin: 0;
        }
        .addon-price-action {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .addon-price {
          font-size: 15px;
          font-weight: 800;
          color: #8b0000;
        }
        .switch-toggle-mmt {
          position: relative;
          display: inline-block;
          width: 46px;
          height: 24px;
        }
        .switch-toggle-mmt input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .switch-slider-mmt {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.1);
          transition: .3s;
          border-radius: 34px;
        }
        .switch-slider-mmt:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: #ffffff;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .switch-toggle-mmt input:checked + .switch-slider-mmt {
          background-color: #16a34a;
        }
        .switch-toggle-mmt input:checked + .switch-slider-mmt:before {
          transform: translateX(22px);
        }

        /* 11. SIDEBAR & RECEIPT STYLES */
        .mmt-sidebar {
          position: sticky;

        .summary-card-header {
          border-bottom: 1.5px solid rgba(212, 175, 55, 0.2);
          padding-bottom: 14px;
          margin-bottom: 18px;
        }

        .summary-card-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #8b0000;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .summary-row-mmt {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: rgba(44, 37, 32, 0.65);
          margin-bottom: 12px;
        }

        .summary-row-mmt.discount {
          color: #16a34a;
          font-weight: 700;
        }

        .summary-row-mmt.total {
          border-top: 1.5px solid rgba(0, 0, 0, 0.08);
          margin-top: 16px;
          padding-top: 16px;
          font-size: 20px;
          font-weight: 900;
          color: #8b0000;
        }

        /* PROMO BOX DESIGN */
        .promo-container-mmt {
          margin-top: 20px;
          padding: 16px;
          background: #faf9f5;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
        }

        .promo-input-group {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .promo-input-group input {
          flex: 1;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.15);
          color: #1a1512;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          text-transform: uppercase;
        }

        .btn-apply-promo {
          padding: 10px 18px;
          background: rgba(139, 0, 0, 0.06);
          color: #8b0000;
          border: 1px solid rgba(139, 0, 0, 0.2);
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-apply-promo:hover {
          background: #8b0000;
          color: #ffffff;
        }

        .promo-badges-quick {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding-top: 14px;
        }

        .quick-promo-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(139, 0, 0, 0.03);
          border: 1px dashed rgba(139, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-promo-pill:hover {
          background: rgba(139, 0, 0, 0.06);
          border-color: #8b0000;
        }

        .quick-promo-code {
          font-size: 12px;
          font-weight: 700;
          color: #8b0000;
          background: rgba(139, 0, 0, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .quick-promo-desc {
          font-size: 11px;
          color: rgba(44, 37, 32, 0.6);
        }

        /* PRIMARY ACTION GRADIENT BUTTON WITH GLOW */
        .btn-primary-mmt {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #a82c2c 0%, #8b0000 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(139, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary-mmt:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(139, 0, 0, 0.35);
        }

        .btn-primary-mmt svg {
          transition: transform 0.3s;
        }

        .btn-primary-mmt:hover svg {
          transform: translateX(4px);
        }

        /* COMPLETED SUCCESS STATE */
        .success-checkmark-card {
          max-width: 650px;
          margin: 40px auto;
          text-align: center;
          padding: 50px 40px;
          background: #ffffff;
          border: 1.5px solid rgba(139, 0, 0, 0.2);
          border-radius: 24px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
        }

        .success-badge-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(22, 163, 74, 0.08);
          border: 2px solid #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #16a34a;
          margin: 0 auto 25px;
          box-shadow: 0 0 30px rgba(22, 163, 74, 0.15);
        }

        /* MODAL POPUPS */
        .mmt-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .mmt-modal-content {
          background: #ffffff;
          border: 1.5px solid rgba(139, 0, 0, 0.3);
          border-radius: 20px;
          max-width: 440px;
          width: 100%;
          padding: 32px;
          position: relative;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.15);
        }

        .mmt-modal-close {
          position: absolute;
          top: 16px; right: 16px;
          background: transparent;
          border: none;
          color: rgba(0, 0, 0, 0.4);
          cursor: pointer;
          font-size: 20px;
          transition: color 0.3s;
        }

        .mmt-modal-close:hover {
          color: #8b0000;
        }

        /* PAYMENT TAB SELECTORS */
        .payment-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 6px;
          margin-bottom: 24px;
        }

        .payment-tab-btn {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          color: rgba(44, 37, 32, 0.6);
          font-weight: 700;
          font-size: 13px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .payment-tab-btn.active {
          background: rgba(139, 0, 0, 0.08);
          border: 1px solid rgba(139, 0, 0, 0.2);
          color: #8b0000;
        }

        .secure-lock-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(44, 37, 32, 0.5);
          margin-top: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding-top: 16px;
        }

        .secure-lock-bar svg {
          color: #16a34a;
        }

        /* SPINNING LOADER FOR SIMULATED TRANSACTION */
        .payment-loading-overlay {
          text-align: center;
          padding: 40px 20px;
        }

        .spinner-payment {
          width: 56px;
          height: 56px;
          border: 4px solid rgba(139, 0, 0, 0.15);
          border-top: 4px solid #8b0000;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 900px) {
          .booking-grid-mmt {
            grid-template-columns: 1fr;
          }
          .mmt-sidebar {
            position: static;
          }
          .suite-selector-grid {
            grid-template-columns: 1fr;
          }
        }
      ` }} />

      {/* 1. STUNNING HEADER NAVIGATION IN MMT STYLE */}
      <header className="booking-header-bar scrolled" id="main-header">
        <Link href="/" className="booking-logo">
          <img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" />
        </Link>
        
        {/* Stepper display in header */}
        <div className="stepper-container">
          <div className={`stepper-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="stepper-circle">
              {currentStep > 1 ? <Check size={12} strokeWidth={3} /> : "1"}
            </div>
            <span>Review Stay</span>
          </div>
          <ChevronRight size={14} className="stepper-arrow" />
          <div className={`stepper-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="stepper-circle">
              {currentStep > 2 ? <Check size={12} strokeWidth={3} /> : "2"}
            </div>
            <span>Payment Secure</span>
          </div>
          <ChevronRight size={14} className="stepper-arrow" />
          <div className={`stepper-item ${currentStep === 3 ? 'active' : ''}`}>
            <div className="stepper-circle">3</div>
            <span>Confirmed</span>
          </div>
        </div>

        {/* Member Profile/Logout area */}
        <div>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: 'rgba(44, 37, 32, 0.6)', margin: 0 }}>Braj Club Premium Member</p>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#8b0000', margin: 0 }}>{userName}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn-login-mmt" 
                style={{ background: 'rgba(139, 0, 0, 0.05)', border: '1px solid rgba(139, 0, 0, 0.15)', color: '#8b0000' }}
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => setLoginModalOpen(true)} className="btn-login-mmt">
              <User size={14} />
              Login / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* 2. BODY CONTENT SECTION */}
      <main style={{ marginTop: '20px' }}>
        
        {currentStep === 1 && (
          <div className="booking-grid-mmt">
            
            {/* LEFT SIDE CONTENT - GUEST & ROOM SELECTIONS */}
            <div>
              
              {/* Login Banner Promo */}
              {!isLoggedIn && (
                <div className="login-banner-card">
                  <div className="login-banner-info">
                    <div className="login-banner-icon">
                      <Sparkles size={20} />
                    </div>
                    <div className="login-banner-text">
                      <h4>Log in for an Extra 10% Member Discount!</h4>
                      <p>Sign in to unlock exclusive heritage member pricing and instant guest autofill.</p>
                    </div>
                  </div>
                  <button onClick={() => setLoginModalOpen(true)} className="btn-login-mmt">
                    Log In Now
                  </button>
                </div>
              )}

              {/* Card 1: Review Room Details */}
              <div className="mmt-card">
                <div className="card-header-mmt">
                  <div className="card-header-title">
                    <Compass size={18} />
                    <span>Review Your Spiritual Stay Details</span>
                  </div>
                  <span className="badge-pill-mmt success">Instant Confirmation</span>
                </div>

                <div className="room-review-split">
                  <div className="room-review-image">
                    <img 
                      src={getRoomImage(roomType)} 
                      alt="Selected suite room" 
                    />
                    <div className="room-review-badge">Best Choice</div>
                  </div>
                  <div className="room-review-details">
                    <h3>{getRoomTitle(roomType)}</h3>
                    <div className="room-details-badges">
                      <span className="badge-pill-mmt accent">Spiritual Garden View</span>
                      <span className="badge-pill-mmt">King-size Bed</span>
                      <span className="badge-pill-mmt success">Breakfast Included</span>
                      <span className="badge-pill-mmt">Free high-speed WiFi</span>
                    </div>

                    {/* Interactive Stay Date Strip */}
                    <div className="stay-dates-strip">
                      <div className="stay-date-box">
                        <h5>Check-In Date</h5>
                        <p>{new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className="stay-duration-circle">
                        {nights} {nights === 1 ? 'Night' : 'Nights'}
                      </div>
                      <div className="stay-date-box" style={{ textAlign: 'right' }}>
                        <h5>Check-Out Date</h5>
                        <p>{new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Room & Guest Selections */}
              <div className="mmt-card">
                <div className="card-header-mmt">
                  <div className="card-header-title">
                    <Calendar size={18} />
                    <span>Customize Room & Calendar Selections</span>
                  </div>
                </div>

                {/* Grid Room Selector */}
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(44, 37, 32, 0.9)', marginBottom: '12px' }}>
                  Select Suite Category
                </h4>
                <div className="suite-selector-grid" style={{ marginBottom: '24px' }}>
                  <div 
                    onClick={() => setRoomType('deluxe2')} 
                    className={`suite-selector-card ${roomType === 'deluxe2' ? 'selected' : ''}`}
                  >
                    {roomType === 'deluxe2' && <Check size={10} strokeWidth={3} className="selected-check" />}
                    <h4>Deluxe 2 – Twin Bedded Room</h4>
                    <p>Ideal for 2 Adults</p>
                    <span className="price-tag">₹3,500<span style={{ fontSize: '12px', fontWeight: 'normal', color: 'rgba(44, 37, 32, 0.5)' }}> / night</span></span>
                  </div>
                  <div 
                    onClick={() => setRoomType('deluxe3')} 
                    className={`suite-selector-card ${roomType === 'deluxe3' ? 'selected' : ''}`}
                  >
                    {roomType === 'deluxe3' && <Check size={10} strokeWidth={3} className="selected-check" />}
                    <h4>Deluxe 3 – 3 Bedded Room</h4>
                    <p>Ideal for 2 Adults + 1 Child OR 3 Adults</p>
                    <span className="price-tag">₹4,500<span style={{ fontSize: '12px', fontWeight: 'normal', color: 'rgba(44, 37, 32, 0.5)' }}> / night</span></span>
                  </div>
                  <div 
                    onClick={() => setRoomType('deluxe4')} 
                    className={`suite-selector-card ${roomType === 'deluxe4' ? 'selected' : ''}`}
                  >
                    {roomType === 'deluxe4' && <Check size={10} strokeWidth={3} className="selected-check" />}
                    <h4>Deluxe 4 – 4 Bedded Room</h4>
                    <p>Ideal for 3 Adults + 1 Child OR 4 Adults</p>
                    <span className="price-tag">₹4,999<span style={{ fontSize: '12px', fontWeight: 'normal', color: 'rgba(44, 37, 32, 0.5)' }}> / night</span></span>
                  </div>
                </div>

                {/* Inputs for Dates */}
                <div className="form-grid-dual-mmt">
                  <div className="input-wrapper-mmt">
                    <label>Change Check-in Date</label>
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="input-wrapper-mmt">
                    <label>Change Check-out Date</label>
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dropdowns for Adults & Children */}
                <div className="form-grid-dual-mmt">
                  <div className="input-wrapper-mmt">
                    <label>Adults (Above 12 yrs)</label>
                    <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Adults</option>
                      <option value={4}>4 Adults</option>
                    </select>
                  </div>
                  <div className="input-wrapper-mmt">
                    <label>Children (0 - 12 yrs)</label>
                    <select value={children} onChange={(e) => setChildren(Number(e.target.value))}>
                      <option value={0}>No Children</option>
                      <option value={1}>1 Child</option>
                      <option value={2}>2 Children</option>
                      <option value={3}>3 Children</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 3: Guest Contact Details */}
              <div className="mmt-card">
                <div className="card-header-mmt">
                  <div className="card-header-title">
                    <Users size={18} />
                    <span>Primary Guest Details</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'rgba(44, 37, 32, 0.5)' }}>* Required fields</span>
                </div>

                <div className="form-grid-mmt">
                  <div className="input-wrapper-mmt">
                    <label>Salutation</label>
                    <select 
                      value={guestDetails.title} 
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, title: e.target.value }))}
                    >
                      <option value="Mr">Mr.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Ms">Ms.</option>
                    </select>
                  </div>
                  <div className="input-wrapper-mmt">
                    <label>First Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Kalyan" 
                      value={guestDetails.firstName}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="input-wrapper-mmt">
                    <label>Last Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sharma" 
                      value={guestDetails.lastName}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-grid-dual-mmt">
                  <div className="input-wrapper-mmt">
                    <label>Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="email" 
                        placeholder="email@example.com" 
                        style={{ paddingLeft: '40px', width: '100%' }}
                        value={guestDetails.email}
                        onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'rgba(0,0,0,0.35)' }} />
                    </div>
                  </div>
                  <div className="input-wrapper-mmt">
                    <label>Mobile Number *</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="tel" 
                        placeholder="e.g. +91 98765 43210" 
                        style={{ paddingLeft: '40px', width: '100%' }}
                        value={guestDetails.phone}
                        onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Phone size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'rgba(0,0,0,0.35)' }} />
                    </div>
                  </div>
                </div>

                {/* Special Request tags */}
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(44, 37, 32, 0.9)', marginBottom: '4px' }}>
                    Special Requests (Optional)
                  </h4>
                  <p style={{ fontSize: '12px', color: 'rgba(44, 37, 32, 0.6)', margin: '0 0 12px' }}>
                    Select pre-curated options to configure in your premium stay suite.
                  </p>
                  <div className="requests-container">
                    {requestBadges.map((badge, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleRequestBadgeToggle(badge)}
                        className={`request-badge-item ${specialRequests.includes(badge) ? 'active' : ''}`}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>

                {/* GST Invoice Details */}
                <div style={{ marginTop: '24px', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox" 
                      style={{ accentColor: '#d4af37', width: '16px', height: '16px' }}
                      checked={guestDetails.gstEnabled}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, gstEnabled: e.target.checked }))}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(44, 37, 32, 0.9)' }}>
                      Enter GST Details (Optional - For corporate invoice claims)
                    </span>
                  </label>

                  {guestDetails.gstEnabled && (
                    <div className="form-grid-dual-mmt" style={{ marginTop: '16px' }}>
                      <div className="input-wrapper-mmt">
                        <label>GST Number</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 07AAAAA1111A1Z1" 
                          value={guestDetails.gstNumber}
                          onChange={(e) => setGuestDetails(prev => ({ ...prev, gstNumber: e.target.value }))}
                        />
                      </div>
                      <div className="input-wrapper-mmt">
                        <label>Registered Company Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Braj Heritage Private Ltd." 
                          value={guestDetails.gstCompany}
                          onChange={(e) => setGuestDetails(prev => ({ ...prev, gstCompany: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 4: Premium Spiritual Add-ons */}
              <div className="mmt-card">
                <div className="card-header-mmt">
                  <div className="card-header-title">
                    <Sparkles size={18} />
                    <span>Enhance Your Spiritual Journey (Add-ons)</span>
                  </div>
                </div>

                {/* Addon 1 */}
                <div className="addon-item-row">
                  <div className="addon-left-info">
                    <div className="addon-icon-box">
                      <Compass size={20} />
                    </div>
                    <div className="addon-text">
                      <h5>Private Vrindavan Temple Darshan Guide</h5>
                      <p>Includes express temple entries, private guide escort, and sacred Prasadam offerings.</p>
                    </div>
                  </div>
                  <div className="addon-right-action">
                    <span className="addon-price">₹1,500</span>
                    <label className="switch-toggle-mmt">
                      <input 
                        type="checkbox" 
                        checked={darshanGuide}
                        onChange={(e) => setDarshanGuide(e.target.checked)}
                      />
                      <span className="switch-slider-mmt"></span>
                    </label>
                  </div>
                </div>

                {/* Addon 2 */}
                <div className="addon-item-row">
                  <div className="addon-left-info">
                    <div className="addon-icon-box">
                      <Car size={20} />
                    </div>
                    <div className="addon-text">
                      <h5>Chauffeur-Driven Airport Pickup & Drop</h5>
                      <p>Luxury private transfers between New Delhi Airport (DEL) and Braj Nidhi Guesthouse.</p>
                    </div>
                  </div>
                  <div className="addon-right-action">
                    <span className="addon-price">₹2,500</span>
                    <label className="switch-toggle-mmt">
                      <input 
                        type="checkbox" 
                        checked={airportCab}
                        onChange={(e) => setAirportCab(e.target.checked)}
                      />
                      <span className="switch-slider-mmt"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT STICKY SIDEBAR - BOOKING PRICE SUMMARY & PROMO ENGINE */}
            <div className="mmt-sidebar">
              <div className="mmt-card" style={{ borderColor: 'rgba(212, 175, 55, 0.25)' }}>
                <div className="summary-card-header">
                  <h3>
                    <ShieldCheck size={20} />
                    <span>Fare Summary</span>
                  </h3>
                </div>

                <div>
                  <div className="summary-row-mmt">
                    <span>Base Room Fare ({nights} nights)</span>
                    <span>₹{roomCost.toLocaleString()}</span>
                  </div>
                  
                  {darshanGuide && (
                    <div className="summary-row-mmt">
                      <span>Darshan VIP Guide Option</span>
                      <span>₹1,500</span>
                    </div>
                  )}

                  {airportCab && (
                    <div className="summary-row-mmt">
                      <span>Airport Luxury Car Pickup</span>
                      <span>₹2,500</span>
                    </div>
                  )}

                  {/* Discounts display */}
                  {isLoggedIn && (
                    <div className="summary-row-mmt discount">
                      <span>10% Club Member Discount</span>
                      <span>-₹{memberDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  {appliedPromo && (
                    <div className="summary-row-mmt discount">
                      <span>Coupon Discount ({appliedPromo})</span>
                      <span>-₹{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="summary-row-mmt" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '10px' }}>
                    <span>GST (12% Standard Tax)</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row-mmt">
                    <span>Spiritual Trust Levy & Service Fee (5%)</span>
                    <span>₹{serviceCharge.toLocaleString()}</span>
                  </div>
                  <div className="summary-row-mmt total">
                    <span>Total Payable</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Promo Code Engine */}
                <div className="promo-container-mmt">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#d4af37' }}>
                    <Percent size={14} />
                    <span>Apply Promotional Code</span>
                  </div>

                  {appliedPromo ? (
                    <div style={{ marginTop: '12px', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34,197,94,0.3)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '11px', color: '#15803d', fontWeight: '700' }}>COUPON APPLIED!</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1a1512', fontWeight: 'bold' }}>{appliedPromo}</p>
                      </div>
                      <button 
                        onClick={handleRemovePromo}
                        style={{ background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.45)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', textDecoration: 'underline' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="promo-input-group">
                        <input 
                          type="text" 
                          placeholder="ENTER PROMO CODE" 
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                        />
                        <button 
                          onClick={() => handleApplyPromo(promoInput)}
                          className="btn-apply-promo"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && <p style={{ color: '#f87171', fontSize: '11px', margin: '6px 0 0', fontWeight: '500' }}>{promoError}</p>}
                      {promoSuccess && <p style={{ color: '#4ade80', fontSize: '11px', margin: '6px 0 0', fontWeight: '500' }}>{promoSuccess}</p>}

                      <div className="promo-badges-quick">
                        <div onClick={() => handleApplyPromo('VRINDAVAN10')} className="quick-promo-pill">
                          <span className="quick-promo-code">VRINDAVAN10</span>
                          <span className="quick-promo-desc">10% Off Room Suites</span>
                        </div>
                        <div onClick={() => handleApplyPromo('WELCOME500')} className="quick-promo-pill">
                          <span className="quick-promo-code">WELCOME500</span>
                          <span className="quick-promo-desc">Save flat ₹500 instantly</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  onClick={proceedToPayment}
                  className="btn-primary-mmt"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight size={18} />
                </button>

                <div className="secure-lock-bar">
                  <Lock size={13} />
                  <span>256-bit Secure TLS Booking Shield</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. STEP 2: SECURE MAKE-MY-TRIP PAYMENT SYSTEM SCREEN */}
        {currentStep === 2 && (
          <div className="booking-grid-mmt" style={{ maxWidth: '1000px' }}>
            
            {/* LEFT SIDE - INTERACTIVE PAYMENT PORTALS */}
            <div>
              <div className="mmt-card">
                
                {paymentLoading ? (
                  /* SIMULATED GATEWAY LOADER */
                  <div className="payment-loading-overlay">
                    <div className="spinner-payment"></div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1a1512' }}>
                      {paymentStepText}
                    </h3>
                    <p style={{ color: 'rgba(44, 37, 32, 0.65)', fontSize: '13px' }}>
                      Please do not close this tab or refresh the page. Your payment is securing.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="card-header-mmt">
                      <div className="card-header-title">
                        <Lock size={18} />
                        <span>Select Secure Payment Method</span>
                      </div>
                      <span className="badge-pill-mmt success">Secured by Razorpay</span>
                    </div>

                    {/* Quick Stepper tab */}
                    <div className="payment-tabs">
                      <button 
                        onClick={() => setPaymentMethod('upi')}
                        className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                      >
                        <Compass size={16} />
                        <span>UPI Instants</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('qr')}
                        className={`payment-tab-btn ${paymentMethod === 'qr' ? 'active' : ''}`}
                      >
                        <QrCode size={16} />
                        <span>BHIM QR Scan</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                      >
                        <CreditCard size={16} />
                        <span>Debit / Credit Card</span>
                      </button>
                    </div>

                    {/* Method 1: UPI */}
                    {paymentMethod === 'upi' && (
                      <div style={{ animation: 'fadeIn 0.4s ease' }}>
                        <h4 style={{ fontSize: '15px', color: '#1a1512', margin: '0 0 10px' }}>Pay via Instant UPI ID</h4>
                        <p style={{ fontSize: '12px', color: 'rgba(44, 37, 32, 0.65)', marginBottom: '18px' }}>
                          Submit your registered Virtual Payment Address (e.g. username@okhdfcbank or phone@paytm).
                        </p>
                        
                        <div className="input-wrapper-mmt" style={{ maxWidth: '380px' }}>
                          <label>Enter Virtual Payment Address (VPA)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. kalyan@ybl" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                        </div>
                        
                        <div style={{ marginTop: '20px', background: 'rgba(0, 0, 0, 0.03)', padding: '12px 16px', borderRadius: '10px', fontSize: '12px', color: 'rgba(44, 37, 32, 0.7)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <Info size={16} style={{ color: '#8b0000' }} />
                          <span>We will send a secure transaction request directly to your UPI smartphone application.</span>
                        </div>
                      </div>
                    )}

                    {/* Method 2: Scan QR */}
                    {paymentMethod === 'qr' && (
                      <div style={{ textAlign: 'center', padding: '15px 0', animation: 'fadeIn 0.4s ease' }}>
                        <h4 style={{ fontSize: '16px', color: '#1a1512', margin: '0 0 6px' }}>Scan Unified BHIM Trust QR Code</h4>
                        <p style={{ fontSize: '12px', color: 'rgba(44, 37, 32, 0.65)', margin: '0 0 20px' }}>
                          Scan this official encrypted dynamic booking receipt QR using any UPI app (GPay, PhonePe, Paytm).
                        </p>

                        <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', border: '3px solid #d4af37', boxShadow: '0 0 25px rgba(212,175,55,0.2)' }}>
                          {/* Rich glowing simulator QR */}
                          <QrCode size={180} style={{ color: '#0b0908' }} />
                        </div>
                        
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: '#a3e635', fontWeight: '700' }}>
                          <Clock size={14} />
                          <span>QR Code expires in 4 mins 52 secs</span>
                        </div>
                      </div>
                    )}

                    {/* Method 3: Cards */}
                    {paymentMethod === 'card' && (
                      <div style={{ animation: 'fadeIn 0.4s ease' }}>
                        <h4 style={{ fontSize: '15px', color: '#1a1512', margin: '0 0 10px' }}>Pay via Secure Credit or Debit Card</h4>
                        <p style={{ fontSize: '12px', color: 'rgba(44, 37, 32, 0.65)', marginBottom: '18px' }}>
                          Enter card details. We encrypt this data directly via end-to-end PCI-DSS compliant secure vaults.
                        </p>

                        <div className="input-wrapper-mmt" style={{ marginBottom: '16px' }}>
                          <label>Cardholder Full Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Kalyan Sharma" 
                          />
                        </div>

                        <div className="input-wrapper-mmt" style={{ marginBottom: '16px' }}>
                          <label>Debit / Credit Card Number</label>
                          <input 
                            type="text" 
                            placeholder="4111 2222 3333 4444" 
                            maxLength={19}
                            value={cardNo}
                            onChange={(e) => setCardNo(e.target.value)}
                          />
                        </div>

                        <div className="form-grid-dual-mmt">
                          <div className="input-wrapper-mmt">
                            <label>Expiry Date (MM/YY)</label>
                            <input 
                              type="text" 
                              placeholder="09/29" 
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                            />
                          </div>
                          <div className="input-wrapper-mmt">
                            <label>CVV Shield (3-Digit)</label>
                            <input 
                              type="password" 
                              placeholder="***" 
                              maxLength={3}
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                      <button 
                        onClick={() => setCurrentStep(1)}
                        style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', color: 'rgba(44,37,32,0.7)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        Back to Details
                      </button>
                      <button 
                        onClick={triggerPaymentProcessing}
                        className="btn-primary-mmt"
                        style={{ flex: 2, margin: 0 }}
                      >
                        <ShieldCheck size={18} />
                        <span>Pay Securely ₹{finalTotal.toLocaleString()}</span>
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN - PRICE BREAKDOWN STICKY CARD */}
            <div>
              <div className="mmt-card" style={{ borderColor: 'rgba(212, 175, 55, 0.25)' }}>
                <div className="summary-card-header">
                  <h3>
                    <Compass size={18} />
                    <span>Booking Outline</span>
                  </h3>
                </div>

                <div style={{ fontSize: '13px', color: 'rgba(44, 37, 32, 0.7)' }}>
                  <p style={{ margin: '0 0 10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Suite:</span>
                    <strong style={{ color: '#1a1512' }}>{getRoomTitle(roomType)}</strong>
                  </p>
                  <p style={{ margin: '0 0 10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Nights Count:</span>
                    <strong style={{ color: '#1a1512' }}>{nights} {nights === 1 ? 'Night' : 'Nights'}</strong>
                  </p>
                  <p style={{ margin: '0 0 10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Guests Configuration:</span>
                    <strong style={{ color: '#1a1512' }}>{adults} Adults, {children} Children</strong>
                  </p>
                  <p style={{ margin: '0 0 10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Primary Guest:</span>
                    <strong style={{ color: '#1a1512' }}>{guestDetails.firstName} {guestDetails.lastName}</strong>
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '15px', marginTop: '15px' }}>
                  <div className="summary-row-mmt" style={{ fontSize: '13px' }}>
                    <span>Room Net cost:</span>
                    <span>₹{roomCost.toLocaleString()}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="summary-row-mmt discount" style={{ fontSize: '13px' }}>
                      <span>Combined Discounts:</span>
                      <span>-₹{totalDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="summary-row-mmt total" style={{ fontSize: '16px', margin: '10px 0 0', paddingTop: '10px' }}>
                    <span>Final Amount:</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 4. STEP 3: TRANSACTION SUCCESS CONFIRMATION RECEIPT SCREEN */}
        {currentStep === 3 && (
          <div className="success-checkmark-card">
            <div className="success-badge-icon">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>

            <span className="badge-pill-mmt success" style={{ marginBottom: '14px', display: 'inline-block' }}>
              Booking Confirmed
            </span>

            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#8b0000', margin: '0 0 8px' }}>
              Radhe Radhe! Stay Confirmed 🎉
            </h1>
            <p style={{ color: 'rgba(44, 37, 32, 0.75)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 30px' }}>
              We are delighted to host you, {guestDetails.firstName}! Your spiritual heritage suite room at Braj Nidhi Guesthouse has been securely booked.
            </p>

            {/* Receipt Frame */}
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '24px', textAlign: 'left', marginBottom: '30px' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Booking Reference</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#d4af37' }}>{bookingRef}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div>
                  <p style={{ color: 'rgba(44, 37, 32, 0.6)', margin: '0 0 4px' }}>Suite Category</p>
                  <strong style={{ color: '#1a1512' }}>{getRoomTitle(roomType)}</strong>
                </div>
                <div>
                  <p style={{ color: 'rgba(44, 37, 32, 0.6)', margin: '0 0 4px' }}>Stay Duration</p>
                  <strong style={{ color: '#1a1512' }}>{nights} {nights === 1 ? 'Night' : 'Nights'}</strong>
                </div>
                <div>
                  <p style={{ color: 'rgba(44, 37, 32, 0.6)', margin: '0 0 4px' }}>Check-In</p>
                  <strong style={{ color: '#1a1512' }}>{new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (12:00 PM)</strong>
                </div>
                <div>
                  <p style={{ color: 'rgba(44, 37, 32, 0.6)', margin: '0 0 4px' }}>Check-Out</p>
                  <strong style={{ color: '#1a1512' }}>{new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (11:00 AM)</strong>
                </div>
                <div>
                  <p style={{ color: 'rgba(44, 37, 32, 0.6)', margin: '0 0 4px' }}>Primary Guest</p>
                  <strong style={{ color: '#1a1512' }}>{guestDetails.title}. {guestDetails.firstName} {guestDetails.lastName}</strong>
                </div>
                <div>
                  <p style={{ color: 'rgba(44, 37, 32, 0.6)', margin: '0 0 4px' }}>Amount Paid Securely</p>
                  <strong style={{ color: '#16a34a' }}>₹{finalTotal.toLocaleString()}</strong>
                </div>
              </div>

              {specialRequests.length > 0 && (
                <div style={{ marginTop: '16px', borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '12px' }}>
                  <p style={{ color: 'rgba(44, 37, 32, 0.6)', margin: '0 0 6px', fontSize: '12px' }}>Configured Suite Add-ons</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {specialRequests.map((r, i) => (
                      <span key={i} style={{ fontSize: '11px', color: '#8b0000', background: 'rgba(139, 0, 0, 0.04)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(139, 0, 0, 0.12)' }}>{r}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link 
                href="/"
                style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.15)', color: 'rgba(44, 37, 32, 0.8)', borderRadius: '8px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.3s' }}
              >
                Return to Home
              </Link>
              <button 
                onClick={() => window.print()}
                className="btn-primary-mmt"
                style={{ flex: 'none', width: 'auto', margin: 0, padding: '12px 28px' }}
              >
                Print Booking Receipt
              </button>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'rgba(44, 37, 32, 0.65)', fontSize: '12px' }}>
              <MapPin size={13} style={{ color: '#8b0000' }} />
              <span>Location: Braj Nidhi Raman Reti Road, Vrindavan, Uttar Pradesh - 281121</span>
            </div>
          </div>
        )}

      </main>

      {/* 5. ANMATED PREMIUM INLINE LOGIN MODAL (MMT STYLED) */}
      {loginModalOpen && (
        <div className="mmt-modal-overlay">
          <div className="mmt-modal-content" style={{ animation: 'fadeIn 0.3s ease' }}>
            <button className="mmt-modal-close" onClick={() => setLoginModalOpen(false)}>×</button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 0, 0, 0.05)', border: '1px solid rgba(139, 0, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b0000', margin: '0 auto 12px' }}>
                <Sparkles size={20} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#8b0000', margin: '0 0 6px' }}>Braj Club Members Area</h3>
              <p style={{ fontSize: '12px', color: 'rgba(44, 37, 32, 0.65)', margin: 0 }}>
                Access exclusive hotel tariffs, pre-filled guest accounts, & instant secure bookings.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="input-wrapper-mmt" style={{ marginBottom: '16px' }}>
                <label>Email Address or Phone *</label>
                <input 
                  type="text" 
                  placeholder="e.g. kalyan@gmail.com" 
                  required
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                />
              </div>

              <div className="input-wrapper-mmt" style={{ marginBottom: '20px' }}>
                <label>Password *</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              {loginError && <p style={{ color: '#f87171', fontSize: '12px', margin: '0 0 16px', textAlign: 'center', fontWeight: '500' }}>{loginError}</p>}

              <button 
                type="submit" 
                className="btn-primary-mmt"
                style={{ width: '100%', margin: 0 }}
              >
                <span>Access Premium Club Account</span>
                <ChevronRight size={18} />
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'rgba(44, 37, 32, 0.5)' }}>
                <span>By continuing, you agree to our </span>
                <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#8b0000' }}>Tariff Policy</span>
                <span> & </span>
                <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#8b0000' }}>Terms</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER COHESIVE WITH REST OF THE BRAND */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#080706', padding: '60px 0 30px', marginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px' }}>
          <div>
            <img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{ height: '56px', width: 'auto', marginBottom: '16px' }} />
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', maxWidth: '340px' }}>
              Experience the divine blend of heritage and luxury in the heart of Vrindavan.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#d4af37', textTransform: 'uppercase', marginBottom: '16px' }}>Suite Selections</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/guesthouse" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>Royal Heritage Suite</Link></li>
              <li><Link href="/guesthouse" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>Executive Suite Rooms</Link></li>
              <li><Link href="/weddings" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>Spiritual Marriages</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#d4af37', textTransform: 'uppercase', marginBottom: '16px' }}>Help & Security</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/contact" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>Reach out to Guesthouse</Link></li>
              <li><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>SSL Encrypted Checkout</span></li>
              <li><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>24/7 Spiritual Desk Support</span></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', marginTop: '40px', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          &copy; 2026 Braj Nidhi. All rights reserved. Razorpay Secured payment.
        </div>
      </footer>

      <FloatingWidgets />
    </div>
  );
}
