let productDetails = [];
let details = document.querySelector(".pdp-content-section-body").children;
Array.from(details).forEach((element) => {
  let featureName = element.children[0].innerText.trim();
  let featureDescription = element.children[1].innerText.trim();
  productDetails.push({ featureName, featureDescription });
});
productDetails.forEach(({ featureName, featureDescription }) => {
  ProductCard.push({ featureName, featureDescription });
});
