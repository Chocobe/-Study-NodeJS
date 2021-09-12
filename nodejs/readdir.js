const fs = require("fs");
const folderDir = "./data";

fs.readdir(folderDir, (error, fileList) => {
  console.log(fileList);
});