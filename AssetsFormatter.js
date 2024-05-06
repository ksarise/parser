const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const format = require("./AutoFormatter.js");
const { getCategories } = require("./CategoriesFormatter.js");

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
  let allCategories = [];
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
        function skuGen(name) {
          let sum = 0;
          for (let i = 0; i < name.length; i++) {
            sum += name.charCodeAt(i);
          }
          return sum;
        }
        let ProductCard = [];
        for (let i = 0; i < 5; i += 1) {
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
              uriValue: `https://raw.githubusercontent.com/ksarise/parser/2ac6a84713952960a18eb54cd3ed6b994342fabe/assets/SNW-${linkNumber}-01/${i}.jpg`,
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
          console.log(dataArray);
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
  console.log(flattenArray(ProductCards));
  format.formatAndExportData(flattenArray(ProductCards), "Assets");
  await browser.close();
})();
