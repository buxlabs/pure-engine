const test = require('ava')
const compile = require('../../helpers/deprecated-compile')
const path = require('path')
const { escape } = require('../../..')

test('components: tag', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return tag("a")
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a></a>')
})

test('components: tag in an array', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return tag("a")
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a></a>')
})

test('components: tag with an attribute', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return tag("a", { href: "#foo" })
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a href="#foo"></a>')
})

test('components: two tags in an array', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return [
        tag("a"),
        tag("a")
      ]
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a></a><a></a>')
})

test('components: three tags in an array', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return [
        tag("a"),
        tag("a")
      ]
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a></a><a></a>')
})

test('components: tag with a child', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return tag("a", "foo")
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a>foo</a>')
})

test('components: tag with children', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return tag("a", [
        tag("strong", "foo"),
        "bar"
      ])
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a><strong>foo</strong>bar</a>')
})

test('components: tag with nested children', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return tag("div", [
        tag("a", [
          tag("strong", "foo"),
          "bar"
        ])
      ])
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<div><a><strong>foo</strong>bar</a></div>')
})

test('components: tag with attributes and children', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    export default function () {
      return tag("a", { href: "#foo" }, [
        tag("strong", "bar"),
        "baz"
      ])
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a href="#foo"><strong>bar</strong>baz</a>')
})

test('components: binary expression as a child', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    const name = "world"

    export default function () {
      return tag("p", "Hello, " + name + "!")
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<p>Hello, world!</p>')
})

test('component: template literal as a child', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    const name = "world"

    export default function () {
      return tag("p", \`Hello, \${name}!\`)
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<p>Hello, world!</p>')
})

test('component: identifier as a child', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    const name = "Hello, world!"

    export default function () {
      return tag("p", name)
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<p>Hello, world!</p>')
})

test('components: tag with an attribute and template literal as a child', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    const name = "world"

    export default function () {
      return tag("a", { href: "#foo" }, \`Hello, \${name}!\`)
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a href="#foo">Hello, world!</a>')
})

test('components: tag with an attribute and identifier as a child', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'

    const name = "Hello, world!"

    export default function () {
      return tag("a", { href: "#foo" }, name)
    }
  `, {
    paths: [],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a href="#foo">Hello, world!</a>')
})

test('components: tag and an external dependency', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'
    import { capitalize } from 'pure-utilities/string'

    export default function () {
      return tag("a", capitalize("foo"))
    }
  `, {
    paths: [path.join(__dirname, '../../../node_modules')],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a>Foo</a>')
})

test('components: import local utilities', async assert => {
  const { template } = await compile(`
    import { tag } from 'boxwood'
    import { capitalize } from 'utilities/string'

    export default function () {
      return tag('a', capitalize('foo'))
    }
  `, {
    paths: [
      path.join(__dirname, '../../../node_modules'),
      path.join(__dirname, '../../fixtures')
    ],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a>Foo</a>')
})

test('components: import local components', async assert => {
  const { template } = await compile(`
    import anchor from 'components/anchor'

    export default function () {
      return anchor()
    }
  `, {
    paths: [
      path.join(__dirname, '../../../node_modules'),
      path.join(__dirname, '../../fixtures')
    ],
    path: 'app.js'
  })
  assert.deepEqual(template({ title: 'foo' }, escape), '<a>foo</a>')
})
