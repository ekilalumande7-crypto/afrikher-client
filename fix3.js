const fs = require('fs');

const files = [
  'app/abonnement/page.tsx',
  'components/home/Newsletter.tsx',
  'components/layout/Navbar.tsx'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/import\s*\{[^}]*motion[^}]*\}\s*from\s*["']motion\/react["'];?\n?/g, '');
  c = c.replace(/export\s+const\s+dynamic\s*=\s*["']force-dynamic["'];?\n?\n?/g, '');
  c = c.replace(/<motion\.(\w+)/g, '<$1');
  c = c.replace(/<\/motion\.(\w+)/g, '</$1');
  c = c.replace(/\s+(initial|whileInView|whileHover|whileTap|animate|exit|viewport|transition|variants)\s*=\s*\{\{[^}]*\}\}/g, '');
  c = c.replace(/\s+(initial|whileInView|whileHover|whileTap|animate|exit|viewport|transition|variants)\s*=\s*\{[^}]+\}/g, '');
  c = c.replace(/\s+viewport\s*=\s*\{\{[^}]*\}\}/g, '');
  fs.writeFileSync(f, c);
  console.log('Fixed: ' + f);
});
console.log('All remaining done!');
