// 包装某些对象上的方法，增强函数
export function fill(source: { [key: string]: any }, name: string, replacementFactory: (...args: any[]) => any): void {
  if (!(name in source)) return;

  const original = source[name] as () => any;
  const wrapped = replacementFactory(original);

  if (typeof wrapped === 'function') {
    source[name] = wrapped
  }
}


// 记录请求的 xhr 和对应的参数，目前不需要，后续 Breadcrumb 可能需要
// const requestKeys: XMLHttpRequest[] = [];
// const requestValues: Array<any>[] = [];
const xhrproto = XMLHttpRequest.prototype;

fill(xhrproto, 'open', function(originalOpen: () => void): () => void {
  return function(this: XMLHttpRequest, ...args: any): void {
    const xhr = this;
    const onreadystatechangeHandler = function(): void {
      if (xhr.readyState === 4) {
        console.log('open', xhr)
      }
    };

    if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
      fill(xhr, 'onreadystatechange', function(original): Function {
        return function(...readyStateArgs: any[]): void {
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

fill(xhrproto, 'send', function(originalSend: () => void): () => void {
  return function(this: XMLHttpRequest, ...args: any) {
    console.log('send', this)
    
    return originalSend.apply(this, args);
  };
});