let request_interceptor_config = {};

// let request_interceptor_config = {
//   enabled: true,
//   list: [
//     {
//       name: 'test1',
//       match: 'Normal',
//       // rule: '/shopList/gets',
//       rule: '/budd/shop/draft/examine/list',
//       enabled: true,
//       cover: false,
//       request: {
//         body: '{"offset":10}',
//         query: '{"latitude":120.0145264,"longitude":30.2831792,"queryContext":"肯德基"}',
//         headers: '{"test": "test"}',
//       },
//       // response: '{"code":0,"data":{},"msg":"ok","success":true}'
//       response: '{"code":0,"data":{"total":12,"list":[{"id":1055,"name":"1全家便利店111","address":"浙江省杭州市余杭区-海创园14幢","contactName":"沧尽","contactMobile":"13313131313","typeId":261,"typeName":"超市/便利店","gmtCreate":1652169465730,"examineStatus":3,"examineRejectReason":"代理商、运营型服务商的门店不能创建商机,shopId=1112119164","examineRemark":"代理商、运营型服务商的门店不能创建商机,shopId=1112119164","shopCreateSourceEnum":"CREATE_OPPO","defaultTip":"审核中,请等待审核通过后再开始签约及安装","mobile":"13313131313","creator":617,"examineTime":1652169490440,"parentTypeName":"购物","importSubject":1,"subjectBizId":0},{"id":1054,"name":"全家便利店九","address":"浙江省杭州市余杭区-未来科技城海创园5号楼一楼","contactName":"沧尽","contactMobile":"13333333333","typeId":98,"typeName":"美容/美发","gmtCreate":1652082205742,"examineStatus":3,"examineRejectReason":"代理商、运营型服务商的门店不能创建商机,shopId=1112119115","examineRemark":"代理商、运营型服务商的门店不能创建商机,shopId=1112119115","shopCreateSourceEnum":"CREATE_OPPO","defaultTip":"审核中,请等待审核通过后再开始签约及安装","mobile":"13333333333","creator":617,"examineTime":1652082615856,"parentTypeName":"休闲娱乐","importSubject":1,"subjectBizId":0}]},"msg":"ok","success":true}'
//     },
//     { name: 'test2', match: 'Normal', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
//     { name: 'test3', match: 'Normal', rule: '/test', enabled: false, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
//     { name: 'test4', match: 'RegExp', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
//     { name: 'test5', match: 'Normal', rule: '/test', enabled: false, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
//     { name: 'test6', match: 'Normal', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
//   ]
// }

// const CONFIG = "REQUEST_INTERCEPTOR_CONFIG"
const CONFIG = "__XHR__CONFIG__"

const utils = {
  getUrlParams: (url) => {
    const u = new URL(url);
    const s = new URLSearchParams(u.search);
    console.log('s', s)
    const obj = {};
    s.forEach((v, k) => (obj[k] = v));
    return obj;
  },
  isRegExp: () => {
    let isRegExp;
    try {
      isRegExp = eval(reg) instanceof RegExp
    } catch (e) {
      isRegExp = false
    }
    return isRegExp
  }
}

const proxyXHRAttribute = (target, attr) => {
  Object.defineProperty(target, attr, {
    get: () => target[`_${attr}`],
    set: (val) => target[`_${attr}`] = val,
    enumerable: true
  });
}

// 包装某些对象上的方法，增强函数
function fill(source, name, replacementFactory) {
  if (!(name in source)) return;

  const original = source[name];
  const wrapped = replacementFactory(original);

  if (typeof wrapped === 'function') {
    source[name] = wrapped
  }
}

// 记录请求的 xhr 和对应的参数，目前不需要，后续 Breadcrumb 可能需要
const xhrproto = XMLHttpRequest.prototype;

