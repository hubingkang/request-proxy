const REQUEST_PROXY_WINDOW_ID = "REQUEST_PROXY_WINDOW_ID"
const REQUEST_PROXY_CONFIG = 'request_proxy_config';

let request_proxy_config = {}
let panel_window_id; 

const setEnabledIcon = () => {
  chrome.action.setIcon({
    path: {
      16: "/images/request_proxy_enabled16.png",
      32: "/images/request_proxy_enabled32.png",
      48: "/images/request_proxy_enabled48.png",
      128: "/images/request_proxy_enabled128.png"
    }
  })
}

const setDisabledIcon = () => {
  chrome.action.setIcon({
    path: {
      16: "/images/request_proxy_disabled16.png",
      32: "/images/request_proxy_disabled32.png",
      48: "/images/request_proxy_disabled48.png",
      128: "/images/request_proxy_disabled128.png"
    }
  })
}

// 从 storage 中恢复数据
chrome.storage.local.get([REQUEST_PROXY_CONFIG], (result) => {
  // 在进入页面的时候，更新页面的状态
  const payload = result[REQUEST_PROXY_CONFIG];
  if (payload) {
    // 启动的时候重置一下每个 rule 状态
    payload.list = (payload.list).map(item => ({
      ...item,
      state: [],
    }))
    chrome.storage.local.set({ request_proxy_config: payload })
    request_proxy_config = payload;
    if (payload.enabled) {
      setEnabledIcon();
    }
  } else {
    // 如果没有缓存数据，则设置默认值
    const defaultValue = {
      enabled: false,
      list: []
    }
    chrome.storage.local.set({ request_proxy_config: defaultValue })
    request_proxy_config = defaultValue
  }
});

// const getStorage = (name) => {
//   return new Promise((resolve) => {
//     chrome.storage.local.get(name, (res) => {
//       resolve(res);
//     })
//   })
// }

// const setStorage = (name, value) => {
//   chrome.storage.local.set({ [name]: value });
// }

// 获取当前所有 windowId
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
    top: 10,
  }, (target) => {
    panel_window_id = target.id;
    // 创建配置面板后 - 发送配置初始化数据
    // chrome.tabs.query({ active: true, windowId: panel_window_id }, function(tabs){
    //   chrome.tabs.sendMessage(tabs[0].id, {
    //     source: "background-to-panel",
    //     payload: request_proxy_config
    //   })
    //   .catch(err => {
    //   })
    // })
    // setStorage(REQUEST_PROXY_WINDOW_ID, target.id)
  });
}

const create = async () => {
  // const data = await getStorage(REQUEST_PROXY_WINDOW_ID);
  const windowIdList = await getAllWindowIds();

  const windowId = panel_window_id
  console.log(windowId,  windowIdList?.includes(windowId))
  // 将已存在窗口置于顶层
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
// 如果 sendResponse 没有调用 会出错 : Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
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
      })
      chrome.storage.local.set({"request_proxy_config": payload});
    } else {
      // 接受不带 payload 的 message, 表示 inject script(wrapper.js) 加载完成
      // 数据从 background -> content -> wrapper
      chrome.tabs.sendMessage(sender.tab.id, {
        source: "background-to-content",
        payload: request_proxy_config
      })
    }
  } else if (source === 'panel-to-background') {
    if (payload) {
      if (!request_proxy_config.enabled && payload.enabled) {
        setEnabledIcon()
      }
      if (request_proxy_config.enabled && !payload.enabled) {
        setDisabledIcon()
      }
      request_proxy_config = payload;
      chrome.storage.local.set({"request_proxy_config": payload});
    } else {
      sendResponse(request_proxy_config);
    }
  }
  sendResponse();
})

// 每个窗口可能会有多个 高亮的选项卡，但是只会有一个 actived 的选项卡
chrome.tabs.onActivated.addListener((res) => {
  chrome.tabs.sendMessage(res.tabId, {
    source: "background-to-content",
    payload: request_proxy_config
  })
  .catch(() => {
    // 能捕获页面未加载 content.js 导致通信连接错误
    // // 解决加载了插件，但是页面没刷新，无法进行交互，手动执行 content.js
    // chrome.tabs.get(res.tabId, function(tabDetail){
    //   if (tabDetail.url) {
    //     console.log('1')
    //     // 需要配置权限 "host_permissions": ["<all_urls>"]
    //     chrome.scripting.executeScript({
    //       target: { tabId: res.tabId },
    //       files: ['content.js']
    //     })
    //   }
    // })
  })
})

chrome.windows.onFocusChanged.addListener((res) => {
  if (res !== -1) {
    chrome.tabs.query({ active: true, windowId: res }, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {
        source: "background-to-content",
        payload: request_proxy_config
      })
      .catch((err) => {
        // 能捕获页面未加载 content.js 导致通信连接错误
        // // 解决加载了插件，但是页面没刷新，无法进行交互，手动执行 content.js
        // // 若 url startsWith("chrome://") 不插入。此时 url 为空
        // if (!tabs[0].url) return undefined;
        // console.log('2')
        // // 需要配置权限 "host_permissions": ["<all_urls>"]
        // chrome.scripting.executeScript({
        //   target: { tabId: tabs[0].id },
        //   files: ['content.js']
        // })
      })
    })
  }
})
