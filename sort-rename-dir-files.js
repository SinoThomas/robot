const fs = require("fs");
const path = require("path");

// node sort-rename-dir-files.js ~/Downloads/Downies 1 2

const parentDirPath = String(process.argv[2]);
const startNumber = Number(process.argv[3]);
const digitsCount = Number(process.argv[4]);

console.log("   Path: ", parentDirPath);
console.log("   startNumber: ", startNumber);
console.log("   paddingNumber: ", digitsCount);

if (!parentDirPath) {
  console.log("   Error: missing Path");
  process.exit(1);
}
if (!startNumber) {
  console.log("   Error: missing startNumber");
  process.exit(1);
}
if (!digitsCount) {
  console.log("   Error: missing digitsCount");
  process.exit(1);
}

const dirPaths = fs.readdirSync(parentDirPath, {withFileTypes: true})
  .filter(dirent => dirent.isDirectory())
  .map(dirent => path.join(dirent.path, dirent.name));

for (const dirPath of dirPaths) {
  sortRenameDirFiles(dirPath);
}

function sortRenameDirFiles(dirPath) {
  console.log("");

  if (!dirPath) {
    console.log("Missing dir path.");
    console.log("Skipping.");
    return;
  }

  console.log("directory: " + dirPath);

  if (!fs.existsSync(dirPath)) {
    console.log("directory not found.");
    console.log("Skipping.");
    return;
  }

  // Get all file in dir & sort
  const fileNames = fs.readdirSync(dirPath).filter(path => !path.startsWith(".")).sort();

  // Rename files
  for (let i = 0; i < fileNames.length; i++) {
    const oldFileName = fileNames[i];
    const oldFilePath = path.join(dirPath, oldFileName);
    const oldFilePathParsed = path.parse(oldFilePath);

    let fileNum = startNumber + i;
    const newFileName = String(fileNum).padStart(digitsCount, "0");

    const newFilePath = path.format({
      root: oldFilePathParsed.root,
      dir: oldFilePathParsed.dir,
      name: newFileName,
      ext: oldFilePathParsed.ext,
    });

    try {
      fs.renameSync(oldFilePath, newFilePath);
      console.log("Renamed " + oldFilePath + " to " + newFilePath);
    } catch (error) {
      console.error("Error renaming " + oldFilePath + " to " + newFilePath + ":", error);
    }
  }
}

