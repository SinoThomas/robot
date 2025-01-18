const axios = require("axios");
const {JSDOM} = require("jsdom");

async function getHTMLDocument(url) {
  try {
    const response = await axios.get(url);
    const {window} = new JSDOM(response.data);
    return window.document;
  } catch (error) {
    console.error(`Error fetching ${url}`, error);
    return undefined;
  }
}


module.exports = getHTMLDocument;


// Usage Example

(async () => {
  try {
    const url = "https://www.example.com";
    const document = await getHTMLDocument(url);
    if (document) {
      // Do something with the HTML document
      const canvasDiv = document.getElementById("preview-canvas");
      const lat = canvasDiv.getAttribute("lat");
      const lon = canvasDiv.getAttribute("lon");

      console.log("lat :", typeof (lat), "= ", lat);
      console.log("lon :", typeof (lon), "= ", lon);

    } else {
      console.log("Failed to fetch and parse the document");
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
})();
