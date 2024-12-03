import { defineConfig } from 'vite';
import { name, version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  define: {
    __PACKAGE_NAME__: JSON.stringify(name),
    __PACKAGE_VERSION__: JSON.stringify(version),
  },
});
