const fs = require('fs');
const { createCanvas } = require('canvas');

// Create placeholder image
function createPlaceholderImage(width, height, color, text, filename) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Draw text
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.floor(height/8)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width/2, height/2);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Created: ${filename}`);
}

// Create assets
createPlaceholderImage(1024, 1024, '#4CAF50', 'Tourist\nApp', './assets/icon.png');
createPlaceholderImage(1024, 1024, '#4CAF50', 'Tourist\nApp', './assets/adaptive-icon.png');
createPlaceholderImage(1284, 2778, '#4CAF50', 'Tourist App\nIndonesia', './assets/splash.png');
createPlaceholderImage(48, 48, '#4CAF50', 'T', './assets/favicon.png');