/**
 * Bundle the provided path with rollup.
 *
 * The Bundle is given a name of `BUNDLED_NAME` which can be imported from
 * `bundler.macro/constants`.
 *
 * @param path - the relative path to the entry point which will be transformed.
 * @param rollupConfigPath - An optional path to a rollup configuration, for customising options.
 */
export function rollupBundle(path: string, rollupConfigPath?: string): string;

/**
 * Bundle the provided path with esbuild.
 *
 * @param path - the relative path to the entry point which will be transformed.
 * @param buildOptionsPath - the path to an esbuild configuration for custom options.
 */
export function esbuildBundle(path: string, buildOptionsPath?: string): string;

/**
 * Transpile a single file import. Exports and imports are not recognized.
 *
 * This uses babel for the transpilation.
 */
export function transpileFile(path: string): string;
