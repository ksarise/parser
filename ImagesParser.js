const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.evo.com/shop/snowboard/snowboards/rpp_40");

  // Parse all product cards links on the page
  let arr = await page.evaluate(() => {
    let links = Array.from(
      document.querySelectorAll(".product-thumb-link"),
      (link) => link.href
    );
    return links.map((link) => ({ Link: link }));
  });

  // Start parsing every card
  let ProductCards = [];
  for (let linkNumber = 0; linkNumber < 2; linkNumber++) {
    try {
      const itemPage = await browser.newPage();
      await itemPage.goto(arr[linkNumber].Link);

      const folderName = `assets/SNW-${linkNumber}-01`;

      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, { recursive: true });
      }

      // Product Card parse and autoformat
      let productImages = await itemPage.evaluate((linkNumber) => {
        try {
          function getUniqueImagesUrl(productImagesElem) {
            const elements = Array.from(productImagesElem);
            const uniqueSrcSet = new Set();
            elements.forEach((element) => {
              const src = element.getAttribute("src");
              if (src) {
                const bigSrc = src.replace("/80/", "/700/");
                uniqueSrcSet.add(bigSrc);
              }
            });

            return Array.from(uniqueSrcSet);
          }
          console;
          let productImageElements = document.querySelectorAll(
            ".pdp-hero-alt-thumb"
          );
          let images = getUniqueImagesUrl(productImageElements);
          let selectedUrls = images.slice(0, 4).concat(images.slice(-2, -1));
          return selectedUrls;
        } catch {
          console.error(`Error occurred at ${linkNumber} :`, error);
        }
      }, linkNumber);
      // Save images to local folder

      for (let i = 0; i < productImages.length; i++) {
        const imageUrl = productImages[i];
        const viewSource = await itemPage.goto(imageUrl);
        const buffer = await viewSource.buffer();
        fs.writeFileSync(path.join(folderName, `${i}.jpg`), buffer);
      }
      await itemPage.close();
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  await browser.close();
})();
