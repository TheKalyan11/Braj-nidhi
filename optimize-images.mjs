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
            
            // Regex to find <img> tags that don't already have loading="lazy"
            const imgRegex = /<img\s+([^>]*?)>/gi;
            
            content = content.replace(imgRegex, (match, p1) => {
                // If it already has a loading strategy, skip
                if (p1.includes('loading=') || p1.includes('loading :')) {
                    return match;
                }
                
                // Strip the trailing slash if it exists
                let inner = p1.trim();
                let hasClosingSlash = false;
                if (inner.endsWith('/')) {
                    hasClosingSlash = true;
                    inner = inner.slice(0, -1).trim();
                }

                // Also ensure object-cover is present if className is present
                // This prevents images from stretching when they have w-full h-full
                let newTag = `<img loading="lazy" decoding="async" ${inner} ${hasClosingSlash ? '/' : ''}>`;
                if (newTag.includes('className="') || newTag.includes("className='")) {
                    if (!newTag.includes('object-cover') && !newTag.includes('object-contain') && !newTag.includes('object-none')) {
                        // Find the className=" or className=' and inject object-cover 
                        newTag = newTag.replace(/className=(['"])(.*?)\1/, (cMatch, quote, classes) => {
                            // Don't add to logos or icons based on class
                            if (classes.includes('logo') || classes.includes('icon') || classes.includes('avatar')) {
                                return cMatch;
                            }
                            return `className=${quote}${classes} object-cover${quote}`;
                        });
                    }
                }
                
                modified = true;
                return newTag;
            });
            
            // We also want to replace iframe with loading="lazy" if not present
            const iframeRegex = /<iframe\s+([^>]*?)>/gi;
            content = content.replace(iframeRegex, (match, p1) => {
                if (p1.includes('loading=')) {
                    return match;
                }
                
                let inner = p1.trim();
                let hasClosingSlash = false;
                if (inner.endsWith('/')) {
                    hasClosingSlash = true;
                    inner = inner.slice(0, -1).trim();
                }

                modified = true;
                return `<iframe loading="lazy" ${inner} ${hasClosingSlash ? '/' : ''}>`;
            });
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated assets in ${fullPath}`);
            }
        }
    }
}

const targetDir = path.resolve(process.cwd(), 'src');
console.log(`Scanning directory: ${targetDir}`);
processDirectory(targetDir);
console.log('Optimization script completed.');
