// import './style.css'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import { i18nConfig } from '@/components/i18nConfig.ts'
// import initTranslations from '@/components/i18n'
// import { ThemeProvider } from '@/components/theme-provider'
import { storage } from '@wxt-dev/storage'
import { sendMessage, onMessage } from 'webext-bridge/content-script'
// import wrapper from './wrapper'

// const script = document.createElement('script')
// script.setAttribute('type', 'text/javascript')
// script.setAttribute('src', browser.runtime.getURL('/wrapper1.js'))
// // script.setAttribute('id', "request-proxy-wrapper");
// document.documentElement.insertBefore(
//   script,
//   document.documentElement.firstChild
// )

export default defineContentScript({
  matches: ['*://*/*'],
  // cssInjectionMode: 'ui',
  runAt: 'document_start',

  async main(ctx) {
    // initTranslations(i18nConfig.defaultLocale, ['common', 'content'])
    // const ui = await createShadowRootUi(ctx, {
    //   name: 'language-learning-content-box',
    //   position: 'inline',
    //   onMount: (container) => {
    //     console.log(container)
    //     const root = ReactDOM.createRoot(container)
    //     root.render(
    //       <ThemeProvider>
    //         <App />
    //       </ThemeProvider>
    //     )
    //     return root
    //   },
    //   onRemove: (root) => {
    //     root?.unmount()
    //   },
    // })
    // ui.mount()

    // console.log('window', window)

    const config = await storage.getItem<string>('local:request-proxy-config')
    // window.__WRAPPER_INITIAL_CONFIG__ = config

    // CustomEvent 会冒泡到 document 层级， Content Script 可以访问页面的 DOM 事件
    // 事件系统是共享的，所以可以跨环境通信，直接 window 赋值是没法访问的，window 是隔离开的
    window.addEventListener('wrapper-ready', async () => {
      console.log('wrapper-ready', '执行了？？？')

      // wrapper 已准备就绪，发送初始化配置
      await window.postMessage(
        {
          source: 'content-to-wrapper-init-config',
          payload: config
            ? JSON.parse(config)
            : {
                enabled: false,
                list: [],
              },
        },
        '*'
      )
    })

    // 在页面上插入代码
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', browser.runtime.getURL('/wrapper.js'))
    script.fetchPriority = 'high'
    script.async = false
    script.defer = false
    // script.rel = 'preload'

    // // script.setAttribute('id', "request-proxy-wrapper");
    document.documentElement.insertBefore(
      script,
      document.documentElement.firstChild
    )
    // document.documentElement.insertBefore(
    //   script,
    //   document.documentElement.firstChild
    // )

    // wrapper()

    // const inlineScript = document.createElement('script')
    // inlineScript.textContent = `(${wrapper.toString()})();` // 将wrapper函数转为字符串并立即执行
    // document.documentElement.appendChild(inlineScript)

    // await injectScript('/wrapper.js', {
    //   keepInDom: true,
    // })

    // console.log('warpper 注入完成 content-to-wrapper')

    // setTimeout(() => {
    //   postMessage({
    //     source: 'content-to-wrapper',
    //     payload: '你好，我来自content-script',
    //   })
    // }, 1000)

    const createIframe = () => {
      const existingIframe = document.getElementById('request-proxy-iframe')

      // 如果iframe已存在
      if (existingIframe) {
        // 如果当前是隐藏状态，则显示
        if (existingIframe.style.opacity === '0') {
          existingIframe.style.opacity = '1'
          existingIframe.style.pointerEvents = 'auto' // 显示时启用鼠标事件
        } else {
          existingIframe.style.opacity = '0'
          existingIframe.style.pointerEvents = 'none' // 隐藏时禁用鼠标事件，实现点击穿透
        }
        return
      }

      const iframe = document.createElement('iframe')
      iframe.src = browser.runtime.getURL('/options.html')
      iframe.id = 'request-proxy-iframe'

      iframe.style.opacity = '0'
      iframe.style.pointerEvents = 'none' // 初始状态禁用鼠标事件
      // 添加必要的权限
      iframe.allow = 'clipboard-read; clipboard-write'
      // 或者更完整的权限设置
      iframe.setAttribute('allow', 'clipboard-read; clipboard-write;')

      // iframe.style.transition = 'opacity 0.3s ease-in-out'

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
        const config = await storage.getItem('local:request-proxy-config')
        // console.log('iframe onload 初始化 config', config)
        iframe.style.opacity = '1'
        iframe.style.pointerEvents = 'auto' // iframe加载完成后启用鼠标事件

        // 发送消息到iframe
        iframe.contentWindow?.postMessage(
          {
            source: 'content-to-iframe',
            payload: JSON.parse(config),
          },
          '*'
        )
      }

      document.body.appendChild(iframe)
    }

    // createIframe()

    onMessage('background-to-content', (message) => {
      postMessage({
        source: 'content-to-wrapper',
        payload: '你好，我来自content-script',
      })
      createIframe()
    })

    window.addEventListener('message', async (e) => {
      const { source, payload } = e.data || {}
      console.log('content ===> source', source)

      try {
        if (source === 'iframe-to-content') {
          console.log('content 收到来自 iframe 的消息', payload)

          // 缓存数据
          await storage.setItem<string>(
            'local:request-proxy-config',
            JSON.stringify(payload)
          )
        } else if (source === 'iframe-to-content-close') {
          createIframe()
        } else if (source === 'wrapper-to-content-get-init-config') {
          // console.log('content 收到来自 wrapper 的初始化配置', payload)
          // postMessage({
          //   source: 'content-to-wrapper',
          //   payload: storage.getItem('local:request-proxy-config'),
          // })
        }
      } catch (error) {
        console.log(error)
      }
    })
  },
})
