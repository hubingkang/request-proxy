let request_proxy_config = {
  enabled: false,
  list: []
};

let iframe;
let iframeLoaded = false;
let unreceivedMessage = null; // 某些加载情况下会偶发消息未发送，当前存储最新的消息，保证 iframe 加载完成能更新最新的状态

// iframe 是否可见
let visible = false;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { source } = message;
  if (iframeLoaded && source === 'background-to-content') {
    visible = !visible;
    iframe.style.setProperty('transform', visible ? 'translateX(0)' : 'translateX(100%)', 'important');
  }
  sendResponse();
});

// 在页面最开始初始的时候 清空所有 state 值
chrome.storage.local.get(['request_proxy_config'], (result) => {
  // 在离开页面的时候，更新页面的状态
  const payload = result['request_proxy_config'];
  if (payload) {
    payload.list = (payload.list).map(item => ({
      ...item,
      state: [],
    }))
    chrome.storage.local.set({ request_proxy_config: payload })
  }
});

// 接收 wrapper 的消息
window.addEventListener('message', function (e) {
  const { source, payload } = e.data || {}
  if (source === 'wrapper-to-content') {
    chrome.storage.local.set({ request_proxy_config: payload })
    // 如果未加载 iframe 则不发送消息，iframe 加载完成后会从 storage 中获取最新的配置
    if (iframeLoaded) {
      unreceivedMessage = null;
      chrome.runtime.sendMessage({
        source: "content-to-iframe",
        payload,
      });
    } else {
      unreceivedMessage = payload;
    }
  }
})

// 在页面上插入代码
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('wrapper.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
  // 通过 postMessage 给 popup 改变图标的样式
  chrome.storage.local.get(['request_proxy_config'], (result) => {
    // console.log('%c 【content】初始获取【storage】', "font-size: 20px; color: green;", result)
    // 如果没有缓存数据，则设置默认值
    if (!result['request_proxy_config']) {
      // console.log('%c 【content】初始获取【storage】-- 没有数据，赋予默认值', "font-size: 20px; color: green;", result)
      chrome.storage.local.set({ request_proxy_config })
    }

    // 发送消息给 wrapper.js 这里发送会比 iframe 执行早一些
    postMessage({
      source: 'content-to-wrapper',
      payload: result?.request_proxy_config || request_proxy_config,
    });
  });
});

window.addEventListener('load', () => {
  iframe = document.createElement('iframe'); 
  iframe.id = "request-proxy";
  iframe.className = "request-proxy";

  const style = {
    height: '100vh !important',
    width: '100vw !important',
    "min-width": '1px !important',
    position: "fixed !important",
    top: '0px !important',
    right: '0px !important',
    left: '0px !important',
    bottom: "0 auto !important",
    "z-index": "999999 !important", // 设置大一些
    transform: "translateX(100%) !important",
    transition: "all .4s !important",
    border: "none",
  }

  let gatherStyle = "";
  for (let [key, value] of Object.entries(style)) {
    gatherStyle += `${key}: ${value};`
  }

  iframe.style.cssText = gatherStyle;
  iframe.src = chrome.runtime.getURL("dist/index.html")
  document.body.appendChild(iframe);
  
  iframe.onload = function() {
    iframeLoaded = true;

    // 同步 onload 之前的最新消息
    if (unreceivedMessage) {
      chrome.runtime.sendMessage({
        source: "content-to-iframe",
        payload: unreceivedMessage,
      });
      unreceivedMessage = null;
    }
  }
})
