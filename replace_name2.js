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

['test-email.ts', 'README.md', 'package.json'].forEach(file => {
  if (fs.existsSync(file)) replaceInFile(file);
});
console.log('Done root files.');
