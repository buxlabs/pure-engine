import test from 'ava'
import compile from '../../helpers/compile'
import escape from 'escape-html'

test('font: ttfs fonts', async assert => {
  var { template } = await compile('<font NunitoRegular from="/fonts/NunitoRegular.ttf" />')
  assert.deepEqual(template({}, escape), '<style>@font-face { font-family: "NunitoRegular"; src: local("NunitoRegular"), url(/fonts/NunitoRegular.ttf) format("truetype"); }</style>')

  var { template } = await compile(`
    <font NunitoRegular from="/fonts/NunitoRegular.ttf" />
    <font RobotoCondensed from="/fonts/RobotoCondensed.ttf" />
  `)
  assert.deepEqual(template({}, escape), `<style>@font-face { font-family: "NunitoRegular"; src: local("NunitoRegular"), url(/fonts/NunitoRegular.ttf) format("truetype"); }</style><style>@font-face { font-family: "RobotoCondensed"; src: local("RobotoCondensed"), url(/fonts/RobotoCondensed.ttf) format("truetype"); }</style>`)

  var { template } = await compile('<font { NunitoRegular } from="/fonts" extension="ttf"/>')
  assert.deepEqual(template({}, escape), '<style>@font-face { font-family: "NunitoRegular"; src: local("NunitoRegular"), url(/fonts/NunitoRegular.ttf) format("truetype"); }</style>')

  var { template } = await compile('<font { NunitoRegular, RobotoCondensed } from="/fonts" extension="ttf"/>')
  assert.deepEqual(template({}, escape), '<style>@font-face { font-family: "NunitoRegular"; src: local("NunitoRegular"), url(/fonts/NunitoRegular.ttf) format("truetype"); }</style><style>@font-face { font-family: "RobotoCondensed"; src: local("RobotoCondensed"), url(/fonts/RobotoCondensed.ttf) format("truetype"); }</style>')

  var { template } = await compile('<font { NunitoRegular,   RobotoCondensed  ,   Gotham   } from="/fonts" extension="ttf"/>')
  assert.deepEqual(template({}, escape), '<style>@font-face { font-family: "NunitoRegular"; src: local("NunitoRegular"), url(/fonts/NunitoRegular.ttf) format("truetype"); }</style><style>@font-face { font-family: "RobotoCondensed"; src: local("RobotoCondensed"), url(/fonts/RobotoCondensed.ttf) format("truetype"); }</style><style>@font-face { font-family: ""; src: local(""), url(/fonts/.ttf) format("truetype"); }</style><style>@font-face { font-family: "Gotham"; src: local("Gotham"), url(/fonts/Gotham.ttf) format("truetype"); }</style>')  
})
