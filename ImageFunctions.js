const fs = require("fs");
const path = require("path");
function saveImagesToFolder(images, folderName, fileName) {
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    let imageName;
    if (!fileName) {
      imageName = path.basename(imageUrl);
    } else {
      imageName = `${i}.jpg`;
    }
    const viewSource = itemPage.goto(imageUrl);
    const buffer = viewSource.buffer();
    fs.writeFileSync(path.join(folderName, imageName), buffer);
  }
}

module.exports = { saveImagesToFolder };
