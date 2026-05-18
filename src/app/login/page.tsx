"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Mail, Phone, ChevronDown, ArrowLeft, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  
  const [activeAccountType, setActiveAccountType] = useState<'personal' | 'mybiz'>('personal');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [countryCode, setCountryCode] = useState('+91');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto scroll the promo slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    setShowCountryDropdown(false);
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    setTimeout(() => {
      setIsLoading(false);
      
      if (authMethod === 'phone') {
        if (phoneNumber.length < 10) {
          setErrorMessage('Please enter a valid 10-digit mobile number.');
          return;
        }
        
        const finalName = fullName || 'Braj Pilgrim';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', finalName);
        localStorage.setItem('userPhone', phoneNumber);
        setSuccessMessage('Logged in successfully via SMS OTP simulation!');
        
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        if (!email || !password) {
          setErrorMessage('Please enter both email and password.');
          return;
        }
        
        if (isRegistering && !fullName) {
          setErrorMessage('Please enter your full name.');
          return;
        }

        const finalName = isRegistering ? fullName : (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', finalName);
        localStorage.setItem('userEmail', email);
        setSuccessMessage(isRegistering ? 'Account created successfully!' : 'Signed in successfully!');
        
        setTimeout(() => {
          router.push('/');
        }, 1200);
      }
    }, 1500);
  };

  const countries = [
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
    { name: 'Singapore', code: '+65', flag: '🇸🇬' },
    { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
    { name: 'Nepal', code: '+977', flag: '🇳🇵' },
    { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
    { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
    { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
    { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
    { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
    { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
    { name: 'Japan', code: '+81', flag: '🇯🇵' },
    { name: 'South Korea', code: '+82', flag: '🇰🇷' },
    { name: 'South Africa', code: '+27', flag: '🇿🇦' },
    { name: 'Russia', code: '+7', flag: '🇷🇺' },
    { name: 'Italy', code: '+39', flag: '🇮🇹' },
    { name: 'Spain', code: '+34', flag: '🇪🇸' },
    { name: 'Brazil', code: '+55', flag: '🇧🇷' },
    { name: 'Mexico', code: '+52', flag: '🇲🇽' },
    { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
    { name: 'Thailand', code: '+66', flag: '🇹🇭' },
    { name: 'Kuwait', code: '+965', flag: '🇰🇼' },
    { name: 'Qatar', code: '+974', flag: '🇶🇦' },
    { name: 'Oman', code: '+968', flag: '🇴🇲' },
    { name: 'Bahrain', code: '+973', flag: '🇧🇭' },
    { name: 'Hong Kong', code: '+852', flag: '🇭🇰' },
    { name: 'Ireland', code: '+353', flag: '🇮🇪' },
    { name: 'Sweden', code: '+46', flag: '🇸🇪' },
    { name: 'Norway', code: '+47', flag: '🇳🇴' },
    { name: 'Denmark', code: '+45', flag: '🇩🇰' },
    { name: 'Belgium', code: '+32', flag: '🇧🇪' },
    { name: 'Austria', code: '+43', flag: '🇦🇹' },
    { name: 'Mauritius', code: '+230', flag: '🇲🇺' },
  ];

  const promos = [
    {
      title: 'FLAT 10% OFF',
      subtitle: 'On your first divine Guesthouse stay',
      coupon: 'WELCOMEBN',
      icon: (
        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v3.75H3V3z" />
        </svg>
      )
    },
    {
      title: 'FLAT 20% OFF',
      subtitle: 'On all custom guided Vrindavan Temple yatras',
      coupon: 'HOLYYATRA',
      icon: (
        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c-.105-.347-.492-.546-.838-.44l-6 1.838a.75.75 0 00-.518.892l2.25 7.375a.75.75 0 00.518.513l6-1.838a.75.75 0 00.518-.893l-2.25-7.375c-.05-.164-.15-.306-.28-.407zM18.75 9.75v10.5M15.75 21h6m-12-6h3.75m-3.75 3h3.75m-7.5-6h7.5M3 12h18M12 9.75v10.5" />
        </svg>
      )
    },
    {
      title: 'ZERO FEES',
      subtitle: 'Absolutely no convenience charges for direct suites bookings',
      coupon: 'DIRECTBN',
      icon: (
        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )
    }
  ];

  return (
    <div className="login-page-container">
      {/* Dynamic inline styles to achieve exactly the MMT Premium look */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .login-page-container {
          min-height: 100vh;
          background: radial-gradient(circle at top left, #1a1a1a, #090909);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .login-back-btn {
          position: absolute;
          top: 30px;
          left: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 30px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.2s ease;
          z-index: 100;
        }
        .login-back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(-3px);
        }
        .mmt-login-card {
          width: 100%;
          max-width: 860px;
          height: 520px;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          display: flex;
          position: relative;
          z-index: 10;
        }
        .mmt-left-pane {
          width: 45%;
          background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.8)), url('/DSC05818-HDR.webp') no-repeat center center;
          background-size: cover;
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #ffffff;
        }
        .mmt-right-pane {
          width: 55%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          background: #ffffff;
        }
        .mmt-pill-tabs {
          background: #f2f2f2;
          padding: 4px;
          border-radius: 30px;
          display: flex;
          margin-bottom: 24px;
          position: relative;
          border: 1px solid #e0e0e0;
        }
        .mmt-pill-tab {
          flex: 1;
          padding: 10px 0;
          text-align: center;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #4a4a4a;
          cursor: pointer;
          border-radius: 30px;
          transition: all 0.3s ease;
          z-index: 5;
        }
        .mmt-pill-tab.active {
          color: #ffffff;
          background: #0066ff;
          box-shadow: 0 4px 12px rgba(0,102,255,0.3);
        }
        .mmt-input-label {
          font-size: 14px;
          font-weight: 700;
          color: #4a4a4a;
          margin-bottom: 10px;
          display: block;
        }
        .mmt-input-wrapper {
          border: 1px solid #c4c4c4;
          border-radius: 8px;
          display: flex;
          align-items: center;
          height: 48px;
          overflow: visible;
          position: relative;
          transition: border-color 0.2s;
        }
        .mmt-input-wrapper:focus-within {
          border-color: #0066ff;
        }
        .mmt-country-select {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 12px;
          cursor: pointer;
          height: 100%;
          border-right: 1px solid #e0e0e0;
          background: #fdfdfd;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          user-select: none;
        }
        .mmt-country-dropdown {
          position: absolute;
          top: 50px;
          left: 0;
          width: 220px;
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          z-index: 99;
          max-height: 200px;
          overflow-y: auto;
        }
        .mmt-country-option {
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
          color: #1a1a1a;
        }
        .mmt-country-option:hover {
          background: #f5f9ff;
        }
        .mmt-phone-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0 16px;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: 0.5px;
          background: transparent;
        }
        .mmt-phone-input::placeholder {
          font-weight: 500;
          color: #9b9b9b;
          letter-spacing: normal;
        }
        .mmt-continue-btn {
          width: 100%;
          height: 46px;
          background: #0066ff;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,102,255,0.25);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .mmt-continue-btn:hover {
          background: #0052cc;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,102,255,0.35);
        }
        .mmt-continue-btn:disabled {
          background: #dcdcdc;
          color: #9a9a9a;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        .mmt-or-divider {
          text-align: center;
          margin: 18px 0;
          position: relative;
        }
        .mmt-or-divider::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: #e0e0e0;
          z-index: 1;
        }
        .mmt-or-text {
          background: #ffffff;
          padding: 0 12px;
          font-size: 11px;
          font-weight: 700;
          color: #9b9b9b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 2;
        }
        .mmt-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #d8d8d8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #ffffff;
        }
        .mmt-social-btn:hover {
          background: #f9f9f9;
          transform: scale(1.05);
          border-color: #c4c4c4;
        }
        .mmt-footer-terms {
          font-size: 10.5px;
          color: #4a4a4a;
          line-height: 1.5;
          text-align: center;
          margin-top: 15px;
        }
        .mmt-footer-terms a {
          color: #0066ff;
          text-decoration: none;
          font-weight: 700;
        }
        .mmt-footer-terms a:hover {
          text-decoration: underline;
        }
        .dot-slider {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 15px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s;
        }
        .dot.active {
          background: #ffffff;
          width: 14px;
          border-radius: 3px;
        }
        
        .mmt-spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: mmt-spin 0.8s linear infinite;
        }
        @keyframes mmt-spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .mmt-left-pane {
            display: none !important;
          }
          .mmt-right-pane {
            width: 100% !important;
          }
          .mmt-login-card {
            max-width: 420px;
            height: auto;
          }
        }
        `
      }} />

      {/* Back to Home Button */}
      <Link href="/" className="login-back-btn">
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <div className="mmt-login-card">
        
        {/* Left Promotion Banner Panel */}
        <div className="mmt-left-pane">
          <div>
            <img src="/Braj_nidhi_.png" alt="Braj Nidhi" className="h-10 w-auto filter brightness-0 invert mb-6" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  {promos[activeSlide].icon}
                  <h3 className="text-2xl font-black tracking-tight text-white">{promos[activeSlide].title}</h3>
                </div>
                <p className="text-sm font-semibold text-white/90 leading-snug pr-4">
                  {promos[activeSlide].subtitle}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3.5 py-1.5 rounded-lg">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">Coupon Code:</span>
                  <span className="text-xs font-black font-mono text-white">{promos[activeSlide].coupon}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <div className="dot-slider">
              {promos.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`dot ${idx === activeSlide ? 'active' : ''}`}
                />
              ))}
            </div>
            <p className="text-[9px] text-white/40 mt-3 text-center tracking-wide uppercase font-bold">
              Braj Nidhi Hospitality • Spiritual Luxury
            </p>
          </div>
        </div>

        {/* Right Login/Registration Form Pane */}
        <div className="mmt-right-pane">
          <div>
            {/* Selector Tabs Capsule */}
            <div className="mmt-pill-tabs">
              <div
                className={`mmt-pill-tab ${activeAccountType === 'personal' ? 'active' : ''}`}
                onClick={() => {
                  setActiveAccountType('personal');
                  setIsRegistering(false);
                }}
              >
                Personal Account
              </div>
              <div
                className={`mmt-pill-tab ${activeAccountType === 'mybiz' ? 'active' : ''}`}
                onClick={() => {
                  setActiveAccountType('mybiz');
                  setIsRegistering(false);
                }}
              >
                Corporate Account
              </div>
            </div>

            {/* Dynamic Alert Messages */}
            {errorMessage && (
              <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600 font-bold leading-normal">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <Check size={14} className="stroke-[3]" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Active Forms */}
            <form onSubmit={handleContinue} className="space-y-4">
              
              {isRegistering && (
                <div>
                  <label className="mmt-input-label">Full Name</label>
                  <div className="mmt-input-wrapper">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mmt-phone-input"
                      required
                    />
                  </div>
                </div>
              )}

              {authMethod === 'phone' ? (
                /* Mobile Login Flow */
                <div>
                  <label className="mmt-input-label">Mobile Number</label>
                  <div className="mmt-input-wrapper">
                    
                    {/* Flag and Code Dropdown Selector */}
                    <div
                      className="mmt-country-select"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    >
                      <span>{countries.find(c => c.code === countryCode)?.flag}</span>
                      <span>{countryCode}</span>
                      <ChevronDown size={14} className="text-[#9b9b9b]" />
                    </div>

                    {showCountryDropdown && (
                      <div className="mmt-country-dropdown">
                        {countries.map((c) => (
                          <div
                            key={c.code}
                            className="mmt-country-option"
                            onClick={() => handleCountrySelect(c.code)}
                          >
                            <span className="font-semibold">{c.flag} {c.name}</span>
                            <span className="text-[#9b9b9b] font-bold">{c.code}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <input
                      type="tel"
                      placeholder="Enter Mobile Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="mmt-phone-input"
                      required
                    />
                  </div>
                </div>
              ) : (
                /* Email Login Flow */
                <div className="space-y-3.5">
                  <div>
                    <label className="mmt-input-label">Email ID</label>
                    <div className="mmt-input-wrapper">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mmt-phone-input"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mmt-input-label">Password</label>
                    <div className="mmt-input-wrapper">
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mmt-phone-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="mmt-continue-btn mt-6"
                disabled={
                  isLoading || 
                  (authMethod === 'phone' && phoneNumber.length < 10) || 
                  (authMethod === 'email' && (!email || !password))
                }
              >
                {isLoading ? (
                  <div className="mmt-spinner" />
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Or Login/Signup With Toggles */}
            <div className="mmt-or-divider">
              <span className="mmt-or-text">Or Login/Signup With</span>
            </div>

            <div className="flex justify-center gap-4">
              {/* Google Icon Social Login */}
              <div
                className="mmt-social-btn"
                onClick={() => {
                  localStorage.setItem('isLoggedIn', 'true');
                  localStorage.setItem('userName', 'Kalyan Google');
                  router.push('/');
                }}
                title="Login with Google"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              
              {/* Email Envelope Toggle Button */}
              <div
                className="mmt-social-btn"
                onClick={() => {
                  setAuthMethod(authMethod === 'phone' ? 'email' : 'phone');
                  setErrorMessage('');
                }}
                title={authMethod === 'phone' ? 'Login with Email' : 'Login with Phone'}
              >
                {authMethod === 'phone' ? (
                  <Mail size={18} className="text-stone-600" />
                ) : (
                  <Phone size={18} className="text-stone-600" />
                )}
              </div>
            </div>
            
            {/* Mini Register Toggle Option */}
            <div className="text-center mt-3">
              <span className="text-[11px] font-bold text-[#9b9b9b]">
                {authMethod === 'email' && (
                  isRegistering ? (
                    <>Already have an account? <span onClick={() => setIsRegistering(false)} className="text-[#0066ff] cursor-pointer hover:underline">Login here</span></>
                  ) : (
                    <>Don't have an email account? <span onClick={() => setIsRegistering(true)} className="text-[#0066ff] cursor-pointer hover:underline">Register here</span></>
                  )
                )}
              </span>
            </div>
          </div>

          {/* Terms Disclaimer Footnote */}
          <div className="mmt-footer-terms">
            By proceeding, you agree to Braj Nidhi's <a href="/privacy" target="_blank">Privacy Policy</a>, <a href="/terms" target="_blank">User Agreement</a> and <a href="/terms" target="_blank">T&Cs</a>
          </div>

        </div>

      </div>
    </div>
  );
}
