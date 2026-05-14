import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Globe, Share2, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-royal text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex flex-col mb-6">
              <span className="text-2xl font-serif font-bold tracking-widest text-gold">
                BRAJNIDHI
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/60">
                Divine Guesthouse
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              A sanctuary of peace and royal luxury in the heart of Vrindavan. Experience the divine essence with comfort and grace.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all">
                <Globe size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all">
                <Share2 size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all">
                <MessageCircle size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-serif text-lg mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/rooms" className="text-white/70 hover:text-gold transition-colors text-sm">Royal Suites</Link></li>
              <li><Link href="/guesthouse" className="text-white/70 hover:text-gold transition-colors text-sm">Divine Amenities</Link></li>
              <li><Link href="/weddings" className="text-white/70 hover:text-gold transition-colors text-sm">Royal Weddings</Link></li>
              <li><Link href="/events" className="text-white/70 hover:text-gold transition-colors text-sm">Corporate Retreats</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-gold transition-colors text-sm">Our Legacy</Link></li>
            </ul>
          </div>

          {/* Useful Info */}
          <div>
            <h4 className="text-gold font-serif text-lg mb-6">Information</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-white/70 hover:text-gold transition-colors text-sm">Guest FAQ</Link></li>
              <li><Link href="/privacy" className="text-white/70 hover:text-gold transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white/70 hover:text-gold transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/location" className="text-white/70 hover:text-gold transition-colors text-sm">Getting Here</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold font-serif text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-1" />
                <span className="text-white/70 text-sm leading-relaxed">
                  Brajnidhi Guesthouse, Raman Reti,<br />Vrindavan, Uttar Pradesh 281121
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold" />
                <span className="text-white/70 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold" />
                <span className="text-white/70 text-sm">stay@brajnidhi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs tracking-wider">
            © 2026 BRAJNIDHI GUESTHOUSE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <span className="text-white/40 text-[10px] uppercase tracking-widest">Designed for Divinity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
