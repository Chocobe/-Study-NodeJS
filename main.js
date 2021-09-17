const http = require("http");
const url = require("url");
const fs = require("fs");

function templateHTML(title, list, body) {
  return `
    <!DOCTYPE html>
      <head>
        <meta charset="UTF-8">
        <title>WEB1 - ${title}</title>
      </head>

      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${body}
      </body>
    </html>
  `;
}

function templateList(fileList) {
  let list = "<ul>";

  fileList.forEach(fileName => {
    list = list.concat(`
      <li><a href="/?id=${fileName}">${fileName}</a></li>
    `);
  });

  list = list.concat("</ul>");
  return list;
}

const app = http.createServer((request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if(pathname === "/") {
    if(queryData.id === undefined) {
      fs.readdir("./data", (error, fileList) => {
        const title = "Welcome";
        const description = "Hello, NodeJS";

        const list = templateList(fileList);
        const template = templateHTML(title, list, description);
        
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", (error, fileList) => {
        const list = templateList(fileList);

        fs.readFile(
          `./data/${queryData.id}`,
          { encoding: "UTF-8" },
          (error, description) => {
            const title = queryData.id;            
            const template = templateHTML(title, list, description);

            response.writeHead(200);
            response.end(template);
          },
        );
      })
    }
  } else if(pathname === "/create") {
    fs.readdir("./data", (error, fileList) => {
      const title = "WEB - create";
      const list = templateList(fileList);
      const template = templateHTML(title, list, `
        <form action="http://localhost/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>
      `);

      response.writeHead(200);
      response.end(template);
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});

app.listen(80);
