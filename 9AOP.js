const robot = require("robotjs");
const wait = require("./wait");
const tls = require("node:tls");


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
            left: 1240,
            right: 1260,
            // left: 2540,
            // right: 2560,
            top: 100,
            bottom: 110,
            // top: 150,
            // bottom: 160,
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


async function mouseMoveAndBack(x, y) {
    const mousePos = robot.getMousePos();
    robot.moveMouse(x, y);
    robot.moveMouse(mousePos.x, mousePos.y);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// test_mouseMoveAndBack().catch(console.error);

async function test_mouseMoveAndBack() {
    let total = 0, count = 0;

    while (true) {
        await wait(100);

        const startT = performance.now();
        await mouseMoveAndBack(100, 100)
        const endT = performance.now();

        count++
        const t = endT - startT;
        total += t;
        console.log('mouseMoveAndBack() took ', t, 'ms', '\tAverage ', total / count, 'ms');
    }
}


async function mouseMoveClickAndBack(x, y) {
    const mousePos = robot.getMousePos();
    robot.moveMouse(x, y);
    robot.mouseClick();
    // await wait(100)
    robot.moveMouse(mousePos.x, mousePos.y);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// test_mouseMoveClickAndBack().catch(console.error);

async function test_mouseMoveClickAndBack() {
    let t = 0, total = 0, count = 0, min = -1, max = -1;

    while (true) {
        await wait(1000);

        const startT = performance.now();
        await mouseMoveClickAndBack(100, 100)
        const endT = performance.now();

        count++
        total += t;
        t = +((endT - startT).toFixed())
        if (min < 0) min = t;
        if (t < min) min = t;
        if (t > max) max = t;

        let average = +((total / count).toFixed());
        console.log('mouseMoveClickAndBack() took ', t, 'ms', '\tMin ', min, 'ms', '\tMax ', max, 'ms', '\tAverage ', average, 'ms');
    }
}
