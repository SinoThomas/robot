// Script Usage
//=============================================================================
// node manga-read.js --url=https://www.mangaread.org/manga/against-the-gods/chapter-0/
// node manga-read.js --overwrite --url=https://www.mangaread.org/manga/against-the-gods/chapter-0/
//=============================================================================


const {chromium} = require('playwright');
const writeFileSyncRecursive = require("./writeFileSyncRecursive.js");
const fs = require("node:fs");


const dataFileDir = `/Users/sinothomas/Downloads/manga`;

let manga = {
  title: '',
  chapters: {}
};


// Get firstPageUrl
// const firstPageUrl = String(process.argv[2]);
const firstPageUrl = process.argv.find(arg => arg.trim().startsWith('--url=')).split('--url=')[1];
if (!firstPageUrl) {
  console.log('\nMissing FirstPageUrl.')
  console.log('Exiting.')
  process.exit(0)
} else {
  console.log(`\nFirstPageUrl ${firstPageUrl}`);
}


// Get -o , --overwrite Flag
const overwrite = process.argv.some(arg => ['-o', '--overwrite'].includes(arg.trim().toLowerCase()));


(async () => {
  const browser = await chromium.launch({headless: true, timeout: 3000});
  const context = await browser.newContext({
    viewport: {width: 400, height: 2000}
  });
  const page = await context.newPage();
  await page.goto(firstPageUrl, {waitUntil: 'load'});


  // Get Title
  const titleElSelector = '#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li:nth-child(2) > a'
  const titleEl = await page.waitForSelector(titleElSelector, {timeout: 3000});
  const title = await titleEl.textContent().then(s => s.trim())
  manga.title = title;
  console.log(`\nTitle   ${title}`);

  const dataFromFile = readFromFile({title})
  if (dataFromFile) {
    console.log(`Data found at '${getFilePath({title})}'`);
    manga = dataFromFile
  }
  console.log();


  let thereIsNextChapter = true;

  for (let i = 0; thereIsNextChapter; i++) {
    // Get Chapter Number
    const chapterElSelector = '#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li.active'
    const chapterEl = await page.waitForSelector(chapterElSelector, {timeout: 3000});
    const chapter = await chapterEl.textContent().then(s => s.replace(/^\D+/g, '').trim())


    const chapterExist = manga?.chapters[chapter]?.length > 0;
    if (chapterExist && !overwrite) {
      console.log(`Chapter ${chapter.padStart(5)}  Skipped in ${getDuration(true)}ms`);
    } else {
      manga.chapters[chapter] = [];

      // Get all image src
      const imagesElSelector = '.reading-content .page-break img'
      await page.waitForSelector(imagesElSelector, {timeout: 3000});
      const imagesEls = await page.$$(imagesElSelector)
      for (const imageEl of imagesEls) {
        const imageSrc = (await imageEl.getAttribute('src')).trim()
        manga.chapters[chapter].push(imageSrc);
      }
      console.log(`Chapter ${chapter.padStart(5)}  Added ${imagesEls?.length} images in ${getDuration(true)}ms`);
    }

    // Click Next Button
    const nextBtnElSelector = 'a.next_page'
    try {
      // Check if the "Next" button exists within a timeout
      await page.waitForSelector(nextBtnElSelector, {timeout: 3000});
      await page.click(nextBtnElSelector);
    } catch (error) {
      console.log("\nNext button not found.\n");
      thereIsNextChapter = false;
    }

    if (i % 10 === 0) await writeToFile(manga);
  }

  await writeToFile(manga);

  // Teardown
  await context.close();
  await browser.close();
  console.log("\nExiting Successfully.\n");
})();


function getFilePath({title}) {
  const fileName = `${title || 'data'}.json`;
  return `${dataFileDir}/${fileName}`;
}

async function writeToFile(obj) {
  writeFileSyncRecursive(getFilePath({title: obj?.title}), JSON.stringify(obj, null, 2))
}


function readFromFile({title}) {
  try {
    const data = fs.readFileSync(getFilePath({title}), 'utf8');
    return JSON.parse(data)
  } catch (err) {
    return undefined
  }
}


let time = performance.now();

function getDuration(reset = false, length = 4) {
  const ms = Number(performance.now() - (time || 0)).toFixed().padStart(length);
  if (reset) resetDuration()
  return ms
}

function resetDuration() {
  time = performance.now();
}
