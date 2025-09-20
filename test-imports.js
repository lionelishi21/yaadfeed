// Test file to verify imports work
const path = require('path');

console.log('Testing module resolution...');

// Test if files exist
const fs = require('fs');

const filesToCheck = [
  'src/components/Footer.tsx',
  'src/components/ui/Button.tsx', 
  'src/components/ClientHeader.tsx'
];

filesToCheck.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} NOT FOUND`);
  }
});

console.log('Module resolution test complete.');
