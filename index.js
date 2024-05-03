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
  console.log(arr[1].Link);
  const itemPage = await browser.newPage();
  await itemPage.goto(arr[1].Link);

  let ProductCard = await itemPage.evaluate(() => {
    function attribCsvFormat(str) {
      const index = str.indexOf("(");
      let newStr = index !== -1 ? str.slice(0, index) : str;
      return `attributes.${newStr.replace(/\s/g, "")}`;
    }

    let titleDetails = document.querySelector(".pdp-header-title").innerText;
    let details = document.querySelector(".pdp-content-section-body").children;
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
    let ProductCard = [];

    ProductCard = [
      { dataObject: "data-object", variant: "variant" },
      { key: "key", snowboardID: "snowboard3" },
      {
        productTypeKey: "productType.key",
        snowboardTypeKey: "snowboardTypeKey",
      },
      { productTypeTypeId: "productType.typeId", productType: "product-type" },
      { name: "name.en-GB", productName: titleDetails },
      { slugEn: "slug.en-GB", slugEnName: "snowboard3" },
      { variantsKey: "variants.key", slugEnName: "SNW-3-01" },
    ];
    // productDetails.forEach(({ featureName, featureDescription }) => {
    //   ProductCard.push({ featureName, featureDescription });
    // });
    Specs[0].forEach(({ specName, specValue }) => {
      ProductCard.push({ specName, specValue });
    });
    return ProductCard;
  });
  console.log(ProductCard);
  let dataArray = ProductCard.map((obj) => Object.values(obj));
  function transposeArray(array) {
    return array.map((col, i) => array.map((row) => row[i]));
  }
  let transposedArray = transposeArray(dataArray);
  let ws = XLSX.utils.aoa_to_sheet(transposedArray);
  let csvContent = XLSX.utils.sheet_to_csv(ws);
  let filePath = "ProductCard.csv";
  fs.writeFileSync(filePath, csvContent);
  console.log(`data exported`);
  await browser.close();
})();
