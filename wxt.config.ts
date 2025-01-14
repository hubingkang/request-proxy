import { defineConfig } from 'wxt'
import react from '@vitejs/plugin-react'
// import replace from '@rollup/plugin-replace'
// import copy from 'rollup-plugin-copy'
// import replace from '@rollup/plugin-replace'
// import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    permissions: ['activeTab', 'scripting', 'storage', 'tabs'],
    action: {},
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    web_accessible_resources: [
      {
        resources: [
          // 'assets/editor.worker-mLNEVLJU.js',
          // 'assets/json.worker-DFDpljhp.js',
          'assets/*',
          'wrapper.js',
          'config-panel.html',
        ],
        matches: ['<all_urls>'],
      },
    ],
    // content_scripts: [
    //   {
    //     matches: ['<all_urls>'],
    //     js: ['content1.js'],
    //     run_at: 'document_start',
    //   },
    // ],
  },
  vite: () => ({
    // base: './', // 确保路径相对于当前文件夹
    // build: {
    //   assetsDir: 'assets', // 将资源文件打包到 assets 目录
    // },
    plugins: [
      react(),
      // monacoEditorPlugin({
      //   // publicPath: './', // 相对路径
      //   customWorkers: [
      //     {
      //       label: 'editor.worker',
      //       entry: 'monaco-editor/esm/vs/editor/editor.worker',
      //     },
      //     {
      //       label: 'json.worker',
      //       entry: 'monaco-editor/esm/vs/language/json/json.worker',
      //     },
      //   ],
      //   customDistPath: chrome.runtime.getURL('./'),
      // }),

      // replace({
      //   preventAssignment: true,
      //   values: {
      //     // '/assets/': './assets/',
      //     // assets/editor.worker-mLNEVLJU.js
      //   },
      // }),

      // ...(process.env.NODE_ENV === 'production'
      //   ? [
      //       replace({
      //         'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs': './vs',
      //       }),
      //       copy({
      //         targets: [
      //           { src: 'src/public/vs/*', dest: '../extension/dist/vs' },
      //         ],
      //         hook: 'writeBundle'
      //       })
      //     ]
      //   : []),
    ],
    // publicDir: browser.runtime.getURL('./'),
    // publicDir: './',
  }),
})
