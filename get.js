var oauthUri = "https://auth.europe-west1.gcp.commercetools.com";
var baseUri = "https://api.europe-west1.gcp.commercetools.com";
var credentials = {
  clientId: "sAK0xMcXaPq2YP46ZbeB6yuG",
  clientSecret: "hGo-M6EDWQTdmUYjvPwW4TwGoAzxRgZv",
};
var projectKey = "cae-ecom-app";
const fs = require("fs").promises;
const { ClientBuilder } = require("@commercetools/sdk-client-v2");
const {
  ApiRoot,
  createApiBuilderFromCtpClient,
} = require("@commercetools/platform-sdk");
const client = new ClientBuilder()
  .defaultClient(baseUri, credentials, oauthUri, projectKey)
  .build();

const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
  projectKey,
});
const productTypeDraft = {
  key: "custom-product-type",
  name: "Custom Product Type",
  description: "A custom product type for demonstration purposes",
  attributes: [
    {
      type: {
        name: "enum",
        values: [
          {
            key: "Camber-Rocker-Camber",
            label: "Camber/Rocker/Camber",
          },
          {
            key: "Rocker-Camber-Rocker",
            label: "Rocker/Camber/Rocker",
          },
        ],
      },
      name: "RockerType-2",
      label: {
        en: "RockerType:",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "TrueTwin",
            label: "True Twin",
          },
          {
            key: "Asymmetrical-TrueTwin",
            label: "Asymmetrical, True Twin",
          },
        ],
      },
      name: "Shape-2",
      label: {
        en: "Shape:",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "Stiff",
            label: "Stiff",
          },
          {
            key: "Soft",
            label: "Soft",
          },
        ],
      },
      name: "FlexRating-2",
      label: {
        en: "FlexRating:",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "2x4",
            label: "2x4",
          },
        ],
      },
      name: "BindingMountPattern-2",
      label: {
        en: "BindingMountPattern:",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "Basalt-Wood",
            label: "Basalt, Wood",
          },
          {
            key: "Bamboo-Carbon-Wood",
            label: "Bamboo, Carbon, Wood",
          },
        ],
      },
      name: "Core-Laminates-2",
      label: {
        en: "Core-Laminates:",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "Magne-Traction",
            label: "Magne-Traction",
          },
        ],
      },
      name: "EdgeTech-2",
      label: {
        en: "EdgeTech:",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "Yes",
            label: "Yes",
          },
        ],
      },
      name: "MadeintheUSA-2",
      label: {
        en: "MadeintheUSA:",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "1Year",
            label: "1 Year",
          },
          {
            key: "3Years",
            label: "3 Years",
          },
        ],
      },
      name: "Warranty-2",
      label: {
        en: "Warranty:",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "153",
            label: "153",
          },
          {
            key: "155",
            label: "155",
          },
          {
            key: "157",
            label: "157",
          },
          {
            key: "157W",
            label: "157W",
          },
          {
            key: "159",
            label: "159",
          },
          {
            key: "161",
            label: "161",
          },
          {
            key: "161W",
            label: "161W",
          },
          {
            key: "164",
            label: "164",
          },
          {
            key: "164W",
            label: "164W",
          },
          {
            key: "136",
            label: "136",
          },
          {
            key: "142",
            label: "142",
          },
          {
            key: "148",
            label: "148",
          },
          {
            key: "151",
            label: "151",
          },
          {
            key: "154",
            label: "154",
          },
          {
            key: "156W",
            label: "156W",
          },
        ],
      },
      name: "SpecsSize2",
      label: {
        en: "SpecsSize",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "1185",
            label: "1185",
          },
          {
            key: "1190",
            label: "1190",
          },
          {
            key: "1210",
            label: "1210",
          },
          {
            key: "1220",
            label: "1220",
          },
          {
            key: "1245",
            label: "1245",
          },
          {
            key: "1270",
            label: "1270",
          },
        ],
      },
      name: "SpecsEffectiveEdge2",
      label: {
        en: "SpecsEffectiveEdge",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "295",
            label: "295",
          },
          {
            key: "298",
            label: "298",
          },
          {
            key: "301",
            label: "301",
          },
          {
            key: "305",
            label: "305",
          },
          {
            key: "302",
            label: "302",
          },
          {
            key: "304",
            label: "304",
          },
          {
            key: "311",
            label: "311",
          },
          {
            key: "310",
            label: "310",
          },
          {
            key: "312",
            label: "312",
          },
          {
            key: "287",
            label: "287",
          },
          {
            key: "307",
            label: "307",
          },
          {
            key: "314",
            label: "314",
          },
          {
            key: "320",
            label: "320",
          },
          {
            key: "328",
            label: "328",
          },
          {
            key: "323",
            label: "323",
          },
        ],
      },
      name: "SpecsTipWidth2",
      label: {
        en: "SpecsTipWidth",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "",
            label: "",
          },
          {
            key: "263",
            label: "263",
          },
          {
            key: "265",
            label: "265",
          },
          {
            key: "267",
            label: "267",
          },
          {
            key: "240",
            label: "240",
          },
          {
            key: "250",
            label: "250",
          },
          {
            key: "257",
            label: "257",
          },
          {
            key: "268",
            label: "268",
          },
          {
            key: "275",
            label: "275",
          },
          {
            key: "270",
            label: "270",
          },
        ],
      },
      name: "SpecsWaistWidth2",
      label: {
        en: "SpecsWaistWidth",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "295",
            label: "295",
          },
          {
            key: "298",
            label: "298",
          },
          {
            key: "301",
            label: "301",
          },
          {
            key: "305",
            label: "305",
          },
          {
            key: "302",
            label: "302",
          },
          {
            key: "304",
            label: "304",
          },
          {
            key: "311",
            label: "311",
          },
          {
            key: "310",
            label: "310",
          },
          {
            key: "312",
            label: "312",
          },
          {
            key: "287",
            label: "287",
          },
          {
            key: "307",
            label: "307",
          },
          {
            key: "314",
            label: "314",
          },
          {
            key: "320",
            label: "320",
          },
          {
            key: "328",
            label: "328",
          },
          {
            key: "323",
            label: "323",
          },
        ],
      },
      name: "SpecsTailWidth2",
      label: {
        en: "SpecsTailWidth",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "8",
            label: "8",
          },
          {
            key: "8-1",
            label: "8.1",
          },
          {
            key: "8-2",
            label: "8.2",
          },
          {
            key: "8-3",
            label: "8.3",
          },
          {
            key: "8-4",
            label: "8.4",
          },
          {
            key: "8-5",
            label: "8.5",
          },
          {
            key: "6-2--5-3-5-2--4-3-6-2--5-3",
            label: "6.2​/5.3, 5.2​/4.3, 6.2​/5.3",
          },
          {
            key: "6-4--5-5-5-4--4-5-6-4--5-5",
            label: "6.4​/5.5, 5.4​/4.5, 6.4​/5.5",
          },
          {
            key: "6-6--5-7-5-6--4-7-6-6--5-7",
            label: "6.6​/5.7, 5.6​/4.7, 6.6​/5.7",
          },
          {
            key: "6-8--5-8-5-8--4-8-6-8--5-8",
            label: "6.8​/5.8, 5.8​/4.8, 6.8​/5.8",
          },
          {
            key: "6-9--5-9-5-9--4-9-6-9--5-8",
            label: "6.9​/5.9, 5.9​/4.9, 6.9​/5.8",
          },
          {
            key: "7--6-6--5-7--6",
            label: "7​/6, 6​/5, 7​/6",
          },
        ],
      },
      name: "SpecsSidecutRadius2",
      label: {
        en: "SpecsSidecutRadius",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "0",
            label: "0",
          },
        ],
      },
      name: "SpecsStanceSetback2",
      label: {
        en: "SpecsStanceSetback",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "4-75",
            label: "4.75",
          },
        ],
      },
      name: "SpecsStanceRange2",
      label: {
        en: "SpecsStanceRange",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "Regular",
            label: "Regular",
          },
          {
            key: "Wide",
            label: "Wide",
          },
        ],
      },
      name: "SpecsWidth2",
      label: {
        en: "SpecsWidth",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
    {
      type: {
        name: "enum",
        values: [
          {
            key: "60-130",
            label: "60-130",
          },
          {
            key: "100-175",
            label: "100-175",
          },
          {
            key: "130-190",
            label: "130-190",
          },
          {
            key: "140-200",
            label: "140-200",
          },
          {
            key: "170-220--",
            label: "170-220​+",
          },
          {
            key: "160-220--",
            label: "160-220​+",
          },
        ],
      },
      name: "SpecsRiderWeight2",
      label: {
        en: "SpecsRiderWeight",
      },
      isRequired: false,
      attributeConstraint: "None",
      isSearchable: true,
    },
  ],
};
let jsonData;
async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading or parsing file:", err);
    throw err; // Re-throw the error to handle it in the calling function
  }
}
async function init() {
  try {
    jsonData = await readJSONFile("output.json");
    console.log("Data successfully read and placed into variable:", jsonData);
    // Now you can call another function and use jsonData
    console.log(jsonData);
  } catch (err) {
    console.error("Error initializing data:", err);
  }
}
init().then(() => {
  createProductType();
});
console.log(jsonData);
async function createProductType() {
  const response = await apiRoot
    .productTypes()
    .post({
      body: jsonData,
    })
    .execute();
  console.log("BODY", response.body);
}

