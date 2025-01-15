import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
// import './style.css'
import { i18nConfig } from '@/components/i18nConfig.ts'
import initTranslations from '@/components/i18n.js'

initTranslations(i18nConfig.defaultLocale, ['common'])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
