const fs = require("fs");

fs.readFile(
  "./sample.txt", 
  { encoding: "utf-8" }, 
  (err, data) => {
    console.log(data);
  }
);