const fs = require("fs");
const path = require("path");
const sourceFolder = path.join(__dirname, "files");
const copiedFolder = path.join(__dirname, "files-copy");

fs.rm(copiedFolder, { force: true, recursive: true }, (err) => {
  if (err) throw err;
  fs.mkdir(copiedFolder, { recursive: true }, throwError);
  fs.readdir(sourceFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const sourceFilePath = path.join(__dirname, "files", `${file}`);
      const copiedFilePath = path.join(__dirname, "files-copy", `${file}`);
      fs.copyFile(sourceFilePath, copiedFilePath, throwError);
      
    });
  });
});

function throwError(err) {
  if (err) throw err;
}
