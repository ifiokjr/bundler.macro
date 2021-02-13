<p align="center">
  <a href="#">
    <img width="300" height="300" src="support/assets/logo.svg" alt="free logo via https://logodust.com/" title="free logo via https://logodust.com/" />
  </a>
</p>

<p align="center">
  Bundle your <em>JavaScript</em> and <em>TypeScript</em> files inline.
</p>

<br />

<p align="center">
  <a href="#why"><strong>Why?</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="docs"><strong>Documentation</strong></a> ·
  <a href="docs/contributing.md"><strong>Contributing</strong></a>
</p>

<br />

<p align="center">
  <a href="https://github.com/ifiokjr/bundler.macro/actions?query=workflow:ci">
    <img src="https://github.com/ifiokjr/bundler.macro/workflows/ci/badge.svg?branch=main" alt="Continuous integration badge for github actions" title="CI Badge" />
  </a>
</p>

<br />

## Why

This package has primarily been created for use within the `@remirror/react-native` package to enable inline compilation local TypeScript files which are injected directly into the ReactNative WebView as a bundled file.

There are features which you may need that are not yet included.

For example, the rollup configuration is hardcoded and optimised for my current use case. I'm open to PR's which improve the functionality especially relating to the following areas.

- [ ] Support custom configurations via a `bundler.macro.config.js` file. Each transformation macro should support custom configurations being used.
- [ ] Support injection of CSS as well
- [ ] Support a full html bundle (not just the JS)
- [ ] Support bundling with tools other than [babel](https://babeljs.io/) e.g. [swc](https://github.com/swc-project/swc), [esbuild](https://esbuild.github.io/api/)

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

## Contributing

Please read our [contribution guide] for details on our code of conduct, and the process for submitting pull requests. It also outlines the project structure so you can find help when navigating your way around the codebase.

In addition each folder in this codebase a readme describing why it exists.

You might also notice there are surprisingly few files in the root directory of this project. All the configuration files have been moved to the `support/root` directory and are symlinked to the root directory in a `preinstall` hook. For more information take a look at [folder](support/root) and [readme](support/root/readme.md).

<br />

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ifiokjr/bundler.macro/tags).

<br />

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[contribution guide]: docs/contributing
[typescript]: https://github.com/microsoft/Typescript
