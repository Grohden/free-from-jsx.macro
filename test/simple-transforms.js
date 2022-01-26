const transform = require("./utils/babel-transform");
const plugin = require("babel-plugin-macros");
const { assert } = require("chai");

describe("Simple transforms", function() {
  it("transforms code preserving primitives", () => {
    const { actual, expected } = transform({
      plugin,
      filename: __filename,
      // language=JavaScript
      code: `
        import myMacro from '../index.macro.js'

        export const Component = () => {
          return myMacro(
            Foo({
              bar: 'baz',
              bazz: 1,
              bazz2: 2 + 2,
            })
          )
        }
      `,
      output: `
        export const Component = () => {
          return <Foo bar="baz" bazz={1} bazz2={2 + 2} />;
        };`,
    });

    assert.equal(actual, expected);
  });

  it("should transform nested component argument", () => {
    const { actual, expected } = transform({
      plugin,
      filename: __filename,
      // language=JavaScript
      code: `
        import myMacro from '../index.macro.js'

        export const Component = () => {
          return myMacro(
            Foo({
              bazz: Bazz()
            })
          )
        }`,
      output: `
        export const Component = () => {
          return <Foo bazz={<Bazz />} />;
        };`,
    });

    assert.equal(actual, expected);
  });

  it("should transform list of components", () => {
    const { actual, expected } = transform({
      plugin,
      filename: __filename,
      // language=JavaScript
      code: `
        import myMacro from '../index.macro.js'

        export const Component = () => {
          return myMacro(
            Foo({
              bazz: [Bazz(), Bazz()]
            })
          )
        }`,
      output: `
        export const Component = () => {
          return <Foo bazz={[<Bazz />, <Bazz />]} />;
        };`,
    });

    assert.equal(actual, expected);
  });
});
