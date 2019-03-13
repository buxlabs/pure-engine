const AbstractSyntaxTree = require('abstract-syntax-tree')
const { convertKey } = require('../convert')

module.exports = function ({ fragment, tree, attrs, variables, depth, collectChildren }) {
  let leaf = tree.last(`IfStatement[depth="${depth}"]`)
  if (leaf) {
    const ast = new AbstractSyntaxTree('')
    collectChildren(fragment, ast)
    while (leaf.alternate && leaf.alternate.type === 'IfStatement') {
      leaf = leaf.alternate
    }
    const { key } = attrs[0]
    leaf.alternate = {
      type: 'IfStatement',
      test: {
        type: 'UnaryExpression',
        operator: '!',
        prefix: true,
        argument: convertKey(key, variables)
      },
      consequent: {
        type: 'BlockStatement',
        body: ast.body
      },
      depth
    }
  }
}
