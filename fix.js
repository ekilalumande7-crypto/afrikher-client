const fs = require('fs');

const files = [
  'app/auth/login/page.tsx',
  'app/auth/register/page.tsx',
  'app/blog/page.tsx',
  'app/boutique/[id]/page.tsx',
  'app/contact/page.tsx',
  'app/dashboard/page.tsx',
  'app/magazine/page.tsx',
  'app/magazine/[slug]/page.tsx',
  'app/partenaires/page.tsx',
  'app/rubriques/page.tsx'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  
  // Remove motion import line
  c = c.replace(/import\s*\{[^}]*motion[^}]*\}\s*from\s*["']motion\/react["'];?\n?/g, '');
  
  // Remove force-dynamic export  
  c = c.replace(/export\s+const\s+dynamic\s*=\s*["']force-dynamic["'];?\n?\n?/g, '');
  
  // Replace <motion.xxx with <xxx (opening tags)
  c = c.replace(/<motion\.(\w+)/g, '<$1');
  
  // Replace </motion.xxx with </xxx (closing tags)
  c = c.replace(/<\/motion\.(\w+)/g, '</$1');
  
  // Remove motion-specific props with object values {{ }}
  c = c.replace(/\s+(initial|whileInView|whileHover|whileTap|animate|exit|viewport|transition|variants)\s*=\s*\{\{[^}]*\}\}/g, '');
  
  // Remove motion-specific props with single brace { ... } containing objects
  c = c.replace(/\s+(initial|whileInView|whileHover|whileTap|animate|exit|viewport|transition|variants)\s*=\s*\{[^}]+\}/g, '');
  
  // Remove viewport prop with nested object {{ once: true }}
  c = c.replace(/\s+viewport\s*=\s*\{\{[^}]*\}\}/g, '');
  
  fs.writeFileSync(f, c);
  console.log('Fixed: ' + f);
});

console.log('All done!');
