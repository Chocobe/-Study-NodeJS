/**
 * 동기 동작
 */
// const fs = require("fs");

// console.log("A");

// const result = fs.readFileSync("./syntax/sample.txt", { encoding: "utf-8" });
// console.log(result);
// console.log("C");

/**
 * 비동기 동작
 */
const fs = require("fs");

console.log("A");

fs.readFile("./syntax/sample.txt", { encoding: "utf-8" }, (error, result) => {
  console.log(result);
});
console.log("C");