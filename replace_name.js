const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  content = content.replace(/Little Lantern/g, "My Lantern");
  content = content.replace(/LITTLE LANTERN/g, "MY LANTERN");
  content = content.replace(/little lantern/gi, "my lantern");
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', '.next', '.vercel', 'public'].includes(file)) continue;
      walkDir(fullPath);
    } else {
      if (fullPath.match(/\.(tsx|ts|jsx|js|md|json)$/)) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Done replacing in src directory.');
