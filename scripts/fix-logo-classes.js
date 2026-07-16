const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Complex stray classes
  content = content.replace(/from-logo-primary via-logo-secondary to-logo-accent/g, 'from-yard-dark via-[#111] to-yard-gray');
  content = content.replace(/bg-gradient-to-r from-logo-primary\/20 to-logo-secondary\/20/g, 'bg-[#1a1a1a]');
  content = content.replace(/bg-gradient-to-br from-logo-primary\/20 to-logo-secondary\/20/g, 'bg-[#1a1a1a]');
  content = content.replace(/bg-gradient-to-br from-logo-primary\/10 to-logo-secondary\/10/g, 'bg-[#111]');
  content = content.replace(/bg-gradient-to-r from-logo-primary to-logo-primary\/90/g, 'bg-yard-gold');
  
  // Specific regex replacements for classes with opacities
  content = content.replace(/text-logo-(?:primary|secondary|accent|light|dark|muted)(?:\/\d+)?/g, 'text-yard-gold');
  content = content.replace(/bg-logo-(?:primary|secondary|accent|light|dark|muted)(?:\/\d+)?/g, 'bg-yard-gold');
  content = content.replace(/from-logo-(?:primary|secondary|accent|light|dark|muted)(?:\/\d+)?/g, 'from-yard-gold');
  content = content.replace(/to-logo-(?:primary|secondary|accent|light|dark|muted)(?:\/\d+)?/g, 'to-yellow-600');
  content = content.replace(/via-logo-(?:primary|secondary|accent|light|dark|muted)(?:\/\d+)?/g, 'via-yellow-500');
  content = content.replace(/border-logo-(?:primary|secondary|accent|light|dark|muted)(?:\/\d+)?/g, 'border-yard-gold');
  content = content.replace(/ring-logo-(?:primary|secondary|accent|light|dark|muted)(?:\/\d+)?/g, 'ring-yard-gold');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated stray logo classes in ${filePath}`);
  }
}

walkDir('/Users/lionelfrancis/workspace/yaadfeed/src/app', replaceInFile);
walkDir('/Users/lionelfrancis/workspace/yaadfeed/src/components', replaceInFile);
console.log('Done cleaning up stray logo classes!');
