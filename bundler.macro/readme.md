# bundler.macro

> Bundle local JavaScript and TypeScript files with parcel.js.

[![Version][version]][npm] [![Weekly Downloads][downloads-badge]][npm] [![Typed Codebase][typescript]](#) [![MIT License][license]](#)

[version]: https://flat.badgen.net/npm/v/bundler.macro
[npm]: https://npmjs.com/package/bundler.macro
[license]: https://flat.badgen.net/badge/license/MIT/purple
[typescript]: https://flat.badgen.net/badge/icon/TypeScript?icon=typescript&label
[downloads-badge]: https://badgen.net/npm/dw/bundler.macro/red?icon=npm

<br />

## Installation

`bundler.macro` is designed to be used with [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) to bundle or transpile files during your build step. <br />

First, install the plugin and it's peer dependency (`babel-plugin-macros`). Since the macro is compiled away during the build, it should be installed as a `devDependency` to prevent bloating the dependency tree of the consumers of your package.

```bash
# yarn
yarn add bundler.macro babel-plugin-macros

# pnpm
pnpm add bundler.macro babel-plugin-macros

# npm
npm install bundler.macro babel-plugin-macros
```

Once installed make sure to add the 'babel-plugin-macros' to your `babel.config.js` (or `.babelrc`) file.

**`.babelrc`**

```diff
{
  "plugins": [
+   "macros",
    "other",
    "plugins"
  ]
}
```

**`babel.config.js`**

```diff
module.exports = {
  // rest of config...,
  plugins: [
+   'macros',
    ...otherPlugins,
  ]
}
```

<br />

## Usage

<br />

### Code Example

> Bundle files using esbuild.

```ts
import { esbuildBundler } from 'bundler.macro';

// The file is bundled with `esbuild` and the output is provided as a string.
const bundledOutput: string = esbuildBundler('./main.ts');
```

> Bundle files using rollup.

```ts
import { rollupBundler } from 'bundler.macro';

// The file is bundled with `rollup` and the output is provided as a string.
const bundledOutput: string = rollupBundler('./main.ts');
```

> Transpile a file using babel

This should be used when you want to get the string output from a file, in a format that can be

```ts
import { transpileFile } from 'bundler.macro';

// The file is transpiled as a single file with babel.
const output: string = transpileFile('./simple.js');
```
