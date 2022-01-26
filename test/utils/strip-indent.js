const minIndent = require("min-indent");

// copy of https://github.com/sindresorhus/strip-indent/blob/main/index.js
// just changing the f******* impl to use requires instead of esm
module.exports = (string) => {
  const indent = minIndent(string);

  if (indent === 0) {
    return string;
  }

  const regex = new RegExp(`^[ \\t]{${indent}}`, "gm");

  return string.replace(regex, "");
};
