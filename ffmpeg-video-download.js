const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const createDir = require("./createDir.js");

// const videoUrl = `https://wf1.biananset.net/_v7/e5a3aa111a44794cd57fd4cb021d149e67c04b9d360e22c0c075f4d69f5c487c4d8c83d417184766e452e240a5804551732606536f4b769444c72225ddd26334b88394a64689df7754fbf01a15e6b4b64d7ce6c8a49d22f959c8c105d9440d9b52618bf6ce846e9586f8a13d07a9a8509be01bd34d2ec10f89d931b51ad7f3ad/master.m3u8`;
const videoUrl = `https://ef.netmagcdn.com:2228/hls-playback/e5a3aa111a44794cd57fd4cb021d149e67c04b9d360e22c0c075f4d69f5c487c4d8c83d417184766e452e240a580455125862a301b878e1d529eb782faa52c8c0fd69b3153f270975a903c00b7d08941112653d392da0d55f0d3b003846bc5eb9b6063a22e23ee7735dd4c0a3d7bbcdce2f0a9e35cafc94fab6264f1e0e82c39d4015596b4a9837ef9e5dea9cf819a71/master.m3u8`;
const outputFilePath = path.join("/Users/sinothomas/Downloads/Shangri-La Frontier Season 02/01.mp4");

createDir(path.dirname(outputFilePath));
ffmpeg(videoUrl)
  .on("progress", function (info) {
    console.log("info :", typeof (info), "= ", info);
    console.log("progress " + Number(info.percent).toFixed(2) + "%");
  })
  .on("error", function (err) {
    console.log("an error happened: " + err.message);
  })
  .on("end", function () {
    console.log("done processing input stream");
  })
  .save(outputFilePath);



