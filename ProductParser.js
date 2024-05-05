const puppeteer = require("puppeteer");
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
      function attribCsvFormat(str) {
        const index = str.indexOf("(");
        let newStr = index !== -1 ? str.slice(0, index) : str;
        return `attributes.${newStr.replace(/\s/g, "")}`;
      }

      function tableParser(tableRows) {
        let Specs = [];

        for (
          let colIndex = 0;
          colIndex < tableRows[0].childElementCount;
          colIndex++
        ) {
          let Spec = [];
          tableRows.forEach((row) => {
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
        return Specs;
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
        { name: "name.en-US", productName: titleDetails },
        { slugEn: "slug.en-US", slugEnName: `snowboardSlug10${linkNumber}` },
        { variantsKey: "variants.key", slugEnName: `SNW-${linkNumber}-01` },
      ];
      // productDetails.forEach(({ featureName, featureDescription }) => {
      //   ProductCard.push({ featureName, featureDescription });
      // });
      let tableRows = document.querySelectorAll(".spec-table tr");
      let Specs = tableParser(tableRows);
      Specs[0].forEach(({ specName, specValue }) => {
        ProductCard.push({ specName, specValue });
      });
      return ProductCard;
    }, linkNumber);

    // Get data from script
    const scriptParse = await itemPage.evaluate(() => {
      const scripts = document.querySelectorAll("script");
      const scriptContents = Array.from(scripts).map(
        (script) => script.innerHTML
      );

      const evoDataScript = scriptContents.find((content) =>
        content.includes("var evoData")
      );

      let evoData;
      if (evoDataScript) {
        const start = evoDataScript.indexOf("{");
        const end = evoDataScript.lastIndexOf("}") + 1;
        const dataString = evoDataScript.slice(start, end);
        evoData = JSON.parse(dataString);
      }
      const specsTerrain = document.querySelector(".pdp-spec-list-description");
      let terrainCat = specsTerrain.textContent.replace(/\s/g, "").split(",");
      return {
        abilityLevel: evoData?.abilityLevel || null,
        brand: evoData?.brand.replace(/\s/g, "") || null,
        ageGroup: evoData?.ageGroup || null,
        terrain: terrainCat || null,
      };
    });
    // console.log("KEYS", Object.keys(scriptParse));
    // Format categories
    function addKeys(key) {
      let mainCats = Array(4);
      let mainCatsString = "";
      if (key === "Key") {
        mainCats.fill("");
      } else {
        for (let i = 0; i < 4; i += 1) {
          mainCats[i] = `${Object.keys(scriptParse)[i]},`;
          mainCatsString += `${mainCats[i]};`;
        }
      }
      let terrainCatToString = "";
      for (let i = 0; i < scriptParse.terrain.length; i += 1) {
        terrainCatToString += `${mainCats[3]}${scriptParse.terrain[i]}${key}`;

        if (i < scriptParse.terrain.length - 1) {
          terrainCatToString += ";";
        }
      }
      let productCategories = {
        categories: "categories",
        catnames: `${mainCatsString}${mainCats[0]}${
          scriptParse.abilityLevel
        }${key};${mainCats[1]}${scriptParse.brand}${key};${mainCats[2]}${
          scriptParse.ageGroup
        }${key};${terrainCatToString.trim()}`,
      };

      return productCategories;
    }

    allCategories.push(addKeys(""));
    // console.log("Categories:", Categories);
    ProductCard.push(addKeys("Key"));
    // console.log(ProductCard);
    itemPage.close();
    if (ProductCard && ProductCard.length > 0) {
      let dataArray = ProductCard.map((obj) => Object.values(obj));
      ProductCards.push(dataArray);
    }
    // console.log(createKeyValueArrays(ProductCards));
  }
  let formattedCategories = getCategories(allCategories);
  // Preparing data for export
  format.formatAndExportData(ProductCards, "ProductCards");
  format.formatAndExportData(formattedCategories, "Categories");
  await browser.close();
})();
