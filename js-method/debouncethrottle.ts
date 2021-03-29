function debounce(fn: Function, time = 500) {
  let timer: undefined | number;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, time);
  };
}

function throttle(fn: Function, time = 500) {
  let preCall: undefined | number;
  return function (...args: any[]) {
    const now = new Date().getTime();
    // 首次调用或已经过了规定时间
    if (!preCall || now - preCall > time) {
      preCall = new Date().getTime();
      fn(...args);
      // 未到规定时间不给继续调用
      setTimeout(() => {
        preCall = undefined;
      }, time);
    }
  };
}
