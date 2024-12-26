const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filepath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}


// // Example Usage:
// const path = require('path');
//
// const imageUrl = 'https://example.com/image.jpg';
// const savePath = path.resolve(__dirname, 'downloaded_image.jpg');
//
// downloadImage(imageUrl, savePath)
//   .then(() => console.log('Image downloaded successfully!'))
//   .catch(err => console.error('Error downloading image:', err));


module.exports = downloadImage;
