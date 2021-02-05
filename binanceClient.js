const Binance = require("node-binance-api");
require("dotenv").config();

let client;
const init = (run) => {
  client = new Binance().options({
    APIKEY: process.env.API_KEY,
    APISECRET: process.env.API_SECRET,
  });
  run(client);
};

module.exports = {
  init,
  client,
};
