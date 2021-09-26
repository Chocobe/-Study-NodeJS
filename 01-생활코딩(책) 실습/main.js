const http = require("http");
const url = require("url");
const qs = require("querystring");
const fs = require("fs");
const template = require("./lib/template");
const path = require("path");
const sanitizeHtml = require("sanitize-html");

const app = http.createServer((request, response) => {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if(pathname === "/") {
    if(queryData.id === undefined) {
      fs.readdir("./data", (error, fileList) => {
        const title = "Welcome";
        const description = "Hello, NodeJS";

        const list = template.list(fileList);
        const html = template.html(
          title, 
          list, 
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a>`,
        );
        
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir("./data", (error, fileList) => {
        const list = template.list(fileList);
        const filteredId = path.parse(queryData.id).base;

        fs.readFile(
          `./data/${filteredId}`,
          { encoding: "UTF-8" },
          (error, description) => {
            const title = queryData.id;
            const sanitizedTitle = sanitizeHtml(title);
            const sanitizedDescription = sanitizeHtml(description, {
              allowedTags: ["h1", "h2"],
            });
            
            const html = template.html(
              sanitizedTitle,
              list,
              `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
              `<a href="/create">create</a>
              | <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="/delete_process" method="post" onsubmit="return confirm('정말로 삭제 하시겠습니까?');">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`,
            );

            response.writeHead(200);
            response.end(html);
          },
        );
      })
    }
  } else if(pathname === "/create") {
    fs.readdir("./data", (error, fileList) => {
      const title = "WEB - create";
      const list = template.list(fileList);
      const html = template.html(
        title, 
        list, 
        `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
          </form>
        `,
        "",
      );

      response.writeHead(200);
      response.end(html);
    });
  } else if(pathname === "/create_process") {
    let body = "";

    request.on("data", data => {
      body = body.concat(data);
    });

    request.on("end", () => {
      const post = qs.parse(body);
      const { title, description } = post;

      fs.writeFile(`./data/${title}`, description, { encoding: "utf-8" }, (error) => {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if(pathname === "/update") {
    fs.readdir("./data", (error, fileList) => {
      const filteredId = path.parse(queryData.id).base;
      
      fs.readFile(
        `./data/${filteredId}`,
        { encoding: "utf-8" }, 
        (error, description) => {
          const title = queryData.id;
          const list = template.list(fileList);
          const html = template.html(
            title,
            list,
            `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                  <textarea name="description" placeholder="description" rows="30" cols="100">${description}</textarea>
                </p>
                <p><input type="submit"></p>
              </form>
            `,
            `<a href="/create">create</a> | <a href="/update?id=${title}">update</a>`,
          );

          response.writeHead(200);
          response.end(html);
        }
      );
    });
  } else if(pathname === "/update_process") {
    let body = "";

    request.on("data", data => {
      body = body.concat(data);
    });

    request.on("end", () => {
      const { id, title, description } = qs.parse(body);
      
      fs.rename(`./data/${id}`, `./data/${title}`, error => {
        fs.writeFile(`./data/${title}`, description, { encoding: "utf-8" }, error => {
          response.writeHead(302, { Location: `/?id=${title}`});
          response.end();
        });
      });
    });
  } else if(pathname === "/delete_process") {
    let body = "";

    request.on("data", data => {
      body = body.concat(data);
    });

    request.on("end", () => {
      const post = qs.parse(body);
      const filteredId = path.parse(post.id).base;

      fs.unlink(`./data/${filteredId}`, error => {
        response.writeHead(302, { Location: "/" });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});

app.listen(80);
