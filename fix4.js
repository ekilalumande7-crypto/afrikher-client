const fs = require('fs');

// Fix package.json - remove motion dependency
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (pkg.dependencies && pkg.dependencies.motion) {
  delete pkg.dependencies.motion;
  console.log('Removed motion from dependencies');
}
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

// Fix next.config.ts - remove motion from optimizePackageImports
let nc = fs.readFileSync('next.config.ts', 'utf8');
nc = nc.replace(/optimizePackageImports:\s*\[.*?\]/s, "optimizePackageImports: ['lucide-react']");
fs.writeFileSync('next.config.ts', nc);
console.log('Fixed next.config.ts');

console.log('Package cleanup done!');
