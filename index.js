const puppeteer = require("puppeteer");
const fs = require("fs");
const XLSX = require("xlsx");
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.evo.com/shop/snowboard/snowboards/rpp_40");
  let arr = await page.evaluate(() => {
    let links = Array.from(
      document.querySelectorAll(".product-thumb-link"),
      (link) => link.href
    );
    return links.map((link) => ({ Link: link }));
  });

  let ProductCards = [];
  for (let linkNumber = 0; linkNumber < 20; linkNumber++) {
    const itemPage = await browser.newPage();
    await itemPage.goto(arr[linkNumber].Link);

    let ProductCard = await itemPage.evaluate((linkNumber) => {
      function attribCsvFormat(str) {
        const index = str.indexOf("(");
        let newStr = index !== -1 ? str.slice(0, index) : str;
        return `attributes.${newStr.replace(/\s/g, "")}`;
      }

      let titleDetails = document.querySelector(".pdp-header-title").innerText;
      let details = document.querySelector(
        ".pdp-content-section-body"
      ).children;
      let productDetails = [];
      Array.from(details).forEach((element) => {
        let featureName = element.children[0].innerText.trim();
        let featureDescription = element.children[1].innerText.trim();
        productDetails.push({ featureName, featureDescription });
      });
      let tableRows = document.querySelectorAll(".spec-table tr");
      let Specs = [];

      for (
        let colIndex = 0;
        colIndex < tableRows[0].childElementCount;
        colIndex++
      ) {
        let Spec = [];
        tableRows.forEach((row, rowIndex) => {
          let th = row.querySelector("th");
          let td = row.querySelectorAll("td")[colIndex];

          if (th && td) {
            let specName = attribCsvFormat(th.textContent);
            let specValue = td.textContent.trim();
            Spec.push({ specName, specValue });
          }
        });
        if (Spec.length > 0) {
          Specs.push(Spec);
        }
      }

      let ProductCard = [
        { dataObject: "data-object", variant: "variant" },
        { key: "key", snowboardID: `snowboard10${linkNumber}` },
        {
          productTypeKey: "productType.key",
          snowboardTypeKey: "snowboardTypeKey",
        },
        {
          productTypeTypeId: "productType.typeId",
          productType: "product-type",
        },
        { name: "name.en-GB", productName: titleDetails },
        { slugEn: "slug.en-GB", slugEnName: `snowboardSlug10${linkNumber}` },
        { variantsKey: "variants.key", slugEnName: `SNW-${linkNumber}-01` },
      ];
      // productDetails.forEach(({ featureName, featureDescription }) => {
      //   ProductCard.push({ featureName, featureDescription });
      // });
      Specs[0].forEach(({ specName, specValue }) => {
        ProductCard.push({ specName, specValue });
      });
      return ProductCard;
    }, linkNumber);
    itemPage.close();
    if (ProductCard && ProductCard.length > 0) {
      let dataArray = ProductCard.map((obj) => Object.values(obj));
      ProductCards.push(dataArray);
    }
    console.log(createKeyValueArrays(ProductCards));
  }

  function createKeyValueArrays(arrays) {
    let keysObj = {};

    arrays.forEach((array) => {
      array.forEach((pair) => {
        keysObj[pair[0]] = undefined;
      });
    });

    let keys = Object.keys(keysObj);

    let result = [];
    result.push(keys);

    arrays.forEach((array) => {
      let valuesArray = [];
      keys.forEach((key) => {
        let value = array.find((pair) => pair[0] === key);
        valuesArray.push(value ? value[1] : undefined);
      });
      result.push(valuesArray);
    });

    return result;
  }
  // CSV
  let ws = XLSX.utils.aoa_to_sheet(ProductCards);
  let csvContent = XLSX.utils.sheet_to_csv(ws);
  let filePath = "ProductCards.csv";
  fs.writeFileSync(filePath, csvContent);

  // Excel
  // let wb = XLSX.utils.book_new();
  // let ws = XLSX.utils.aoa_to_sheet(createKeyValueArrays(ProductCards));
  // XLSX.utils.book_append_sheet(wb, ws, "ProductCards");
  // let filePath = "ProductCards.xlsx";
  // XLSX.writeFile(wb, filePath);
  console.log(`data exported`);
  await browser.close();
})();
