import plugin from 'babel-plugin-macros';
import pluginTester from 'babel-plugin-tester';
import path from 'path';

const fixtures = (...paths: string[]) => path.join(__dirname, '..', '__fixtures__', ...paths);

pluginTester({
  plugin,
  pluginName: 'bundler.macro',
  title: 'transpileFile',
  snapshot: true,
  babelOptions: {
    filename: fixtures('file.js'),
  },

  tests: {
    'run correctly': {
      code: `import { transpileFile } from './macro.js';
      const output = transpileFile('./transpile.fixture.js');`,
      snapshot: true,
    },
  },
});

pluginTester({
  plugin,
  pluginName: 'bundler.macro',
  title: 'rollupBundle',
  snapshot: true,
  babelOptions: {
    filename: fixtures('file.ts'),
  },

  tests: {
    'run correctly': {
      code: `import { rollupBundle } from './macro.js';
      const output = rollupBundle('./bundle.fixture.js');`,
      snapshot: true,
    },
  },
});