import queryString from 'query-string'

const CONFIG = '__PROXY__XHR__CONFIG__'

declare global {
  interface XMLHttpRequest {
    [CONFIG]: {
      method: string
      url: string
      body?: any
    }
    _responseText: string
    _response: any
  }
}

interface RequestProxyRule {
  id: string
  rule: string
  method: string
  enabled: boolean
  state: string
  query: string
  body: string
  headers: string
  response: string
}

interface RequestProxyConfig {
  enabled: boolean
  list: RequestProxyRule[]
}

export default defineUnlistedScript(async () => {
  let configs: RequestProxyConfig = {
    enabled: false,
    list: [],
  }

  console.log('========> wrapper.js 执行了')

  // 发送准备就绪事件 -- content 接收到消息 将初始化数据传入
  await window.dispatchEvent(new CustomEvent('wrapper-ready'))

  console.log('===== configs =====', configs)

  const urlIsMatched = (url: string, rule: string): boolean => {
    try {
      return new RegExp(rule, 'i').test(url)
    } catch {
      return url.toLowerCase().includes(rule.toLowerCase())
    }
  }

  const isJSONString = (str: string): boolean => {
    // 首先判断是否为字符串类型
    if (typeof str !== 'string') return false

    // 去除首尾空格
    str = str.trim()

    // 快速判断：JSON 必须以 { 或 [ 开始，以 } 或 ] 结束
    if (
      !(str.startsWith('{') || str.startsWith('[')) ||
      !(str.endsWith('}') || str.endsWith(']'))
    ) {
      return false
    }

    try {
      // 尝试解析
      const result = JSON.parse(str)
      // JSON 数据必须是对象或数组
      return result !== null && typeof result === 'object'
    } catch {
      return false
    }
  }

  const proxyXHRAttribute = (target: any, attr: string) => {
    Object.defineProperty(target, attr, {
      get: () => target[`_${attr}`],
      set: (val) => (target[`_${attr}`] = val),
      enumerable: true,
    })
  }

  // 包装某些对象上的方法，增强函数
  const fill = (source: any, name: string, replacementFactory: any) => {
    if (!(name in source)) return

    const original = source[name]
    const wrapped = replacementFactory(original)

    if (typeof wrapped === 'function') {
      source[name] = wrapped
    }
  }

  // 处理 url query
  const requestQueryHandle = (url: string, queryStr: string) => {
    if (!isJSONString(queryStr)) return url
    try {
      const params = queryString.stringify(JSON.parse(queryStr))

      const baseUrl = url.split('?')[0]
      return params ? `${baseUrl}?${params}` : baseUrl
    } catch (error) {
      console.error('Query handling error:', error)
      return url
    }
  }

  // 请求处理
  const requestHandler = function (
    this: XMLHttpRequest,
    url: string,
    body: any,
    method: string = 'GET'
  ) {
    try {
      console.log('========> requestHandler', url)

      let newUrl = url
      let newBody = body

      const isXHR = this instanceof XMLHttpRequest // true is ajax，false is fetch

      for (const config of configs.list) {
        if (!urlIsMatched(url, config.rule)) continue
        if (method.toUpperCase() !== config.method.toUpperCase()) continue

        const state = 'MATCHED'

        config.state = state
        sendMessage2Content()

        // 1. 设置 query 参数，xhr 单独在 send 做 query 的更新。这里只为 fetch 请求修改 query 参数
        if (!isXHR) {
          newUrl = requestQueryHandle(url, config.query)
        }

        // 处理 body
        if (!['GET', 'HEAD'].includes(method.toUpperCase()) && config.body) {
          try {
            if (body instanceof FormData) {
              const formData = new FormData()
              const newBodyObj = JSON.parse(config.body)

              // 先添加原有的 FormData 内容
              for (const [key, value] of body.entries()) {
                formData.append(key, value)
              }

              // 再添加/覆盖新的内容
              for (const [key, value] of Object.entries(newBodyObj)) {
                formData.append(key, value)
              }

              newBody = formData
            } else if (typeof body === 'string' && isJSONString(body)) {
              newBody = JSON.stringify({
                ...JSON.parse(body),
                ...JSON.parse(config.body),
              })
            } else if (!body) {
              newBody = config.body
            }
          } catch (e) {
            // state.push('BODY_ERROR')
          }
        }

        // // 2. 设置 body 参数
        // // GET 和 HEAD 请求不设置 body
        // if (['GET', 'HEAD'].includes(method.toUpperCase())) continue

        // // // 如果 rule 符合 而 body 不符合 JSON string 格式，则不再向下匹配, 直接跳过, 避免出现两条同样的规则各匹配一部分的情况
        // // if (!isJSONString(request?.body?.value)) break;
        // if (!isJSONString(request?.body?.value)) continue

        // // 暂时只处理格式为 formdata 和 json 的情况  Content-Type 为 application/x-www-form-urlencoded 暂不处理
        // if (!(body instanceof FormData) || !isJSONString(body)) continue

        // if (body instanceof FormData) {
        //   // multipart/form-data：可以上传文件或者键值对，最后都会转化为一条消息
        //   let formDataObj = {}
        //   if (request?.body?.overwritten) {
        //     formDataObj = {
        //       ...JSON.parse(request?.body?.value),
        //     }
        //   } else {
        //     for (let [key, value] of body.entries()) {
        //       formDataObj[key] = value
        //     }
        //     formDataObj = {
        //       ...formDataObj,
        //       ...JSON.parse(request?.body?.value),
        //     }
        //   }

        //   const formData = new FormData()
        //   for (let [key, value] of Object.entries(formDataObj)) {
        //     formData.append(
        //       key,
        //       typeof value === 'object' ? JSON.stringify(value) : value
        //     )
        //   }
        //   newBody = formData
        // } else {
        //   // 修改 body 参数
        //   newBody = JSON.stringify({
        //     // ...(request?.body?.overwritten ? {} : JSON.parse(body)),
        //     ...JSON.parse(request?.body),
        //   })
        // }
      }

      return [newUrl, newBody]
    } catch (error) {
      console.error('Request handler error:', error)
      return [url, body]
    }
  }

  // 响应处理
  const responseHandler = function (url: string) {
    try {
      for (const rule of configs.list) {
        if (!urlIsMatched(url, rule.rule)) continue

        sendMessage2Content()
        // 保证 response 存在并且是一个 JSON 字符串
        if (rule.response && isJSONString(rule.response)) {
          return JSON.parse(rule.response)
        }
        return undefined
      }
    } catch (error) {
      console.error('Response handler error:', error)
      return undefined
    }
  }

  const xhrproto = XMLHttpRequest.prototype

  fill(xhrproto, 'open', function (this: XMLHttpRequest, originalOpen: any) {
    return function (this: XMLHttpRequest, ...args: any[]) {
      // 这 this 指向的原本的 XMLHttpRequest 对象，这里只代理对象中的 open 方法
      const xhr = this

      // 未开启拦截
      if (!configs.enabled) return originalOpen.apply(xhr, args)

      const [method, url, ...restArgs] = args

      // 添加 url 的 query 参数
      const newUrl = configs.list.reduce((currentUrl, config) => {
        if (urlIsMatched(url, config.rule)) {
          return requestQueryHandle(currentUrl, config.query)
        }
        return currentUrl
      }, url)

      xhr[CONFIG] = { method, url: newUrl }

      const handleReadyStateChange = () => {
        if (xhr.readyState === 4) {
          const responseJson = responseHandler(newUrl)
          // 如果待修改的 responseJson 有值，则代理响应结果
          if (responseJson) {
            // 代理 xhr 属性 - 目的是代理劫持返回数据
            proxyXHRAttribute(xhr, 'responseText')
            proxyXHRAttribute(xhr, 'response')

            // 下面的会被代理到 _[attr] 上
            xhr._responseText = responseJson
            xhr._response = responseJson
          }
        }
      }

      // 添加 onreadystatechange 事件
      if (typeof xhr.onreadystatechange === 'function') {
        fill(xhr, 'onreadystatechange', function (original: Function) {
          return function (...readyStateArgs: any[]) {
            handleReadyStateChange()
            return original.apply(xhr, readyStateArgs)
          }
        })
      } else {
        xhr.addEventListener('readystatechange', handleReadyStateChange)
      }

      return originalOpen.apply(xhr, [method, newUrl, ...restArgs])
    }
  })

  // send 函数中只能获取 body 参数
  fill(
    xhrproto,
    'send',
    function (this: XMLHttpRequest, originalSend: Function) {
      return function (this: XMLHttpRequest, ...args: any[]) {
        const xhr = this

        // 未开启拦截
        if (!configs.enabled) return originalSend.apply(xhr, args)
        const [body, ...rest] = args
        const { method, url } = xhr[CONFIG]
        const [newUrl, newBody] = requestHandler.apply(xhr, [url, body, method])
        xhr[CONFIG].body = newBody

        return originalSend.apply(xhr, [...(newBody ? [newBody] : []), ...rest])
      }
    }
  )

  fill(window, 'fetch', function (originalFetch: typeof fetch) {
    return async function (...args: any[]) {
      console.log(
        '================ configs.enabled=============configs.enabled',
        configs.enabled
      )

      if (!configs.enabled) {
        return originalFetch.apply(window, args)
      }

      console.log('========> fetch 拦截', args[0])

      try {
        // let newArgs = args
        // // 开启拦截 修改请求参数
        // const isFromRequest = args[0] instanceof Request
        // if (isFromRequest) {
        //   console.log('========> fetch 拦截 是 Request 对象')
        //   const originRequest = args[0]
        //   // 这里需要用解构，会从原型上去获取解构的值，如果使用展开运算符无法获取到值
        //   // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
        //   const {
        //     bodyUsed,
        //     cache,
        //     credentials,
        //     destination,
        //     headers,
        //     integrity,
        //     method,
        //     mode,
        //     priority,
        //     redirect,
        //     referrer,
        //     referrerPolicy,
        //     url,
        //   } = originRequest
        //   let requestBody = undefined
        //   try {
        //     // 如果未走 catch  表示 body 获取成功
        //     requestBody = await originRequest.clone().json()
        //   } catch (error) {}

        //   const [newUrl, newBody] = requestHandler.apply(this, [
        //     url,
        //     requestBody && JSON.stringify(requestBody),
        //     method,
        //   ])

        //   // 这三个有一个改变都重新创建一个新的 request
        //   if (newUrl !== url || newBody !== requestBody) {
        //     const newRequest = new Request(newUrl, {
        //       bodyUsed,
        //       cache,
        //       credentials,
        //       destination,
        //       headers,
        //       integrity,
        //       method,
        //       mode,
        //       priority,
        //       redirect,
        //       referrer,
        //       referrerPolicy,
        //       ...(requestBody ? { body: newBody } : {}),
        //     })
        //     newArgs = [newRequest]
        //   }
        // } else {
        //   const { method, body } = args[1] || {}
        //   console.log('========> fetch 拦截 不是 Request 对象')

        //   // 如果 args[1] 参数不存在 表示的是 一个 GET/HEAD 请求，body 为空
        //   const [newUrl, newBody] = requestHandler.apply(this, [
        //     args[0],
        //     body,
        //     method,
        //   ])

        //   newArgs = [
        //     newUrl,
        //     {
        //       ...args[1],
        //       ...(body ? { body: newBody } : {}), // 如果原本 body 存在，则设置为新的值
        //     },
        //   ]
        // }

        let request: Request
        // 统一转换为 Request 对象
        if (args[0] instanceof Request) {
          request = args[0].clone() // 克隆以避免 body 被消费
        } else {
          const url = args[0]
          const options = args[1] || {}
          request = new Request(url, options)
        }

        // 获取原始请求信息
        const { method, url } = request
        let body = undefined

        // 安全地获取 body
        if (request.body) {
          try {
            const clonedRequest = request.clone()
            // 尝试作为 JSON 解析
            body = await clonedRequest.json()
          } catch {
            try {
              // 如果不是 JSON，尝试获取原始 body
              const clonedRequest = request.clone()
              body = await clonedRequest.text()
            } catch (e) {
              console.warn('无法读取请求体:', e)
            }
          }
        }

        // 使用现有的 requestHandler 处理请求
        const [newUrl, newBody] = requestHandler.apply(this, [
          url,
          body,
          method,
        ])

        // 构建新的请求配置
        const newRequestInit: RequestInit = {
          method: request.method,
          headers: request.headers,
          mode: request.mode,
          credentials: request.credentials,
          cache: request.cache,
          redirect: request.redirect,
          referrer: request.referrer,
          integrity: request.integrity,
          // 只在有 body 时添加
          ...(newBody ? { body: newBody } : {}),
        }

        // 创建新的请求对象
        const newRequest = new Request(newUrl, newRequestInit)

        // 发送请求并处理响应
        return originalFetch(newRequest).then(
          async (response) => {
            // 处理响应
            const responseJson = responseHandler(newUrl)
            if (!responseJson) {
              return response
            }

            // 创建修改后的响应
            return new Response(JSON.stringify(responseJson), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            })
          },
          (error) => {
            throw error
          }
        )
      } catch (error) {
        console.error('Fetch 拦截器错误:', error)
        // 发生错误时回退到原始请求
        return originalFetch.apply(window, args)
      }

      // return originalFetch.apply(window, newArgs).then(
      //   (response) => {
      //     if (!configs.enabled) return response
      //     // 如果匹配并成功修改返回值，则 responseJson 为修改后的值、否则 responseJson 为 undefined
      //     const responseJson = responseHandler(response.url)

      //     // 如果 json 未被赋予新的值，则返回原有的 response
      //     if (!responseJson) {
      //       return response
      //     } else {
      //       let cloneResponse = response.clone()
      //       cloneResponse.json = () => Promise.resolve(responseJson)
      //       return cloneResponse
      //     }
      //   },
      //   (error) => {
      //     throw error
      //   }
      // )
    }
  })

  // 接收插入到页面中的 iframe 的消息 - 修改 configs
  window.addEventListener('message', function (e) {
    const { source, payload } = e.data || {}

    console.log('source===>', source)

    try {
      if (source === 'iframe-to-wrapper') {
        console.log('wrapper 收到来自编辑的更新请求', payload)
        configs = payload
        // sendMessage2Content()
        // console.log('%c 【wrapper】 ---- 来自 【content】 消息', "font-size: 20px; color: red;", payload)
      } else if (source === 'content-to-wrapper-init-config') {
        console.log('wrapper 收到来自 content 的初始化配置', payload)
        configs = {
          enabled: payload.enabled || true,
          list: payload.list.filter(
            (item: RequestProxyRule) => item.enabled && item.rule
          ),
        }
      }
    } catch (error) {
      console.log(error)
    }
  })

  function sendMessage2Content() {
    postMessage(
      {
        source: 'wrapper-to-content',
        payload: configs,
      },
      '*'
    )
  }

  // postMessage(
  //   {
  //     source: 'wrapper-to-content-get-init-config',
  //   },
  //   '*'
  // )
})
