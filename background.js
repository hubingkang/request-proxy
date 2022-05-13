// let color = '#3aa757';


// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// });

chrome.action.onClicked.addListener((tab) => {
  console.log('扩展图标点击回调-background')
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  //   chrome.tabs.sendMessage(tabs[0].id, "toggle");
  // })
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, "toggle");
  })

  // chrome.scripting.executeScript({
  //   target: {tabId: tab.id},
  //   files: ['content.js']
  // });
});

const user = {
  username: 'demo-user'
};


// 这里收到消息 sendResponse 必须调用，发送端可以通过 callback 接收
// 加入 sendResponse 没有调用 会出错 : Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message', message)
  if (message === 'iframe-to-backgroud') {
    // 发送消息给 content.js 关闭 iframe 窗口
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, "toggle");
    })
    sendResponse(user);
  }
})

// // Example of a simple user data object

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   // 2. A page requested user data, respond with a copy of `user`
//   if (message === 'get-user-data') {
//     console.log('收到消息了222')

//     sendResponse(user);
//   }
// });