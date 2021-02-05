const useRound = (precision) => (coinAmount) =>
  Math.floor((coinAmount + Number.EPSILON) / precision) * precision;

module.exports = ({
  marketName,
  price,
  precision,
  tickSize,
  btcAmount,
  sellValues,
  client,
}) => {
  const round = useRound(precision);
  const coinAmountRounded = round(btcAmount / price);
  console.log(
    `ca. ${btcAmount} BTC => ${coinAmountRounded} ${marketName.replace(
      "BTC",
      ""
    )}`
  );

  /*   new Promise((resolve, reject) =>
    resolve({ executedQty: "139.470000", cumulativeQuoteQty: "0.03121158" })
  ) */
  console.log(coinAmountRounded);
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
        const sellPrice = round(actualBuyPrice * sellValue);
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
        console.log(`Amount of coin:${quantityLimitSell},Price:${sellPrice}`);
        client
          .sell(marketName, quantityLimitSell, sellPrice)
          .then((res) => console.log(res))
          .catch((err) => console.error(err.body));
      }
    });
};
