const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  database: "opentutorials",
  user: "root",
  password: "1111",
});

connection.connect();

connection.query(`
    SELECT author.id, title, profile, title, description, created
    FROM author
    JOIN topic
    ON author.id = topic.author_id
  `,
  (error, results, fields) => {
    console.log(results);
  }
)

connection.end();
