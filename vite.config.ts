import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { babel } from '@rollup/plugin-babel';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'
// import path from 'path';
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/'),
        // '@': path.resolve(__dirname, './src'),
        
      }
    },
    plugins: [
      tsconfigPaths(),
      react(),
      babel({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        exclude: 'node_modules/**'
      }),
    ]
  };
});
