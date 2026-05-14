const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Fix / />
code = code.replace(/\/ \/>/g, '/>');

// Fix HTML comments
code = code.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

// Fix iframe attributes
code = code.replace(/allowfullscreen=\"\"/g, 'allowFullScreen');
code = code.replace(/frameborder=\"0\"/g, 'frameBorder=\"0\"');
code = code.replace(/referrerpolicy=/g, 'referrerPolicy=');

// Fix stroke-width -> strokeWidth etc.
code = code.replace(/stroke-width/g, 'strokeWidth');
code = code.replace(/stroke-linecap/g, 'strokeLinecap');

fs.writeFileSync('src/app/page.tsx', code);
