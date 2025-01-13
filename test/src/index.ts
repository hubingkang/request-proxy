import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// 启用 CORS 中间件
app.use(
  '/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Custom-Header'],
  })
)

// 测试路由处理
app.get('/test', async (c) => {
  const query = c.req.query()

  return c.json({
    message: 'GET 请求成功',
    method: 'GET',
    query,
    headers: Object.fromEntries(c.req.raw.headers.entries()),
  })
})

app.post('/test', async (c) => {
  let body
  const contentType = c.req.header('Content-Type')

  if (contentType?.includes('application/json')) {
    body = await c.req.json()
  } else if (contentType?.includes('multipart/form-data')) {
    const formData = await c.req.formData()
    body = Object.fromEntries(formData.entries())
  }

  return c.json({
    message: 'POST 请求成功',
    method: 'POST',
    contentType,
    body,
    headers: Object.fromEntries(c.req.raw.headers.entries()),
  })
})

app.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const files = []

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      files.push({
        fieldName: key,
        fileName: value.name,
        fileType: value.type,
        fileSize: value.size,
      })
    }
  }

  return c.json({
    message: '文件上传成功',
    method: 'POST',
    formData: Object.fromEntries(formData.entries()),
    files,
    headers: Object.fromEntries(c.req.raw.headers.entries()),
  })
})

// 首页路由
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 3001
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
