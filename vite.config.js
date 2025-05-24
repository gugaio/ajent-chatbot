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
      external: ['react', 'react-dom', 'axios', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          axios: 'axios'
        },
        sourcemap: true // Enable sourcemaps for library build
      }
    },
    sourcemap: true, // Generates .js.map files
    minify: false, // Optional: Disable minification for better debugging
    outDir: 'dist-lib'
  } : {
    // Regular app build configuration
    sourcemap: true, // Enable sourcemaps for app build
    minify: 'terser', // Keep minification but still generate sourcemaps
    terserOptions: {
      keep_classnames: true, // Optional: Helps with debugging
      keep_fnames: true // Optional: Helps with debugging
    },
    outDir: 'dist'
  }
});