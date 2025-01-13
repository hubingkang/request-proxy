import { useEffect, useRef, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import Editor from '@monaco-editor/react'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&url'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&url'
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&url'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&url'

import '@/assets/main.css'

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    if (label === 'json') {
      return new Worker(browser.runtime.getURL(editorWorker))
      // return new jsonWorker()
    }
    return new Worker(browser.runtime.getURL(jsonWorker))
    // return new editorWorker()
  },
}

loader.config({
  monaco,
  // paths: { vs: browser.runtime.getURL('/') },
})

interface Request {
  id: string
  name: string
  url: string
  method: string
  params: Record<string, any>
  body: Record<string, any>
  headers: Record<string, any>
}

export default () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      name: '请求1',
      url: 'https://api.example.com/v1/data1',
      method: 'GET',
      params: {
        a: 1,
        b: 2,
      },
      body: {},
      headers: {},
    },
  ])
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(
    requests[0]
  )
  // const editorRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   if (editorRef.current) {
  //     loader.init().then((monaco) => {
  //       monaco.editor.create(editorRef.current!, {
  //         value: 'console.log("Hello, world!");',
  //       })
  //     })
  //   }
  // }, [])

  return (
    <div className="fixed top-0 right-0 w-screen h-screen">
      {/* 添加蒙层 */}
      <div className="fixed inset-0 bg-black/50 z-[999999999999]" />

      {/* 居中的弹框 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-background z-[1000000000000] rounded-xl shadow-2xl">
        <div className="flex h-full">
          {/* 左侧列表 */}
          <div className="w-64 border-r h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">请求列表</h2>
              <Button size="sm" variant="ghost">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-2">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className={`p-2 rounded cursor-pointer hover:bg-accent ${
                    selectedRequest?.id === request.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="font-medium">{request.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {request.url}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1 p-4 overflow-auto">
            {selectedRequest ? (
              <div className="space-y-4">
                <Input
                  placeholder="请输入请求URL"
                  value={selectedRequest.url}
                  onChange={(e) => {
                    // 处理URL更新
                  }}
                />

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">请求参数</h2>
                  <Tabs defaultValue="params" className="w-full">
                    <TabsList>
                      <TabsTrigger value="params">Params</TabsTrigger>
                      <TabsTrigger value="body">Body</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="params" className="h-[500px]">
                      {/* JSON编辑器组件 */}
                      {/* <JsonEditor
                        defaultValue={JSON.stringify(
                          selectedRequest.params,
                          null,
                          2
                        )} // 不是 control 模式
                        // height={
                        //   settingType === 'REQUEST'
                        //     ? 'calc(100vh - 150px - 62px)'
                        //     : 'calc(100vh - 150px)'
                        // }
                        height="500px"
                        onChange={(value) => {
                          // const newConfig = { ...config }
                          // if (settingType === 'RESPONSE') {
                          //   newConfig.list[handledIndex]['response'] = value
                          // } else {
                          //   switch (requestSettingType) {
                          //     case 'body':
                          //       newConfig.list[handledIndex]['request']['body'][
                          //         'value'
                          //       ] = value
                          //       break
                          //     case 'query':
                          //       newConfig.list[handledIndex]['request'][
                          //         'query'
                          //       ]['value'] = value
                          //       break
                          //   }
                          // }
                          // setConfig(newConfig)
                        }}
                      /> */}

                      <Editor
                        height="500px"
                        defaultLanguage="json"
                        // defaultValue=""
                        defaultValue={JSON.stringify(
                          selectedRequest.params,
                          null,
                          2
                        )}
                        onChange={(value) => {
                          console.log(value)
                        }}
                        path={browser.runtime.getURL('/')}
                      />

                      {/* <div ref={editorRef} className="h-[500px]"></div> */}
                    </TabsContent>
                    <TabsContent value="body" className="h-[500px]">
                      <div className="w-full h-full border rounded-md">
                        {JSON.stringify(selectedRequest.headers, null, 2)}
                      </div>
                    </TabsContent>
                    <TabsContent value="headers" className="h-[500px]">
                      <div className="w-full h-full border rounded-md">
                        {JSON.stringify(selectedRequest.headers, null, 2)}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                请选择或创建一个请求
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
