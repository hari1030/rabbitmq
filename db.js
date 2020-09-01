var pg = require("pg");

var async = require("async");

// Connect to the "bank" database.
var config = {
  user: "root",
  host: "localhost",
  database: "chat",
  port: 26257,
};

// Create a pool.
var pool = new pg.Pool(config);

const saveTodb = (payload) => {
  // console.log(payload);

  async.waterfall(
    [
      function (next) {
        pool.query(
          "CREATE TABLE IF NOT EXISTS sender (ID SERIAL PRIMARY KEY,sender STRING, message STRING,date STRING);",
          next
        );
      },
      function (results, next) {
        pool.query(
          "CREATE TABLE IF NOT EXISTS receiver (ID SERIAL PRIMARY KEY,receiver STRING, message STRING,date STRING);",
          next
        );
      },
      function (results, next) {
        var date = new Date();
        pool.query(
          "INSERT INTO sender (sender, message ,date) VALUES ($1, $2, $3)",
          [payload.sender, payload.message, date],
          next
        );
      },
      function (results, next) {
        pool.query(
          "INSERT INTO receiver (receiver, message,date) VALUES ($1, $2, $3)",
          [payload.receiver, payload.message, new Date()],
          next
        );
      },
    ],
    function (err, results) {
      if (err) {
        console.error(
          "Error inserting into and selecting from accounts: ",
          err
        );
      }
      // console.log(results);
    }
  );
  // });
};

exports.saveTodb = saveTodb;
