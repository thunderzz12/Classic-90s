import { defineConfig } from 'vite';
export default defineConfig({
    root: '.',
    server: {
        port: 5173,
        allowedHosts: true
    },
    build: {
        outDir: 'dist',
        cssMinify: 'esbuild',
    },
});