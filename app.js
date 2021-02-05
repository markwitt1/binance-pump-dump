let client;
require("./binanceClient").init(run);
const placeOrders = require("./placeOrders");
var readline = require("readline");
const exchangeInfo = require("./exchangeInfo.json");
let config;
try {
  config = require("./config.json");
} catch {
  config = null;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run(res) {
  client = res;
  console.log(process.env.API_KEY);
  console.log(process.env.API_SECRET);

  client.balance((error, balances) => {
    if (error) return console.error(error.body);

    console.info("BTC balance: ", balances.BTC.available);

    if (config) {
      calculateAndLaunch(config);
    } else {
      rl.question("BTC investment?", async (answer) => {
        const btcAmount = parseFloat(answer);
        if (btcAmount < balances.BTC.available) {
          rl.question(
            "Enter the values where you want to sell(separated by commas,2.0=200%):",
            async (answer) => {
              const sellValues = answer
                .replace(/\s+/g, "")
                .split(",")
                .map((val) => parseFloat(val));

              rl.question("Coin Name?", async (answer) => {
                const coin = answer.toUpperCase();
                calculateAndLaunch({ coin, sellValues, btcAmount });
              });
            }
          );
        } else {
          console.log("Not enough balance");
          rl.close();
        }
      });
    }
  });
}

function calculateAndLaunch({ coin, sellValues, btcAmount }) {
  const { precision, tickSize } = exchangeInfo[`${coin}BTC`];
  const marketName = `${coin}BTC`;
  client.prices(marketName, async (error, ticker) => {
    const price = ticker[marketName];
    console.info(`Price of ${coin} : `, price);
    if (price) {
      placeOrders({
        marketName,
        price,
        precision,
        tickSize,
        btcAmount,
        sellValues,
        client,
      });
      rl.close();
    } else {
      console.log("fail");
    }
  });
}
