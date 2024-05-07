import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: './frontend/src',
    server: {
        host: '0.0.0.0',
        port: 80,
        strictPort: true,
        https: {
            key: './.cert/key.pem',
            cert: './.cert/cert.pem'
        },
    },
})
