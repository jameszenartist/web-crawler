// formats pages object
function printReport(pages) {
  console.log("========");
  console.log("REPORT");
  console.log("========");
  const sortedPages = sortPages(pages);

  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const linkCount = sortedPage[1];

    console.log(
      `Found ${linkCount} ${linkCount < 2 ? "link" : "links"} to page ${url}`
    );
  }
  console.log("========");
  console.log("END REPORT");
  console.log("========");
}

function sortPages(pages) {
  // sort the tuples from highest to lowest
  return Object.entries(pages).sort((a, b) => b[1] - a[1]);
}

module.exports = { sortPages, printReport };
