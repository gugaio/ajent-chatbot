import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

const isLibraryBuild = process.env.BUILD_MODE === 'library';

export default defineConfig({
  plugins: [react()],
  build: isLibraryBuild ? {
    // Library build configuration
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'AgentChat',
      fileName: (format) => `agent-chat.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'axios'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          axios: 'axios'
        }
      }
    },
    outDir: 'dist-lib' // Different output directory for library
  } : {
    // Regular app build configuration
    outDir: 'dist' // Your current app build directory
  }
});