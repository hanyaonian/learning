/**
 * 极简的事件监听方法：
 *
 * const emit = emitter();
 * emit.on('happend', ()=> {
 *   console.log('on happend')
 * })
 *
 * setTimeout(()=> {
 *   emit.emit('happend');
 * })
 */

export type eventMap = Map<string, Function[]>;

export default function emitter(pmap?: eventMap) {
  const map = pmap || new Map<string, Function[]>();
  return {
    // 触发任务, 使用es6的剩余参数可以减少处理
    // fix: 不应该使用剩余参数：这样传空会导致异常。仅接受一个参数/undefined为佳。
    emit(event: string, arg: any) {
      let sub = map.get(event) || [];
      sub.slice().forEach((func) => {
        func(arg);
      });
    },
    // 事件发生时，注册了的选手都会收到消息并且调用注册的handler
    on(event: string, handler: Function) {
      if (map.has(event) === false) {
        map.set(event, [handler]);
      } else {
        let sub = map.get(event) || [];
        if (sub.indexOf(handler) === -1) {
          sub.push(handler);
        }
      }
    },
    // 取消事件的订阅
    unsubscribe(event: string, handler: Function) {
      let sub = map.get(event) || [];
      let i = sub.indexOf(handler);
      if (i !== -1) {
        sub.splice(i, 1);
      }
    }
  };
}
