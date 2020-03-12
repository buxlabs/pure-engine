# pure-engine

[![npm](https://img.shields.io/npm/v/pure-engine.svg)](https://www.npmjs.com/package/pure-engine)
[![build](https://github.com/buxlabs/pure-engine/workflows/build/badge.svg)](https://github.com/buxlabs/pure-engine/actions)

> Compile HTML templates into JS

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Benchmarks](#benchmarks)
- [REPL](https://buxlabs.pl/en/tools/js/pure-engine)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

Pure Engine is a library designed to compile HTML templates into JS. It analyses the template and generates an optimal rendering function that can be used on the client and the server. The compilation process should ideally happen in a build step (for the client) or the output could be memoized after first usage (for the server).

The syntax of the template should be easy to read and write. There are three types of tags: curly, square and html tags.

Status: Alpha / Proof of concept

### Curly Tags

`{name}` is a curly tag

Curly tags can contain expressions, e.g. `{1 + 2}` is a valid tag.
They can also contain additional filters like `{name | capitalize}`.

```html
<div>{name}</div>
```

### Square Tags

`[color]` is a square tag

Square tags are array expressions and can be used as values of html attributes.

```html
<button class="[color, size, shape]"><slot/></button>
```

### HTML Tags

`<if>` is an html tag

HTML tags can contain additional attributes, e.g. `<if limit is a number>` is a valid tag. The attribute syntax follows the natural language principles.

```html
<if name is present>
  Hello, {name}!
<else>
  Welcome!
<end>
```

## Install

`npm install pure-engine escape-html`

## Usage

```js
const { compile } = require('pure-engine')
const escape = require('escape-html')

async function example () {
  const { template } = await compile('<div>{foo}</div>')
  console.log(template({ foo: 'bar' }, escape))
}

example()
```

If you're using webpack you should use [pure-engine-loader](https://github.com/buxlabs/pure-engine-loader).

## API

* import and require tags

```html
<import layout from="./layouts/default.html">
<import { form, input, button } from="./components">

<layout>
  <h1>Hello, world!</h1>
  <form>
    <input name="foo" />
    <button>Submit</button>
  </form>
</layout>
```

It's possible to import multiple components from a given directory. Curly brackets within the import tag are optional.

* render, partial and include tags

```html
<partial from="./foo.html" />
<include partial="./foo.html" />
<render partial="./foo.html" />
```

* conditional tags: if, else, elseif, unless, elseunless

```html
<if foo>bar<end>
```

```html
<if foo>
  bar
<elseif baz>
  qux
<else>
  quux
<end>
```

```html
<unless foo>bar<end>
```

* loops: for, each, foreach

```html
<for car of cars>
  {car.brand}
</for>

<for car and index of cars>
  #{index + 1} {car.brand}
</for>

<for key and value in object>
  {key}: {value}
</for>
```

* filters

```html
{title | capitalize}
```

* special attributes

```html
<img src="./foo.png" inline>
```

```html
<div class="foo">bar</div>
<style scoped>
.foo {
  color: red;
}
</style>
```

* built-in i18n support (translate tag and filter)

```html
<h1><translate hello/></h1>
<i18n yaml>
hello:
- 'Hej!'
- 'Hello!'
</i18n>
```

* compiler attribute for scripts

```html
<div id="app"></div>
<script compiler="preact">
import { render } from "preact"
const Foo = ({ bar }) => {
  return (<span>{bar}</span>)
}
render(
  <Foo bar="baz" />,
  document.getElementById("app")
)
</script>
```

* polyfills attribute for scripts

```html
<script polyfills="['promise.js']">
new Promise(resolve => resolve())
</script>
```

## Examples

```
<if foo.length equals 0>{bar}</if>
```

```js
function render(__o, __e) {
  var __t = "";
  if (__o.foo.length === 0) {
    __t += __e(__o.bar);
  }
  return __t;
}
```

```
<for month in months>{month}</for>
```

```js
function render(__o, __e) {
  var __t = "";
  for (var a = 0, b = __o.months.length; a < b; a += 1) {
    var month = __o.months[a];
    __t += __e(month);
  }
  return __t;
}
```

```
<foreach month in months>{month}</foreach>
```

```js
function render(__o, __e) {
  var __t = "";
  __o.months.forEach(function (month) {
    __t += __e(month);
  });
  return __t;
}
```

## Benchmarks

`npm run benchmark`

## Maintainers

[@emilos](https://github.com/emilos)

## Contributing

All contributions are highly appreciated. Please feel free to open new issues and send PRs.

## License

MIT
