let request_proxy_config = {
  enabled: false,
  list: []
};

const CONFIG = "__XHR__CONFIG__"
const getUrlParams = (url) => {
  const u = new URL(url);
  const s = new URLSearchParams(u.search);
  const obj = {};
  s.forEach((v, k) => {
    if (obj.hasOwnProperty(k)) {
      if (!Array.isArray(obj[k])) {
        obj[k] = [obj[k]]
      }
      obj[k].push(v);
    } else {
      obj[k] = v
    }
  });
  return obj;
}

const isRegExp = () => {
  let isRegExp;
  try {
    isRegExp = eval(reg) instanceof RegExp
  } catch (e) {
    isRegExp = false
  }
  return isRegExp
}

const isJSONString = (str) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

// 请求处理
function requestHandler(url, body) {
  let newUrl = url;
  let newBody = body;

  const isXHR = this instanceof XMLHttpRequest; // true is ajax，false is fetch

  // 过滤 fetch 的 GET/HEAD 请求， Request with GET/HEAD method cannot have body
  if (!isXHR && !body) return [newUrl, newBody];

  for (const item of request_proxy_config.list) {
    const { match, rule, enabled, cover, request } = item;
    if (!enabled) continue;

    // 匹配结果
    let matchResult = false;

    if (match === 'RegExp') {
      matchResult = url.match(new RegExp(rule, 'i'));
    } else {
      matchResult = url.includes(rule)
    }

    if (!matchResult) continue;

    // 如果 body 不符合 JSON string 格式，跳过
    if (!isJSONString(request?.body)) break;

    // 当前请求来自 ajax
    if (isXHR) {
      // 代理 xhr 属性 - 目的是代理劫持返回数据
      proxyXHRAttribute(this, 'responseText')
      proxyXHRAttribute(this, 'response')
    } else {
      // fetch 请求修改 query 参数
      newUrl = requestQueryHandle(url, request.query)
      console.log('%c requestHandler--- 修改 newUrl111', "font-size: 20px; color: green;", newUrl)
    }
  
    // 修改 body 参数
    newBody = {
      ...(cover ? {} : body), // 覆盖默认值不传入原本的 body
      ...JSON.parse(request?.body)
    }

    // console.log(this)

    // isMatch = true
    // 设置请求头
    // for (const [key, value] of Object.entries(JSON.parse(request?.headers))) {
    //   xhr.setRequestHeader(key, value)
    // }

    console.log('%c requestHandler---匹配到指定 url', "font-size: 20px; color: green;", this, newBody)
  }

  // console.log('%c requestHandler ---false', "font-size: 20px; color: green;", this, newBody)

  return [newUrl, newBody];
}

function stringify(obj) {
  let result = [];
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value === 'function' || value === undefined) continue;

    if (Object.prototype.toString.call(value) === '[object Object]') {
      result.push(`${key}=${JSON.stringify(value)}`)
    } else if (Array.isArray(value)) {
      // arr = [1, 2, 3] => arr=1&arr=2&arr=3
      for (let v of value) {
        result.push(`${key}=${v}`)
      }
    } else {
      result.push(`${key}=${value}`)
    }
  }
  return result;
}

// 处理 url query
function requestQueryHandle (url, query) {
  if (!isJSONString(query)) return url;
  const res = getUrlParams(url)

  const params = "?" + stringify({
    ...res,
    ...JSON.parse(query),
  }).join('&')

  console.log('%c requestQueryHandle --- query', "font-size: 20px; color: green;", url.replace(/\?.*/, params))
  return url.replace(/\?.*/, params);
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
    if (!request_proxy_config.enabled) return originalOpen.apply(xhr, args);

    xhr[CONFIG] = {
      method: args[0],
      url: args[1],
    }

    const onreadystatechangeHandler = function() {
      if (xhr.readyState === 4) {
        for (const item of request_proxy_config.list) {
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
          // console.log('%c Response---匹配到指定 url', "font-size: 20px; color: red;", response)
        }
      }
    };

    if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
      fill(xhr, 'onreadystatechange', function(original) {
        return function(...readyStateArgs) {
          onreadystatechangeHandler();
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
    // console.log('%c send---', "color: red;",  args, request_proxy_config)
    const xhr = this;
    
    // 未开启拦截
    if (!request_proxy_config.enabled) return originalSend.apply(xhr, args); 
    const [body, ...rest]  = args
    const [url, newBody] = requestHandler.call(xhr, xhr[CONFIG].url, body);

    xhr[CONFIG].body = newBody;

    return originalSend.apply(xhr, [JSON.stringify(newBody), ...rest]);
  };
});


fill(window, 'fetch', function(originalFetch) {
  return function(...args) {
    let newArgs = args;

    // console.log('%c Response---匹配到指定 fetch', "font-size: 20px; color: red;", args)
    // 开启拦截 修改请求参数
    if (request_proxy_config.enabled) {
      const [url, newBody] = requestHandler.call(this, args[0], args[1].body && JSON.parse(args[1].body));
      newArgs = [url, {
        ...args[1],
        body: JSON.stringify(newBody)
      }]
    };

    // console.log('%c Response---匹配到指定 fetch', "font-size: 20px; color: red;", args[1].body, newArgs)

  
    return originalFetch.apply(window, newArgs).then(
      async (response) => {
        if (!request_proxy_config.enabled) return response;
        // https://stackoverflow.com/questions/50728411/how-to-inspect-fetch-call-and-return-same-call
        cloneResponse = response.clone();
        let json = response.json();

        for (const item of request_proxy_config.list) {
          const { match, rule, enabled, response: responseConfig } = item;
          if (!enabled) continue;
    
          // 匹配结果
          let matchResult = false;
    
          if (match === 'RegExp') {
            matchResult = cloneResponse.url.match(new RegExp(rule, 'i'));
          } else {
            matchResult = cloneResponse.url.includes(rule)
          }
    
          if (!matchResult) continue;
          json = JSON.parse(responseConfig);
          break;
        }
  
        cloneResponse.json = () => Promise.resolve(json);
        return cloneResponse;
      },
      (error) => {
        throw error;
      },
    )
  };
});

// 接收 iframe 的消息 - 修改 request_proxy_config
window.addEventListener('message', function (e) {
  const { source, payload } = e.data || {}
  try {
    if (source === 'request-interceptor-iframe') {
      request_proxy_config = payload;
      console.log('%c 【wrapper】 ---- 来自 【iframe】 消息', "font-size: 20px; color: red;", payload)
    } else if (source === 'request-interceptor-content') {
      request_proxy_config = payload;
      console.log('%c 【wrapper】 ---- 来自 【content】 消息', "font-size: 20px; color: red;", payload)
    }
  } catch (error) {
    console.log(error)
  }
})


// window.onload = () => {
//   const iframe = document.getElementById('request-interceptor')
//   console.log('iframe', iframe)

//   iframe.onload = () => {
//     iframe.contentWindow.postMessage({name: '对弈'}, '*')
//   }
// }