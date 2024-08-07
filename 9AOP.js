const robot = require("robotjs");
const wait = require("./wait");


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


start({iterationCount}).catch(console.error);


async function start({iterationCount = 0}) {
    console.log("STARTED");

    for (let i = 1; i <= iterationCount; i++) {
        /**
         * wait for '+' button and click
         */
        const c = await waitForColor({
            color: 'ffffff',
            left: 1240, //2540,
            right: 1260, //2560,
            top: 150,
            bottom: 160,
        })
        await wait(1000);
        await click(c.x, c.y);

        let iterationStr = String(i).padStart(iterationCount?.toString().length);
        let leftStr = String(iterationCount - i).padStart(iterationCount?.toString().length);
        console.log(`Clicked ${iterationStr}/${iterationCount} ` + ` ${leftStr} left`);

        await wait(2 * 1000);

        /**
         * click "Clear" button
         */
        // await click(2525, 2145)
        await click(1247, 1076)

        /**
         * click "Next" button
         */
        // await click(1638, 685)
        await click(360, 685)
    }

    await wait(1000);
    console.log("ENDED");
}


async function click(x, y) {
    robot.moveMouseSmooth(x, y, 0);
    robot.mouseClick();

    // const mousePos = robot.getMousePos();
    // robot.moveMouse(x, y);
    // robot.mouseClick();
    // await wait(100)
    // robot.moveMouse(mousePos.x, mousePos.y);
}


async function waitForColor({color, left, right, top, bottom, timeout = Infinity}) {
    if (!color || !left || !right || !top || !bottom || !timeout) return;

    const startTime = performance.now()

    while (performance.now() < (startTime + timeout)) {
        for (let x = left; x < right; x++) {
            for (let y = top; y < bottom; y++) {
                // robot.moveMouseSmooth(x, y, 0);
                if (robot.getPixelColor(x, y).includes(color)) {
                    return {x, y}
                }
            }
        }
    }
}
