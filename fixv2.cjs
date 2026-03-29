const fs = require('fs');
const path = require('path');

console.log('=== AFRIKHER Fix Script v2 ===\n');

// 1. Add missing dependencies
console.log('1. Adding missing dependencies...');
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
let pkgChanged = false;
if (!pkg.dependencies['date-fns']) {
  pkg.dependencies['date-fns'] = '^3.6.0';
  pkgChanged = true;
  console.log('   + date-fns ^3.6.0');
}
if (!pkg.dependencies['stripe']) {
  pkg.dependencies['stripe'] = '^14.14.0';
  pkgChanged = true;
  console.log('   + stripe ^14.14.0');
}
if (pkg.dependencies['motion']) {
  delete pkg.dependencies['motion'];
  pkgChanged = true;
  console.log('   - removed motion');
}
if (pkg.dependencies['framer-motion']) {
  delete pkg.dependencies['framer-motion'];
  pkgChanged = true;
  console.log('   - removed framer-motion');
}
if (pkgChanged) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('   package.json updated');
} else {
  console.log('   package.json OK');
}

// 2. Fix "use client" pages that have searchParams in their function signature
// Next.js 15 bug: searchParams in client page props causes "Expected workStore" crash
console.log('\n2. Fixing searchParams in client pages...');

const allPages = [];
function findPages(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.next') {
      findPages(full);
    } else if (e.name === 'page.tsx' || e.name === 'page.jsx') {
      allPages.push(full);
    }
  }
}
findPages('app');

let pagesFixed = 0;
allPages.forEach(pagePath => {
  let c = fs.readFileSync(pagePath, 'utf8');
  const orig = c;

  // Only fix "use client" pages
  if (!c.trimStart().startsWith('"use client"') && !c.trimStart().startsWith("'use client'")) {
    return;
  }

  // Remove searchParams from function signature
  // Pattern: function PageName({ searchParams }: { searchParams: ... })
  // Or: function PageName({ searchParams })
  c = c.replace(/\(\s*\{\s*searchParams\s*\}\s*:\s*\{[^}]*\}\s*\)/g, '()');
  c = c.replace(/\(\s*\{\s*searchParams\s*\}\s*\)/g, '()');

  // Also handle: function PageName({ params, searchParams }: ...)
  // Remove searchParams from destructuring but keep params
  c = c.replace(/,\s*searchParams\s*/g, '');
  c = c.replace(/searchParams\s*,\s*/g, '');

  // Remove any "export const dynamic = 'force-dynamic'" in client pages (doesn't work)
  c = c.replace(/export\s+const\s+dynamic\s*=\s*["']force-dynamic["'];?\s*\n?/g, '');

  // Remove motion imports if any remain
  c = c.replace(/import\s*\{[^}]*\}\s*from\s*["'](motion\/react|framer-motion)["'];?\s*\n?/g, '');

  // Replace AnimatePresence
  c = c.replace(/<AnimatePresence>/g, '<>');
  c = c.replace(/<\/AnimatePresence>/g, '</>');

  // Replace motion.xxx tags
  c = c.replace(/<motion\.(\w+)/g, '<$1');
  c = c.replace(/<\/motion\.(\w+)/g, '</$1');

  // Remove motion props (double brace)
  c = c.replace(/\s+(initial|whileInView|whileHover|whileTap|whileFocus|whileDrag|animate|exit|viewport|transition|variants|layout|layoutId|drag|dragConstraints|dragElastic|onAnimationStart|onAnimationComplete)\s*=\s*\{\{[^}]*\}\}/g, '');

  // Remove motion props (single brace)
  c = c.replace(/\s+(initial|whileInView|whileHover|whileTap|whileFocus|whileDrag|animate|exit|viewport|transition|variants|layout|layoutId|drag|dragConstraints|dragElastic|onAnimationStart|onAnimationComplete)\s*=\s*\{[^}]+\}/g, '');

  if (c !== orig) {
    fs.writeFileSync(pagePath, c);
    pagesFixed++;
    console.log('   FIXED: ' + pagePath);
  }
});
console.log('   Pages fixed: ' + pagesFixed);

// 3. Also fix component files for any remaining motion
console.log('\n3. Fixing components for remaining motion...');
const compFiles = [
  'components/layout/Navbar.tsx',
  'components/home/AboutSection.tsx',
  'components/home/FeaturedSection.tsx',
  'components/home/FeaturedArticles.tsx',
  'components/home/Newsletter.tsx',
  'components/home/BoutiquePreview.tsx',
  'components/home/HeroSection.tsx',
];

let compsFixed = 0;
compFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;
  c = c.replace(/import\s*\{[^}]*\}\s*from\s*["'](motion\/react|framer-motion)["'];?\s*\n?/g, '');
  c = c.replace(/<AnimatePresence>/g, '<>');
  c = c.replace(/<\/AnimatePresence>/g, '</>');
  c = c.replace(/<motion\.(\w+)/g, '<$1');
  c = c.replace(/<\/motion\.(\w+)/g, '</$1');
  c = c.replace(/\s+(initial|whileInView|whileHover|whileTap|whileFocus|whileDrag|animate|exit|viewport|transition|variants|layout|layoutId|drag|dragConstraints|dragElastic|onAnimationStart|onAnimationComplete)\s*=\s*\{\{[^}]*\}\}/g, '');
  c = c.replace(/\s+(initial|whileInView|whileHover|whileTap|whileFocus|whileDrag|animate|exit|viewport|transition|variants|layout|layoutId|drag|dragConstraints|dragElastic|onAnimationStart|onAnimationComplete)\s*=\s*\{[^}]+\}/g, '');
  if (c !== orig) { fs.writeFileSync(f, c); compsFixed++; console.log('   FIXED: ' + f); }
});
console.log('   Components fixed: ' + compsFixed);

// 4. Fix next.config.ts
if (fs.existsSync('next.config.ts')) {
  let nc = fs.readFileSync('next.config.ts', 'utf8');
  const nco = nc;
  nc = nc.replace(/['"]motion['"],?\s*/g, '');
  if (nc !== nco) {
    fs.writeFileSync('next.config.ts', nc);
    console.log('\n4. FIXED: next.config.ts');
  }
}

console.log('\n=== Done! Now run: npm install && npx next build ===');
