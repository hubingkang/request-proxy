chrome.action.onClicked.addListener((tab) => {
  // console.log('扩展图标点击回调-background')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {
      source: "background-to-content",
    });
  })
});

// 这里收到消息 sendResponse 必须调用，发送端可以通过 callback 接收
// 加入 sendResponse 没有调用 会出错 : Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log('background 收到了 【content-to-backgroud', message)
  const { source } = message;

  if (source === 'iframe-to-backgroud') {
    sendResponse();

    // 发送消息给 content.js 关闭 iframe 窗口
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {
        source: "background-to-content"
      });
    })
  }
  sendResponse();
})
