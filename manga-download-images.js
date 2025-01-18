// Script Usage
//=============================================================================
// node manga-download-images.js /Users/sinothomas/Downloads/manga/Above\ All\ Gods.json
// node manga-download-images.js /Users/sinothomas/Downloads/manga/Above\ All\ Gods.json --overwrite
// node ~/Development/Projects/robot/manga-download-images.js /Volumes/4\ TB\ SSD\ X9/Manga/The\ Player\ With\ a\ Hidden\ Past.json
//=============================================================================


const fs = require("node:fs");
const readline = require("node:readline");
const path = require("node:path");
const createDir = require("./createDir.js");
const fileExist = require("./fileExist.js");
const downloadImage = require("./download-image.js");
const logOnSameLine = require("./logOnSameLine.js");


const pathOptions = [
  `/Volumes/4 TB SSD X9/Manga`,
  `/Users/sinothomas/Downloads/Manga`,
];
let imageOutputDir;
for (const path of pathOptions) {
  if (fs.existsSync(path)) {
    imageOutputDir = path;
    break;
  }
}
if (imageOutputDir) {
  console.log("\nOutput Directory: " + imageOutputDir);
} else {
  console.log("\nOutput Directory not found.");
  console.log("Exiting.");
  process.exit(0);
}


// Get dataFilePath
const dataFilePath = process.argv[2];
if (!dataFilePath) {
  console.log("\nMissing DataFilePath.");
  console.log("Exiting.");
  process.exit(0);
} else {
  console.log(`\nDataFilePath ${dataFilePath}`);
}

// Get -o , --overwrite Flag
const overwrite = process.argv.some(arg => ["-o", "--overwrite"].includes(arg.trim().toLowerCase()));


// Get data
let data;
try {
  data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
} catch (e) {
  console.log("\nData parse error.", e);
  console.log("Exiting.");
  process.exit(0);
}


let downloadCount = 0;
let skippedCount = 0;
let erroredCount = 0;
let totalCount = 0;


// Download all chapter/image
(async () => {
  for (const chapterKey in data?.chapters) {
    const imageUrls = data?.chapters[chapterKey];

    let ps = [];
    for (const [index, imageUrl] of imageUrls.entries()) {
      const dirPath = path.resolve(imageOutputDir, data?.title?.trim(), chapterKey?.trim());
      createDir(dirPath);
      const filepath = path.resolve(dirPath, `${index}.jpg`);
      if (fileExist(filepath) && !overwrite) {
        logStatus(`Skipped    image ${filepath}`);
        skippedCount++;
      } else {
        ps.push(
          downloadImage(imageUrl, filepath)
            .then(() => {
              logStatus(`Downloaded image ${filepath}`);
            })
            .catch(e => {
              logStatus(`Error Downloading image ${filepath}`);
              erroredCount++;
            }),
        );
        downloadCount++;
      }
      totalCount++;
    }
    await Promise.all(ps);
  }


  logStatus();
  console.log("\nExiting Successfully.\n");
})();


function logStatus(msg = "") {
  logOnSameLine(
    `(${totalCount})Total      ` +
    `(${downloadCount})Downloaded      ` +
    `(${skippedCount})Skipped      ` +
    `(${erroredCount})Errored      ` +
    `${msg}`,
  );
}


