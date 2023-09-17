const { Cluster } = require("puppeteer-cluster");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function runScraper(search) {
  let backmarketProducts = [];
  let refurbedProducts = [];
  let rebuyProducts = [];
  let products = [];

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2, // Anzahl der parallelen Seiten
    puppeteerOptions: {
      defaultViewport: false,
      headless: true,
    },
  });

  cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message} ${err}`);
  });

  const backmarketScraper = async ({ page, data: url }) => {
    let title, price, img, link, platform;

    await page.goto(url);
    //cookie wegklicken
    await page.waitForSelector('button[data-qa="accept-cta"]');
    await page.click('button[data-qa="accept-cta"]');

    await page.type("form > div > input", search, { delay: 200 });
    await page.keyboard.press("Enter");

    await page.waitForNavigation();
    const items = await page.$$(".productCard"); //verwendet querySelectorAll
    for (let item of items) {
      title = await page.evaluate(
        (el) => el.querySelector("div.flex > h2").textContent,
        item
      );
      img = await page.evaluate(
        (el) =>
          el
            .querySelector("div.flex-shrink-0 > img.h-auto")
            .getAttribute("src"),
        item
      );
      price = await page.evaluate(
        (el) => el.querySelector(`[data-qa="prices"]`).textContent,
        item
      );
      link = await page.evaluate(
        (el) =>
          el.querySelector('a[data-qa="product-thumb"]').getAttribute("href"),
        item
      );
      platform = "backmarket";

      let imgIndex = img.indexOf("https://");

      backmarketProducts.push({
        title: title.match(/[a-zA-Z0-9\s]+/)[0].trim(),
        img: img.substring(imgIndex),
        price: Number(price.match(/[\d,]+/)[0].replace(/,/g, ".")),
        link: `https://www.backmarket.de/${link}`,
        platform: platform,
      });
    }
  };

  const refurbedScraper = async ({ page, data: url }) => {
    let title, price, img, link, platform;

    await page.goto(url);
    await page.waitForSelector('button[data-tracking-id="cookies-accepted"]');
    await page.click('button[data-tracking-id="cookies-accepted"]');

    await page.type('input[data-test="searchInput"]', search, {
      delay: 200,
    });
    await page.keyboard.press("Enter");

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    const items = await page.$$("#product-list article");
    for (item of items) {
      title = await page.evaluate(
        (el) => el.querySelector("div.w-full h3").textContent,
        item
      );
      img = await page.evaluate(
        (el) =>
          el.querySelector("picture img[data-original]").getAttribute("src"),
        item
      );
      price = await page.evaluate(
        (el) => el.querySelector("div.price-main").textContent,
        item
      );
      link = await page.evaluate(
        (el) => el.querySelector("article a").getAttribute("href"),
        item
      );
      platform = "refurbed";

      refurbedProducts.push({
        title: title.trim(),
        img: img,
        price: Number(price.match(/[\d,]+/)[0].replace(/,/g, ".")),
        link: `https://www.refurbed.de/${link}`,
        platform: platform,
      });
    }
  };

  const rebuyScraper = async ({ page, data: url }) => {
    let title, price, img, link, platform;

    await page.goto(url);
    //vervollständigen
    await page.waitForSelector("#CybotCookiebotDialog");
    await page.click("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll");

    await page.type('input[data-cy="search-input-field"]', search, {
      delay: 200,
    });
    await page.keyboard.press("Enter");

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    //autoscroll Funktion
    await autoScroll(page);

    const items = await page.$$('ry-product[listname="product-list"]');
    for (item of items) {
      title = await page.evaluate(
        (el) => el.querySelector("div.title").textContent,
        item
      );
      img = await page.evaluate(
        (el) => el.querySelector("img.product-image").getAttribute("src"),
        item
      );
      price = await page.evaluate(
        (el) => el.querySelector('span[data-cy="product-price"]').textContent,
        item
      );
      link = await page.evaluate(
        (el) =>
          el.querySelector('a[data-cy="product-link"]').getAttribute("href"),
        item
      );
      platform = "rebuy";

      rebuyProducts.push({
        title: title.trim(),
        img: img,
        price: Number(price.match(/[\d,]+/)[0].replace(/,/g, ".")),
        link: `https://www.rebuy.de/${link}`,
        platform: platform,
      });
    }
  };

  cluster.queue("https://www.backmarket.de/de-de", backmarketScraper);
  cluster.queue("https://www.refurbed.de", refurbedScraper);
  cluster.queue("https://www.rebuy.de", rebuyScraper);

  await cluster.idle();
  await cluster.close();

  products = [...backmarketProducts, ...refurbedProducts, ...rebuyProducts];
  let filteredProducts = products.filter((el) =>
    el.title.toLowerCase().includes(search.toLowerCase())
  );

  return filteredProducts;
}

// Funktion die automatisch ans Ende der Seite scrollt
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = {
  runScraper,
};
