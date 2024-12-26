const fs = require('node:fs');

function writeFileSync(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
  } catch (err) {
    console.error(err);
  }
}


module.exports = writeFileSync;
