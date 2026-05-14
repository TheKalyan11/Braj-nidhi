const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Move @imports to the top
const imports = [];
css = css.replace(/@import\s+[^;]+;/g, (match) => {
    imports.push(match);
    return '';
});
css = imports.join('\n') + '\n' + css;

// Fix relative image urls
css = css.replace(/url\(['"]?((?!http|data|\/)[^\)]+)['"]?\)/g, (match, p1) => {
    return 'url("/' + p1 + '")';
});

fs.writeFileSync('src/app/globals.css', css);
