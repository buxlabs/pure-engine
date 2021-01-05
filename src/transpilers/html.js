'use strict'

const AbstractSyntaxTree = require('abstract-syntax-tree')
const { parse } = require('../utilities/html')

const {
  ArrayExpression,
  BlockStatement,
  CallExpression,
  Identifier,
  IfStatement,
  Literal,
  ObjectExpression,
  Property,
  ReturnStatement
} = AbstractSyntaxTree

const program = (body) => {
  return AbstractSyntaxTree.program(
    AbstractSyntaxTree.template(`
      import { tag } from "boxwood"

      export default function () {
        return <%= body %>
      }
    `, { body })
  )
}

function reduce ({ node: htmlNode, parent, index }) {
  function mapAttributes (attributes) {
    return attributes.length > 0 && new ObjectExpression({
      properties: attributes.map(attribute => {
        return new Property({
          key: new Identifier({
            name: attribute.key
          }),
          value: new Literal({
            value: attribute.value
          }),
          kind: 'init',
          computed: false,
          method: false,
          shorthand: false
        })
      })
    })
  }
  function mapChildren (children) {
    return children.length > 0 && new ArrayExpression({
      elements: children.map((childNode, index) => {
        return reduce({ node: childNode, parent: children, index })
      }).filter(Boolean)
    })
  }
  function mapIfStatement (htmlNode, parent, index) {
    function mapAttributesToTest ({ attributes }) {
      if (attributes.length === 1) {
        if (attributes[0].key === 'true') {
          return new Literal({ value: true })
        } else if (attributes[0].key === 'false') {
          return new Literal({ value: false })
        }
      }
      throw new Error('unsupported')
    }

    function mapCurrentNodeToConsequent (htmlNode) {
      const body = htmlNode.children.map((node, index) => reduce({ node, parent: htmlNode.children, index })).filter(Boolean)
      const argument = body.pop()
      body.push(new ReturnStatement({ argument }))
      return new BlockStatement({ body })
    }

    function mapNextNodeToAlternate (nextNode) {
      if (nextNode && nextNode.tagName === 'else') {
        const body = nextNode.children.map((node, index) => reduce({ node, parent: nextNode.children, index })).filter(Boolean)
        const argument = body.pop()
        body.push(new ReturnStatement({ argument }))
        return new BlockStatement({ body })
      }
      return null
    }

    return new IfStatement({
      test: mapAttributesToTest(htmlNode),
      consequent: mapCurrentNodeToConsequent(htmlNode),
      alternate: mapNextNodeToAlternate(parent[index + 1])
    })
  }

  if (htmlNode.type === 'element' && htmlNode.tagName === 'div') {
    const { tagName, attributes, children } = htmlNode
    const node = new CallExpression({
      callee: new Identifier({ name: 'tag' }),
      arguments: [
        new Literal({ value: tagName }),
        mapAttributes(attributes),
        mapChildren(children)
      ].filter(Boolean)
    })
    return node
  } else if (htmlNode.type === 'element' && htmlNode.tagName === 'if') {
    const [node] = AbstractSyntaxTree.template(`
      (function () {
        <%= body %>
      }())
    `, { body: mapIfStatement(htmlNode, parent, index) })
    return node.expression
  } else if (htmlNode.type === 'element' && htmlNode.tagName === 'else') {
    return null
  } else if (htmlNode.type === 'text') {
    const { content } = htmlNode
    return new Literal({ value: content })
  }
}

function transpile (source, options) {
  const tree = parse(source)
  const reducedTree = tree.length === 1
    ? reduce({ node: tree[0], parent: tree, index: 0 })
    : new ArrayExpression({
      elements: tree
        .map((node, index) => reduce({ node, parent: tree, index }))
        .filter(Boolean)
    })
  return new AbstractSyntaxTree(
    program(reducedTree)
  ).source
}

module.exports = { transpile }