const http = require("http");
const url = require("url");
const fs = require("fs");

const app = http.createServer((request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if(pathname === "/") {
    if(queryData.id === undefined) {
      const title = "Welcome";
      const description = "Hello, NodeJS";

      const template = `
        <!DOCTYPE html>
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
          </head>

          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=Javascript">Javascript</a></li>
            </ul>

            <h2>${title}</h2>
            <p>${description}</p>
          </body>
        </html>
      `;

      response.writeHead(200);
      response.end(template);
    } else {
      fs.readFile(
        `./data/${queryData.id}`,
        { encoding: "utf-8" },
        (error, description) => {
          const title = queryData.id;

          const template = `
            <!DOCTYPE html>
              <head>
                <meta charset="UTF-8">
                <title>WEB - ${title}</title>
              </head>

              <body>
                <h1><a href="/">WEB</a></h1>
                <ul>
                  <li><a href="/?id=HTML">HTML</a></li>
                  <li><a href="/?id=CSS">CSS</a></li>
                  <li><a href="/?id=Javascript">Javascript</a></li>
                </ul>

                <h2>${title}</h2>
                <p>${description}</p>
              </body>
            </html>
          `;

          response.writeHead(200);
          response.end(template);
        },
      );
    }
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});

app.listen(80);
