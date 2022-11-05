const fs = require("fs");
const path = require("path");
const { stdout } = require("process");
const promise = fs.promises;
const buildPath = path.resolve(__dirname, "project-dist");
const createdHTMLPath = path.resolve(buildPath, "index.html");
const htmlComponentsPath = path.resolve(__dirname, "components");
const compiledCssFilePath = path.resolve(buildPath, "style.css");
const sourceCssPath = path.resolve(__dirname, "styles");
const sourceAssetsPath = path.resolve(__dirname, "assets");
const copiedAssetsPath = path.resolve(buildPath, "assets");

// Create Directory
fs.mkdir(buildPath, { recursive: true }, throwError);
fs.writeFile(compiledCssFilePath, "", throwError);
fs.mkdir(copiedAssetsPath, { recursive: true }, throwError);
copyAssets(sourceAssetsPath, copiedAssetsPath);
fs.writeFile(createdHTMLPath, "", throwError);

// Build HTML
const readHTML = fs.createReadStream(path.resolve(__dirname, "template.html"), "utf8");
readHTML.on("data", (chunk) => {
  let savedHtmlTemplate = chunk;
  promise
    .readdir(htmlComponentsPath, { withFileTypes: true })
    .then((files) => {
      for (let file of files) { 
        if (path.extname(file.name) === ".html" && file.isDirectory() !== true) {
          const singleComponentPath = path.resolve(htmlComponentsPath, file.name);
          const readComponent = fs.createReadStream(singleComponentPath, "utf8");
          readComponent.on("data", (chunk) => {
            const innerHTML = [];
            innerHTML.push(chunk);
            const sectionName = file.name.replace(path.extname(singleComponentPath), "");
            savedHtmlTemplate = savedHtmlTemplate.replace(`{{${sectionName}}}`, innerHTML[0]);
            fs.writeFile(createdHTMLPath, savedHtmlTemplate, throwError);        
          });
        }
      }
    })
    .catch((err) => {
      stdout.write(err);
    });
});

// Copy Assets
function copyAssets(sourceAssetsPath, copiedAssetsPath) {
  promise
    .readdir(sourceAssetsPath, { withFileTypes: true })
    .then((files) => {
      for (let file of files) {
        if (file.isDirectory() !== true) {
          fs.copyFile(
            path.resolve(sourceAssetsPath, file.name),
            path.resolve(copiedAssetsPath, file.name),
            throwError
          );
        } else if (file.isDirectory()) {
          fs.mkdir(
            path.resolve(copiedAssetsPath, file.name),
            { recursive: true },
            throwError
          );
          copyAssets(
            path.resolve(sourceAssetsPath, file.name),
            path.resolve(copiedAssetsPath, file.name)
          );
        }
      }
    })
    .catch((err) => {
        stdout.write(err);
    });
}

// Merge styles
promise
  .readdir(sourceCssPath, { withFileTypes: true })
  .then((files) => {
    for (let file of files) {
      if (file.isDirectory() !== true && path.extname(file.name) === ".css") {
        fs.readFile(
          path.resolve(sourceCssPath, file.name),
          "utf-8",
          (err, data) => {
            if (err) throw err;
            else {
              fs.appendFile(compiledCssFilePath, data, throwError);
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