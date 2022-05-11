window.myBridge = (config) => {
  // chrome.runtime && chrome.runtime.sendMessage(chrome.runtime.id, {
  //   source: 'request-interceptor-iframe',
  //   payload: config,
  // });

  postMessage({
    source: 'request-interceptor-iframe',
    payload: config,
  })

  // 更新 chrome.storage.local
  chrome.storage && chrome.storage.local.set({"request_interceptor_config": config});
  console.log('config 更新了', config)
}