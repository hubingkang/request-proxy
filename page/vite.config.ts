import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete'
// import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  ...(process.env.NODE_ENV === 'production' ? {base: './',} : {}),
  build: {
    outDir: "../extension/dist",
  },
  plugins: [
    react(),
    ...(process.env.NODE_ENV === 'production'
      ? [
          replace({
            'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs': './vs',
          }),
          copy({
            targets: [
              { src: 'public/vs/*', dest: '../extension/dist/vs' },
            ],
            hook: 'writeBundle'
          })
        ]
      : []
    ),
    // @ts-ignore
    del({ targets: '../extension/dist/*', force: true }),
    // visualizer(),
  ]
})
