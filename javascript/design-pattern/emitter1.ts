/**
 * simple emitter, function based
 *
 * const emit = emitter();
 *
 * const someMethod = ()=> {
 *   console.log('on happend')
 * }
 * emit.on('happend', someMethod);
 *
 * emit.emit('happend');   // print 'on happend'
 *
 * // unsubscribe
 * emit.unsubscribe('happend', someMethod);
 * // or simply
 * emit.unsubscribe('happend');
 */

export type eventMap = Map<string, Function[]>;

export default function emitter(pmap?: eventMap) {
  const map = pmap || new Map<string, Function[]>();
  return {
    /**
     * trigger evemt
     * @param event { String }
     * @param arg { any }
     */
    emit(event: string, arg: any) {
      let sub = map.get(event) || [];
      sub.slice().forEach((func) => {
        func(...arg);
      });
    },

    /**
     * register event handler
     * @param event
     * @param handler
     */
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

    /**
     * unsubscribe event;
     * @param event { String }
     * @param handler { Function }
     * @returns void
     */
    unsubscribe(event: string, handler?: Function) {
      let sub = map.get(event) || [];
      if (!handler) {
        map.delete(event);
        return;
      }
      let i = sub.indexOf(handler);
      if (i !== -1) {
        sub.splice(i, 1);
      }
    }
  };
}
