import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],

    server: {
        watch: {
            ignored: ["**/db.json"],
        },
    },
})