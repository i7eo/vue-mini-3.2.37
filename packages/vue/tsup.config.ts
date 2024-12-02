import process from 'node:process';
import { defineConfig } from 'tsup';
import { version } from './package.json';

export default defineConfig({
  entry: {
    vue: './src/index.ts',
  },
  format: ['esm', 'cjs', 'iife'],
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
    __VUE_DEV__: JSON.stringify(!!process.env.DEV),
    __VUE_VERSION__: JSON.stringify(version),
  },
  globalName: 'Vue',
  sourcemap: !!process.env.DEV,
  outExtension({ format }) {
    return {
      js: `.${format === 'iife' ? 'global' : format}.js`,
    };
  },
});
