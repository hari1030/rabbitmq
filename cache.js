const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
client.on("error", function (error) {
  console.error(error);
});

const pushToCache = (req) => {
  // console.log(req);
  var date1 = new Date();
  date2 = new Date(date1.getTime() - 7 * 1000 * 3600 * 24);
  date2 = date2.getDate() + "" + date2.getMonth() + "" + date2.getFullYear();
  // console.log(date2);

  const getAsync = promisify(client.keys).bind(client);
  getAsync(`${req.sender}:${date2}`).then((re) => {
    // console.log(re);
    if (re.length !== 0) client.del(re[0]);
  });
  client.rpush(
    `${req.sender}:${date1.getDate()}${date1.getMonth()}${date1.getFullYear()}`,
    req.message
  );
  getAsync(`${req.receiver}1:${date2}`).then((re) => {
    // console.log(re);
    if (re.length !== 0) client.del(re[0]);
  });
  client.rpush(
    `${
      req.receiver
    }1:${date1.getDate()}${date1.getMonth()}${date1.getFullYear()}`,
    req.message
  );
};

exports.pushToCache = pushToCache;