fill(xhrproto, 'open', function(originalOpen) {
  return function(...args) {
    // 这 this 指向的原本的 XMLHttpRequest 对象，这里只代理对象中的 open 方法
    const xhr = this;

    // 未开启拦截
    if (!request_interceptor_config.enabled) return originalOpen.apply(xhr, args);

    xhr[CONFIG] = {
      method: args[0],
      url: args[1],
    }

    const onreadystatechangeHandler = function() {
      if (xhr.readyState === 4) {
        for (const item of request_interceptor_config.list) {
          const { match, rule, enabled, response } = item;
          if (!enabled) continue;
    
          // 匹配结果
          let matchResult = false;
    
          if (match === 'RegExp') {
            matchResult = xhr[CONFIG].url.match(new RegExp(rule, 'i'));
          } else {
            matchResult = xhr[CONFIG].url.includes(rule)
          }
    
          if (!matchResult) continue;
    
          // 下面的会被代理到 _[attr] 上
          xhr.responseText = response;
          xhr.response = response;
          console.log('%c Response---匹配到指定 url', "font-size: 20px; color: red;", xhr)
        }
      }
    };

    if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
      fill(xhr, 'onreadystatechange', function(original) {
        return function(...readyStateArgs) {
          // onreadystatechangeHandler();
          return original.apply(xhr, readyStateArgs);
        }; 
      });
    } else {
      xhr.addEventListener('readystatechange', onreadystatechangeHandler);
    }
    
    return originalOpen.apply(xhr, args);
  };
});

// send 函数中只能获取 body 参数
fill(xhrproto, 'send', function(originalSend) {
  return function(...args) {
    console.log('%c send---', "color: red;",  args, request_interceptor_config)
    const xhr = this;
    
    // 未开启拦截
    if (!request_interceptor_config.enabled) return originalSend.apply(xhr, args); 

    for (const item of request_interceptor_config.list) {
      const { match, rule, enabled, cover, request, response } = item;
      if (!enabled) continue;

      // 匹配结果
      let matchResult = false;

      if (match === 'RegExp') {
        matchResult = xhr[CONFIG].url.match(new RegExp(rule, 'i'));
      } else {
        matchResult = xhr[CONFIG].url.includes(rule)
      }

      if (!matchResult) continue;

      // 代理 xhr 属性 - 目的是代理劫持返回数据
      proxyXHRAttribute(xhr, 'responseText')
      proxyXHRAttribute(xhr, 'response')

      let newBody;

      // 修改 body
      // 是否为覆盖模式
      if (cover) {
        newBody = {
          ...JSON.parse(request?.body)
        }
      } else {
        newBody = {
          ...JSON.parse(args[0]),
          ...JSON.parse(request?.body)
        }
      }

      // 设置请求头
      // for (const [key, value] of Object.entries(JSON.parse(request?.headers))) {
      //   xhr.setRequestHeader(key, value)
      // }

      // console.log(xhr.headers)

      console.log('%c send---匹配到指定 url', "font-size: 20px; color: green;", xhr.headers)
      xhr[CONFIG].body = newBody;

      return originalSend.apply(xhr, [JSON.stringify(newBody)]);
    }
    return originalSend.apply(xhr, args);
  };
});


// 接收 iframe 的消息 - 修改 request_interceptor_config
window.addEventListener('message', function (e) {
  const { source, payload } = e.data || {}
  try {
    if (source === 'request-interceptor-iframe') {
      request_interceptor_config = payload;
      console.log('%c 【wrapper】 ---- 来自 【iframe】 消息', "font-size: 20px; color: red;", payload)
    } else if (source === 'request-interceptor-content') {
      request_interceptor_config = payload;
      console.log('%c 【wrapper】 ---- 来自 【content】 消息', "font-size: 20px; color: red;", payload)
    }
  } catch (error) {
    console.log(error)
  }
})


window.onload = () => {
  const iframe = document.getElementById('request-interceptor')
  console.log('iframe', iframe)

  iframe.onload = () => {
    iframe.contentWindow.postMessage({name: '对弈'}, '*')
  }
}