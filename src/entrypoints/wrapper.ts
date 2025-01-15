import queryString from 'query-string'
import { RequestProxyConfig, RequestProxyRule } from './types'

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

export default defineUnlistedScript(async () => {
  let configs: RequestProxyConfig = {
    enabled: false,
    list: [],
  }
  // 发送准备就绪事件 -- content 接收到消息 将初始化数据传入
  await window.dispatchEvent(new CustomEvent('wrapper-ready'))

  // console.log('===== configs =====', configs)

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
  const requestQueryHandle = (url: string, config: RequestProxyRule) => {
    if (!isJSONString(config.query)) return url
    try {
      const newQuery = JSON.parse(config.query)
      const baseUrl = url.split('?')[0]

      if (config.overwriteRequest) {
        // 覆盖模式：直接使用新参数
        const params = queryString.stringify(newQuery)
        return params ? `${baseUrl}?${params}` : baseUrl
      } else {
        // 追加模式：合并现有参数和新参数
        const existingParams = queryString.parse(url.split('?')[1] || '')
        const mergedParams = { ...existingParams, ...newQuery }
        const params = queryString.stringify(mergedParams)
        return params ? `${baseUrl}?${params}` : baseUrl
      }
    } catch (error) {
      // console.error('Query handling error:', error)
      return url
    }
  }

  // 请求处理
  const requestHandler = function (
    this: XMLHttpRequest | Request,
    url: string,
    body: any,
    method: string = 'GET'
  ) {
    try {
      let newUrl = url
      let newBody = body

      const isXHR = this instanceof XMLHttpRequest

      for (const config of configs.list) {
        if (!config.enabled) continue
        if (!urlIsMatched(url, config.rule)) continue
        // 修改这里：确保方法匹配是大写比较
        if (method.toUpperCase() !== config.method.toUpperCase()) continue

        // 修改 query 参数处理, 只处理 fetch 请求, XHR 请求在 open 中已经处理
        if (!isXHR) {
          newUrl = requestQueryHandle(url, config)
        }

        // 处理 body
        if (!['GET', 'HEAD'].includes(method.toUpperCase()) && config.body) {
          try {
            if (body instanceof FormData) {
              const formData = new FormData()
              const newBodyObj = JSON.parse(config.body)

              // 如果不是覆盖模式，先添加原有的 FormData 内容
              if (!config.overwriteRequest) {
                for (const [key, value] of body.entries()) {
                  formData.append(key, value)
                }
              }

              // 添加新的内容
              for (const [key, value] of Object.entries(newBodyObj)) {
                formData.append(key, value)
              }

              newBody = formData
            } else if (typeof body === 'string' && isJSONString(body)) {
              const originalBody = JSON.parse(body)
              const newBodyObj = JSON.parse(config.body)

              newBody = JSON.stringify(
                config.overwriteRequest
                  ? newBodyObj // 覆盖模式：只使用新数据
                  : { ...originalBody, ...newBodyObj } // 追加模式：合并数据
              )
            } else if (!body) {
              newBody = config.body
            }
          } catch (e) {
            // console.error('Body handling error:', e)
            newBody = body
          }
        }
      }
      return [newUrl, newBody]
    } catch (error) {
      // console.error('Request handler error:', error)
      return [url, body]
    }
  }

  // 响应处理
  const responseHandler = function (
    this: XMLHttpRequest,
    url: string,
    method: string = 'GET'
  ) {
    try {
      for (const config of configs.list) {
        if (!config.enabled) continue
        if (!urlIsMatched(url, config.rule)) continue
        // 确保请求方法匹配
        if (method.toUpperCase() !== config.method) continue

        // 如果匹配的规则，则标记为已匹配
        config.matched = true
        updateConfigsByMessages()

        if (config.response && isJSONString(config.response)) {
          const responseData = JSON.parse(config.response)

          if (!config.overwriteResponse) {
            // 如果不是覆盖模式，尝试合并原始响应和新响应
            try {
              const originalResponse = JSON.parse(this.response || '{}')
              return { ...originalResponse, ...responseData }
            } catch (e) {
              // console.warn('无法解析原始响应，将直接使用新响应')
              return responseData
            }
          }

          return responseData // 覆盖模式：直接返回新响应
        }
        return undefined
      }
    } catch (error) {
      // console.error('Response handler error:', error)
      return undefined
    }
  }

  const xhrproto = XMLHttpRequest.prototype

  // 修改 query 和 response
  fill(xhrproto, 'open', function (this: XMLHttpRequest, originalOpen: any) {
    return function (this: XMLHttpRequest, ...args: any[]) {
      // 这 this 指向的原本的 XMLHttpRequest 对象，这里只代理对象中的 open 方法
      const xhr = this

      // 未开启拦截
      if (!configs.enabled) return originalOpen.apply(xhr, args)

      const [method, url, ...restArgs] = args

      // 添加 url 的 query 参数
      let newUrl = url
      for (const config of configs.list) {
        if (urlIsMatched(url, config.rule)) {
          newUrl = requestQueryHandle(url, config)
          break
        }
      }

      // 先保存原始的 url 和 method，后续需要使用
      xhr[CONFIG] = { method, url: newUrl }

      // 设置响应拦截器，用于修改返回数据
      const handleReadyStateChange = () => {
        // // 添加全局开关检查
        // if (!configs.enabled) return

        if (xhr.readyState === 4) {
          const responseJson = responseHandler.call(xhr, newUrl, method)
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
        // 未开启拦截
        if (!configs.enabled) return originalSend.apply(this, args)

        const xhr = this

        const [body, ...rest] = args
        const { method, url } = xhr[CONFIG]
        const [_newUrl, newBody] = requestHandler.apply(xhr, [
          url,
          body,
          method,
        ])
        xhr[CONFIG].body = newBody

        return originalSend.apply(xhr, [...(newBody ? [newBody] : []), ...rest])
      }
    }
  )

  fill(window, 'fetch', function (originalFetch: typeof fetch) {
    return async function (...args: Parameters<typeof fetch>) {
      if (!configs.enabled) {
        return originalFetch.apply(window, args)
      }

      try {
        // 1. 统一处理请求参数
        const request = await normalizeRequest(args)

        const { url, method } = request

        // 提前检查是否有匹配的规则
        const matchedRule = configs.list.find(
          (config) =>
            config.enabled &&
            urlIsMatched(url, config.rule) &&
            method.toUpperCase() === config.method.toUpperCase()
        )

        // 如果没有匹配的规则，直接返回原始请求
        if (!matchedRule) {
          return originalFetch.call(window, args[0], args[1])
        }

        // 2. 处理请求拦截
        const modifiedRequest = await interceptRequest(request)

        // 3. 发送请求并处理响应
        const response = await originalFetch(modifiedRequest)

        // 4. 处理响应拦截
        return interceptResponse(response, request.url, request.method)
      } catch (error) {
        // console.error('Fetch 拦截器错误:', error)
        return originalFetch.apply(window, args)
      }
    }
  })

  // 统一化请求参数
  async function normalizeRequest(args: any[]): Promise<Request> {
    if (args[0] instanceof Request) {
      return args[0].clone()
    }

    const url = args[0]
    const options = args[1] || {}
    return new Request(url, options)
  }

  // 请求拦截处理
  async function interceptRequest(request: Request): Promise<Request> {
    const { url, method } = request
    let body: any

    // 获取原始 body
    if (!['GET', 'HEAD'].includes(method.toUpperCase()) && request.body) {
      try {
        const clonedRequest = request.clone()
        const contentType = request.headers.get('Content-Type')

        if (contentType?.includes('multipart/form-data')) {
          body = await clonedRequest.formData()
        } else {
          body = await clonedRequest.text()
        }
      } catch (e) {
        // console.warn('读取请求体失败:', e)
      }
    }

    // 使用现有的 requestHandler 处理请求
    const [newUrl, newBody] = requestHandler.call(request, url, body, method)

    // 构建新的请求配置，注意：对于 FormData，不要设置 Content-Type
    const newHeaders = new Headers(request.headers)
    if (newBody instanceof FormData) {
      newHeaders.delete('Content-Type')
    }

    const newRequestInit: RequestInit = {
      method,
      headers: newHeaders,
      mode: request.mode,
      credentials: request.credentials,
      cache: request.cache,
      redirect: request.redirect,
      referrer: request.referrer,
      integrity: request.integrity,
      ...(!['GET', 'HEAD'].includes(method.toUpperCase()) && newBody
        ? { body: newBody }
        : {}),
    }

    return new Request(newUrl || url, newRequestInit)
  }

  // 响应拦截处理
  async function interceptResponse(
    response: Response,
    url: string,
    method: string
  ): Promise<Response> {
    // 添加全局开关检查
    if (!configs.enabled) return response

    const matchedRule = configs.list.find(
      (config) =>
        urlIsMatched(url, config.rule) &&
        method.toUpperCase() === config.method.toUpperCase()
    )

    if (!matchedRule || !matchedRule.response) {
      return response
    }

    // 如果匹配的规则，则标记为已匹配
    matchedRule.matched = true
    updateConfigsByMessages()

    try {
      const responseData = JSON.parse(matchedRule.response)
      let finalResponse = responseData

      // 如果不是覆盖模式，需要合并原始响应
      if (!matchedRule.overwriteResponse) {
        const originalResponse = await response.clone().json()

        finalResponse = { ...originalResponse, ...responseData }
      }

      return new Response(JSON.stringify(finalResponse), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    } catch (e) {
      // console.warn('处理响应失败:', e)
      return response
    }
  }

  // 接收插入到页面中的 iframe 的消息 - 修改 configs
  window.addEventListener('message', function (e) {
    const { source, payload } = e.data || {}
    try {
      if (source === 'iframe-to-wrapper') {
        configs = payload
      } else if (source === 'content-to-wrapper-init-config') {
        configs = {
          enabled: payload?.enabled || false,
          list: payload?.list.filter(
            (item: RequestProxyRule) => item.enabled && item.rule
          ),
        }
      }
    } catch (error) {
      // console.log(error)
    }
  })

  function updateConfigsByMessages() {
    // postMessage(
    //   {
    //     source: 'wrapper-to-content',
    //     payload: configs,
    //   },
    //   '*'
    // )

    const iframe = document.getElementById('request-proxy-iframe')
    if (iframe) {
      ;(iframe as HTMLIFrameElement).contentWindow?.postMessage(
        {
          source: 'wrapper-to-iframe',
          payload: configs,
        },
        '*'
      )
    }
  }
})
