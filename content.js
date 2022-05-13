let request_interceptor_config = {
  enabled: true,
  list: [
    {
      name: 'test1',
      match: 'Normal',
      // rule: '/shopList/gets',
      rule: '/budd/shop/draft/examine/list',
      enabled: true,
      cover: false,
      request: {
        body: '{"offset":10}',
        query: '{"latitude":120.0145264,"longitude":30.2831792,"queryContext":"肯德基"}',
        headers: '{"test": "test"}',
      },
      // response: '{"code":0,"data":{},"msg":"ok","success":true}'
      response: '{"code":0,"data":{"total":12,"list":[{"id":1055,"name":"1全家便利店111","address":"浙江省杭州市余杭区-海创园14幢","contactName":"沧尽","contactMobile":"13313131313","typeId":261,"typeName":"超市/便利店","gmtCreate":1652169465730,"examineStatus":3,"examineRejectReason":"代理商、运营型服务商的门店不能创建商机,shopId=1112119164","examineRemark":"代理商、运营型服务商的门店不能创建商机,shopId=1112119164","shopCreateSourceEnum":"CREATE_OPPO","defaultTip":"审核中,请等待审核通过后再开始签约及安装","mobile":"13313131313","creator":617,"examineTime":1652169490440,"parentTypeName":"购物","importSubject":1,"subjectBizId":0},{"id":1054,"name":"全家便利店九","address":"浙江省杭州市余杭区-未来科技城海创园5号楼一楼","contactName":"沧尽","contactMobile":"13333333333","typeId":98,"typeName":"美容/美发","gmtCreate":1652082205742,"examineStatus":3,"examineRejectReason":"代理商、运营型服务商的门店不能创建商机,shopId=1112119115","examineRemark":"代理商、运营型服务商的门店不能创建商机,shopId=1112119115","shopCreateSourceEnum":"CREATE_OPPO","defaultTip":"审核中,请等待审核通过后再开始签约及安装","mobile":"13333333333","creator":617,"examineTime":1652082615856,"parentTypeName":"休闲娱乐","importSubject":1,"subjectBizId":0}]},"msg":"ok","success":true}'
    },
    { name: 'test2', match: 'Normal', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test3', match: 'Normal', rule: '/test', enabled: false, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test4', match: 'RegExp', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test5', match: 'Normal', rule: '/test', enabled: false, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test6', match: 'Normal', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
  ]
}

// 在页面上插入代码
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('wrapper.js'));
document.documentElement.appendChild(script);

script.addEventListener('load', () => {
  // chrome.storage.local.set({ request_interceptor_config })
  // 通过 postMessage 给 popup 改变图标的样式
  chrome.storage.local.get(['request_interceptor_config'], (result) => {
    console.log('%c 【content】初始获取【storage】', "font-size: 20px; color: green;", result)

    // 发送消息给 wrapper.js 这里发送会比代码执行早一些
    if (result['request_interceptor_config']) {
      postMessage({
        source: 'request-interceptor-content',
        payload: result?.request_interceptor_config,
      });
    }
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
        "z-index": "99 !important",
        transform: "translateX(100%) !important",
        transition: "all .4s !important",
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
          if (show) {
            // const dom = iframe.contentWindow.document.getElementById('request-interceptor-dashboard')
            // const dom = iframe.contentWindow.document
          }
        }

        chrome.storage.local.set({ request_interceptor_config })
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