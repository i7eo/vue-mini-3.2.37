import process from 'node:process';
import { defineConfig } from 'tsup';
import { version } from './package.json';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  // splitting: true,
  cjsInterop: true,
  watch: !!process.env.DEV,
  dts: process.env.DEV
    ? false
    : {
        compilerOptions: {
          composite: false,
        },
      },
  tsconfig: './tsconfig.json',
  clean: true,
  shims: true,
  define: {
    __DEV__: JSON.stringify(!!process.env.DEV),
    __VERSION__: JSON.stringify(version),
  },
  sourcemap: !!process.env.DEV,
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
});
