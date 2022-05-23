<p align="center">
  <img src="https://raw.githubusercontent.com/hubingkang/request-proxy/main/resources/icon.png">
</p>
<h1 align="center">Request Proxy</h1>

<div align="center">
Chrome request proxy extension
</div>


## ✨Features

- [X] Supports modifying Ajax/Fetch Request query
- [X] Supports modifying Ajax/Fetch Request body
- [X] Supports modifying Ajax/Fetch Request header
- [X] Supports modifying Ajax/Fetch Response


## 🔨 Usage

<p align="center">
<img src="https://raw.githubusercontent.com/hubingkang/request-proxy/main/resources/how_to_use_1.png">
</p>

<p align="center">
<img src="https://raw.githubusercontent.com/hubingkang/request-proxy/main/resources/response.png">
<img src="https://raw.githubusercontent.com/hubingkang/request-proxy/main/resources/request_body.png">
<img src="https://raw.githubusercontent.com/hubingkang/request-proxy/main/resources/request_query.png">
</p>


## Response data

覆盖接口请求结果

## Request params

### Body | Query

附加模式：会在原有基础上追加自定义字段，如果和原本字段相同，追加字段会覆盖原有字段

覆盖模式：直接丢弃原有的 body 和 query 参数，直接使用自定义字段

#### fetch

fetch 请求 method 为 `GET/HEAD` 不允许设置 `body`  **Request with GET/HEAD method cannot have body**

### Headers

#### XHR

附加模式：
  - 通过 xhr.setRequestHeader 方式去设置 header
  
覆盖模式：
  - 只能覆盖请求中明确设置的 header, 对未明确设置的 header 不生效
  
#### fetch


附加模式：
  - 如果请求设置了 headers, 相同的 hearder 会被自定义的覆盖
  
覆盖模式：
  - 只能覆盖请求中明确设置的 header, 对明确设置的 header 不生效

eg: 覆盖模式只会覆盖下 **Content-Type**
```
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  }),
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
```


暂不支持修改如 `/example/:id ` 上 `:id` 的参数