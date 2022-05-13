window.global = window;

window.myBridge = function(val) {
  // console.log('-----myBridge')
  chrome.runtime.sendMessage(chrome.runtime.id, 'iframe-to-backgroud');
}