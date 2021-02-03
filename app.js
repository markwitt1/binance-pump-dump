require("dotenv").config();
var readline = require("readline");
const precisions = require("./precision.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const Binance = require("node-binance-api");
console.log(process.env.API_KEY);
console.log(process.env.API_SECRET);
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.API_SECRET,
});

binance.balance((error, balances) => {
  if (error) return console.error(error.body);
  console.info("BTC balance: ", balances.BTC.available);
  rl.question("BTC investment?", async (answer) => {
    const btcAmount = parseFloat(answer);
    if (btcAmount < balances.BTC.available) {
      rl.question("Coin Name?", async (answer) => {
        const coin = answer.toUpperCase();
        const precision = precisions[`${coin}BTC`].toString();
        console.log("Precision: ", precision);
        binance.prices(`${coin}BTC`, async (error, ticker) => {
          console.info(`Price of ${coin} : `, ticker[`${coin}BTC`]);
          if (ticker[`${coin}BTC`]) {
            const coinAmount = btcAmount / ticker[`${coin}BTC`];
            const coinAmountRounded =
              Math.floor(coinAmount / precision) * precision;
            console.info(
              `ca. ${btcAmount} BTC => ${coinAmountRounded} ${coin}`
            );
            binance
              .marketBuy(`${coin}BTC`, coinAmountRounded)
              .then(console.info)
              .catch((err) => {
                const errJson = err.toJSON();
                console.error(errJson);
              });
          }
        });
        rl.close();
      });
    } else {
      console.log("Not enough balance");
      rl.close();
    }
  });
});
