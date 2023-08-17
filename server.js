const { crawlPage } = require("./utils/crawl.js");
const { printReport } = require("./utils/report.js");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }

  if (process.argv.length > 3) {
    console.log("too many command line args");
    process.exit(1);
  }

  const baseURL = process.argv[2];

  // for (const arg of process.argv) {
  //   console.log(arg);
  // }

  console.log(`starting crawl of: ${baseURL}\n`);

  const pages = await crawlPage(baseURL, baseURL, {});

  // for (const page of Object.entries(pages)) {
  //   console.log(page);
  // }
  printReport(pages);
}

main();
