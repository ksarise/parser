const fs = require("fs");
const XLSX = require("xlsx");

function formatAndExportData(ProductCards, fileName) {
  function createKeyValueArrays(arrays) {
    let keysObj = {};

    arrays.forEach((array) => {
      array.forEach((pair) => {
        keysObj[pair[0]] = "";
      });
    });

    let keys = Object.keys(keysObj);

    let result = [];
    result.push(keys);

    arrays.forEach((array) => {
      let valuesArray = [];
      keys.forEach((key) => {
        let value = array.find((pair) => pair[0] === key);
        valuesArray.push(value ? value[1] : "");
      });
      result.push(valuesArray);
    });

    return result;
  }
  // CSV export
  let wb = XLSX.utils.book_new();
  let we = XLSX.utils.aoa_to_sheet(createKeyValueArrays(ProductCards));
  let csvContent = XLSX.utils.sheet_to_csv(we);
  let filePathCsv = `${fileName}.csv`;
  fs.writeFileSync(filePathCsv, csvContent);

  // Excel export
  // Column auto-size
  const columnSizes = [];
  we["!ref"].split(":").forEach((ref) => {
    const range = XLSX.utils.decode_range(ref);
    for (let i = range.s.c; i <= range.e.c; ++i) {
      let maxWidth = 0;
      for (let j = range.s.r; j <= range.e.r; ++j) {
        const cell = we[XLSX.utils.encode_cell({ r: j, c: i })];
        if (cell && cell.v) {
          const cellWidth = cell.v.toString().length;
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
          }
        }
      }
      columnSizes[i] = maxWidth;
    }
  });
  columnSizes.forEach((width, idx) => {
    if (width > 0) {
      we["!cols"] = we["!cols"] || [];
      we["!cols"][idx] = { wch: width + 2 };
    }
  });

  XLSX.utils.book_append_sheet(wb, we, fileName);
  let filePathExcel = `${fileName}.xlsx`;
  XLSX.writeFile(wb, filePathExcel);
  console.log(`data exported`);
}
module.exports = { formatAndExportData };
