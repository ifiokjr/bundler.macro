# bundler.macro

## 0.2.0

> 2021-02-13

### Minor Changes

- c384d65: Add `esbuildBundle` macro which bundles the referenced file path with esbuild for much
  faster build time.

  Also add a rollup config path parameter so that the rollup bundle can be fully customized.

### Patch Changes

- dfc4c38: Improve package `readme.md` and fix homepage url.

## 0.1.1

> 2021-02-02

### Patch Changes

- 3985736: Prefer node `builtins` for the `rollupBundle`.

## 0.1.0

> 2021-02-02

### Minor Changes

- 29519d4: Release the first version of `bundler.macro` for use within `@remirror/react-native`.
