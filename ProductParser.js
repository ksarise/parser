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
  for (let linkNumber = 0; linkNumber < 20; linkNumber += 1) {
    try {
      const itemPage = await browser.newPage();
      await itemPage.goto(arr[linkNumber].Link);

      // Product Card parse and autoformat
      let ProductCard = await itemPage.evaluate((linkNumber) => {
        try {
          function attribCsvFormat(str) {
            const index = str.indexOf("(");
            let newStr = index !== -1 ? str.slice(0, index) : str;
            return `attributes.${newStr.replace(/[\s:]/g, "")}`;
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

          function attribListParser(elements) {
            let list = [];
            elements.forEach((elem) => {
              let titleCheck = elem.children[0].textContent.replace(
                /[\s:]/g,
                ""
              );
              if (titleCheck !== "Terrain" && titleCheck !== "AbilityLevel") {
                let attTitle = attribCsvFormat(
                  elem.children[0].textContent
                ).replace(/\//g, "-");
                let attDesc = elem.children[1].textContent.trim();
                list.push({ attTitle, attDesc });
              }
            });
            return list;
          }
          let titleDetails =
            document.querySelector(".pdp-header-title").innerText;
          let productDescription = document.querySelector(
            ".pdp-details-content"
          ).children[0].textContent;
          let productPrice = document
            .querySelector('meta[name="twitter:data1"]')
            .getAttribute("content")
            .replace(/\$|\./g, "");

          function skuGen(name) {
            let sum = 0;
            for (let i = 0; i < name.length; i++) {
              sum += name.charCodeAt(i);
            }
            return sum;
          }
          let ProductCard = [
            { dataObject: "data-object", variant: "variant" },
            { key: "key", keyValue: `snowboard10${linkNumber}` },
            {
              productTypeKey: "productType.key",
              productTypeKeyValue: "snowboardTypeKey",
            },
            {
              variantSku: "variants.sku",
              variantSkuValue: `SNW-${skuGen(titleDetails)}-01`,
            },
            {
              description: "description.en-US",
              descriptionValue: productDescription,
            },
            {
              priceMode: "priceMode",
              priceModeValue: "Embedded",
            },
            {
              variantPriceKey: "variants.prices.key",
              variantPriceKeyValue: `SNW-Price-${linkNumber}-01`,
            },
            {
              currency: "variants.prices.value.currencyCode",
              currencyValue: "USD",
            },
            {
              valueType: "variants.prices.value.type",
              valueTypeValue: "centPrecision",
            },
            {
              pricesCountry: "variants.prices.country",
              pricesCountryValue: "US",
            },
            {
              fractionDigits: "variants.prices.value.fractionDigits",
              fractionDigitsValue: "2",
            },
            {
              centAmount: "variants.prices.value.centAmount",
              centAmountValue: productPrice,
            },
            {
              productTypeId: "productType.typeId",
              productTypeIdValue: "product-type",
            },
            { name: "name.en-US", nameValue: titleDetails },
            {
              slugEn: "slug.en-US",
              slugEnValue: `snowboardSlug10${linkNumber}`,
            },
            {
              variantsKey: "variants.key",
              variantKeyValue: `SNW-${linkNumber}-01`,
            },
            {
              taxCategoryKey: "taxCategory.key",
              taxCategoryKeyValue: `SnowboardTaxKey`,
            },
            {
              taxCategoryTypeId: "taxCategory.typeId",
              taxCategoryValue: "tax-category",
            },
          ];

          let attribElemList = document.querySelectorAll(".pdp-spec-list-item");
          let attribList = attribListParser(attribElemList);
          attribList.forEach(({ attTitle, attDesc }) => {
            ProductCard.push({ attTitle, attDesc });
          });
          let tableRows = document.querySelectorAll(".spec-table tr");
          let Specs = tableParser(tableRows);
          Specs[0].forEach(({ specName, specValue }) => {
            ProductCard.push({ specName, specValue });
          });
          return ProductCard;
        } catch (error) {
          console.log(linkNumber, error);
        }
      }, linkNumber);
      // console.log(ProductCard);
      // Get data from script
      let scriptParse = await itemPage.evaluate(() => {
        try {
          let scripts = document.querySelectorAll("script");
          let scriptContents = Array.from(scripts).map(
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
          let specsTerrain = document.querySelector(
            ".pdp-spec-list-description"
          );
          if (!specsTerrain) {
            specsTerrain = "All-Mountain";
          } else {
            specsTerrain = specsTerrain.textContent;
          }
          let terrainCat = specsTerrain.replace(/\s/g, "").split(",");
          return {
            abilityLevel: evoData?.abilityLevel || null,
            brand: evoData?.brand.replace(/\s/g, "") || null,
            ageGroup: evoData?.ageGroup || null,
            terrain: terrainCat || null,
          };
        } catch (error) {
          console.error(`Error occurred at `, error);
        }
      });
      // console.log("KEYS", Object.keys(scriptParse));
      // Format categories
      console.log(scriptParse);
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
        if (!scriptParse.abilityLevel) {
          scriptParse.abilityLevel = "Intermediate-Advanced";
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
      // console.log(createKeyValueArrays(Produ0ctCards));
    } catch (error) {
      console.error(`Error occurred at ${linkNumber}`, error);
    }
  }
  let formattedCategories = getCategories(allCategories);
  // Preparing data for export
  format.formatAndExportData(ProductCards, "ProductCards");
  format.formatAndExportData(formattedCategories, "Categories");
  await browser.close();
})();
