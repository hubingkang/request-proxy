const REQUEST_PROXY_WINDOW_ID = "REQUEST_PROXY_WINDOW_ID"
const REQUEST_PROXY_CONFIG = 'request_proxy_config';

let request_proxy_config = {}
let panel_window_id; 

chrome.storage.local.get([REQUEST_PROXY_CONFIG], (result) => {
  // 在进入页面的时候，更新页面的状态
  const payload = result[REQUEST_PROXY_CONFIG];
  if (payload) {
    payload.list = (payload.list).map(item => ({
      ...item,
      state: [],
    }))
    chrome.storage.local.set({ request_proxy_config: payload })
    request_proxy_config = payload
  } else {
    const defaultValue = {
      enabled: false,
      list: []
    }
    // 如果没有缓存数据，则设置默认值
    chrome.storage.local.set({ request_proxy_config: defaultValue })
    request_proxy_config = defaultValue
  }
});

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
    panel_window_id = target.id;
    // setStorage(REQUEST_PROXY_WINDOW_ID, target.id)
  });
}

const create = async () => {
  const data = await getStorage(REQUEST_PROXY_WINDOW_ID);
  const windowIdList = await getAllWindowIds();

  const windowId = panel_window_id

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
  const { source, payload } = message;

  if (source === 'content-to-background') {
    // wrapper -> content -> background 用于更新 panel 的数据
    if (payload) {
      chrome.tabs.query({ active: true, windowId: panel_window_id }, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {
          source: "background-to-panel",
          payload: payload
        })
        .catch(() => {})
      })
      sendResponse()
    } else {
      // 接受不带 payload 的 message, 表示 inject script(wrapper.js) 加载完成
      // 数据从 background -> content -> wrapper
      chrome.tabs.sendMessage(sender.tab.id, {
        source: "background-to-content",
        payload: request_proxy_config
      })
      .catch(() => {})
    }
  }
  
  if (source === 'panel-to-background') {
    sendResponse();
    request_proxy_config = payload;
  }
  sendResponse();
})

// 每个窗口可能会有多个 高亮的选项卡，但是只会有一个  actived 的选项卡
chrome.tabs.onActivated.addListener((res) => {
  chrome.tabs.sendMessage(res.tabId, {
    source: "background-to-content",
    payload: request_proxy_config
  })
  .catch(() => {})
})

chrome.windows.onFocusChanged.addListener((res) => {
  if (res !== -1) {
    chrome.tabs.query({ active: true, windowId: res }, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {
        source: "background-to-content",
        payload: request_proxy_config
      })
      .catch(() => {})
    })
  }
})
