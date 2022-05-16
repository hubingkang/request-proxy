let request_proxy_config = {
  enabled: false,
  list: []
};

const CONFIG = "__XHR__CONFIG__"

// 获取 url 参数
function getUrlParams(url) {
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

function isRegExp() {
  let isRegExp;
  try {
    isRegExp = eval(reg) instanceof RegExp
  } catch (e) {
    isRegExp = false
  }
  return isRegExp
}

function isJSONString(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (Object.prototype.toString.call(obj) === '[object Object]'&& obj) {
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

  return url.replace(/\?.*/, params);
}

function proxyXHRAttribute (target, attr) {
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

      // 修改 body 参数
      newBody = JSON.stringify({
        ...(cover ? {} : JSON.parse(body)), // 覆盖默认值不传入原本的 body, XHR body 是个字符串
        ...JSON.parse(request?.body)
      })
    } else {
      // 修改 body 参数
      newBody = {
        ...(cover ? {} : body), // 覆盖默认值不传入原本的 body, Fetch body 是个对象
        ...JSON.parse(request?.body)
      }
      // fetch 请求修改 query 参数
      newUrl = requestQueryHandle(url, request.query)
    }
    // isMatch = true
    // 设置请求头
    // for (const [key, value] of Object.entries(JSON.parse(request?.headers))) {
    //   xhr.setRequestHeader(key, value)
    // }
  }
  return [newUrl, newBody];
}

// 响应处理
function responseHandler(url) {
  let result;

  for (const item of request_proxy_config.list) {
    const { match, rule, enabled, response: responseConfig } = item;
    if (!enabled) continue;

    // 匹配结果
    let matchResult = false;

    if (match === 'RegExp') {
      matchResult = url.match(new RegExp(rule, 'i'));
    } else {
      matchResult = url.includes(rule)
    }

    if (!matchResult) continue;

    // 保证 responseConfig 存在并且是一个 JSON 字符串
    if (responseConfig && isJSONString(responseConfig)) {
      result = JSON.parse(responseConfig);
    }
    break;
  }

  return result;
}

// 记录请求的 xhr 和对应的参数，目前不需要，后续 Breadcrumb 可能需要
const xhrproto = XMLHttpRequest.prototype;

fill(xhrproto, 'open', function(originalOpen) {
  return function(...args) {
    // 这 this 指向的原本的 XMLHttpRequest 对象，这里只代理对象中的 open 方法
    const xhr = this;

    // 未开启拦截
    if (!request_proxy_config.enabled) return originalOpen.apply(xhr, args);

    const [method, url] = args;
    
    xhr[CONFIG] = {
      method,
      url,
    }

    const onreadystatechangeHandler = function() {
      if (xhr.readyState === 4) {
        const responseJson = responseHandler(url)
         // 下面的会被代理到 _[attr] 上
         xhr.responseText = responseJson;
         xhr.response = responseJson;
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
    const xhr = this;
    
    // 未开启拦截
    if (!request_proxy_config.enabled) return originalSend.apply(xhr, args); 
    const [body, ...rest]  = args
    const [url, newBody] = requestHandler.call(xhr, xhr[CONFIG].url, body);

    xhr[CONFIG].body = newBody;

    return originalSend.apply(xhr, [newBody, ...rest]);
  };
});


fill(window, 'fetch', function(originalFetch) {
  return function(...args) {
    let newArgs = args;

    // 开启拦截 修改请求参数
    if (request_proxy_config.enabled) {
      // 如果 args[1] 参数不存在 表示的是 一个 GET/HEAD 请求，body 为空
      if (args[1]) {
        const [url, newBody] = requestHandler.call(this, args[0], args[1].body && JSON.parse(args[1].body));
        newArgs = [url, {
          ...args[1],
          body: JSON.stringify(newBody)
        }]
      }
    };
  
    return originalFetch.apply(window, newArgs).then(
      async (response) => {
        if (!request_proxy_config.enabled) return response;
        // 如果匹配并成功修改返回值，则 responseJson 为修改后的值、否则 responseJson 为 undefined
        const responseJson = responseHandler(response.url)

        // 如果 json 未被赋予新的值，则返回原有的 response
        if (!responseJson) {
          return response
        } else {
          let cloneResponse = response.clone();
          cloneResponse.json = () => Promise.resolve(responseJson);
          return cloneResponse;
        }
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
    if (source === 'request-proxy-iframe') {
      request_proxy_config = payload;
      // console.log('%c 【wrapper】 ---- 来自 【iframe】 消息', "font-size: 20px; color: red;", payload)
    } else if (source === 'request-proxy-content') {
      request_proxy_config = payload;
      // console.log('%c 【wrapper】 ---- 来自 【content】 消息', "font-size: 20px; color: red;", payload)
    }
  } catch (error) {
    console.log(error)
  }
})
