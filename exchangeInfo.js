const axios = require("axios");
const fs = require("fs");

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    const findFilter = (name) =>
      item.filters.find((filter) => filter.filterType === name);
    const priceFilter = findFilter("PRICE_FILTER");
    return {
      ...obj,
      [item[key]]: {
        precision: parseFloat(findFilter("LOT_SIZE").stepSize),
        tickSize: parseFloat(priceFilter.tickSize),
        /*        multiplierUp: percentPriceFilter.multiplierUp,
        multiplierDown: percentPriceFilter.multiplierDown, */
      },
    };
  }, initialValue);
};

axios.get("https://api.binance.com/api/v3/exchangeInfo").then(async (res) => {
  console.log(
    res.data.symbols.find(({ symbol }) => symbol == "XRPBTC").filters
  );
  const result = convertArrayToObject(res.data.symbols, "symbol");
  await fs.writeFileSync("exchangeInfo.json", JSON.stringify(result));
});
