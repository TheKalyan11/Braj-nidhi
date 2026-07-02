"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: "url('/hero-bg.webp')" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-gold uppercase tracking-[0.4em] text-sm font-medium mb-6 block">
            Welcome to Royal Vrindavan
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight">
            Divine Comfort, <br />
            <span className="italic">Royal Heritage</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the sacred serenity of Braj in a residence designed for royalty. Your spiritual journey deserves the finest stay.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/booking"
              className="group bg-primary text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gold transition-all flex items-center gap-3 shadow-2xl hover:shadow-gold/20"
            >
              <Calendar size={20} />
              Search
            </Link>
            <Link
              href="/rooms"
              className="group border border-white/30 backdrop-blur-sm text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-royal transition-all"
            >
              Explore Suites
            </Link>
          </div>

          {/* Desktop Showcase Images */}
          <div className="hidden lg:flex items-center justify-center gap-6 mt-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative w-48 h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl hover:z-10"
            >
              <Image src="/m1.webp" alt="Royal Vrindavan 1" fill className="object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="relative w-48 h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl -mt-12 hover:z-10"
            >
              <Image src="/m2.webp" alt="Royal Vrindavan 2" fill className="object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="relative w-48 h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl hover:z-10"
            >
              <Image src="/m3.webp" alt="Royal Vrindavan 3" fill className="object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
      >
        <span className="text-white/50 text-[10px] uppercase tracking-widest">Scroll to Explore</span>
        <ChevronDown size={24} className="text-white/50" />
      </motion.div>
    </section>
  );
};

export default Hero;
