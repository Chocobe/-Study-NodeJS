console.log('Hello no deamon');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require("mysql");

var db = mysql.createConnection({
  host: "localhost",
  database: "opentutorials",
  user: "root",
  password: "1111",
});

db.connect();

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined) {
            db.query(`
                SELECT * FROM topic
              `,
              (error, topics) => {
                const title = "Welcome";
                const description = "Hello, Node.js";
                const list = template.list(topics);
                const html = template.HTML(
                  title,
                  list,
                  `
                    <h2>${title}</h2>
                    ${description}
                  `,
                  `
                    <a href="/create">create</a>
                  `,
                );

                response.writeHead(200);
                response.end(html);
              },
            );
          
            // fs.readdir('./data', function(error, filelist) {
            //     var title = 'Welcome';
            //     var description = 'Hello, Node.js';
            //     var list = template.list(filelist);
            //     var html = template.HTML(title, list,
            //         `<h2>${title}</h2><p>${description}</p>`,
            //         `<a href="/create">create</a>`
            //     );
            //     response.writeHead(200);
            //     response.end(html);
            // });
        } else {
            db.query(
              `SELECT * FROM topic`,
              (error, topics) => {
                if(error) {
                  throw error;
                }
                
                db.query(
                  `
                    SELECT * FROM topic
                    LEFT JOIN author
                    ON topic.author_id = author.id
                    WHERE topic.id=?
                  `,
                  [queryData.id],
                  (error2, topic) => {
                    if(error2) {
                      throw error2;
                    }
                 
                    const title = topic[0].title;
                    const description = topic[0].description;
                    const list = template.list(topics);
                    const html = template.HTML(
                      title,
                      list,
                      `
                        <h2>${title}</h2>
                        ${description}
                        <p>by ${topic[0].NAME}</p>
                      `,
                      `
                        <a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="delete_process" method="post">
                          <input type="hidden" name="id" value="${queryData.id}" />
                          <input type="submit" value="delete" />
                        </form>
                      `,
                    );

                    console.log(topic);
                    
                    response.writeHead(200);
                    response.end(html);
                  },
                )
              }
            )
          
            // fs.readdir('./data', function(error, filelist) {
            //     var filteredId = path.parse(queryData.id).base;
            //     fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            //         var title = queryData.id;
            //         var sanitizedTitle = sanitizeHtml(title);
            //         var sanitizedDescription = sanitizeHtml(description, {
            //             allowedTags:['h1']
            //         });
            //         var list = template.list(filelist);
            //         var html = template.HTML(sanitizedTitle, list,
            //             `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
            //             `<a href="/create">create</a>
            //             <a href="/update?id=${sanitizedTitle}">update</a>
            //             <form action="delete_process" method="post">
            //                 <input type="hidden" name="id" value="${sanitizedTitle}">
            //                 <input type="submit" value="delete">
            //             </form>`
            //         );
            //         response.writeHead(200);
            //         response.end(html);
            //     });
            // });
        }
    } else if(pathname === '/create') {
        db.query(
          `SELECT * FROM topic`,
          (error, topics) => {
            const title = "Create";
            const list = template.list(topics);
            const html = template.HTML(
              title,
              list,
              `
                <form action="/create_process" method="post">
                  <p><input type="text" name="title" placeholder="title" /></p>
                  <p><textarea name="description" placeholder="description"></textarea></p>
                  <p><input type="submit" value="submit"></p>
                </form>
              `,
              `<a href="/create">create</a>`
            );

            response.writeHead(200);
            response.end(html);
          },
        );
      
        // fs.readdir('./data', function(error, filelist) {
        //     var title = 'WEB - create';
        //     var list = template.list(filelist);
        //     var html = template.HTML(title, list, `
        //         <form action="/create_process" method="post">
        //             <p><input type="text" name="title" placeholder="title"></p>
        //             <p>
        //                 <textarea name="description" placeholder="description"></textarea>
        //             </p>
        //             <p>
        //                 <input type="submit">
        //             </p>
        //         </form>
        //     `, '');
        //     response.writeHead(200);
        //     response.end(html);
        // });
    } else if(pathname === '/create_process') {
        let body = "";

        request.on("data", data => {
          body += body.concat(data);
        });
      
        request.on("end", () => {
          const payload = qs.parse(body);

          db.query(
            `
              INSERT INTO topic (title, description, created, author_id)
              VALUES (?, ?, NOW(), ")
            `,
            [payload.title, payload.description, 1],
            (error, results) => {
              if(error) {
                throw error;
              }
            }
          )
        })
        
        // var body = '';
        // request.on('data', function(data) {
        //     body = body + data;
        // });
        // request.on('end', function() {
        //     var post = qs.parse(body);
        //     var title = post.title;
        //     var description = post.description;
        //     fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        //         response.writeHead(302, {Location: `/?id=${title}`});
        //         response.end();
        //     });
        // });
    } else if(pathname === '/update') {
        db.query(
          `SELECT * FROM topic`,
          (error, topics) => {
            if(error) {
              throw error;
            }

            db.query(
              `
                SELECT * FROM topic WHERE id=?
              `,
              [queryData.id],
              (error2, topic) => {
                const list = template.list(topics);
                const html = template.HTML(
                  topic[0].title,
                  list,
                  `
                    <form action="/update_process" method="post">
                      <input type="hidden" name="id" value="${topic[0].id}" />
                      <p>
                        <input type="text" name="title" placeholder="title" value="${topic[0].title}" />
                      </p>
                      <p>
                        <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                      </p>
                      <p>
                        <input type="submit" value="Submit" />
                      </p>
                    </form>
                  `,
                  `
                    <a href="/create">create</a>
                    <a href="/update?id=${topic[0].id}">update</a>
                  `,
                );

                response.writeHead(200);
                response.end(html);
              },
            );
          },
        );
        
        // fs.readdir('./data', function(error, filelist) {
        //     var filteredId = path.parse(queryData.id).base;
        //     fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
        //         var title = queryData.id;
        //         var list = template.list(filelist);
        //         var html = template.HTML(title, list,
        //             `
        //             <form action="/update_process" method="post">
        //                 <input type="hidden" name="id" value="${title}">
        //                 <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        //                 <p>
        //                     <textarea name="description" placeholder="description">${description}</textarea>
        //                 </p>
        //                 <p>
        //                     <input type="submit">
        //                 </p>
        //             </form>
        //             `,
        //             `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        //         );
        //         response.writeHead(200);
        //         response.end(html);
        //     });
        // });
    } else if(pathname === '/update_process') {
        let body = "";

        request.on("data", data => {
          body = body.concat(data);
        });

        request.on("end", () => {
          const { title, description, id } = qs.parse(body);

          db.query(
            `
              UPDATE topic
              SET title=?, description=?, author_id=1
              WHERE id=?
            `,
            [title, description, id],
            (error, result) => {
              response.writeHead(302, { Location: `/?id=${id}`});
              response.end();
            },
          );
        });
      
        // var body = '';
        // request.on('data', function(data) {
        //     body = body + data;
        // });
        // request.on('end', function() {
        //     var post = qs.parse(body);
        //     var id = post.id;
        //     var title = post.title;
        //     var description = post.description;
        //     fs.rename(`data/${id}`, `data/${title}`, function(error) {
        //         fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        //             response.writeHead(302, {Location: `/?id=${title}`});
        //             response.end();
        //         });
        //     });
        // });
    } else if(pathname === '/delete_process') {
        let body = "";

        request.on("data", data => {
          body = body.concat(data);
        });

        request.on("end", () => {
          const { id } = qs.parse(body);

          db.query(
            `DELETE FROM topic WHERE id=?`,
            [id],
            error => {
              if(error) {
                throw error;
              }

              response.writeHead(302, { Location: "/" });
              response.end();
            },
          );
        });
      
        // var body = '';
        // request.on('data', function(data) {
        //     body = body + data;
        // });
        // request.on('end', function() {
        //     var post = qs.parse(body);
        //     var id = post.id;
        //     var filteredId = path.parse(id).base;
        //     fs.unlink(`data/${filteredId}`, function(error) {
        //         response.writeHead(302, {Location: `/`});
        //         response.end();
        //     });
        // });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(80);
