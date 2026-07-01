import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const srcDir = path.join(__dirname, 'src');

// Extensions to convert
const toConvert = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

// Files to SKIP (logos, icons, transparent PNGs that must stay as PNG)
const skipFiles = new Set([
  'Braj_nidhi_.png',
  'sp logo.png',
  'LOGO1-removebg-preview.png',
  '1200x630wa-removebg-preview.png',
  'favicon.ico',
  'favicon.png',
]);

async function convertImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  try {
    const pipeline = sharp(inputPath);
    
    if (ext === '.png') {
      // For PNGs, check if they have transparency — if so, keep quality high
      const meta = await pipeline.metadata();
      if (meta.hasAlpha) {
        // Keep alpha channel — use lossless WebP
        await sharp(inputPath)
          .webp({ lossless: true, quality: 90 })
          .toFile(outputPath);
      } else {
        await sharp(inputPath)
          .webp({ quality: 82, effort: 6 })
          .toFile(outputPath);
      }
    } else {
      // JPEG/JPG — lossy WebP
      await sharp(inputPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(outputPath);
    }
    
    const origSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((origSize - newSize) / origSize * 100).toFixed(1);
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${(origSize/1024/1024).toFixed(1)}MB → ${(newSize/1024/1024).toFixed(1)}MB, -${savings}%)`);
    return { orig: path.basename(inputPath), webp: path.basename(outputPath) };
  } catch (err) {
    console.error(`❌ Failed: ${inputPath} — ${err.message}`);
    return null;
  }
}

async function main() {
  const conversions = []; // { orig, webp }
  const files = fs.readdirSync(publicDir);
  
  console.log(`\n🔄 Converting images to WebP in: ${publicDir}\n`);
  
  for (const file of files) {
    const ext = path.extname(file);
    if (!toConvert.includes(ext)) continue;
    if (skipFiles.has(file)) {
      console.log(`⏭️  Skipped (logo/icon): ${file}`);
      continue;
    }
    // Skip files that already have a webp counterpart
    const webpName = file.replace(/\.[^.]+$/, '.webp');
    const inputPath = path.join(publicDir, file);
    const outputPath = path.join(publicDir, webpName);
    
    if (fs.existsSync(outputPath)) {
      // Already converted — check sizes
      const origSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      if (newSize < origSize) {
        console.log(`✔️  Already converted: ${webpName}`);
        conversions.push({ orig: file, webp: webpName });
        continue;
      }
    }
    
    const result = await convertImage(inputPath, outputPath);
    if (result) conversions.push(result);
  }
  
  // Now update all src references
  console.log(`\n📝 Updating ${conversions.length} image references in source code...\n`);
  updateSourceReferences(srcDir, conversions);
  
  // Summary
  const totalOrig = conversions.reduce((acc, c) => {
    const origPath = path.join(publicDir, c.orig);
    return acc + (fs.existsSync(origPath) ? fs.statSync(origPath).size : 0);
  }, 0);
  const totalWebp = conversions.reduce((acc, c) => {
    const webpPath = path.join(publicDir, c.webp);
    return acc + (fs.existsSync(webpPath) ? fs.statSync(webpPath).size : 0);
  }, 0);
  
  console.log(`\n🎉 Done! ${conversions.length} images converted.`);
  console.log(`📦 Total original: ${(totalOrig/1024/1024).toFixed(1)} MB`);
  console.log(`📦 Total WebP:     ${(totalWebp/1024/1024).toFixed(1)} MB`);
  console.log(`💾 Saved: ${((totalOrig-totalWebp)/1024/1024).toFixed(1)} MB (${((totalOrig-totalWebp)/totalOrig*100).toFixed(1)}%)`);
}

function updateSourceReferences(dir, conversions) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateSourceReferences(fullPath, conversions);
      continue;
    }
    if (!['.tsx', '.ts', '.jsx', '.js', '.css'].includes(path.extname(file))) continue;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    for (const { orig, webp } of conversions) {
      // Escape special chars in filename for regex
      const escaped = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      if (regex.test(content)) {
        content = content.replace(new RegExp(escaped, 'g'), webp);
        modified = true;
        console.log(`  📄 Updated "${orig}" → "${webp}" in ${path.relative(srcDir, fullPath)}`);
      }
    }
    
    if (modified) fs.writeFileSync(fullPath, content);
  }
}

main().catch(console.error);
