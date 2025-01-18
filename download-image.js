const axios = require("axios");
const fs = require("fs");

/**
 * Download an image from given URL to specified file path.
 * @param {string} url - The URL of the image.
 * @param {string} filepath - The destination path for the downloaded image.
 */
async function downloadImage(url, filepath) {
  // Validate inputs
  if (typeof url !== "string" || typeof filepath !== "string") {
    throw new Error("Both URL and file path must be strings");
  }

  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
    });

    // Create writable stream to the provided filepath
    const writer = fs.createWriteStream(filepath);

    // Pipe data from HTTP response to write stream
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    if (!error.response) {
      // The request was made but no response was received
      console.error("Error downloading image: Request timed out");
    } else {
      console.error(`Error downloading image: ${error}`);
    }

    throw error;
  }
}

module.exports = downloadImage;

// // Example Usage:
// const path = require('path');
//
// const imageUrl = 'https://example.com/image.jpg';
// const savePath = path.resolve(__dirname, 'downloaded_image.jpg');
//
// downloadImage(imageUrl, savePath)
//   .then(() => console.log('Image downloaded successfully!'))
//   .catch(err => console.error('Error downloading image:', err));
