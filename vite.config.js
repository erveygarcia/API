import { defineConfig } from 'vite';

export default defineConfig({
  base: '/API/', // Cambia "TU_REPO" por el nombre de tu repositorio en GitHub
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist', // Guarda los archivos en `dist/`
    emptyOutDir: true, // Borra el contenido anterior de `dist/`
  },
});
