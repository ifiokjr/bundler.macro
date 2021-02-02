/**
 * Bundle the provided path with rollup.
 *
 * The Bundle is given a name of `BUNDLED_NAME` which can be imported from
 * `bundler.macro/constants`.
 *
 * @param path - the relative path to the entry point which will be transformed.
 * @param name - An optional name to export the bundle as. Otherwise it defaults to `BUNDLED_NAME`
 * available via `bundler.macro/constants`
 */
export function rollupBundle(path: string, cacheBuster?: string): string;

/**
 * Transpile a single file import. Exports and imports are not recognized.
 *
 * This uses babel for the transpilation.
 */
export function transpileFile(path: string): string;
