import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' hace que las rutas del sitio compilado sean relativas.
// Sin eso, al abrir dist/index.html con doble clic no carga nada.
export default defineConfig({
    plugins: [react()],
    base: './'
});
