import React, { useEffect, useRef, useState } from 'react'
import { Home } from '@/entrypoints/content1/home'
import { SettingsPage } from '@/entrypoints/content1/settings'
import Sidebar, { SidebarType } from '@/entrypoints/sidebar'
import { browser } from 'wxt/browser'
import ExtMessage, { MessageType } from '@/entrypoints/types'
import Header from '@/entrypoints/content1/header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/components/theme-provider'

import '@/assets/main.css'

export default () => {
  const [showContent, setShowContent] = useState(true)
  const [showButton, setShowButton] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home)
  const [headTitle, setHeadTitle] = useState('home')
  const [buttonStyle, setButtonStyle] = useState<any>()
  const [cardStyle, setCardStyle] = useState<any>()
  const cardRef = useRef<HTMLDivElement>(null)
  const { i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  async function initI18n() {
    let data = await browser.storage.local.get('i18n')
    if (data.i18n) {
      await i18n.changeLanguage(data.i18n)
    }
  }

  function domLoaded() {
    console.log('dom loaded')
  }

  useEffect(() => {
    if (document.readyState === 'complete') {
      // load event has already fired, run your code or function here
      console.log('dom complete')
      domLoaded()
    } else {
      // load event hasn't fired, listen for it
      window.addEventListener('load', () => {
        // your code here
        console.log('content load:')
        console.log(window.location.href)
        domLoaded()
      })
    }
    browser.runtime.onMessage.addListener(
      (message: ExtMessage, sender, sendResponse) => {
        console.log('content:')
        console.log(message)
        if (message.messageType == MessageType.clickExtIcon) {
          setShowContent(true)
        } else if (message.messageType == MessageType.changeLocale) {
          i18n.changeLanguage(message.content)
        } else if (message.messageType == MessageType.changeTheme) {
          toggleTheme(message.content)
        }
      }
    )

    initI18n()
  }, [])

  return (
    <div className={theme}>
      {showContent && (
        <div className="fixed top-0 right-0 h-screen w-[400px] bg-background z-[1000000000000] rounded-l-xl shadow-2xl">
          <Header headTitle={headTitle} />
          <Sidebar
            closeContent={() => {
              setShowContent(false)
            }}
            sideNav={(sidebarType: SidebarType) => {
              setSidebarType(sidebarType)
              setHeadTitle(sidebarType)
            }}
          />
          <main className="mr-14 grid gap-4 p-4">
            {sidebarType === SidebarType.home && <Home />}
            {sidebarType === SidebarType.settings && <SettingsPage />}
          </main>
        </div>
      )}
    </div>
  )
}
