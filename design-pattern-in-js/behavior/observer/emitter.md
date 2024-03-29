# Emitter

## Emitter types in TS

Custom events in typescript

```ts
import { EventEmitter } from 'events';

interface CustomEvents {
  event1: () => void;
  event2: (text: string) => void;
}

class CustomClass extends EventEmitter {
  on<T extends keyof CustomEvents>(event: T, listener: CustomEvents[T]) {
    super.on(event, listener);
    return this;
  }
}

const a = new CustomClass();

// typescript hint works
a.on('event1', () => {});
a.on('event2', (text) => {});
```

in popular npm package `eventemitter3`, this won't work:

```ts
import EventEmitter from "eventemitter3";
/**
 * check the declartion: EventEmitter already use generics
 * 
 * declare class EventEmitter<
 *    EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
 *    Context extends any = any
 *  >
 * 
 * eventNames(): Array<EventEmitter.EventNames<EventTypes>>;
 * 
 * on<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn: EventEmitter.EventListener<EventTypes, T>,
    context?: Context
  ): this;
 */

// so, we should change it into:
class CustomClass extends EventEmitter<keyof CustomEvents> {
  constructor() {
    super();
  }

  on<T extends keyof CustomEvents>(event: T, listener: CustomEvents[T]) {
    super.on(event, listener);
    return this;
  }
}
// it works
```

## simple class-based emitter example

```ts
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
```
