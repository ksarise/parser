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
      console.log(JSON.stringify(body));
    });
}
function getProducts() {
  apiRoot
    .products()
    .get()
    .execute()
    .then(function ({ body }) {
      var productCount = body.total;
      console.log(productCount);
      body.results.forEach(function (product) {
        var productName = product.masterData.current.name["en-US"];
        console.log(productName);
      });
    })
    .catch(function (error) {
      console.error("Error fetching products:", error);
    });
}
// getProducts();
