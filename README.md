# free-from-jsx.macro

A [babel macro](https://github.com/kentcdodds/babel-plugin-macros) that transforms flutter render like syntax to jsx,
allowing you to write react components almost without JSX:

> Note: this is a proof of concept, and is not meant to be used in production. For that reason I'm
> not currently planing into publishing this in npm.

## What it does?

Transforms this:

```js
import ffj from 'free-from-jsx.macro'

const MyComponent = () => ffj(
  View({
    children: [
      Text({ children: ['Hello World'] }),
    ],
  })
);
```

Into this:

```jsx
const MyComponent = () => (
  <View
    children={[
      <Text>Hello World</Text>
    ]}
  />
);
```

# Plans

* We could consider compiling directly to createReactElement calls:

All tooling may be better working with JSX... for example, preserving JSX allows
plugin-transform-react-constant-elements to keep working properly

* Implement a way to transform DOM elements:

Currently, the plugin treats all the lowercase started CallExpressions as only function calls, and therefore things
like `div()` `span()` etc. are not transformed.

# Current problems

### DOM elements

Like said above, DOM elements seems to be treated differently in JSX, so currently it's not possible to use them (unless
you rename them with PascalCase)... its ambiguous whether they are functions or components:

```js
MyComponent({
  children: [
    // In the future we will assume some reserved keywords 
    // to be DOM elements and threat them differently
    div({ children: ["Hello World"] }),

    // Not started with upper case letter, we assume it as a function call
    myCall({ children: ["Hello World"] }),

    // Started with upper case letter, we assume it as a component
    MyOtherComp()
  ]
})
```

### Class components and ts

Typescript will not be happy with "calling a class", so if a component is declared as class for TS, it will not type
check unfortunately

### Keys

I don't know why, but using children as prop instead of implicit makes react complain about requiring keys.

```js
<Component
  children={[
    // react complains about elements not having keys...
    <div>Hello World</div>,
    <div>Hello World</div>,
  ]}
/>
```

# Motivations

I personally don't like JSX (XML stuff in general), and having worked with flutter previously I miss how good is to
compose components in it, while we can do the same composition with JSX, it's just unreadable to have nested trees of
components with JSX that uses child slots other than `children`:

```jsx
const MyComponent = () => {
  return (
    <Foo
      title={
        <Wrap
          text={<ContextText>Hello World</ContextText>}
        />
      }
      content={[
        <SectionStyleProvider style={styles.section}>
          <RedBox
            topContent={
              <Wrap
                text={<ContextText>Hello World</ContextText>}
              />
            }
          />
          <BlueBox
            bottomContent={
              <Wrap
                text={<ContextText>Hello World</ContextText>}
              />
            }
          />
        </SectionStyleProvider>,
      ]}
    />
  );
};
```

# Some references and maybe inspirations:

* https://www.npmjs.com/package/@ts-delight/fluent-react.macro
* https://github.com/davidyu85/Tersus-JSX/blob/master/src/tersus-jsx.macro.js

