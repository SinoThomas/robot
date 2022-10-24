const robot = require("robotjs");


keepMouseAlive().catch(console.error);


async function keepMouseAlive() {
  console.log("STARTED to keep Mouse alive by moving pointer 1 px to right 1 second.");
  while (true) {
    const { x, y } = robot.getMousePos();
    robot.moveMouse(x + 1, y);
    robot.moveMouse(x, y);
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  }
}
