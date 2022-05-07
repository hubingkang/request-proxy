// 包装某些对象上的方法，增强函数
function fill(source, name, replacementFactory) {
  if (!(name in source)) return;

  const original = source[name];
  const wrapped = replacementFactory(original);

  if (typeof wrapped === 'function') {
    source[name] = wrapped
  }
}

// 记录请求的 xhr 和对应的参数，目前不需要，后续 Breadcrumb 可能需要
// const requestKeys: XMLHttpRequest[] = [];
// const requestValues: Array<any>[] = [];
const xhrproto = XMLHttpRequest.prototype;

fill(xhrproto, 'open', function(originalOpen) {
  return function(...args) {
    const xhr = this;
    const onreadystatechangeHandler = function() {
      if (xhr.readyState === 4) {
        console.log('open', xhr)
      }
    };

    if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
      fill(xhr, 'onreadystatechange', function(original) {
        return function(...readyStateArgs) {
          onreadystatechangeHandler();
          return original.apply(xhr, readyStateArgs);
        }; 
      });
    } else {
      xhr.addEventListener('readystatechange', onreadystatechangeHandler);
    }

    return originalOpen.apply(xhr, args);
  };
});

fill(xhrproto, 'send', function(originalSend) {
  return function(...args) {
    console.log('send', this)
    this.setRequestHeader("dingyi","header-dingyi-value");
    console.log('参数', JSON.parse(args[0]))
    return originalSend.apply(this, args);
  };
});