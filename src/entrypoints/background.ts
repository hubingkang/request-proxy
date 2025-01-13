import { browser } from 'wxt/browser'
import ExtMessage, { MessageFrom, MessageType } from '@/entrypoints/types'
import { sendMessage, onMessage } from 'webext-bridge/background'

export default defineBackground(async () => {
  console.log('Hello background!', { id: browser.runtime.id }) // background.js

  // @ts-ignore
  // browser.sidePanel
  //   .setPanelBehavior({ openPanelOnActionClick: true })
  //   .catch((error: any) => console.error(error))

  console.log('browser', browser)

  // 监听扩展图标点击事件
  browser.action.onClicked.addListener(async () => {
    // 打开 options 页面
    // browser.tabs.create({
    //   url: browser.runtime.getURL('options.html'),
    // })
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length > 0) {
      sendMessage(
        'background-to-content',
        {
          first_name: 'background-to-content',
          last_name: 'Doe',
        },
        `content-script@${tabs[0].id}`
      )
    }
  })

  onMessage('options-to-background', (message) => {
    console.log('message', message)
    sendMessage('background-to-content', {
      first_name: 'background-to-content',
      last_name: 'Doe',
    })
  })

  // const response = await sendMessage(
  //   'background-to-content',
  //   {
  //     first_name: 'John',
  //     last_name: 'Doe',
  //   },
  //   'content'
  // )

  // console.log('response', response)

  // browser.action.onClicked.addListener(() => {
  //   // create()
  //   console.log('click icon')
  // })

  // background.js
  // browser.runtime.onMessage.addListener(
  //   async (
  //     message: ExtMessage,
  //     sender,
  //     sendResponse: (message: any) => void
  //   ) => {
  //     console.log('background:')
  //     console.log(message)
  //     if (message.messageType === MessageType.clickExtIcon) {
  //       console.log(message)
  //       return true
  //     } else if (
  //       message.messageType === MessageType.changeTheme ||
  //       message.messageType === MessageType.changeLocale
  //     ) {
  //       let tabs = await browser.tabs.query({
  //         active: true,
  //         currentWindow: true,
  //       })
  //       console.log(`tabs:${tabs.length}`)
  //       if (tabs) {
  //         for (const tab of tabs) {
  //           await browser.tabs.sendMessage(tab.id!, message)
  //         }
  //       }
  //     }
  //   }
  // )
})
