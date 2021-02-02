import { NodePath, transformFileSync } from '@babel/core';
import is from '@sindresorhus/is';
import { createMacro, MacroError, MacroParams } from 'babel-plugin-macros';
import makeSync from 'make-synchronous';
import path from 'path';

import { BUNDLED_NAME } from './constants';

interface MethodProps {
  reference: NodePath;
  babel: MacroParams['babel'];
  state: MacroParams['state'];
}

interface CheckReferenceExistsParameter {
  name: string;
  method: (options: MethodProps) => void;
  macroParameter: MacroParams;
}

/**
 * Provides a custom error for this macro.
 */
class JsonMacroError extends MacroError {
  constructor(message: string) {
    super(message);
    this.name = 'JsonMacroError';
    this.stack = '';
  }
}

/**
 * Checks if a value is a string or is undefined.
 */
function isStringOrUndefined(value: unknown): value is string | undefined {
  return is.string(value) || is.undefined(value);
}

/**
 * Prints readable error messages for when loading a json file fails.
 * @param {NodePath} path
 * @param {string} message
 *
 * @returns {never}
 */
function frameError(path: NodePath, message: string): never {
  throw path.buildCodeFrameError(`\n\n${message}\n\n`, JsonMacroError);
}

interface EvaluateNodeValueProps<Type> {
  node: NodePath | undefined;
  parentPath: NodePath;
  predicate: (value: unknown) => value is Type;
}

/**
 * Evaluates the value matches the provided `predicate`.
 */
function evaluateNodeValue<Type>({
  parentPath,
  node,
  predicate,
}: EvaluateNodeValueProps<Type>): Type {
  let value: unknown;

  try {
    value = node?.evaluate().value;
  } catch {
    /* istanbul ignore next */
    frameError(
      parentPath,
      `There was a problem evaluating the value of the argument for the code: ${parentPath.getSource()}. If the value is dynamic, please make sure that its value is statically deterministic.`,
    );
  }

  if (!predicate(value)) {
    frameError(
      parentPath,
      `Invalid argument passed to function call. Received unsupported type '${is(value)}'.`,
    );
  }

  return value;
}

interface GetArgumentNodeProps {
  parentPath: NodePath;
  required?: boolean;
  index?: number;
  maxArguments?: number;
}

/**
 * Get the node for the first argument of a function call. Will throw an error
 * if more than one argument.
 */
function getArgumentNode({
  parentPath,
  required = true,
  index = 0,
  maxArguments = 1,
}: GetArgumentNodeProps): NodePath | undefined {
  const nodes = parentPath.get('arguments');
  const nodeArray = Array.isArray(nodes) ? nodes : [nodes];

  if (nodeArray.length > maxArguments) {
    frameError(
      parentPath,
      `Too many arguments provided to the function call: ${parentPath.getSource()}. This method only supports one or less.`,
    );
  }

  const node = nodeArray?.[index];

  if (node === undefined && required) {
    frameError(
      parentPath,
      `No arguments were provided when one is required: ${parentPath.getSource()}.`,
    );
  }

  return node;
}

/**
 * @param {any} state
 *
 * @returns {string}
 */
function getFileName(state: any): string {
  const fileName = state.file.opts.filename;

  if (!fileName) {
    throw new JsonMacroError(
      'json.macro methods can only be used on files and no filename was found',
    );
  }

  return fileName;
}

interface ReplaceParentExpressionProps {
  value: string;
  babel: MacroParams['babel'];
  parentPath: NodePath;
}

/**
 * Replace the parent expression with the string value from the bundled file.
 */
function replaceParentExpression(options: ReplaceParentExpressionProps) {
  const { babel, parentPath, value } = options;

  parentPath.replaceWith(babel.types.stringLiteral(value));
}

/**
 * Handles loading a single json file with an optional object path parameter.
 */
