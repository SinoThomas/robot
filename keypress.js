const readlineModule = require("readline");

readlineModule.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (character, key) => {
    console.log(character);
    console.log(key);
});
