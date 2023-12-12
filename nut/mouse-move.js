const {mouse, straightTo, Point, Button} = require('@nut-tree/nut-js');


(async () => {
    await mouse.move(straightTo(new Point(200, 100)));
    await mouse.doubleClick(Button.LEFT);
    await mouse.drag(straightTo(new Point(600, 340)));
})();
