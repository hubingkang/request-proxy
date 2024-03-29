let request_proxy_config = {
  enabled: false,
  list: []
};

const CONFIG = "__XHR__CONFIG__"

const REQUEST_PROXY_UTILS = {};
const REQUEST_PROXY_HANDLE = {};

REQUEST_PROXY_UTILS.getUrlSearch = function(str) {
  const s = new URLSearchParams(str);
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


REQUEST_PROXY_UTILS.isRegExp = function() {
  let isRegExp;
  try {
    isRegExp = eval(reg) instanceof RegExp
  } catch (e) {
    isRegExp = false
  }
  return isRegExp
}

REQUEST_PROXY_UTILS.isJSONString = function(str) {
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

REQUEST_PROXY_UTILS.queryStringify = function(obj) {
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
  return result.join("&");
}

REQUEST_PROXY_UTILS.urlIsMatched = function(url, rule) {
  // 匹配结果
  let matchResult = false;
  if (REQUEST_PROXY_UTILS.isRegExp(rule)) {
    matchResult = url.match(new RegExp(rule, 'i'));
  } else {
    matchResult = url.includes(rule)
  }
  return matchResult
}

REQUEST_PROXY_UTILS.proxyXHRAttribute = function(target, attr) {
  Object.defineProperty(target, attr, {
    get: () => target[`_${attr}`],
    set: (val) => target[`_${attr}`] = val,
    enumerable: true
  });
}

// 包装某些对象上的方法，增强函数
REQUEST_PROXY_UTILS.fill = function(source, name, replacementFactory) {
  if (!(name in source)) return;

  const original = source[name];
  const wrapped = replacementFactory(original);

  if (typeof wrapped === 'function') {
    source[name] = wrapped
  }
}

// 处理 url query
REQUEST_PROXY_HANDLE.requestQueryHandle = function (url, query) {
  const { overwritten, value } = query || {};

  if (!REQUEST_PROXY_UTILS.isJSONString(value)) return url;
  
  const params = "?" + REQUEST_PROXY_UTILS.queryStringify({
    ...(overwritten ? {} : REQUEST_PROXY_UTILS.getUrlParams(url)),
    ...JSON.parse(value),
  })
  
  let newUrl = url.replace(/\?.*/, ""); // 清除原本存在的值
  return newUrl + params; // 如果原本有值，则替换，否则追加
}

// 请求处理
REQUEST_PROXY_HANDLE.requestHandler = function (url, body, method = "GET") {
  let newUrl = url;
  let newBody = body;
  
  const isXHR = this instanceof XMLHttpRequest; // true is ajax，false is fetch

  // // 过滤 fetch 的 GET/HEAD 请求， Request with GET/HEAD method cannot have body
  // if (!isXHR && !body) return [newUrl, newBody];

  for (const index in request_proxy_config.list) {
    const { rule, enabled, request } = request_proxy_config.list[index];

    if (!enabled || !rule) continue;
    if (!REQUEST_PROXY_UTILS.urlIsMatched(url, rule)) continue;

    const state = ["MATCHED"];

    // 更新命中状态
    if (request.body?.value !== "" && !REQUEST_PROXY_UTILS.isJSONString(request.body?.value)) {
      // 设置对应值的状态
      state.push("REQUEST_BODY_JSON_ERROR")
    }
    if (request.query?.value !== "" && !REQUEST_PROXY_UTILS.isJSONString(request.query?.value)) {
      // 设置对应值的状态
      state.push("REQUEST_QUERY_JSON_ERROR")
    }
 
    request_proxy_config.list[index].state = state
    sendMessage2Content()
    
    // 1. 设置 query 参数，xhr 单独在 send 做 query 的更新。这里只为 fetch 请求修改 query 参数
    if (!isXHR) {
      newUrl = REQUEST_PROXY_HANDLE.requestQueryHandle(url, request.query)
    }

    // 2. 设置 body 参数
    // GET 和 HEAD 请求不设置 body
    if (['GET', "HEAD"].includes(method.toUpperCase())) continue;

    // // 如果 rule 符合 而 body 不符合 JSON string 格式，则不再向下匹配, 直接跳过, 避免出现两条同样的规则各匹配一部分的情况
    // if (!REQUEST_PROXY_UTILS.isJSONString(request?.body?.value)) break;
    if (!REQUEST_PROXY_UTILS.isJSONString(request?.body?.value)) continue;

    // 暂时只处理格式为 formdata 和 json 的情况  Content-Type 为 application/x-www-form-urlencoded 暂不处理
    if (!(body instanceof FormData) || !REQUEST_PROXY_UTILS.isJSONString(body)) continue;

    if (body instanceof FormData) {
      // multipart/form-data：可以上传文件或者键值对，最后都会转化为一条消息
      let formDataObj = {};
      if (request?.body?.overwritten) {
        formDataObj = {
          ...JSON.parse(request?.body?.value)
        }
      } else {
        for (let [key, value] of body.entries()) {
          formDataObj[key] = value;
        }
        formDataObj = {
          ...formDataObj,
          ...JSON.parse(request?.body?.value)
        }
      }
      
      const formData = new FormData();
      for (let [key, value] of Object.entries(formDataObj)) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
      newBody = formData;
    } else {
      // 修改 body 参数
      newBody = JSON.stringify({
        ...(request?.body?.overwritten ? {} : JSON.parse(body)),
        ...JSON.parse(request?.body.value)
      })
    }
  }

  return [newUrl, newBody];
}

// 响应处理
REQUEST_PROXY_HANDLE.responseHandler = function(url) {
  let result;

  for (const index in request_proxy_config.list) {
    const { rule, enabled, response } = request_proxy_config.list[index];
    if (!enabled || !rule) continue;

    if (!REQUEST_PROXY_UTILS.urlIsMatched(url, rule)) continue;

    // 更新命中状态
    const state = []
    if (response !== "" && !REQUEST_PROXY_UTILS.isJSONString(response)) {
      // 设置对应值的状态
      state.push("RESPONSE_JSON_ERROR")
    }
    request_proxy_config.list[index].state.push(...state);
    sendMessage2Content()

    // 保证 response 存在并且是一个 JSON 字符串
    if (REQUEST_PROXY_UTILS.isJSONString(response)) {
      result = JSON.parse(response);
    }
    break;
  }

  return result;
}


const xhrproto = XMLHttpRequest.prototype;

REQUEST_PROXY_UTILS.fill(xhrproto, 'open', function(originalOpen) {
  return function(...args) {
    // 这 this 指向的原本的 XMLHttpRequest 对象，这里只代理对象中的 open 方法
    const xhr = this;

    // 未开启拦截
    if (!request_proxy_config.enabled) return originalOpen.apply(xhr, args);

    const [method, url, ...restArgs] = args;
    let newUrl = url;

    for (const index in request_proxy_config.list) {
      const { rule, enabled, request } = request_proxy_config.list[index];

      if (!enabled || !rule) continue;
      if (!REQUEST_PROXY_UTILS.urlIsMatched(url, rule)) continue;

      newUrl = REQUEST_PROXY_HANDLE.requestQueryHandle(url, request.query);
      break;
    }

    xhr[CONFIG] = { method, url: newUrl };

    const onreadystatechangeHandler = function() {
      if (xhr.readyState === 4) {
        const responseJson = REQUEST_PROXY_HANDLE.responseHandler(newUrl);
        // 如果待修改的 responseJson 有值，则代理响应结果
        if (responseJson) {
          // 代理 xhr 属性 - 目的是代理劫持返回数据
          REQUEST_PROXY_UTILS.proxyXHRAttribute(this, 'responseText');
          REQUEST_PROXY_UTILS.proxyXHRAttribute(this, 'response');

          // 下面的会被代理到 _[attr] 上
          xhr.responseText = responseJson;
          xhr.response = responseJson;
        }
      }
    };

    if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
      REQUEST_PROXY_UTILS.fill(xhr, 'onreadystatechange', function(original) {
        return function(...readyStateArgs) {
          onreadystatechangeHandler();
          return original.apply(xhr, readyStateArgs);
        }; 
      });
    } else {
      xhr.addEventListener('readystatechange', onreadystatechangeHandler);
    }
    
    return originalOpen.apply(xhr, [method, newUrl, ...restArgs]);
  };
});

// send 函数中只能获取 body 参数
REQUEST_PROXY_UTILS.fill(xhrproto, 'send', function(originalSend) {
  return function(...args) {
    const xhr = this;
    
    // 未开启拦截
    if (!request_proxy_config.enabled) return originalSend.apply(xhr, args); 
    const [body, ...rest]  = args
    const { method, url } = xhr[CONFIG];
    const [newUrl, newBody] = REQUEST_PROXY_HANDLE.requestHandler.apply(xhr, [url, body, undefined, method]);
    xhr[CONFIG].body = newBody;

    return originalSend.apply(xhr, [...(newBody ? [newBody] : []), ...rest]);
  };
});

REQUEST_PROXY_UTILS.fill(window, 'fetch', function(originalFetch) {
  return async function(...args) {
    let newArgs = args;
    // 开启拦截 修改请求参数
    if (request_proxy_config.enabled) {
      const isFromRequest = args[0] instanceof Request;
      if (isFromRequest) {
        const originRequest = args[0];
        // 这里需要用解构，会从原型上去获取解构的值，如果使用展开运算符无法获取到值
        // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
        const { bodyUsed, cache, credentials, destination, headers, integrity, method, mode, priority, redirect, referrer, referrerPolicy, url } = originRequest
        let requestBody = undefined;
        try {
          // 如果未走 catch  表示 body 获取成功
          requestBody = await originRequest.clone().json()
        } catch (error) {
        }

        const [newUrl, newBody] = REQUEST_PROXY_HANDLE.requestHandler.apply(this, [ url, requestBody && JSON.stringify(requestBody), method ]);

        // 这三个有一个改变都重新创建一个新的 request
        if (newUrl !== url || newBody !== requestBody) {
          const newRequest = new Request(newUrl, {
            bodyUsed,
            cache,
            credentials,
            destination,
            headers,
            integrity,
            method,
            mode,
            priority,
            redirect,
            referrer,
            referrerPolicy,
            ...(requestBody ? {body: newBody}: {}),
          });
          newArgs = [newRequest]
        }
      } else {
        const { method, body } = args[1] || {};
        // 如果 args[1] 参数不存在 表示的是 一个 GET/HEAD 请求，body 为空
        const [newUrl, newBody] = REQUEST_PROXY_HANDLE.requestHandler.apply(this, [args[0], body, method]);

        newArgs = [newUrl, {
          ...args[1],
          ...(body ? { body: newBody } : {}), // 如果原本 body 存在，则设置为新的值
        }]
      }
    };
  
    return originalFetch.apply(window, newArgs).then(
      (response) => {
        if (!request_proxy_config.enabled) return response;
        // 如果匹配并成功修改返回值，则 responseJson 为修改后的值、否则 responseJson 为 undefined
        const responseJson = REQUEST_PROXY_HANDLE.responseHandler(response.url)

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
    if (source === 'content-to-wrapper') {
      request_proxy_config = payload;
      // console.log('%c 【wrapper】 ---- 来自 【content】 消息', "font-size: 20px; color: red;", payload)
    }
  } catch (error) {
    console.log(error)
  }
})

function sendMessage2Content() {
  postMessage({
    source: 'wrapper-to-content',
    payload: request_proxy_config,
  }, "*");
}