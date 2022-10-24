const robot = require("robotjs");
const wait = require("./wait");
const fs = require("fs");


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
        // Move mouse to Clear button
        await wait(1000);
        robot.moveMouseSmooth(2525, 2145);
        await wait(1000);
        robot.mouseClick();
        await wait(1000);

        // Move mouse to Next button
        // robot.moveMouseSmooth(1638, 590);
        robot.moveMouseSmooth(1638, 685);
        await wait(1000);
        robot.mouseClick();
        await wait(10000);

        // Move mouse to + button
        robot.moveMouseSmooth(2551, 100);
        await wait(1000);
        robot.mouseClick();
        await wait(1000);

        console.log(`Clicked ${i}/${iteration}  (${iteration - i} left)`);
    }

    await wait(1000);
    console.log("ENDED");
}
