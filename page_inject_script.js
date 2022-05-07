// 在页面上插入代码
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('wrapper.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
  // 通过 postMessage 给 popup 改变图标的样式
  // chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules'], (result) => {
  //   if (result.hasOwnProperty('ajaxInterceptor_switchOn')) {
  //     postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'ajaxInterceptor_switchOn', value: result.ajaxInterceptor_switchOn});
  //   }
  //   if (result.ajaxInterceptor_rules) {
  //     postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'ajaxInterceptor_rules', value: result.ajaxInterceptor_rules});
  //   }
  // });
});

let iframe;
let iframeLoaded = false;

// 只在最顶层页面嵌入iframe
if (window.self === window.top) {
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      iframe = document.createElement('iframe'); 
      iframe.className = "api-interceptor";
      iframe.style.setProperty('height', '100%', 'important');
      iframe.style.setProperty('width', '450px', 'important');
      iframe.style.setProperty('min-width', '1px', 'important');
      iframe.style.setProperty('position', 'fixed', 'important');
      iframe.style.setProperty('top', '0', 'important');
      iframe.style.setProperty('right', '0', 'important');
      iframe.style.setProperty('left', 'auto', 'important');
      iframe.style.setProperty('bottom', 'auto', 'important');
      iframe.style.setProperty('z-index', '9999999999999', 'important');
      iframe.style.setProperty('transform', 'translateX(470px)', 'important');
      iframe.style.setProperty('transition', 'all .4s', 'important');
      iframe.style.setProperty('box-shadow', '0 0 15px 2px rgba(0,0,0,0.12)', 'important');
      iframe.frameBorder = "none"; 
      iframe.src = chrome.runtime.getURL("dist/index.html")
      document.body.appendChild(iframe);
      let show = false;

      chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg == 'toggle') {
          show = !show;
          iframe.style.setProperty('transform', show ? 'translateX(0)' : 'translateX(470px)', 'important');
        }

        return true;
      });
    }
  }
}