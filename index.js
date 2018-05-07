const { parse, walk } = require('./src/parser')
const AbstractSyntaxTree = require('@buxlabs/ast')
const { TEMPLATE_VARIABLE, OBJECT_VARIABLE, ESCAPE_VARIABLE } = require('./src/enum')
const { getTemplateVariableDeclaration, getTemplateReturnStatement } = require('./src/factory')
const collect = require('./src/collect')

module.exports = {
  render () {},
  compile (source) {
    const htmltree = parse(source)
    const tree = new AbstractSyntaxTree('')
    const variables = [
      TEMPLATE_VARIABLE,
      OBJECT_VARIABLE,
      ESCAPE_VARIABLE
    ]
    const modifiers = []
    tree.append(getTemplateVariableDeclaration())
    walk(htmltree, fragment => {
      collect(tree, fragment, variables, modifiers)
    })
    // modifiers.forEach(modifier => {
      tree.prepend({
        type: 'FunctionDeclaration',
        id: {
          type: 'Identifier',
          name: 'uppercase'
        },
        params: [{
          type: 'Identifier',
          name: 'string'
        }],
        body: {
          type: 'BlockStatement',
          body: [{
            type: 'ReturnStatement',
            argument: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'string'
                },
                property: {
                  type: 'Identifier',
                  name: 'toUpperCase'
                },
                computed: false
              },
              arguments: []
            }
          }]
        }
      })
    // })
    tree.append(getTemplateReturnStatement())
    const body = tree.toString()
    return new Function(OBJECT_VARIABLE, ESCAPE_VARIABLE, body) // eslint-disable-line
  }
}
