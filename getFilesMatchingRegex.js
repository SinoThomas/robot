const fs = require('fs');
const path = require('path');

function getFilesMatchingRegex(dir, regex) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        traverse(fullPath);
      } else if (regex.test(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

// // Example usage:
// const matchingFiles = getFilesMatchingRegex('./', /.*\.js$/);
// console.log('Matching files:', matchingFiles);


module.exports = getFilesMatchingRegex;