function getProductTypes() {
  const productTypeKeyOrId = "custom-product-type";
  apiRoot
    .productTypes()
    .withKey({ key: productTypeKeyOrId })
    .get()
    .execute()
    .then(function ({ body }) {
      console.log(body);
      const productType = body;

      console.log(`Product Type: ${productType.name}`);
      console.log(`Description: ${productType.description}`);
      console.log("Attributes:");

      productType.attributes.forEach((attribute) => {
        console.log(`  - Name: ${attribute.name}`);
        console.log(`    Label: ${attribute.label.en}`);
        console.log(`    Is Required: ${attribute.isRequired}`);
        console.log(`    Is Searchable: ${attribute.isSearchable}`);
        console.log(
          `    Attribute Constraint: ${attribute.attributeConstraint}`
        );

        // Check if the attribute type is enum and display its values
        if (attribute.type.name === "enum") {
          console.log("    Enum Values:");
          attribute.type.values.forEach((value) => {
            console.log(`      - Key: ${value.key}, Label: ${value.label}`);
          });
        }
      });
    })
    .catch(function (error) {
      console.error("Error creating product type:", error);
    });
}
// getProductTypes();
function getProjectDetails() {
  apiRoot
    .get()
    .execute()
    .then(function ({ body }) {
      // console.log(JSON.stringify(body));
    });
}
function getProducts() {
  apiRoot
    .products()
    .get()
    .execute()
    .then(function ({ body }) {
      console.log(body.results[19].masterData.current.masterVariant.attributes);
      // body.results.forEach((element) => {
      //   console.log(element.masterData.current.name["en-US"]);
      // });
    })
    .catch(function (error) {
      console.error("Error fetching products:", error);
    });
}
// getProducts();
function getCategories() {
  apiRoot
    .categories()
    .get()
    .execute()
    .then(function ({ body }) {
      body.results.forEach((element) => {
        if (!element.parent) {
          console.log("main category", element.name["en-US"], element.id);
        } else {
          console.log(element.name["en-US"], "parent id", element.parent.id);
        }
      });
    })
    .catch(function (error) {
      console.error("Error fetching products:", error);
    });
}

