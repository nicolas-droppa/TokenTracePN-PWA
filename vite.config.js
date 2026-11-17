import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
    base: command === 'build' || isPreview ? '/TokenTracePN-PWA/' : '/',
    plugins: [react()],
    resolve: {
        alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    test: {
        environment: 'node',
        include: ['tests/**/*.test.{js,jsx}'],
    },
}));
