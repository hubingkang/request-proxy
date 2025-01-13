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

export enum MessageType {
  clickExtIcon = 'clickExtIcon',
  changeTheme = 'changeTheme',
  changeLocale = 'changeLocale',
}

export enum MessageFrom {
  contentScript = 'contentScript',
  background = 'background',
  popUp = 'popUp',
  sidePanel = 'sidePanel',
}

class ExtMessage {
  content?: string
  from?: MessageFrom

  constructor(messageType: MessageType) {
    this.messageType = messageType
  }

  messageType: MessageType
}

export default ExtMessage
