const fs = require("fs");
const path = require("path");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.output.write(
  `Greetings! Please, write smth for me to save it in the new file called "input":\n`
);

const writePath = path.resolve(__dirname, 'input.txt');

fs.createWriteStream(writePath);

rl.on("line", (input) => {
  if (input === "exit") {
    rl.close();
  } else {
    fs.appendFile(writePath, `${input}\n`, () => {
      rl.output.write(
        `Thanks! File successfully updated! You can write "exit" or use "ctrl + c" if you want to end this.\n`
      );
    });
  }
});

process.on("SIGINT", () => {
  process.exit();
});

process.on("beforeExit", () => {
  rl.output.write(`It was great to talk with you. Have a wonderful day!\n`);
});
