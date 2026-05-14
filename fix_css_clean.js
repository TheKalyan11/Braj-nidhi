const fs = require('fs');

let style = fs.readFileSync('design-repo/style.css', 'utf8');
let banner = fs.readFileSync('design-repo/banner.css', 'utf8');
let features = fs.readFileSync('design-repo/features.css', 'utf8');

// Remove the import from style.css
style = style.replace(/@import url\('https:\/\/fonts.googleapis.com[^)]+'\);/g, '');

let css = `@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

${style}
${banner}
${features}
`;

// Fix relative image urls
css = css.replace(/url\('\.\/city-hero-bg\.jpg'\)/g, 'url("/city-hero-bg.jpg")');
css = css.replace(/url\("city-hero-bg\.jpg"\)/g, 'url("/city-hero-bg.jpg")');
css = css.replace(/url\(city-hero-bg\.jpg\)/g, 'url("/city-hero-bg.jpg")');

fs.writeFileSync('src/app/globals.css', css);
