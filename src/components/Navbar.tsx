"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Weddings", href: "/weddings" },
    { name: "Events", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "glass-morphism py-3 shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center group">
          <span className={cn(
            "text-2xl font-serif font-bold tracking-widest transition-colors",
            isScrolled ? "text-primary" : "text-primary"
          )}>
            BRAJNIDHI
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-70">
            Divine Guesthouse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <span>Login</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <span>Create Account</span>
          </Link>
          <Link
            href="tel:+911234567890"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <Phone size={16} className="text-primary" />
            <span>Support</span>
          </Link>
          <Link
            href="/booking"
            className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2"
          >
            <Calendar size={16} />
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-border shadow-xl p-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium py-2 border-b border-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-4">
                <Link
                  href="/login"
                  className="border border-border text-center py-3 rounded-xl font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="border border-border text-center py-3 rounded-xl font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
                <Link
                  href="/booking"
                  className="bg-primary text-white text-center py-3 rounded-xl font-bold uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Your Stay
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;