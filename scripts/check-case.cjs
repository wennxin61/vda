const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const exts = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.png', '.svg'];
const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(p);
    } else {
      if (/\.(js|jsx|ts|tsx)$/.test(name)) files.push(p);
    }
  }
}
walk(root);

const importRegex = /import\s+[^'\n]+['\"](\.\.?[\/][^'\"]+)['\"];?|require\(['\"](\.\.?[\/][^'\"]+)['\"]\)/g;
let problems = [];
for (const f of files) {
  const txt = fs.readFileSync(f,'utf8');
  let m;
  while ((m = importRegex.exec(txt)) !== null) {
    const imp = m[1] || m[2];
    if (!imp) continue;
    const importerDir = path.dirname(f);
    // try resolve
    let resolved = null;
    for (const ext of exts) {
      const candidate = path.resolve(importerDir, imp + ext);
      if (fs.existsSync(candidate)) { resolved = candidate; break; }
    }
    if (!resolved) {
      // try index files
      const candidateDir = path.resolve(importerDir, imp);
      for (const ext of exts) {
        const cand = path.join(candidateDir, 'index' + ext);
        if (fs.existsSync(cand)) { resolved = cand; break; }
      }
    }
    if (!resolved) continue; // unresolved imports ignored
    const actualName = path.basename(resolved);
    const parentDir = path.dirname(resolved);
    const entries = fs.readdirSync(parentDir);
    const matched = entries.find(e => e.toLowerCase() === actualName.toLowerCase());
    if (matched && matched !== actualName) {
      // case mismatch between resolved and real filename
      const relImporter = path.relative(root, f);
      const relResolved = path.relative(root, resolved);
      problems.push({file: relImporter, importPath: imp, resolved: relResolved, actualFsName: matched, expectedName: actualName});
    }
  }
}
if (problems.length === 0) {
  console.log('No case-mismatch issues found.');
  process.exit(0);
}
console.log('Potential case-mismatch issues:');
for (const p of problems) {
  console.log(`- In ${p.file} import '${p.importPath}' -> resolved ${p.resolved} (fs name: ${p.actualFsName} vs imported casing: ${p.expectedName})`);
}
process.exit(0);
