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
         * click "Clear" button
         */
        robot.moveMouseSmooth(2525, 2145, 0);
        robot.mouseClick();

        /**
         * click "Next" button
         */
        // robot.moveMouseSmooth(1638, 590, 10);
        robot.moveMouseSmooth(1638, 685, 0);
        robot.mouseClick();

        /**
         * wait for '+' button and click
         */
        let found = false;
        // let left = 2540, right = 2560, top = 90, bottom = 110;  // Row 1
        let left = 2540, right = 2560, top = 140, bottom = 160;  // Row 2
        let c = {x: 0, y: 0}
        while (!found) {
            for (let x = left; x < right && !found; x++) {
                for (let y = top; y < bottom && !found; y++) {
                    // robot.moveMouseSmooth(x, y, 0);
                    found = robot.getPixelColor(x, y).includes('ffffff');
                    if (found) {
                        c.x = x;
                        c.y = y;
                    }
                }
            }
        }
        await wait(1000);
        robot.moveMouseSmooth(c.x, c.y, 0);
        robot.mouseClick();
        await wait(2 * 1000);

        let iterationStr = String(i).padStart(iterationCount?.toString().length);
        let leftStr = String(iterationCount - i).padStart(iterationCount?.toString().length);
        console.log(`Clicked ${iterationStr}/${iterationCount} ` + ` ${leftStr} left`);
    }

    await wait(1000);
    console.log("ENDED");
}
