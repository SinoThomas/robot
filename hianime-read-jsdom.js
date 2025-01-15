// Script Usage
//=============================================================================
// node hianime-read-jsdom.js  https://hianime.to/watch/shangri-la-frontier-season-2-19324?ep=128608
//=============================================================================


const fs = require("node:fs");
const axios = require("axios");
const {JSDOM} = require("jsdom");
const writeFileSyncRecursive = require("./writeFileSyncRecursive.js");
const logOnSameLine = require("./logOnSameLine.js");


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
  // Get HTML
  let document = await getDocument(startUrl);
  console.log("document :", typeof (document), "= ", document);


  // // Get Title
  // const titleElSelector = "#manga-reading-nav-head > div > div.entry-header_wrap > div > div.c-breadcrumb > ol > li:nth-child(2) > a";
  // const title = document.querySelector(titleElSelector)?.textContent?.trim();
  // manga.title = title;


  // Teardown
  console.log("\nExiting Successfully.\n");
})();


async function getDocument(url) {
  try {
    const response = await axios.get(url);
    console.log("response.data :", typeof (response.data), "= ", response.data);

    const {window} = new JSDOM(response.data);
    return window.document;
  } catch (error) {
    console.error(`Error fetching ${url}`, error);
    return undefined;
  }
}

