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
xhr.open("GET", "https://jsonplaceholder.typicode.com/posts?userId=1");
xhr.send();
xhr.onload = function() {
  console.log(xhr.response);
}

var xhr = new XMLHttpRequest();
xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");
xhr.send(JSON.stringify({
  title: 'foo',
  body: 'bar',
  userId: 1,
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
    'Content-Type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

var formData = new FormData();
formData.append('test', 'test-value');
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: formData,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

var formData = new FormData();
formData.append('test', 'test-value');
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: formData,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));


const myHeaders = new Headers();
myHeaders.append('Content-Type', 'text/plain');
const myRequest = new Request('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  })
});
fetch(myRequest)
  .then(response => response.json())
  .then(json => {
    console.log(json)
  });

/*
* // 测试用例
* 1. 测试 XHR
*  1.1 get 设置 query、body(自定义会被忽略)、headers （附加、覆盖）
*  1.2 post 设置 query、body、headers （附加、覆盖）
*  1.3 formData
*
* 2. 测试 Fetch
*  2.1 get 设置 query、body(自定义会被忽略)、headers （附加、覆盖）
*  2.2 post 设置 query、body、headers （附加、覆盖）
*  2.3 formData
*/
