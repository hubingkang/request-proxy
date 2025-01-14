export interface RequestProxyRule {
  id?: string
  name: string
  rule: string
  method: 'GET' | 'POST'
  enabled: boolean
  matched: boolean
  query: string
  body: string
  headers: string
  response: string
  overwriteRequest: boolean
  overwriteResponse: boolean
}

export interface RequestProxyConfig {
  enabled: boolean
  list: RequestProxyRule[]
}

export default {}
