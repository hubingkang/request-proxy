import { storage } from '@wxt-dev/storage'
import { onMessage } from 'webext-bridge/content-script'
import { RequestProxyRule } from './types'

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  async main() {
    const config = await storage.getItem<string>('local:request-proxy-config')
    const language = await storage.getItem<string>(
      'local:request-proxy-config-language'
    )
    const parsedConfig = config ? JSON.parse(config) : {}

    // 重置 matched 为 false
    parsedConfig.list = parsedConfig?.list?.map((item: RequestProxyRule) => ({
      ...item,
      matched: false,
    }))

    // CustomEvent 会冒泡到 document 层级， Content Script 可以访问页面的 DOM 事件
    // 事件系统是共享的，所以可以跨环境通信，直接 window 赋值是没法访问的，window 是隔离开的
    window.addEventListener('wrapper-ready', async () => {
      // wrapper 已准备就绪，发送初始化配置
      await window.postMessage(
        {
          source: 'content-to-wrapper-init-config',
          payload: config
            ? parsedConfig
            : {
                enabled: false,
                list: [],
              },
        },
        '*'
      )
    })

    await injectScript('/wrapper.js', {
      keepInDom: true,
    })

    const createIframe = () => {
      const existingIframe = document.getElementById('request-proxy-iframe')
      // 如果iframe已存在
      if (existingIframe) {
        // 如果当前是隐藏状态，则显示
        if (existingIframe.style.opacity === '0') {
          existingIframe.style.opacity = '1'
          existingIframe.style.pointerEvents = 'auto' // 显示时启用鼠标事件
          // 保存当前的 overflow 值到 data 属性
          if (!existingIframe.dataset.originalOverflow) {
            existingIframe.dataset.originalOverflow = getComputedStyle(
              document.body
            ).overflow
          }
          document.body.style.overflow = 'hidden'
        } else {
          existingIframe.style.opacity = '0'
          existingIframe.style.pointerEvents = 'none' // 隐藏时禁用鼠标事件，实现点击穿透
          // 恢复原始的 overflow 值
          document.body.style.overflow =
            existingIframe.dataset.originalOverflow || 'auto'
        }
        return
      }

      const iframe = document.createElement('iframe')
      iframe.src = browser.runtime.getURL('/config-panel.html')
      iframe.id = 'request-proxy-iframe'

      iframe.style.opacity = '0'
      iframe.style.pointerEvents = 'none' // 初始状态禁用鼠标事件
      // 添加必要的权限
      iframe.allow = 'clipboard-read; clipboard-write'
      // 或者更完整的权限设置
      iframe.setAttribute('allow', 'clipboard-read; clipboard-write;')

      // iframe.style.transition = 'opacity 0.3s ease-in-out'

      // 保存当前 body 的 overflow 值到 data 属性
      iframe.dataset.originalOverflow = getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'

      Object.assign(iframe.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw', // 设置合适的宽度
        height: '100vh', // 设置合适的高度
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '2147483647', // 确保显示在最上层
      })

      // 监听iframe加载完成事件
      iframe.onload = async () => {
        iframe.style.opacity = '1'
        iframe.style.pointerEvents = 'auto' // iframe加载完成后启用鼠标事件
      }

      document.body.appendChild(iframe)
    }

    onMessage('background-to-content', () => {
      createIframe()
    })

    window.addEventListener('message', async (e) => {
      const { source, payload } = e.data || {}
      try {
        if (source === 'iframe-to-content') {
          // 缓存数据
          await storage.setItem<string>(
            'local:request-proxy-config',
            JSON.stringify(payload)
          )
        } else if (source === 'iframe-to-content-request-init-data') {
          const iframe = document.getElementById('request-proxy-iframe')
          if (iframe) {
            iframe.contentWindow?.postMessage(
              {
                source: 'content-to-iframe',
                payload: {
                  ...parsedConfig,
                  language: language || 'en',
                },
              },
              '*'
            )
          }
        } else if (source === 'iframe-to-content-close') {
          createIframe()
        } else if (source === 'iframe-to-content-language') {
          await storage.setItem<string>(
            'local:request-proxy-config-language',
            payload.language
          )
        }
      } catch (error) {
        // console.log(error)
      }
    })
  },
})
