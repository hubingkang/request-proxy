import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  ...(process.env.NODE_ENV === 'production' ? {base: './',} : {}),
  plugins: [
    react(),
    ...(process.env.NODE_ENV === 'production'
      ? [
          replace({
            'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs': './vs',
          }),
          copy({
            targets: [
              { src: 'public/vs/*', dest: 'dist/vs' },
            ],
            hook: 'writeBundle'
          })
        ]
      : []
    ),
  ]
})
