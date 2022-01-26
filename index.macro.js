const { createMacro } = require("babel-plugin-macros");
const toJSXMacro = require("./src/jsx.macro");

module.exports = createMacro(toJSXMacro);
