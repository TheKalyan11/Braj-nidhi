import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('\\n')) {
                // Let's replace the literal \n that I accidentally added
                let newContent = content.replace(/\\n/g, '\n');
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent);
                    console.log("Updated " + fullPath);
                }
            }
        }
    }
}

processDir(path.join(__dirname, 'src', 'app'));
