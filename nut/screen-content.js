const {sleep, screen, Region, pixelWithColor, RGBA} = require("@nut-tree/nut-js");

(async () => {
    await sleep(4000);
    const width = await screen.width();
    const height = await screen.height();

    const halfWidth = width / 2;

    await screen.highlight(new Region(halfWidth, 0, halfWidth, height));
    await screen.capture('screenshot.png');
    const pixelPosition = await screen.find(pixelWithColor(new RGBA(255, 0, 0, 255)));

    // TODO:Remove Log
    console.log('pixelPosition<', typeof (pixelPosition), '> = ', pixelPosition);

})();
