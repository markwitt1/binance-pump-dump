const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setCookie(
    "_fbp=fb.1.1605260934404.2003261302; locale=de; __cfduid=db4abcdf58b8b78287764b0ad5629fd361611864710"
  );
  await page.goto(
    "https://discord.com/channels/366690888321073175/402804063348981780"
  );
  await page.screenshot({
    path: "/mnt/d/Projects/binance-pump-dump/example.png",
  });

  await browser.close();
})();
