const fs = require('fs');

const style = fs.readFileSync('design-repo/style.css', 'utf8');
const banner = fs.readFileSync('design-repo/banner.css', 'utf8');
const features = fs.readFileSync('design-repo/features.css', 'utf8');

let css = style + '\n' + banner + '\n' + features;

// Extract @imports
const imports = [];
css = css.replace(/@import\s+url\([^)]+\);/g, (match) => {
    imports.push(match);
    return '';
});

// Prefix relative urls (e.g. url("file.png") -> url("/file.png") )
css = css.replace(/url\(\s*['"]?([^'"\)]+)['"]?\s*\)/g, (match, p1) => {
    if (p1.startsWith('http') || p1.startsWith('data:') || p1.startsWith('/')) {
        return match;
    }
    return `url("/${p1}")`;
});

// Write it out
const finalCss = imports.join('\n') + '\n\n' + css;
fs.writeFileSync('src/app/globals.css', finalCss);
