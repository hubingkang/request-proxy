let request_proxy_config = {
  enabled: false,
  list: []
};

// 在页面上插入代码
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('wrapper.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
  // 通过 postMessage 给 popup 改变图标的样式
  chrome.storage.local.get(['request_proxy_config'], (result) => {
    console.log('%c 【content】初始获取【storage】', "font-size: 20px; color: green;", result)
    
    // 如果没有缓存数据，则设置默认值
    if (!result['request_proxy_config']) {
      console.log('%c 【content】初始获取【storage】-- 没有数据，赋予默认值', "font-size: 20px; color: green;", result)
      chrome.storage.local.set({ request_proxy_config })
    }

    // 发送消息给 wrapper.js 这里发送会比 iframe 执行早一些
    postMessage({
      source: 'request-interceptor-content',
      payload: result?.request_proxy_config || request_proxy_config,
    });
  });
});

let iframe;
let iframeLoaded = false;

// 只在最顶层页面嵌入iframe
if (window.self === window.top) {
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      iframe = document.createElement('iframe'); 
      iframe.id = "request-interceptor";
      iframe.className = "request-interceptor";

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
        // "box-shadow": "0 0 15px 2px rgba(0,0,0,0.12) !important",
      }

      let gatherStyle = "";
      for (let [key, value] of Object.entries(style)) {
        gatherStyle += `${key}: ${value};`
      }

      iframe.style.cssText = gatherStyle;
      iframe.src = chrome.runtime.getURL("dist/index.html")
      document.body.appendChild(iframe);
      let show = false;

      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg === 'toggle') {
          show = !show;
          iframe.style.setProperty('transform', show ? 'translateX(0)' : 'translateX(100%)', 'important');
        }

        // chrome.storage.local.set({ request_proxy_config })
        sendResponse();
      });
    }
  }
}

// chrome.runtime.sendMessage('get-user-data', (response) => {
//   // 3. Got an asynchronous response with the data from the background
//   console.log('received user data', response);
//   // initializeUI(response);
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('message111111', message)
//   sendResponse()
// })