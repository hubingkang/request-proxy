import { useEffect, useState } from 'react'

import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import Editor from '@monaco-editor/react'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import { PlusCircle, Trash2, Languages } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useUpdateEffect } from 'react-use'

import { RequestProxyRule } from '@/entrypoints/types'

import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import { generateRandomString, isValidJson } from '@/lib'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTranslation } from 'react-i18next'

import './App.css'
import { cn } from '@/lib/utils'
import languages from '@/components/i18nConfig'

declare global {
  interface Window {
    MonacoEnvironment: {
      getWorker(workerId: string, label: string): Worker
    }
  }
}

self.MonacoEnvironment = {
  getWorker(_workerId: any, label: any) {
    if (label === 'json') {
      return new jsonWorker()
    }
    return new editorWorker()
  },
}

loader.config({
  monaco,
})

const editorOptions = {
  scrollbar: {
    useShadows: false,
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
  minimap: {
    enabled: false,
  },
  formatOnPaste: true,
  formatOnType: true,
}

const DEFAULT_REQUEST: RequestProxyRule = {
  name: '',
  rule: '',
  method: 'GET' as const,
  enabled: true,
  matched: false,
  query: '',
  body: '',
  headers: '',
  response: '',
  overwriteRequest: true,
  overwriteResponse: true,
}

const METHOD_COLOR_MAP = {
  GET: 'text-green-500',
  POST: 'text-red-500',
}

// 首先定义 RequestEditor 的 props 类型
interface RequestEditorProps {
  selectedRequest: RequestProxyRule
  setSelectedRequest: (request: RequestProxyRule) => void
  selectedRequestTab: 'query' | 'body' | 'headers'
  setSelectedRequestTab: (tab: 'query' | 'body' | 'headers') => void
  requests: RequestProxyRule[]
  setRequests: (requests: RequestProxyRule[]) => void
}

// 修改 RequestEditor 组件，接收新的 props
function RequestEditor({
  selectedRequest,
  setSelectedRequest,
  selectedRequestTab,
  setSelectedRequestTab,
  requests,
  setRequests,
}: RequestEditorProps) {
  // 添加 Monaco Editor 的配置选项
  const { t } = useTranslation()

  const onSaveRequest = () => {
    // setRequests([...requests, selectedRequest])
    const res = ['query', 'body', 'headers', 'response'].every((item) => {
      const value = selectedRequest?.[item as keyof RequestProxyRule] as string
      return !value || isValidJson(value)
    })

    if (selectedRequest.rule === '') {
      toast.error(t('pleaseEnterRequestRule'))
      return
    }

    if (!res) {
      toast.error(t('pleaseEnterCorrectJsonFormat'))
      return
    }

    let newRequests = []

    if (selectedRequest.id) {
      newRequests = requests.map((request) => {
        if (request.id === selectedRequest.id) {
          return selectedRequest
        }
        return request
      })
    } else {
      const newRequestItem = {
        ...selectedRequest,
        id: generateRandomString(),
      }
      newRequests = [...requests, newRequestItem]
      setSelectedRequest(newRequestItem)
    }

    setRequests(newRequests)
  }

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <Select
          value={selectedRequest.method}
          onValueChange={(value) => {
            setSelectedRequest({
              ...selectedRequest,
              method: value as 'GET' | 'POST',
            })
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">
              <span className="text-green-500 font-bold">GET</span>
            </SelectItem>
            <SelectItem value="POST">
              <span className="text-red-500 font-bold">POST</span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder={t('requestRulePlaceholder')}
          value={selectedRequest.rule}
          onChange={(e) => {
            // 处理URL更新
            setSelectedRequest({
              ...selectedRequest,
              rule: e.target.value,
            })
          }}
        />
        <Input
          placeholder={t('requestNamePlaceholder')}
          value={selectedRequest.name}
          onChange={(e) => {
            // 处理URL更新
            setSelectedRequest({
              ...selectedRequest,
              name: e.target.value,
            })
          }}
        />
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-bold mb-4">{t('request')}</h2>
          <div className="flex-1 border rounded-lg overflow-hidden">
            <Tabs
              defaultValue="query"
              className="h-full flex flex-col"
              value={selectedRequestTab}
              onValueChange={(value) =>
                setSelectedRequestTab(value as 'query' | 'body' | 'headers')
              }
            >
              <TabsList>
                <TabsTrigger value="query">Query</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
                {/* <TabsTrigger value="headers">Headers</TabsTrigger> */}
              </TabsList>
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={selectedRequest[selectedRequestTab]}
                  onChange={(value) => {
                    setSelectedRequest({
                      ...selectedRequest,
                      [selectedRequestTab]: value || '',
                    })
                  }}
                  options={editorOptions}
                />
              </div>
            </Tabs>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-bold mb-4">{t('response')}</h2>
          <div className="flex-1 border rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={selectedRequest.response}
              onChange={(value) => {
                setSelectedRequest({
                  ...selectedRequest,
                  response: value,
                })
              }}
              options={editorOptions}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-8 mt-4">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id="overwrite-request"
              checked={selectedRequest.overwriteRequest}
              onCheckedChange={(checked) => {
                setSelectedRequest({
                  ...selectedRequest,
                  overwriteRequest: checked,
                })
              }}
            />
            <label>{t('overrideRequest')}</label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="overwrite-response"
              checked={selectedRequest.overwriteResponse}
              onCheckedChange={(checked) => {
                setSelectedRequest({
                  ...selectedRequest,
                  overwriteResponse: checked,
                })
              }}
            />
            <label>{t('overrideResponse')}</label>
          </div>
        </div>
        <Button onClick={onSaveRequest}>{t('save')}</Button>
      </div>
    </div>
  )
}

function App() {
  const { t, i18n } = useTranslation()

  const [enabled, setEnabled] = useState<boolean>(false)
  const [requests, setRequests] = useState<RequestProxyRule[]>([])
  const [language, setLanguage] = useState<'en' | 'zh_CN'>('en')
  const [selectedRequest, setSelectedRequest] =
    useState<RequestProxyRule | null>(null)

  const [selectedRequestTab, setSelectedRequestTab] = useState<
    'query' | 'body' | 'headers'
  >('query')

  useEffect(() => {
    window.addEventListener('message', (e) => {
      const { source, payload } = e.data || {}
      if (source === 'content-to-iframe') {
        setRequests(payload.list || [])
        setEnabled(payload.enabled)
        setLanguage(payload.language || 'en')
        i18n.changeLanguage(payload.language || 'en')
      } else if (source === 'wrapper-to-iframe') {
        setRequests(payload.list || [])
        setEnabled(payload.enabled)
      }
    })

    window.parent.postMessage(
      {
        source: 'iframe-to-content-request-init-data',
      },
      '*'
    )

    return () => {
      window.removeEventListener('message', () => {})
    }
  }, [])

  useUpdateEffect(() => {
    window.parent.postMessage(
      {
        source: 'iframe-to-wrapper',
        payload: {
          list: requests,
          enabled: enabled,
        },
      },
      '*'
    )
    window.parent.postMessage(
      {
        source: 'iframe-to-content',
        payload: {
          list: requests,
          enabled: enabled,
        },
      },
      '*'
    )
  }, [requests, enabled])

  useUpdateEffect(() => {
    i18n.changeLanguage(language)
    window.parent.postMessage(
      {
        source: 'iframe-to-content-language',
        payload: {
          language,
        },
      },
      '*'
    )
  }, [language])

  // async function sendMessageToBackground() {
  //   let response = await browser.runtime.sendMessage({
  //     eventType: MessageType.clickExtIcon,
  //   })
  //   console.log(response)
  // }

  // const handleSaveRequest = (requests: any) => {
  //   window.parent.postMessage(
  //     {
  //       source: 'iframe-to-wrapper',
  //       payload: {
  //         list: requests,
  //         enabled: enabled,
  //       },
  //     },
  //     '*'
  //   )
  //   window.parent.postMessage(
  //     {
  //       source: 'iframe-to-content',
  //       payload: {
  //         list: requests,
  //         enabled: enabled,
  //       },
  //     },
  //     '*'
  //   )
  // }

  const handleClose = () => {
    window.parent.postMessage(
      {
        source: 'iframe-to-content-close',
        payload: null,
      },
      '*'
    )
  }

  return (
    <div className="w-screen h-screen p-8 text-base">
      <div
        className="bg-black/40 w-full h-full fixed top-0 left-0 flex items-center justify-center p-8"
        onClick={() => {
          handleClose()
        }}
      >
        <div
          className="bg-white w-full max-w-[90vw] h-[90vh] rounded-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b py-3 px-4 gap-4">
            <div className="flex items-center gap-2">
              <span>{t('enableProxy')}：</span>
              <Switch
                id="overwrite-request"
                checked={enabled}
                onCheckedChange={(checked) => {
                  setEnabled(checked)
                }}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Languages className="size-4 cursor-pointer hover:text-primary" />
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="flex flex-col gap-2">
                  {languages.map((item: any) => (
                    <div
                      key={item.locale}
                      className={cn('cursor-pointer hover:text-primary', {
                        'text-primary': language === item.locale,
                      })}
                      onClick={() => {
                        setLanguage(item.locale as 'en' | 'zh_CN')
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg md:min-w-[450px]"
          >
            <ResizablePanel defaultSize={25}>
              <div className="h-full p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    {t('requestManagement')}
                  </h2>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedRequest({ ...DEFAULT_REQUEST })
                    }}
                    disabled={!enabled}
                    className="hover:text-primary"
                  >
                    <PlusCircle className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex-1 space-y-1 overflow-y-auto">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className={cn(
                        'p-2 rounded cursor-pointer hover:bg-accent',
                        {
                          'bg-accent': selectedRequest?.id === request.id,
                          'bg-primary/20 text-white hover:bg-primary/30':
                            request.matched,
                        }
                      )}
                      onClick={() => {
                        setSelectedRequest({
                          ...request,
                          enabled: request.enabled || true,
                          query: request.query,
                          body: request.body,
                          headers: request.headers,
                          response: request.response,
                        })
                      }}
                    >
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <div
                          className={`text-xs font-bold ${
                            METHOD_COLOR_MAP[request.method]
                          }`}
                        >
                          {request.method}
                        </div>
                        <div className="flex-1 truncate">
                          {request.name || request.rule}
                        </div>

                        <Switch
                          id="airplane-mode"
                          checked={request.enabled}
                          onCheckedChange={() => {
                            setRequests(
                              requests.map((item) => {
                                if (item.id === request.id) {
                                  return { ...item, enabled: !item.enabled }
                                }
                                return item
                              })
                            )
                          }}
                        />

                        <Trash2
                          className="size-4 cursor-pointer hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (selectedRequest?.id === request.id) {
                              setSelectedRequest(null)
                            }

                            setRequests(
                              requests.filter((item) => item.id !== request.id)
                            )
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              {selectedRequest && enabled ? (
                <RequestEditor
                  selectedRequest={selectedRequest}
                  setSelectedRequest={setSelectedRequest}
                  selectedRequestTab={selectedRequestTab}
                  setSelectedRequestTab={setSelectedRequestTab}
                  requests={requests}
                  setRequests={setRequests}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {enabled ? (
                    <div className="h-full flex flex-col gap-2 items-center justify-center">
                      <div>{t('selectRequest')}</div>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedRequest({ ...DEFAULT_REQUEST })
                        }}
                      >
                        {t('create')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div>{t('enableProxyTip')}</div>
                      <Switch
                        id="airplane-mode"
                        checked={enabled}
                        onCheckedChange={() => {
                          setEnabled(!enabled)
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* <Button onClick={sendMessageToBackground}>send message</Button> */}
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default App
