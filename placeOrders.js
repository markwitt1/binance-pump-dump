const { fstat } = require("fs");
const readline = require("readline");
const useRound = (precision) => (coinAmount) =>
  parseFloat((Math.floor(coinAmount / precision) * precision).toPrecision(10));
/* function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} */
module.exports = ({
  marketName,
  price,
  precision,
  tickSize,
  btcAmount,
  sellValues,
  client,
}) => {
  /*   readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (str, key) => {
    console.log(key);
    if (key.name === "escape") {
                  client.balance((error, balances) => {
  client.marketSell(
    marketName,
    useRound(tickSize)(balances[marketName]),
    (res) => {
      console.log(res);
    }
  );
}); 
      console.log("sell");
    } else if (key.name === "c" && key.ctrl) {
      process.exit();
    }
  }); */
  client.candlesticks(
    marketName,
    "1m",
    (error, ticks, symbol) => {
      const round = useRound(precision);
      const coinAmountRounded = round(btcAmount / price);
      console.log(
        `ca. ${btcAmount} BTC => ${coinAmountRounded} ${marketName.replace(
          "BTC",
          ""
        )}`
      );
      if (ticks[ticks.length - 1][4] < ticks[ticks.length - 2][4] * 2) {
        /*   new Promise((resolve, reject) =>
    resolve({ executedQty: "139.470000", cumulativeQuoteQty: "0.03121158" })
  ) */

        console.log({ coinAmountRounded });
        client
          .marketBuy(marketName, coinAmountRounded)
          .catch((err) => {
            console.log("Getting prices");
            const errJson = err.toJSON();
            console.error(errJson);
          })
          .then((res) => {
            console.log(res);
            const executedQty = parseFloat(res.executedQty);
            const cumulativeQuoteQty = parseFloat(res.cummulativeQuoteQty);
            const quantityLimitSell = round(executedQty / sellValues.length);
            const actualBuyPrice = cumulativeQuoteQty / executedQty;

            for (let sellValue of sellValues) {
              const sellPrice = useRound(tickSize)(actualBuyPrice * sellValue);
              console.log("Placing sell order");
              console.log({
                cumulativeQuoteQty,
                executedQty,
                marketName,
                precision,
                coinAmountRounded,
                sellPrice,
                precision,
                tickSize,
                actualBuyPrice,
                sellValue,
                quantityLimitSell,
              });
              console.log(
                `Amount of coin:${quantityLimitSell},Price:${sellPrice}`
              );
              client
                .sell(marketName, quantityLimitSell, sellPrice)
                .then((res) => console.log(res))
                .catch((err) => console.error(err.body));
            }
          });
        client.websockets.miniTicker((markets) => {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          const price = markets[marketName]?.close;
          if (price) process.stdout.write(price);
        });
      } else {
        console.log("security");
      }
    },
    { limit: 2 }
  );
};
