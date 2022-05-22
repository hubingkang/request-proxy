var formData = new FormData();

formData.append("username", "Groucho");
// formData.append("accountnum", 123456); //数字123456会被立即转换成字符串 "123456"
// // JavaScript file-like 对象
// var content = '<a id="a"><b id="b">hey!</b></a>'; // 新文件的正文
// var blob = new Blob([content], { type: "text/xml"});

// formData.append("webmasterfile", blob);


// var request = new XMLHttpRequest();
// request.open("POST", "http://foo.com/submitform.php");
// request.send(formData);

fetch("https://randomuser.me/api/", {
  method: "POST",
  body: formData,
  "content-type": "application/x-www-form-urlencoded"
})

// 测试 http://jsonplaceholder.typicode.com/guide/
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed");
xhr.send(JSON.stringify({
  "id_type": 2,
  "client_type": 2608,
  "sort_type": 200,
  "cursor": "0",
  "limit": 100
}));
xhr.onload = function() {
  console.log(xhr.response);
}

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
xhr.send(JSON.stringify({
  "id_type": 2,
  "client_type": 2608,
  "sort_type": 200,
  "cursor": "0",
  "limit": 100
}));
xhr.onload = function() {
  console.log(xhr.response);
}


// This will return all the posts that belong to the first user
fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
  .then((response) => response.json())
  .then((json) => console.log(json));

fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
