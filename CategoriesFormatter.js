function getCategories(allCategories) {
  const catnamesArray = allCategories.map((category) =>
    category.catnames.split(";")
  );
  const uniqueCatnames = new Set(catnamesArray.flat());
  const uniqueCatnamesArray = Array.from(uniqueCatnames);
  function capitalizeFirstLetterAge(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  let CategoryCards = [];
  uniqueCatnames.forEach((category, index) => {
    let categoryCard = [
      { dataObject: "data-object", variant: "category" },
      { key: "key", categoryKey: `${category}Key` },
      { name: "description.en-US", productName: `${category}Description` },
      { id: "externalId", categoryId: `${category}Id` },
      { name: "name.en-US", productName: capitalizeFirstLetterAge(category) },
      { slugEn: "slug.en-US", slugEnName: `${category}Slug` },
    ];
    let dataArray = categoryCard.map((obj) => Object.values(obj));
    CategoryCards.push(dataArray);
  });
  console.log("Formatted", typeof CategoryCards, CategoryCards);
  return CategoryCards;
}
module.exports = { getCategories };
