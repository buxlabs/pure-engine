import test from '../../../helpers/test'
import compile from '../../../helpers/compile'
import escape from 'escape-html'
import { join } from 'path'

test('script: component', async assert => {
  const template = await compile('<script component foo>foo</script><foo/>')
  assert.deepEqual(template({}, escape), 'foo')
})

test('script: component inside of a imported component', async assert => {
  const template = await compile(`
    <import foo from='./foo.html'>
    <foo />
  `, {
    paths: [ join(__dirname, '../../../fixtures/script/component/import') ]
  })
  assert.deepEqual(template({}, escape), 'bar')
})