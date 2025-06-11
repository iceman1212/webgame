import { defineConfig } from 'vite';
// import legacy from '@vitejs/plugin-legacy'; // Import the legacy plugin

export default defineConfig({
  plugins: [
    // legacy({ // Uncomment to use the legacy plugin
    //   targets: ['defaults', 'not IE 11'],
    // }),
  ],
  // We can add more configurations here as needed, for example:
  // server: {
  //   port: 3000, // Example: set a specific port for the dev server
  // },
  // build: {
  //   outDir: 'dist', // Default is 'dist', so this is just an example
  // }
});
