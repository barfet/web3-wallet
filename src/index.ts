// Create the following directory structure
// src/
//   components/
//   containers/
//   actions/
//   reducers/
//   utils/
//   styles/
//   assets/

// You can use the following code to create these directories
import * as fs from 'fs';
import * as path from 'path';

const directories = [
  'components',
  'containers',
  'actions',
  'reducers',
  'utils',
  'styles',
  'assets'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log(`Created directory: ${dirPath}`);
  }
});

// This is a placeholder file to ensure the src/ directory exists
console.log('Project structure initialized');