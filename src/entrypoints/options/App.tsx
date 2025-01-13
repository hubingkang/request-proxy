import { useEffect, useState } from 'react'

import { MessageType } from '@/entrypoints/types'

import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import Editor from '@monaco-editor/react'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import { PlusCircle } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useUpdateEffect } from 'react-use'
import { sendMessage, onMessage } from 'webext-bridge/options'
import { cn } from '@/lib/utils'

import { RequestProxyRule } from '@/entrypoints/types'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import './App.css'

self.MonacoEnvironment = {
  getWorker(workerId, label) {
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
}

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8)
}

// 验证JSON格式
const isValidJson = (value: string): boolean => {
  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}

const DEFAULT_REQUEST: RequestProxyRule = {
  name: '新请求',
  rule: '',
  method: 'GET' as const,
  enabled: true,
  matched: false,
  query: JSON.stringify({}, null, 2),
  body: JSON.stringify({}, null, 2),
  headers: JSON.stringify({}, null, 2),
  response: JSON.stringify({}, null, 2),
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

  const onSaveRequest = () => {
    // setRequests([...requests, selectedRequest])
    const res = ['query', 'body', 'headers', 'response'].every((item) => {
      return !selectedRequest[item] || isValidJson(selectedRequest[item])
    })

    if (!res) {
      toast.error('请输入正确的JSON格式')
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
    }

    setRequests(newRequests)
    // handleSaveRequest(newRequests)
  }

  return (
    <div className="w-full h-full p-6 flex flex-col">
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
          placeholder="请输入请求URL"
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
          placeholder="请输入请求名称"
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
          <h2 className="text-lg font-bold mb-4">请求参数</h2>
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
          <h2 className="text-lg font-bold mb-4">返回响应</h2>
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
            <label>覆盖请求参数</label>
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
            <label>覆盖返回结果</label>
          </div>
        </div>
        <Button onClick={onSaveRequest}>保存</Button>
      </div>
    </div>
  )
}

function App() {
  const [enabled, setEnabled] = useState(true)
  const [requests, setRequests] = useState<RequestProxyRule[]>([])

  const [selectedRequest, setSelectedRequest] = useState<RequestProxyRule>()

  const [selectedRequestTab, setSelectedRequestTab] = useState<
    'query' | 'body' | 'headers'
  >('query')

  useEffect(() => {
    window.addEventListener('message', (e) => {
      const { source, payload } = e.data || {}
      if (source === 'content-to-iframe') {
        setRequests(payload.list || [])
        setEnabled(payload.enabled || true)
        setSelectedRequest(payload.list[0] || null)
      }
    })
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
  }, [requests])

  async function sendMessageToBackground() {
    let response = await browser.runtime.sendMessage({
      eventType: MessageType.clickExtIcon,
    })
    console.log(response)
  }

  const handleSaveRequest = (requests: any) => {
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
  }

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
    <div className="w-screen h-screen p-8">
      <div
        className="bg-black/40 w-full h-full fixed top-0 left-0 flex items-center justify-center p-8"
        onClick={() => {
          handleClose()
        }}
      >
        <div
          className="bg-white w-full max-w-[1200px] h-[800px] rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border md:min-w-[450px]"
          >
            <ResizablePanel defaultSize={20}>
              <div className="h-full p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">请求管理</h2>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      setSelectedRequest({ ...DEFAULT_REQUEST })
                    }}
                  >
                    <PlusCircle className="h-6 w-6" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-2 rounded cursor-pointer hover:bg-accent ${
                        selectedRequest?.id === request.id ? 'bg-accent' : ''
                      }`}
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
                      <div className="font-medium flex items-center justify-between">
                        <div>{request.name}</div>
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
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <div
                          className={`text-xs font-bold ${
                            METHOD_COLOR_MAP[request.method]
                          }`}
                        >
                          {request.method}
                        </div>
                        <div className="flex-1 truncate">{request.rule}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              {selectedRequest ? (
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
                  请选择或创建一个请求
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* <Button onClick={sendMessageToBackground}>send message</Button> */}
        </div>
      </div>

      <Toaster />
    </div>
  )
}

export default App
