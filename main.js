const http = require("http");
const fs = require("fs");
const url = require("url");

const app = http.createServer((request, response) => {
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  console.log(queryData.id);

  if(_url === "/") {
    _url = "/index.html";
  }

  if(_url === "/favicon.ico") {
    return response.writeHead(404);
  }

  response.writeHead(200);
  response.end(queryData.id);
});

app.listen(80);