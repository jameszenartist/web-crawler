const { sortPages } = require("../utils/report.js");
const { test, expect } = require("@jest/globals");

test("sortPages", () => {
  const input = {
    "https://syntaxsamurai.com": 1,
  };
  const actual = sortPages(input);
  const expected = [["https://syntaxsamurai.com", 1]];
  expect(actual).toEqual(expected);
});
