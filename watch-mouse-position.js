const robot = require("robotjs");
const wait = require("./wait");


watchMousePosition().catch(console.error);


async function watchMousePosition() {
    console.log("STARTED");

    while (true) {
        const pos = robot.getMousePos();
        const hex = robot.getPixelColor(pos.x, pos.y);

        console.log(`>> X: ${pos.x}  Y: ${pos.y}  HEX: ${hex}  `);

        await wait(300);
    }

    console.log("ENDED");
}
