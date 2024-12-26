const fs = require("node:fs");

function createDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, {recursive: true});
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = createDir;