function transpileFile({ reference, state, babel }: MethodProps) {
  const filename = getFileName(state);

  const { parentPath } = reference;
  const dir = path.dirname(filename);

  const rawFilePath = evaluateNodeValue({
    node: getArgumentNode({
      parentPath,
      required: true,
      maxArguments: 2,
      index: 0,
    }),
    parentPath,
    predicate: is.string,
  });

  evaluateNodeValue({
    node: getArgumentNode({
      parentPath,
      required: false,
      maxArguments: 2,
      index: 1,
    }),
    parentPath,
    predicate: isStringOrUndefined,
  });

  let filePath: string;

  try {
    filePath = require.resolve(rawFilePath, { paths: [dir] });
  } catch {
    frameError(parentPath, `The provided path: '${rawFilePath}' does not exist`);
  }

  const result = transformFileSync(filePath, { cwd: path.dirname(filePath) });

  if (!result?.code) {
    frameError(parentPath, `The filePath: '${filePath}' could not be processed`);
  }

  replaceParentExpression({ babel, parentPath, value: result.code });
}

function rollupBundle({ reference, state, babel }: MethodProps) {
  const filename = getFileName(state);

  const { parentPath } = reference;
  const dir = path.dirname(filename);

  const rawFilePath = evaluateNodeValue({
    node: getArgumentNode({
      parentPath,
      required: true,
      maxArguments: 2,
      index: 0,
    }),
    parentPath,
    predicate: is.string,
  });

  const name = evaluateNodeValue({
    node: getArgumentNode({
      parentPath,
      required: false,
      maxArguments: 2,
      index: 1,
    }),
    parentPath,
    predicate: isStringOrUndefined,
  });

  let input: string;

  try {
    input = require.resolve(rawFilePath, { paths: [dir] });
  } catch {
    frameError(parentPath, `The provided path: '${rawFilePath}' does not exist`);
  }

  interface Rollup {
    input: string;
    cwd: string;
    name: string;
  }

  const rollup = makeSync(async (props: Rollup) => {
    const { rollup }: typeof import('rollup') = require('rollup');
    const { babel }: typeof import('@rollup/plugin-babel') = require('@rollup/plugin-babel');
    const json: typeof import('@rollup/plugin-json').default = require('@rollup/plugin-json');
    const cjs: typeof import('@rollup/plugin-commonjs').default = require('@rollup/plugin-commonjs');
    const terser = require('rollup-plugin-terser');
    const {
      nodeResolve,
    }: typeof import('@rollup/plugin-node-resolve') = require('@rollup/plugin-node-resolve');

    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.node'];
    const { cwd, input } = props;

    const bundler = await rollup({
      input,
      plugins: [
        cjs({ extensions, include: /node_modules/ }),
        babel({ cwd, extensions, babelHelpers: 'runtime', rootMode: 'upward-optional' }),
        json({ namedExports: false }),
        nodeResolve({ extensions, browser: true, preferBuiltins: true }),
        process.env.NODE_ENV === 'production' && terser(),
      ],
    });

    const result = await bundler.generate({
      format: 'iife',
      exports: 'named',
      name: props.name,
    });

    return result.output[0].code;
  });

  const value = rollup({ cwd: path.dirname(input), input, name: name ?? BUNDLED_NAME });
  replaceParentExpression({
    babel,
    parentPath,
    value,
  });
}

/**
 * Check to see if the provided reference name is used in this file. When it's
 * available call the function for every occurrence.
 */
function checkReferenceExists(options: CheckReferenceExistsParameter): void {
  const { method, name, macroParameter } = options;
  const { babel, references, state } = macroParameter;
  const namedReferences = references[name];

  if (!namedReferences) {
    return;
  }

  for (const reference of namedReferences) {
    const { parentPath } = reference;

    if (!parentPath.isCallExpression()) {
      throw frameError(
        parentPath,
        `'${name}' called from 'json.macro' must be used as a function call.`,
      );
    }

    method({ babel, reference, state });
  }
}

/** The supported methods for this macro */
const supportedMethods = [
  { name: 'rollupBundle', method: rollupBundle },
  { name: 'transpileFile', method: transpileFile },
];

/**
 * The macro which is created and exported for usage in your project.
 */
export default createMacro((macroParameter) => {
  for (const supportedMethod of supportedMethods) {
    const { name, method } = supportedMethod;
    checkReferenceExists({ name, method, macroParameter });
  }
});
