const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
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
  } else if (key.name === "c" && key.ctrl) {
    process.exit();
  }
});
