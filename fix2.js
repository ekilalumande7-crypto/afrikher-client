const fs = require('fs');

const files = [
  'components/home/AboutSection.tsx',
  'components/home/BoutiquePreview.tsx',
  'components/home/FeaturedArticles.tsx',
  'components/home/FeaturedSection.tsx',
  'components/home/HeroSection.tsx',
  'components/home/NewsLetter.tsx',
  'components/layout/Navbar.tsx'
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

console.log('All components done!');
