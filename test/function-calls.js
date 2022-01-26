const plugin = require("babel-plugin-macros");
const { assert } = require("chai");
const transform = require("./utils/babel-transform");

describe("Function call transforms", function() {
  it("only transforms component calls", () => {
    const { actual, expected } = transform({
      plugin,
      filename: __filename,
      // language=JavaScript
      code: `
        import myMacro from '../index.macro.js'

        export const Component = () => {
          return myMacro(
            MyWrapper({
              children: [
                Foo({
                  bazz: bazz({
                    myComponent: anotherCall()
                  })
                }),
                Foo({
                  bazz: bazz({
                    myComponent: MyComponent()
                  })
                })
              ]
            })
          )
        }`,
      output: `
        export const Component = () => {
          return (
            <MyWrapper
              children={[
                <Foo
                  bazz={bazz({
                    myComponent: anotherCall(),
                  })}
                />,
                <Foo
                  bazz={bazz({
                    myComponent: <MyComponent />,
                  })}
                />,
              ]}
            />
          );
        };`,
    });

    assert.equal(actual, expected);
  });
});
