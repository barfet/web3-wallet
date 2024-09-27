const fs = require('fs-extra');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const outDir = path.join(__dirname, '..', 'dist');

async function restructure() {
  try {
    // Ensure the output directory exists
    await fs.ensureDir(outDir);

    // Copy all files from build to dist, except _next
    await fs.copy(buildDir, outDir, {
      filter: (src) => !src.includes('_next'),
    });

    // Copy necessary files from _next to the root of dist
    const nextDir = path.join(buildDir, '_next');
    const staticDir = path.join(nextDir, 'static');
    
    await fs.copy(staticDir, path.join(outDir, 'static'));

    // Copy extension-specific files
    await fs.copy(path.join(__dirname, '..', 'src', 'background.ts'), path.join(outDir, 'background.js'));
    await fs.copy(path.join(__dirname, '..', 'src', 'contentScript.ts'), path.join(outDir, 'contentScript.js'));
    await fs.copy(path.join(__dirname, '..', 'public', 'manifest.json'), path.join(outDir, 'manifest.json'));

    console.log('Restructuring complete. Extension files are in the "dist" directory.');
  } catch (err) {
    console.error('An error occurred during restructuring:', err);
  }
}

restructure();