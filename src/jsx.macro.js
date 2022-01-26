const { MacroError } = require("babel-plugin-macros");

// Macro that transform calls to JSX
module.exports = ({ references, babel }) => {
  const t = babel.types;

  function isComponentCallExpression(expr) {
    if (!t.isCallExpression(expr)) {
      return false;
    }

    const name = expr.callee.name;

    return name[0] === name[0].toUpperCase();
  }

  function makeElementDeclaration(identifier, props) {
    return t.jSXElement(
      t.jSXOpeningElement(
        t.jSXIdentifier(identifier),
        props,
        true,
      ),
      null,
      [],
    );
  }

  function makeElementAttribute(objectExpr) {
    return t.jSXAttribute(
      t.jSXIdentifier(objectExpr.key.name),
      t.isStringLiteral(objectExpr.value)
        ? objectExpr.value
        : t.jSXExpressionContainer(objectExpr.value),
    );
  }

  const transformVisitor = {
    CallExpression(callPath) {
      const node = callPath.node;

      if (!isComponentCallExpression(node)) {
        return;
      }

      callPath.replaceWith(makeElementDeclaration(
        node.callee.name,
        (node.arguments[0]?.properties || []).map(makeElementAttribute),
      ));
    },
  };

  references.default.forEach(nodePath => {
    const arguments = nodePath.container.arguments;

    if (arguments.length > 1) {
      throw new MacroError(`Macro expects only one argument (got ${arguments.length})`);
    }

    if (!t.isCallExpression(arguments[0])) {
      throw new MacroError("Macro argument must be a CallExpression");
    }

    nodePath.parentPath.traverse(transformVisitor);

    // FIXME: maybe there's a better way to remove macro call
    nodePath.parentPath.replaceWith(nodePath.container.arguments[0]);
  });
};
