import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const publicDir = './public';

async function compressImages() {
  const files = await fs.readdir(publicDir);
  for (const file of files) {
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      
      const stats = await fs.stat(path.join(publicDir, file));
      // Only process files larger than 1MB
      if (stats.size > 1024 * 1024) {
        console.log(`Compressing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
        
        try {
          const inputPath = path.join(publicDir, file);
          const outputPath = path.join(publicDir, `${name}.webp`);
          
          await sharp(inputPath)
            .resize({ width: 1920, withoutEnlargement: true }) // Max width 1920px for HD displays
            .webp({ quality: 75 })
            .toFile(outputPath);
            
          console.log(`Created ${name}.webp`);
          
          // Delete original to save space
          // await fs.unlink(inputPath);
          // console.log(`Deleted original ${file}`);
        } catch (e) {
          console.error(`Error processing ${file}:`, e);
        }
      }
    }
  }
}

compressImages().then(() => console.log('Done!'));
