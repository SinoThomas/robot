const {mouse, straightTo, Point, screen, sleep, imageResource, Region, Button} = require("@nut-tree/nut-js");


// Get Iteration Count
const iterationCount = Number(process.argv[2]);
if (!iterationCount) {
    console.log('Missing iteration Count.')
    console.log('Exiting.')
    process.exit(0)
}

console.log('Iterations: ' + iterationCount);

if (!isFinite(iterationCount)) {
    console.log('Iteration count is not a finite number.')
    console.log('Exiting.')
    process.exit(0)
}


start({iteration: iterationCount}).catch(console.error);


async function start({iteration = 0}) {
    console.log("STARTED");

    for (let i = 1; i <= iteration; i++) {
        // // click "Clear" button
        // await mouse.setPosition(new Point(2525, 2145));
        // await mouse.leftClick();

        // // click "Next" button
        // await mouse.setPosition(new Point(1638, 590));
        // await mouse.setPosition(new Point(1638, 685));
        // await mouse.leftClick();


        // wait for "+" icon & click
        screen.config.confidence = 0.1;
        screen.config.resourceDirectory = "./nut/aniwave/assets";
        const region = await screen.waitFor(imageResource("plus.png"), 10 * 1000);
        // TODO:Remove Log
        console.log('region<', typeof (region), '> = ', region);


        // + button
        // robot.moveMouseSmooth(2551, 100, 0);
        // robot.mouseClick();
        // await sleep(2 * 1000);

        console.log(`Clicked ${i}/${iteration}  (${iteration - i} left)`);
    }

    await sleep(1000);
    console.log("ENDED");
}


// Steps
// 1. click "Clear" button
// 2. click "Next" button
// 3. wait for "+" icon & click
