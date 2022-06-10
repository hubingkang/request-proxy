const REQUEST_PROXY_WINDOW_ID = "REQUEST_PROXY_WINDOW_ID"

const getStorage = (name) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(name, (res) => {
      resolve(res);
    })
  })
}

const setStorage = (name, value) => {
  chrome.storage.local.set({ [name]: value });
}

// 获取所有windowId
const getAllWindowIds = async () => {
  return new Promise((resolve) => {
    chrome.windows.getAll(function (targets) {
      const ids = targets.map((item) => item.id);
      resolve(ids);
    });
  });
}

const createWindow = () => {
  chrome.windows.create({
    url: "dist/index.html",
    // url: "http://localhost:3000",
    type: "popup",
    width: 1200,
    height: 720,
    top: 100,
  }, (target) => {
    console.log('target', target.id);
    setStorage(REQUEST_PROXY_WINDOW_ID, target.id)
  });
}

const create = async () => {
  const data = await getStorage(REQUEST_PROXY_WINDOW_ID);
  const windowIdList = await getAllWindowIds();

  const windowId = data[REQUEST_PROXY_WINDOW_ID];

  console.log('windowId', windowId, windowIdList)
  if (windowId && windowIdList?.includes(windowId)) {
    chrome.windows.update(windowId, { focused: true });
  } else {
    createWindow();
  }
}


// 监听 chrome 图标被点击
chrome.action.onClicked.addListener(() => {
  create()
});

// 这里收到消息 sendResponse 必须调用，发送端可以通过 callback 接收
// 加入 sendResponse 没有调用 会出错 : Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log('background 收到了 【content-to-backgroud', message)
  const { source, payload } = message;
  if (source === 'iframe-to-background') {
    sendResponse();
    // 发送消息给 content.js 关闭 iframe 窗口
    chrome.tabs.query({ active: true, currentWindow: false }, function(tabs){
      console.log('tabs', tabs)
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          source: "background-to-content",
          payload
        }).then(() => {
          console.log('调用了 then')
        })
        .catch((error) => {
          console.log('=====出错了', error)
        })
      })
    })
  }
  sendResponse();
})

chrome.tabs.onHighlighted.addListener((res) => {
  console.log('onHighlighted111', res)
})

chrome.tabs.onActivated.addListener((res) => {
  console.log('onActivated222', res)
})

chrome.windows.onFocusChanged.addListener((res) => {
  console.log('onFocusChanged333', res)
})
// setTimeout(() => {
//   chrome.runtime.sendMessage({
//     source: 'wrapper-to-content',
//   })
// }, 2000)