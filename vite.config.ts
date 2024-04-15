import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { resolve } from 'path';
// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
export default defineConfig(() => {
  return {
    // Other configurations...
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    // define: {
    //   'import.meta.env.VITE_PUBLIC_URL': JSON.stringify(process.env.VITE_PUBLIC_URL || ''),
    // },
    // Other configurations...
    plugins: [
      // Other plugins...
      react(),
    ],
  };
});