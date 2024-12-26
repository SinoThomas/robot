const fs = require('node:fs');

function fileExist(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    return false
  }
}


module.exports = fileExist;
