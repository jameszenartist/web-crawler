const { JSDOM } = require("jsdom");

//baseURL is starting point/home page
//pages obj keeps track of all pages visited
// need to make sure currentURL is on same domain as baseURL
async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  // base cases where links are external to site
  // or that we're hitting links we've already crawled

  //this allows us to keep track of all pages
  // checks for external links on page
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  // will check if normalizedCurrentURL is in
  // pages object
  const normalizedCurrentURL = NormalizeURL(currentURL);

  // when generating a report, this can tell the user
  // in the report how many times the page is linked
  // to on the site
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  //only logs when crawling new page
  console.log(`actively crawling: ${currentURL}\n`);

  try {
    const response = await fetch(currentURL);

    // check if 200 level status code
    // shouldn't be in 400-500 status codes
    if (response.status > 399) {
      console.log(
        `error in fetch with status code: ${response.status} on page: ${currentURL}\n`
      );
      return pages;
    }

    //to ensure that text contains HTML:
    // grabbing content type headers
    const contentType = response.headers.get("Content-Type");
    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content type : ${contentType}, on page: ${currentURL}\n`
      );
      return pages;
    }
    // parsing expected HTML as text

    const htmlBody = await response.text();
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    // recursively crawl pages
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.log(`error in fetch: ${error.message} on page: ${currentURL}\n`);
  }
  return pages;
}

// htmlBody is a str that reps some HTML
// baseURL reps the URL of site we're crawling
// purpose is to grab all clickable links on
// page & return all in array of strings
function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // this is a relative url
      // if string not valid url, will throw error
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with relative url: ${err.message}\n`);
      }
    } else {
      // absolute path
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with absolute url: ${err.message}\n`);
      }
    }
  }
  return urls;
}

function NormalizeURL(urlString) {
  // using url constructor
  // constructor already knows to lowercase
  // URLs just in case
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  // logic trims possible trailing slash in path
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  NormalizeURL,
  getURLsFromHTML,
  crawlPage,
};
