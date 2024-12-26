// Script Usage
//=============================================================================
// node manga-read-jsdom.js https://www.mangaread.org/manga/against-the-gods/chapter-0/
// node manga-read-jsdom.js https://www.mangaread.org/manga/against-the-gods/chapter-0/ --overwrite
//=============================================================================


const fs = require("node:fs");
const axios = require("axios");
const {JSDOM} = require("jsdom");
const writeFileSyncRecursive = require("./writeFileSyncRecursive.js");
const logOnSameLine = require("./logOnSameLine.js");


const dataFileDir = `/Users/sinothomas/Downloads/manga`;

let manga = {
  title: "",
  chapters: {},
};


// Get firstPageUrl
const firstPageUrl = process.argv[2];
if (!firstPageUrl) {
  console.log("\nMissing FirstPageUrl.");
  console.log("Exiting.");
  process.exit(0);
} else {
  console.log(`\nFirstPageUrl ${firstPageUrl}`);
}


// Get -o , --overwrite Flag
const overwrite = process.argv.some(arg => ["-o", "--overwrite"].includes(arg.trim().toLowerCase()));


(async () => {
  // Get HTML
  let document = await getDocument(firstPageUrl);


  // Get Title
  const titleElSelector = "#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li:nth-child(2) > a";
  const title = document.querySelector(titleElSelector)?.textContent?.trim();
  manga.title = title;


  // Read data from file
  const dataFromFile = readFromFile({title});
  if (dataFromFile) {
    console.log(`Data at      ${getFilePath({title})}`);
    manga = dataFromFile;
  }
  console.log();


  let thereIsNextChapter = true;

  for (let i = 0; thereIsNextChapter; i++) {
    // Get Chapter Number
    const chapterElSelector = "#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li.active";
    const chapterEl = document.querySelector(chapterElSelector);
    const chapter = chapterEl.textContent.replace(/^\D+/g, "").trim();

    const chapterExist = manga?.chapters[chapter]?.length > 0;
    if (chapterExist && !overwrite) {
      logOnSameLine(`Chapter(${chapter})   Skipped    in ${getDuration(true)}ms`);
    } else {
      manga.chapters[chapter] = [];

      // Get all image src
      const imagesElSelector = ".reading-content .page-break img";
      const imagesEls = document.querySelectorAll(imagesElSelector);
      for (const imageEl of imagesEls) {
        const imageSrc = imageEl.getAttribute("src").trim();
        manga.chapters[chapter].push(imageSrc);
      }
      logOnSameLine(`Chapter(${chapter})   Added ${String(imagesEls?.length).padStart(3)} images    in ${getDuration(true)}ms`);
    }

    // Navigate to Next page
    const nextBtnElSelector = "a.next_page";
    const nextHref = document.querySelector(nextBtnElSelector)?.href;
    if (nextHref?.length > 0) {
      document = await getDocument(nextHref);
    } else {
      thereIsNextChapter = false;
    }

    if (i % 10 === 0) await writeToFile(manga);
  }

  await writeToFile(manga);

  // Teardown
  console.log("\nExiting Successfully.\n");
})();


async function getDocument(url) {
  try {
    const response = await axios.get(url);
    const {window} = new JSDOM(response.data);
    return window.document;
  } catch (error) {
    console.error(`Error fetching ${url}`, error);
    return undefined;
  }
}


function getFilePath({title}) {
  const fileName = `${title || "data"}.json`;
  return `${dataFileDir}/${fileName}`;
}

async function writeToFile(obj) {
  writeFileSyncRecursive(getFilePath({title: obj?.title}), JSON.stringify(obj, null, 2));
}


function readFromFile({title}) {
  try {
    const data = fs.readFileSync(getFilePath({title}), "utf8");
    return JSON.parse(data);
  } catch (err) {
    return undefined;
  }
}


let time = performance.now();

function getDuration(reset = false, length = 4) {
  const ms = Number(performance.now() - (time || 0)).toFixed().padStart(length);
  if (reset) resetDuration();
  return ms;
}

function resetDuration() {
  time = performance.now();
}
