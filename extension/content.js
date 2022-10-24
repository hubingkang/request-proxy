// 接收 wrapper 的消息
window.addEventListener('message', function (e) {
  const { source, payload } = e.data || {}
  if (source === 'wrapper-to-content') {
    chrome.runtime.sendMessage({
      source: "content-to-background",
      payload: payload
    })
  }
})

// 接收 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { source, payload } = message;
  if (source === 'background-to-content') {
    postMessage({
      source: 'content-to-wrapper',
      payload: payload,
    });
  } 
  // if (source === 'background-to-content-hasLoadedWrapper') {
  //   // 判断是否加载了 wrapper.js
  //   const dom = document.getElementById(request-proxy-wrapper);
  //   sendResponse(!!dom);
  // }
  sendResponse();
});

// 在页面上插入代码
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('wrapper.js'));
// script.setAttribute('id', "request-proxy-wrapper");
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
  // content -> background -> content -> wrapper 多走一圈目的是将 background 的数据带过来
  chrome.runtime.sendMessage({
    source: "content-to-background",
  }, () => {
    // 当打开 panel 时，value === null。bug???
  })
});
