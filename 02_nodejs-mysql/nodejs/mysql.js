const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1111",
  database: "opentutorials",
});

connection.connect();

connection.query(
  "SELECT * FROM  topic",
  (error, results, fields) => {
    if(error) {
      console.log(error);
    }

    console.log(results);
  },
);

connection.end();