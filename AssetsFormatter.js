const puppeteer = require("puppeteer");
const format = require("./AutoFormatter.js");

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
  for (let linkNumber = 0; linkNumber < 10; linkNumber += 1) {
    const itemPage = await browser.newPage();
    await itemPage.goto(arr[linkNumber].Link);

    // Product Card parse and autoformat
    let ProductCard = await itemPage.evaluate((linkNumber) => {
      try {
        let titleDetails =
          document.querySelector(".pdp-header-title").innerText;

        let details = document.querySelector(
          ".pdp-content-section-body"
        ).children;

        function getUniqueImagesUrl(productImagesElem) {
          const elements = Array.from(productImagesElem);
          const uniqueSrcSet = new Set();
          elements.forEach((element) => {
            const src = element.getAttribute("src");
            if (src && src.indexOf("clone") === -1) {
              uniqueSrcSet.add(src);
            }
          });
          return Array.from(uniqueSrcSet);
        }

        function skuGen(name) {
          let sum = 0;
          for (let i = 0; i < name.length; i++) {
            sum += name.charCodeAt(i);
          }
          return sum;
        }
        let productImageElements = document.querySelectorAll(
          ".pdp-hero-alt-thumb"
        );
        let imagesNumber = getUniqueImagesUrl(productImageElements).length;
        console.log("iter", linkNumber, "images", imagesNumber);
        let imagesRowNumber;
        if (imagesNumber >= 6) {
          imagesRowNumber = 5;
        } else {
          imagesRowNumber = imagesNumber - 1;
        }
        let ProductCard = [];
        for (let i = 0; i < imagesRowNumber; i += 1) {
          let imageCard = [
            { dataObject: "data-object", variant: "image" },
            { key: "key", keyValue: `snowboard10${linkNumber}` },
            {
              variantSku: "variants.sku",
              variantSkuValue: `SNW-${skuGen(titleDetails)}-01`,
            },
            {
              variantsKey: "variants.key",
              variantKeyValue: `SNW-${linkNumber}-01`,
            },
            {
              variantsNameEn: "variants.images.label",
              variantsNameEnValue: `SNW-Image${linkNumber}-0${i + 1}`,
            },
            {
              uri: "variants.images.url",
              uriValue: `https://raw.githubusercontent.com/ksarise/parser/main/assets/SNW-${linkNumber}-01/${i}.jpg`,
            },
            {
              width: "variants.images.dimensions.w",
              widthValue: "700",
            },
            {
              height: "variants.images.dimensions.h",
              widthValue: "700",
            },
          ];
          let dataArray = imageCard.map((obj) => Object.values(obj));
          ProductCard.push(dataArray);
        }
        return ProductCard;
      } catch {
        console.log(linkNumber, error);
      }
    }, linkNumber);
    // console.log(ProductCard);
    itemPage.close();
    if (ProductCard && ProductCard.length > 0) {
      let dataArray = ProductCard.map((obj) => Object.values(obj));
      ProductCards.push(dataArray);
    }
    // console.log(createKeyValueArrays(ProductCards));
  }
  // console.log(ProductCards);
  // Preparing data for export
  function flattenArray(arrayOfArrays) {
    return arrayOfArrays.reduce((acc, curr) => acc.concat(curr), []);
  }
  format.formatAndExportData(flattenArray(ProductCards), "Assets");
  await browser.close();
})();
