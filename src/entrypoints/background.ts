import { browser } from 'wxt/browser'
import { sendMessage, onMessage } from 'webext-bridge/background'

export default defineBackground(async () => {
  browser.action.onClicked.addListener(async () => {
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
})
