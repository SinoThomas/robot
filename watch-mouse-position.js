const robot = require("robotjs");
const wait = require("./wait");


watchMousePosition().catch(console.error);


async function watchMousePosition() {
    console.log("STARTED");

    while (true) {
        const pos = robot.getMousePos();

        console.log('pos<', typeof (pos), '> = ', pos);

        await wait(100);
    }

    console.log("ENDED");
}
