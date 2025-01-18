const axios = require("axios");

async function getHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}`, error);
    return undefined;
  }
}


module.exports = getHTML;


// Usage Example

(async () => {
  try {
    const url = "https://www.example.com";
    const html = await getHTML(url);
    if (html) {
      console.log(html);
    } else {
      console.log("Failed to fetch and parse the document");
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
})();
