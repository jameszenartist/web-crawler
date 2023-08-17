const { NormalizeURL, getURLsFromHTML } = require("../utils/crawl.js");
const { test, expect } = require("@jest/globals");

test("NormalizeURL strip protocol", () => {
  const input = "https://syntaxsamurai.com/about";
  const actual = NormalizeURL(input);
  const expected = "syntaxsamurai.com/about";
  expect(actual).toEqual(expected);
});

test("NormalizeURL strip trailing slash", () => {
  const input = "https://syntaxsamurai.com/about/";
  const actual = NormalizeURL(input);
  // expected protocol to be striped away
  const expected = "syntaxsamurai.com/about";
  expect(actual).toEqual(expected);
});

test("NormalizeURL capitals", () => {
  const input = "https://SYNTAXSAMURAI.com/about";
  const actual = NormalizeURL(input);
  const expected = "syntaxsamurai.com/about";
  expect(actual).toEqual(expected);
});

test("NormalizeURL strip http", () => {
  const input = "http://syntaxsamurai.com/about";
  const actual = NormalizeURL(input);
  const expected = "syntaxsamurai.com/about";
  expect(actual).toEqual(expected);
});

//===

test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
  <html>
  <body>
  <a href="https://syntaxsamurai.com/">
  Syntaxsamurai Blog
  </a>
  </body>
  </html>
  `;
  const inputBaseURL = `https://syntaxsamurai.com/`;
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://syntaxsamurai.com/"];
  expect(actual).toEqual(expected);
});

//relative path doesn't include domain & protocol

test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
  <html>
  <body>
  <a href="/path/">
  Syntaxsamurai Blog
  </a>
  </body>
  </html>
  `;
  const inputBaseURL = `https://syntaxsamurai.com`;
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://syntaxsamurai.com/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", () => {
  const inputHTMLBody = `
  <html>
  <body>
  <a href="https://syntaxsamurai.com/path1/">
  Syntaxsamurai.com Blog Path One
  </a>
  <a href="/path2/">
  Syntaxsamurai.com Blog Path Two
  </a>
  </body>
  </html>
  `;
  const inputBaseURL = `https://syntaxsamurai.com`;
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://syntaxsamurai.com/path1/",
    "https://syntaxsamurai.com/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid", () => {
  const inputHTMLBody = `
  <html>
  <body>
  <a href="invalid">
  Invalid URL
  </a>
  </body>
  </html>
  `;
  const inputBaseURL = `https://syntaxsamurai.com`;
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
