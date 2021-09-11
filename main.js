const http = require("http");
const fs = require("fs");
const url = require("url");

const app = http.createServer((request, response) => {
  let _url = request.url;
  let { id: title } = url.parse(_url, true).query;

  if(_url === "/") {
    title = "Welcome";
  }

  if(_url === "/favicon.ico") {
    return response.writeHead(404);
  }

  console.log(`_url: ${_url}`);

  response.writeHead(200);

  fs.readFile(
    `./data/${title}`,
    { encoding: "utf-8" },
    (err, data) => {
      const template = `
        <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>

          <body>
            <h1><a href="/">WEB</a></h1>
            
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=Javascript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${data}</p>
          </body>
        </html>
      `;

      response.end(template);
    },
  );
});

app.listen(80);