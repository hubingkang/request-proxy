let color = '#3aa757';

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// });

chrome.action.onClicked.addListener((tab) => {
  console.log('点击了')
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