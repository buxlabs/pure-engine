import test from 'ava'
import compile from '../../helpers/compile'
import { join } from 'path'
import escape from 'escape-html'

test('style[scoped]: first tag', async assert => {
  var { template } = await compile('<style scoped>.foo{color:red}</style><a class="foo">bar</a>')
  assert.deepEqual(template({}, escape), '<style>.scope-122304991.foo{color:red}</style><a class="scope-122304991 foo">bar</a>')
})

test('style[scoped]: last tag', async assert => {
  var { template } = await compile('<a class="foo">bar</a><style scoped>.foo{color:red}</style>')
  assert.deepEqual(template({}, escape), '<a class="scope-122304991 foo">bar</a><style>.scope-122304991.foo{color:red}</style>')
})

test('style[scoped]: handles tags', async assert => {
  const { template } = await compile('<h1>foo</h1><style scoped>h1 { color: red }</style>')
  assert.deepEqual(template({}, escape), '<h1 class="scope-1911416206">foo</h1><style>h1.scope-1911416206{color:red}</style>')
})

test('style[scoped]: handles nested tags', async assert => {
  const { template } = await compile('<main><h1>foo</h1></main><style scoped>main h1 { color: red }</style>')
  assert.deepEqual(template({}, escape), '<main class="scope-686692165"><h1>foo</h1></main><style>main.scope-686692165 h1{color:red}</style>')
})

test('style[scoped]: handles classes', async assert => {
  const { template } = await compile('<h1 class="foo">foo</h1><style scoped>.foo { color: red }</style>')
  assert.deepEqual(template({}, escape), '<h1 class="scope-2771010719 foo">foo</h1><style>.scope-2771010719.foo{color:red}</style>')
})

test('style[scoped]: handles nested classes', async assert => {
  const { template } = await compile('<main class="bar"><h1 class="foo">foo</h1></main><style scoped>.bar .foo { color: red }</style>')
  assert.deepEqual(template({}, escape), '<main class="scope-2128350464 bar"><h1 class="foo">foo</h1></main><style>.scope-2128350464.bar .foo{color:red}</style>')
})

test('style[scoped]: handles tag with nested class', async assert => {
  const { template } = await compile('<main><h1 class="foo">foo</h1></main><style scoped>main .foo { color: red }</style>')
  assert.deepEqual(template({}, escape), '<main class="scope-2128503028"><h1 class="foo">foo</h1></main><style>main.scope-2128503028 .foo{color:red}</style>')
})

test('style[scoped]: handles class with nested tag', async assert => {
  const { template } = await compile('<main class="foo"><h1>foo</h1></main><style scoped>.foo h1 { color: red }</style>')
  assert.deepEqual(template({}, escape), '<main class="scope-686662534 foo"><h1>foo</h1></main><style>.scope-686662534.foo h1{color:red}</style>')
})

test('style[scoped]: multiple classes', async assert => {
  var { template } = await compile(`
    <a class="foo bar">baz</a>
    <style scoped>.foo.bar{color:red}</style>
  `)
  assert.deepEqual(template({}, escape), '<a class="scope-41409600 foo bar">baz</a><style>.scope-41409600.foo.bar{color:red}</style>')
})

test('style[scoped]: pseudo classes', async assert => {
  var { template } = await compile(`
    <a class="foo">baz</a>
    <style scoped>.foo:hover{color:red}</style>
  `)
  assert.deepEqual(template({}, escape), '<a class="scope-861004675 foo">baz</a><style>.scope-861004675.foo:hover{color:red}</style>')
})

test('stype[scoped]: pseudo elements', async assert => {
  var { template } = await compile(`
    <a class="foo">baz</a>
    <style scoped>.foo::after{content:"⤴"}</style>
  `)
  assert.deepEqual(template({}, escape), '<a class="scope-1577098216 foo">baz</a><style>.scope-1577098216.foo::after{content:"⤴"}</style>')
})

test('style[scoped]: type selectors', async assert => {
  var { template } = await compile(`
    <a class="foo">baz</a>
    <style scoped>a.foo::after{content:"⤴"}</style>
  `)
  assert.deepEqual(template({}, escape), '<a class="scope-504633481 foo">baz</a><style>a.scope-504633481.foo::after{content:"⤴"}</style>')
})

test('style[scoped]: passing additional class to the scoped attribute', async assert => {
  var { template } = await compile(`
    <a class="foo">baz</a>
    <style scoped="bar">a.foo::after{content:"⤴"}</style>
  `)
  assert.deepEqual(template({}, escape), '<a class="scope-504633481 foo">baz</a><style>.bar a.scope-504633481.foo::after{content:"⤴"}</style>')
})

test('style[inline]: inline fonts', async assert => {
  var { template } = await compile(`
    <style inline>
      @font-face {
        font-family: 'Example';
        src: local('Example Regular'), local('Example-Regular'), url(./fonts/Example.ttf) format('truetype');
      }
    </style>
  `, {
    paths: [ join(__dirname, '../../fixtures') ]
  })
  const output = template({}, escape)
  assert.truthy(output.includes('url(data:application/font-ttf;charset=utf-8;base64'))
  assert.truthy(output.includes('EABQAlACkAMQHiAeM=) format(\'truetype\')'))
})

test('style[inline]: background image', async assert => {
  var { template } = await compile(`
    <style inline>
      .foo {
        background: url("./images/placeholder.jpg");
      }
    </style>
  `, {
    paths: [ join(__dirname, '../../fixtures') ]
  })
  const output = template({}, escape)
  assert.truthy(output.includes('url(data:image/jpg;charset=utf-8;base64'))
  assert.truthy(output.includes('FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//2Q=='))
})

test('style[colors]: custom colors', async assert => {
  var { template } = await compile(`<style>.button { color: red; }</style>`, { styles: { colors: { red: '#FF6347' } } })
  assert.deepEqual(template({}, escape), '<style>.button { color: #FF6347; }</style>')
})

test('style[colors]: mixed colors', async assert => {
  var { template } = await compile(`<style>.button { color: red; } .blue.button { color: myBeautifulBlue; } .yellow.button { color: yellow }</style>`, {
    styles: {
      colors: {
        red: '#FF6347',
        myBeautifulBlue: '#6495ED'
      }
    }
  })
  assert.deepEqual(template({}, escape), `<style>.button { color: #FF6347; } .blue.button { color: #6495ED; } .yellow.button { color: yellow }</style>`)
})
