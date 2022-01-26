const babel = require("@babel/core");
const os = require("os");
const stripIndent = require("./strip-indent");
const prettierFormatter = require("./prettier");

const fixEOL = (str) => str.replace(/\r?\n/g, os.EOL).trim();

// Based on babel-plugin-tester
module.exports = ({
  plugin,
  filename,
  code: inputCode,
  output: expectedOutput,
}) => {
  const effectiveCode = stripIndent(inputCode).trim();
  const actualOutput = babel.transform(stripIndent(effectiveCode).trim(), {
    plugins: [plugin],
    filename,
    parserOpts: {},
    generatorOpts: {},
    babelrc: false,
    configFile: false,
  }).code;

  return {
    actual: fixEOL(prettierFormatter(actualOutput)),
    expected: fixEOL(stripIndent(expectedOutput)),
  };
};