function getFilterProducts(filters = {}) {
  const { categoryIds = [], attributes = {} } = filters;

  let query = [];

  // Add category filters
  if (categoryIds.length > 0) {
    const categoryFilter = categoryIds
      .map((categoryId) => `categories(id="${categoryId}")`)
      .join(" or ");
    query.push(`masterData(current(${categoryFilter}))`);
  }

  // Add attribute filters
  if (Object.keys(attributes).length > 0) {
    const attributeFilters = Object.entries(attributes)
      .map(([key, value]) => `attributes(name="${key}" and value="${value}")`)
      .join(" and ");

    query.push(`masterData(current(masterVariant(${attributeFilters})))`);
  }

  // Combine category and attribute filters with "and"
  const queryString = query.join(" and ");

  apiRoot
    .products()
    .get({ queryArgs: { where: queryString } })
    .execute()
    .then(function ({ body }) {
      body.results.forEach((element) => {
        console.log(
          // element.masterData.current.name["en-US"],
          element.masterData.current.masterVariant.attributes
        );
        element.masterData.current.masterVariant.attributes.forEach((attr) => {
          console.log(attr.name);
        });
      });
    })
    .catch(function (error) {
      console.error("Error fetching products:", error);
    });
}

const filters = {
  categoryIds: ["3daa511b-ecc5-433d-8661-27f8565d81ce"],
  attributes: {
    Size: "138",
  },
};

