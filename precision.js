const axios = require("axios");
const fs = require("fs");

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item.filters[2].stepSize,
    };
  }, initialValue);
};

axios.get("https://api.binance.com/api/v3/exchangeInfo").then(async (res) => {
  //console.log(res.data.symbols);
  const result = convertArrayToObject(res.data.symbols, "symbol");
  await fs.writeFileSync("precision.json", JSON.stringify(result));
});
