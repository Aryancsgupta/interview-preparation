const fs = require('fs');
const path = require('path');

const src = __dirname;
const dest = path.join(__dirname, 'dist');

async function copyDir(srcDir, destDir) {
  await fs.promises.mkdir(destDir, { recursive: true });
  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const name = entry.name;
    if (name === 'dist' || name === 'node_modules') continue;
    const srcPath = path.join(srcDir, name);
    const destPath = path.join(destDir, name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

copyDir(src, dest)
  .then(() => console.log('Built client into dist/'))
  .catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
  });
