var amqp = require("amqplib/callback_api");
var functions = require("./cache");
var db = require("./db");
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = "chat";

    channel.assertQueue(queue, {
      durable: false,
    });

    // console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      function (payload) {
        // console.log(" [x] Received %s", payload.content.toString());
        // console.log(payload);

        payload = JSON.parse(payload.content.toString());
        // console.log(payload);

        functions.pushToCache(payload);
        db.saveTodb(payload);
      },
      {
        noAck: true,
      }
    );
  });
});
