const robot = require("robotjs");


console.log('STARTED');

// Speed up the mouse.
robot.setMouseDelay(2);

const screenSize = robot.getScreenSize();
const height = (screenSize.height / 2) - 10;
const width = screenSize.width;

let x = 0;
let y = height / 2;

while (true) {
    x++;
    if (x >= width) x = 0
    robot.moveMouse(x, y);
}


console.log('STOPPED');