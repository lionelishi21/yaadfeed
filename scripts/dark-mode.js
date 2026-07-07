const fs = require('fs');
const path = require('path');

const files = [
  '/Users/lionelfrancis/workspace/yaadfeed/src/app/cookies/page.tsx',
  '/Users/lionelfrancis/workspace/yaadfeed/src/app/privacy/page.tsx',
  '/Users/lionelfrancis/workspace/yaadfeed/src/app/terms/page.tsx',
  '/Users/lionelfrancis/workspace/yaadfeed/src/app/contact/page.tsx',
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Backgrounds
  content = content.replace(/bg-gradient-to-br from-logo-light via-white to-logo-muted/g, 'bg-yard-dark');
  content = content.replace(/bg-gradient-to-br from-logo-dark via-logo-primary to-logo-secondary/g, 'bg-yard-gray border-b border-[#1a1a1a]');
  content = content.replace(/bg-gradient-to-r from-logo-light to-logo-muted/g, 'bg-yard-dark');
  content = content.replace(/bg-white/g, 'bg-yard-dark');
  content = content.replace(/bg-gray-50/g, 'bg-yard-gray');
  content = content.replace(/soft-card/g, 'border border-[#222] bg-[#111]');

  // Text Colors
  content = content.replace(/text-gray-900/g, 'text-white');
  content = content.replace(/text-gray-800/g, 'text-gray-200');
  content = content.replace(/text-gray-700/g, 'text-gray-300');
  content = content.replace(/text-gray-600/g, 'text-gray-400');
  content = content.replace(/text-gray-500/g, 'text-gray-400');
  
  content = content.replace(/text-logo-primary/g, 'text-yard-gold');
  content = content.replace(/text-logo-secondary/g, 'text-yard-gold');
  content = content.replace(/from-logo-secondary to-logo-accent/g, 'from-yard-gold to-yellow-600');
  content = content.replace(/from-logo-primary to-logo-secondary/g, 'from-yard-gold to-yellow-600');

  // Borders & Inputs
  content = content.replace(/border-gray-300/g, 'border-[#333] bg-[#222] text-white');
  content = content.replace(/focus:ring-logo-primary\/30/g, 'focus:ring-yard-gold/30');
  
  // Specific Terms page fixes
  content = content.replace(/<div className="mx-auto max-w-3xl px-4 py-10">/g, '<div className="min-h-screen bg-yard-dark text-white"><ClientHeader /><div className="mx-auto max-w-3xl px-4 py-20">');
  content = content.replace(/<\/section>\n    <\/div>\n  \);\n}/g, '<\/section>\n    <\/div><Footer /><\/div>\n  );\n}');
  if (filePath.includes('terms/page.tsx')) {
    if (!content.includes('import ClientHeader')) {
      content = "import ClientHeader from '@/components/ClientHeader';\nimport Footer from '@/components/Footer';\n" + content;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated styles for ${filePath}`);
});
