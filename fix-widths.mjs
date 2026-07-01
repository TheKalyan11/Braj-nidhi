import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // Regex to find w-[Xpx] where X is 300 or greater
            // Example: w-[380px] -> w-full max-w-[380px] md:w-[380px]
            // We need to avoid replacing it if it already has max-w- or md:w-
            const widthRegex = /(?<!md:|lg:|xl:|sm:|max-)w-\[(\d+)px\]/g;
            
            content = content.replace(widthRegex, (match, pixels) => {
                const pxValue = parseInt(pixels, 10);
                if (pxValue >= 300) {
                    modified = true;
                    // Add max-width safeguard
                    return `w-full max-w-[${pixels}px] md:w-[${pixels}px]`;
                }
                return match;
            });
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated widths in ${fullPath}`);
            }
        }
    }
}

const targetDir = path.resolve(process.cwd(), 'src');
console.log(`Scanning directory for width fixes: ${targetDir}`);
processDirectory(targetDir);
console.log('Optimization script completed.');
