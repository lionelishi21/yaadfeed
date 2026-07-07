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
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.js') && !filePath.endsWith('.md') && !filePath.endsWith('.html')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/yardvybz\.com/g, 'yardvybz.news');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('/Users/lionelfrancis/workspace/yaadfeed/src', replaceInFile);
walkDir('/Users/lionelfrancis/workspace/yaadfeed/public', replaceInFile);
console.log('Done!');
