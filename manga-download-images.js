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


console.log("");

// Get dataFilePath
const dataFilePath = process.argv[2];
if (!dataFilePath) {
  console.log("\nMissing DataFilePath.");
  console.log("Exiting.");
  process.exit(0);
} else {
  console.log(`DataFilePath       ${dataFilePath}`);
}

// Get -o , --overwrite Flag
const overwrite = process.argv.some(arg => ["-o", "--overwrite"].includes(arg.trim().toLowerCase()));


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
  console.log("Output Directory   " + imageOutputDir);
} else {
  console.log("Output Directory not found.");
  console.log("Exiting.");
  process.exit(0);
}


// Get data
let data;
try {
  data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
} catch (e) {
  console.log("\nData parse error.", e);
  console.log("Exiting.");
  process.exit(0);
}

console.log("");

// Download all chapter/image
(async () => {
  let downloadCount = 0;
  let skippedCount = 0;
  let erroredCount = 0;
  const totalCount = Object.values(data?.chapters).flat(1).length;

  for (const chapterKey in data?.chapters) {
    let ps = [];
    const imageUrls = data?.chapters[chapterKey];
    for (const [index, imageUrl] of imageUrls.entries()) {
      const dirPath = path.resolve(imageOutputDir, data?.title?.trim(), chapterKey?.trim());
      createDir(dirPath);
      const filepath = path.resolve(dirPath, `${index}.jpg`);
      if (fileExist(filepath) && !overwrite) {
        logStatus(`Skipped    ${filepath}`);
        skippedCount++;
      } else {
        ps.push(
          downloadImage(imageUrl, filepath)
            .then(() => {
              logStatus(`Downloaded ${filepath}`);
              downloadCount++;
            })
            .catch(e => {
              logStatus(`Error Downloading ${filepath}`);
              erroredCount++;
            }),
        );
      }
    }
    await Promise.all(ps);
  }

  logStatus();
  console.log("\n");
  console.log(`Downloaded ${downloadCount}`);
  console.log(`Skipped    ${skippedCount}`);
  console.log(`Errored    ${erroredCount}`);
  console.log("\nExiting Successfully.\n");


  function logStatus(msg = "") {
    let processedCount = downloadCount + skippedCount;
    logOnSameLine(
      ` ${processedCount} of ${totalCount} (${Number((processedCount / totalCount) * 100).toFixed()}%)   ` +
      `${msg}`,
    );
  }
})();
