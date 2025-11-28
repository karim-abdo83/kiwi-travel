import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const imagesToOptimize = [
  'mobile1.jpg',
  'mobile2.jpg', 
  'mobile3.jpg',
  'hero1.jpg',
  'hero2.jpg',
  'hero3.jpg',
  'feature-trip.jpg'
];

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  for (const imageName of imagesToOptimize) {
    const inputPath = path.join(publicDir, imageName);
    const outputPath = path.join(publicDir, `${imageName.split('.')[0]}-optimized.jpg`);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`❌ ${imageName} not found`);
      continue;
    }
    
    try {
      await sharp(inputPath)
        .resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85,
          progressive: true 
        })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${imageName}: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(optimizedSize / 1024 / 1024).toFixed(1)}MB (${reduction}% reduction)`);
    } catch (error) {
      console.log(`❌ Error optimizing ${imageName}:`, error instanceof Error ? error.message : String(error));
    }
  }
  
  console.log('Image optimization complete!');
}

optimizeImages().catch(console.error);
