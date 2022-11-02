const fs = require("fs");
const path = require("path");
const { stdout } = require("process");
const promise = fs.promises;

promise
  .readdir(path.resolve(__dirname, "secret-folder"), { withFileTypes: true })
  .then((items) => {
    for (let item of items) {
      if (item.isDirectory() !== true) {
        promise
          .stat(path.resolve(__dirname, `secret-folder/${item.name}`))
          .then((fileStats) => {            
            stdout.write(
              `${path.parse(path.resolve(__dirname, `secret-folder/${item.name}`)).name} - ${path.extname(item.name).split(".").join("")} - ${fileStats.size} bytes\n`
            );
          });
      }
    }
  })
  .catch((err) => {
    stdout.write(err);
  });