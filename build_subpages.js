const fs = require('fs');
const path = require('path');

const pages = [
  { html: 'guesthouse.html', dir: 'guesthouse', name: 'Guesthouse' },
  { html: 'weddings.html', dir: 'weddings', name: 'Weddings' },
  { html: 'corporate.html', dir: 'corporate', name: 'Corporate' }
];

pages.forEach(page => {
    let html = fs.readFileSync(path.join('design-repo', page.html), 'utf8');

    // Extract body content
    let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<script src=\"https:\/\/cdn/i);
    if (!bodyMatch) {
      bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    }
    let content = bodyMatch ? bodyMatch[1] : '';

    // Convert to JSX
    content = content.replace(/class=/g, 'className=');
    content = content.replace(/stroke-width=/g, 'strokeWidth=');
    content = content.replace(/fill-opacity=/g, 'fillOpacity=');
    content = content.replace(/href=\"index\.html/g, 'href="/');
    content = content.replace(/href=\"guesthouse\.html/g, 'href="/guesthouse');
    content = content.replace(/href=\"weddings\.html/g, 'href="/weddings');
    content = content.replace(/href=\"corporate\.html/g, 'href="/corporate');
    content = content.replace(/href=\"booking\.html/g, 'href="/booking');
    content = content.replace(/onclick=\"this.classList.toggle\('flipped'\)\"/g, "onClick={(e) => e.currentTarget.classList.toggle('flipped')}");
    content = content.replace(/onclick=\"[^\"]*\"/g, "onClick={() => {}}"); // Stub out other onclicks
    content = content.replace(/<a href=\"\/\" className=\"logo\"[^>]*>BRAJ<span>NIDHI<\/span><\/a>/g, '<a href="/" className="logo" style={{textDecoration: "none"}}><img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{height: "60px", width: "auto"}} /></a>');
    content = content.replace(/allowfullscreen=\"\"/g, 'allowFullScreen={true}');
    content = content.replace(/allowfullscreen/g, 'allowFullScreen={true}');
    content = content.replace(/referrerpolicy/g, 'referrerPolicy');

    content = content.replace(/style=\"([^\"]*)\"/g, (match, p1) => {
        let styleObj = {};
        p1.split(';').forEach(s => {
            if (!s.trim()) return;
            let [k, v] = s.split(':');
            if (k && v) {
              k = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              styleObj[k] = v.trim();
            }
        });
        return 'style={' + JSON.stringify(styleObj) + '}';
    });

    // Self-closing tags
    content = content.replace(/<img([^>]*?)\/?>/g, '<img$1 />');
    content = content.replace(/<br\s*\/?>/g, '<br />');
    content = content.replace(/<input([^>]*?)\/?>/g, '<input$1 />');
    content = content.replace(/<source([^>]*?)\/?>/g, '<source$1 />');
    content = content.replace(/rows=\"(\d+)\"/g, 'rows={$1}');
    content = content.replace(/\sreadonly(\s|\/|>)/g, ' readOnly$1');
    content = content.replace(/<use([^>]*?)\/?><\/use>/g, '<use$1 />');
    content = content.replace(/<use([^>]*?)\/?>/g, '<use$1 />');

    // Fix HTML comments
    content = content.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

    // Remove duplicate closing tags for use
    content = content.replace(/<\/use>/g, '');

    // Clean up chat and music logic inside the extracted HTML
    content = content.replace(/<div className=\"premium-music-player\"[^>]*>[\s\S]*?<\/audio>\s*<\/div>/i, '');
    content = content.replace(/<div className=\"chatbot-container\"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, '');
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    content = content.replace(/\scrossorigin=/gi, ' crossOrigin=');

    // Specific content updates for Guesthouse
    if (page.name === 'Guesthouse') {
        content = content.replace(/<div className=\"hero-title-large\">DIVINE LUXURY IN VRINDAVAN<\/div>/gi, 
            '<div className="hero-title-large">Luxury Guestrooms & Divine Suites</div>');
        content = content.replace(/<h2>STAY LONG, SAVE MORE ON SUITES OR ROOMS<\/h2>\s*<p>[\s\S]*?<\/p>/gi, 
            `<h2>Experience a refined stay within the sacred atmosphere of Braj Nidhi.</h2><p>Thoughtfully designed rooms, elegant interiors, and peaceful surroundings come together to offer a truly elevated hospitality experience in the heart of Vrindavan.<br /><br />Whether you are visiting for darshan, weddings, spiritual retreats, or family gatherings, every stay is crafted with warmth, comfort, and timeless elegance.</p>`);
    }

    // Extract styles from head to inject into global CSS if necessary, but actually we will just inline it in the component or keep it in the global css. The user has banner.css, features.css, etc. 
    // Let's add them via import in the layout or page.
    // I'll extract inline <style> and add it as a styled-jsx or simply add to style.css.
    // For simplicity, we can just put it in a <style> tag with dangerouslySetInnerHTML since it's just CSS.
    let headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
    let pageStyles = '';
    if (headMatch) {
      let styles = headMatch[1].match(/<style>([\s\S]*?)<\/style>/gi);
      if (styles) {
        pageStyles = styles.map(s => s.replace(/<\/?style>/gi, '')).join('\n');
      }
    }

    let styleTag = '';
    if (pageStyles) {
        styleTag = '<style dangerouslySetInnerHTML={{ __html: `' + pageStyles.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '` }} />';
    }

    const component = `
"use client";
import React, { useEffect } from 'react';

export default function ` + page.name + `() {
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
    <div className="` + page.name.toLowerCase() + `-page">
      ` + styleTag + `
      ` + content + `
    </div>
  );
}
`;

    const outPath = path.join('src', 'app', page.dir, 'page.tsx');
    fs.mkdirSync(path.join('src', 'app', page.dir), { recursive: true });
    fs.writeFileSync(outPath, component);
    console.log('Converted', page.html, 'to', outPath);
});
