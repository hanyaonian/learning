/**
 * simple event emitter, class-based
 */

export default class Emitter {
  private map: Map<String, Function[]>;
  constructor(pmap?: Map<String, Function[]>) {
    this.map = pmap || new Map<String, Function[]>();
  }
  /**
   * trigger evemt
   * @param event { String }
   * @param arg { any }
   */
  public emit(event: string, arg: any) {
    let sub = this.map.get(event) || [];
    sub.slice().forEach((func) => {
      func(...arg);
    });
  }

  /**
   * register event handler
   * @param event
   * @param handler
   */
  public on(event: string, handler: Function) {
    if (this.map.has(event) === false) {
      this.map.set(event, [handler]);
    } else {
      let sub = this.map.get(event) || [];
      if (sub.indexOf(handler) === -1) {
        sub.push(handler);
      }
    }
  }

  /**
   * unsubscribe event;
   * @param event { String }
   * @param handler { Function }
   * @returns void
   */
  unsubscribe(event: string, handler?: Function) {
    let sub = this.map.get(event) || [];
    if (!handler) {
      this.map.delete(event);
      return;
    }
    let i = sub.indexOf(handler);
    if (i !== -1) {
      sub.splice(i, 1);
    }
  }
}
