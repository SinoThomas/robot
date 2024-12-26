const readline = require("node:readline");

function logOnSameLine(message) {
  // Clear the current line
  readline.clearLine(process.stdout, 0);
  // Move cursor to the beginning of the line
  readline.cursorTo(process.stdout, 0);
  // Write the message without a newline
  process.stdout.write(message);
}


module.exports = logOnSameLine;
