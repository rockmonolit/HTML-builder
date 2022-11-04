const fs = require("fs");
const path = require("path");
const { stdout } = require("process");
const promise = fs.promises;
const bundlePath = path.resolve(__dirname, "project-dist");
const bundleFilePath = path.join(bundlePath, "bundle.css");
const sourcePath = path.resolve(__dirname, "styles");
fs.writeFile(bundleFilePath, "", throwError);

promise
  .readdir(sourcePath, { withFileTypes: true })
  .then((files) => {
    for (let file of files) {
      if (file.isDirectory() !== true && path.extname(file.name) === ".css") {
        fs.readFile(
          path.resolve(sourcePath, file.name),
          "utf-8",
          (err, data) => {
            if (err) throw err;
            else {
              fs.appendFile(bundleFilePath, data, throwError);
            }
          }
        );
      }
    }
  })
  .catch((err) => {
    stdout.write(err);
  });

function throwError(err) {
  if (err) throw err;
}
