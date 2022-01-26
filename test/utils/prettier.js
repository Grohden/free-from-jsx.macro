const path = require("path");
const prettier = require("prettier");

// Based on babel-plugin-tester
const configByDir = {};
function getConfig(dir) {
  if (!configByDir.hasOwnProperty(dir)) {
    configByDir[dir] = prettier.resolveConfig.sync(dir);
  }
  return configByDir[dir];
}

module.exports = (
  code,
  {
    cwd = process.cwd(),
    filename = path.join(cwd, "macro-test.js"),
    config = getConfig(cwd),
  } = {},
) => {
  return prettier.format(code, {
    filepath: filename,
    ...config,
  });
};
