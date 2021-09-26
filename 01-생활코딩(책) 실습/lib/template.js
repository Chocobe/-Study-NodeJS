module.exports = {
  html: (title, list, body, controller) => {
    return `
      <!DOCTYPE html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
        </head>

        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          ${controller}
          ${body}
        </body>
      </html>
    `;
  },

  list: (fileList) => {
    let list = "<ul>";

    fileList.forEach(fileName => {
      list = list.concat(`
        <li><a href="/?id=${fileName}">${fileName}</a></li>
      `);
    });

    return list.concat("</ul>");
  },
};