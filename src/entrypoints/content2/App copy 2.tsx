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
import { useState } from 'react'
import { PlusCircle } from 'lucide-react'

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
  const [requests, setRequests] = useState<Request[]>([])
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  return (
    <div className="fixed top-0 right-0 w-screen h-screen">
      <div className="fixed inset-0 bg-black/50 z-[999999999999]" />

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

                <Tabs defaultValue="params" className="w-full">
                  <TabsList>
                    <TabsTrigger value="params">Params</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="params" className="h-[500px]">
                    {/* JSON编辑器组件 */}
                    <div className="w-full h-full border rounded-md">
                      {JSON.stringify(selectedRequest.params, null, 2)}
                    </div>
                  </TabsContent>
                  <TabsContent value="body" className="h-[500px]">
                    <div className="w-full h-full border rounded-md">
                      {JSON.stringify(selectedRequest.body, null, 2)}
                    </div>
                  </TabsContent>
                  <TabsContent value="headers" className="h-[500px]">
                    <div className="w-full h-full border rounded-md">
                      {JSON.stringify(selectedRequest.headers, null, 2)}
                    </div>
                  </TabsContent>
                </Tabs>
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