// getFilterProducts(filters);
// { 'en-US': 'Advanced-Expert' } { id: '087f2dc1-0d39-4785-bf6a-e45f2b97bb97' }
// { 'en-US': 'LibTech' } { id: '9c393b21-2d93-4895-848c-02117bc26b3e' }
// { 'en-US': 'Adult-male' } { id: '07788de1-155d-4299-a3da-1faded7b52a9' }
// { 'en-US': 'Freestyle' } { id: '62afad2d-349f-4bc6-b33d-d69294521a9b' }
// { 'en-US': 'All-Mountain' } { id: '441d95e2-71c7-4508-ae11-cc9593f4cb0c' }
// { 'en-US': 'Freeride' } { id: 'ab20b56d-b8db-4822-b439-21707a5ebc6f' }
// { 'en-US': 'Intermediate-Advanced' } { id: '7fdb84ab-6188-45d2-9561-c9bed6154467' }
// { 'en-US': 'Ride' } { id: '3daa511b-ecc5-433d-8661-27f8565d81ce' }
// { 'en-US': 'Adult-any' } { id: '9bda10b0-2fb8-43d9-90df-3ffa6a26cb16' }
// { 'en-US': 'AbilityLevel' } { id: '8dd66922-e631-4d07-b35e-42958b7f949e' }
// { 'en-US': 'Brand' } { id: 'efc8f4aa-2f3f-4e68-a905-9e0f79a26594' }
// { 'en-US': 'AgeGroup' } { id: '8fe8f4c6-7e11-4e55-963f-a0ae4e1534d3' }
// { 'en-US': 'Terrain' } { id: 'fc6e9320-b0a9-447b-9e03-a599700bf536' }
// { 'en-US': 'CAPiTA' } { id: 'bc4912ad-fd98-4287-bcb7-8e11e4efbe42' }
// { 'en-US': 'Season' } { id: '8822c331-f8ae-458b-be95-d511aea158a9' }
// { 'en-US': 'Powder' } { id: 'c26ae1c9-ac8c-4ebb-b65c-97fd3a198e05' }
// { 'en-US': 'Beginner-Intermediate' } { id: 'dede6a4b-9348-4d31-86fd-bdab9d05c845' }
// { 'en-US': 'Rossignol' } { id: '35a112bf-182b-4cb2-948e-dd27bfc0aa01' }
// { 'en-US': 'Adult-female' } { id: 'e7b30d52-7126-49ea-97a6-b64cf33e6381' }
// { 'en-US': 'K2' } { id: '5bf0e805-9251-4be2-b14a-6b3e5b7009ad' }

// private createAttributes (name: string, value: string, parentElem: HTMLElement) {
//   const attrFeature= tags.div(['product__attr']).getElement()
//   const attrName = tags.p(['product__attr-name'], name);
//   const attrValue = tags.p(['product__attr-value'], value);
//   attrFeature.append(attrName, attrValue);
//   parentElem.append(attrFeature);

// }
// private renderAttrContainer (current: ProductData) {
//   const attrContainer = tags.div(['product__attr-container']).getElement();
//   current.masterVariant.attributes?.forEach((attr) => {
//     this.createAttributes(attr.name, attr.value, attrContainer);
//   })
//   this.descriptionContainer.append(attrContainer);
// }
