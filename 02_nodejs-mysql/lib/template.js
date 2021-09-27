module.exports = {
    HTML:function(title, list, body, control) {
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
        </html>
        `;
    },
    
    list:function(topics) {
        var list = '<ul>';
        var i = 0;
        while(i < topics.length) {
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    },

    authorSelect:function(authors, author_id) {
      let tag = "";
      let selected = "";

      authors.forEach(author => {
        author.id === author_id && (selected = "selected");
        
        tag += `
          <option value="${author.id}" ${selected}>
            ${author.NAME}
          </option>
        `;

        selected = "";
      });

      return `
        <select name="author" >
          ${tag}
        </select>
      `;
    },
}
