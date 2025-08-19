#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple function to create a basic placeholder image using Canvas
function createPlaceholderImage(category, width = 800, height = 600) {
  const { createCanvas } = require('canvas');
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background color based on category
  const colors = {
    sports: '#22c55e',      // Green
    politics: '#3b82f6',    // Blue
    business: '#f59e0b',    // Orange
    entertainment: '#ec4899', // Pink
    health: '#ef4444',      // Red
    education: '#8b5cf6',   // Purple
    culture: '#f97316',     // Orange
    music: '#06b6d4',       // Cyan
    dancehall: '#84cc16',   // Lime
    general: '#6b7280'      // Gray
  };
  
  const bgColor = colors[category.toLowerCase()] || colors.general;
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = `Jamaica ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  ctx.fillText(text, width / 2, height / 2);
  
  // Add subtitle
  ctx.font = '24px Arial';
  ctx.fillText('YaadFeed News', width / 2, height / 2 + 60);
  
  return canvas.toBuffer('image/jpeg', { quality: 0.8 });
}

async function createPlaceholderImages() {
  console.log('🎨 Creating placeholder images for all categories...');
  
  const categories = [
    'sports', 'politics', 'business', 'entertainment', 
    'health', 'education', 'culture', 'music', 'dancehall', 'general'
  ];
  
  const imagesDir = path.join(__dirname, '../public/images');
  
  // Ensure images directory exists
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  for (const category of categories) {
    try {
      console.log(`📸 Creating placeholder for ${category}...`);
      
      const imageBuffer = createPlaceholderImage(category);
      const filename = `placeholder-${category}.jpg`;
      const filepath = path.join(imagesDir, filename);
      
      fs.writeFileSync(filepath, imageBuffer);
      console.log(`✅ Created: ${filename}`);
      
    } catch (error) {
      console.error(`❌ Failed to create placeholder for ${category}:`, error);
    }
  }
  
  console.log('🎉 All placeholder images created successfully!');
}

// Run the script
if (require.main === module) {
  createPlaceholderImages().catch(console.error);
}

module.exports = { createPlaceholderImages }; 