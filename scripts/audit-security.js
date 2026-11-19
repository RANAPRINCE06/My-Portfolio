const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = [...walk('./components'), ...walk('./app'), ...walk('./content')];
let insecureCount = 0;
let secureCount = 0;

files.forEach((f) => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/<a\s+[^>]*target=["']_blank["'][^>]*>/gi) || [];
  matches.forEach((m) => {
    if (!m.includes('rel=') || (!m.includes('noopener') && !m.includes('noreferrer'))) {
      console.log('Insecure link found in', f, ':', m);
      insecureCount++;
    } else {
      secureCount++;
    }
  });
});

console.log(`Security Audit Complete: ${secureCount} secure external links, ${insecureCount} insecure.`);
if (insecureCount > 0) {
  process.exit(1);
}
