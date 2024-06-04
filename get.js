var oauthUri = "https://auth.europe-west1.gcp.commercetools.com";
var baseUri = "https://api.europe-west1.gcp.commercetools.com";
var credentials = {
  clientId: "sAK0xMcXaPq2YP46ZbeB6yuG",
  clientSecret: "hGo-M6EDWQTdmUYjvPwW4TwGoAzxRgZv",
};
var projectKey = "cae-ecom-app";
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
      console.log(body.results[0].masterData.current.masterVariant.attributes);
      body.results[0].masterData.current.masterVariant.attributes.forEach(
        (attr) => {
          console.log(attr.name);
        }
      );
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
getCategories();

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
