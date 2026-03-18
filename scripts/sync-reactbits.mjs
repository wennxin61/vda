import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const componentRoot = path.join(rootDir, 'src', 'components');
const reactbitsDir = path.join(componentRoot, 'reactbits');

const components = [
  { name: 'Threads', pkg: '@react-bits/Threads-JS-CSS' },
  { name: 'TextType', pkg: '@react-bits/TextType-JS-CSS' },
  { name: 'ShinyText', pkg: '@react-bits/ShinyText-JS-CSS' }
];

fs.mkdirSync(reactbitsDir, { recursive: true });

let hasHardFailure = false;

for (const item of components) {
  console.log(`\n[reactbits] syncing ${item.name} ...`);

  try {
    execSync(`npx shadcn@latest add ${item.pkg} --yes --overwrite`, {
      cwd: rootDir,
      stdio: 'inherit'
    });
  } catch (err) {
    console.warn(`[reactbits] install failed for ${item.pkg}, will keep local fallback if present.`);
  }

  for (const ext of ['jsx', 'css']) {
    const source = path.join(componentRoot, `${item.name}.${ext}`);
    const target = path.join(reactbitsDir, `${item.name}.${ext}`);

    if (fs.existsSync(source)) {
      fs.renameSync(source, target);
      console.log(`[reactbits] moved ${item.name}.${ext} -> src/components/reactbits/${item.name}.${ext}`);
    }
  }

  const hasJsx = fs.existsSync(path.join(reactbitsDir, `${item.name}.jsx`));
  const hasCss = fs.existsSync(path.join(reactbitsDir, `${item.name}.css`));

  if (!hasJsx || !hasCss) {
    hasHardFailure = true;
    console.error(`[reactbits] missing files for ${item.name}: jsx=${hasJsx}, css=${hasCss}`);
  }
}

if (hasHardFailure) {
  process.exitCode = 1;
  console.error('\n[reactbits] sync finished with missing files.');
} else {
  console.log('\n[reactbits] sync completed successfully.');
}
