// Script Usage
//=============================================================================
// node hianime-read.js  https://hianime.to/watch/shangri-la-frontier-season-2-19324?ep=128608
//=============================================================================


const {chromium} = require("playwright");
const wait = require("./wait.js");


// Get startUrl
const startUrl = process.argv[2];
if (!startUrl) {
  console.log("\nMissing startUrl.");
  console.log("Exiting.");
  process.exit(0);
} else {
  console.log(`\nstartUrl ${startUrl}`);
}

(async () => {
  const browser = await chromium.launch({headless: false, timeout: 3000});
  const context = await browser.newContext({
    viewport: {width: 1200, height: 2000},
  });
  const page = await context.newPage();
  await page.goto(startUrl, {waitUntil: "load"});


  // Click Watch now button
  try {
    await page.getByRole("link", {name: " Watch now"}).click();
  } catch (error) {
    console.log("\n 'Watch now' button not found.\n");
    thereIsNextChapter = false;
  }


  await wait(10 * 60 * 1000);

  // Teardown
  await context.close();
  await browser.close();
  console.log("\nExiting Successfully.\n");
})();
