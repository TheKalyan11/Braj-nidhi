import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newReplacementString = `            <div className="footer-col">
                <h3>Follow Us</h3>
                <a href="https://wa.me/917037794300" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://www.instagram.com/braj.nidhi_/" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
        </div>`;

// regex to find the added follow us section
const followUsRegex = /<div className="footer-col" style={{flex: 1\.5}}>[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/g;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.match(followUsRegex)) {
                let newContent = content.replace(followUsRegex, newReplacementString);
                fs.writeFileSync(fullPath, newContent);
                console.log("Updated " + fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, 'src', 'app'));
