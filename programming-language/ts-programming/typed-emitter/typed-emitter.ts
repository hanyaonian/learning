/**
 * @description type-safed eventemitter for nodejs events
 */

import EventEmitter from "events";

interface EventMap {
  [key: string]: (...args: any[]) => void;
}

// for type used:

/**
 *
 * type MyEvents = {
 *   error: (error: Error) => void;
 *   message: (from: string, content: string) => void;
 * }
 *
 * const myEmitter = new EventEmitter() as TypedEventEmitter<MyEvents>;
 * myEmitter.emit("error", "x")  // <- Will catch this type error;
 * ```
 */

export interface TypedEventEmitter<Events extends EventMap>
  extends EventEmitter {
  addListener<K extends keyof Events>(eventName: K, listener: Events[K]): this;
  on<K extends keyof Events>(eventName: K, listener: Events[K]): this;
  once<K extends keyof Events>(eventName: K, listener: Events[K]): this;
  removeListener<K extends keyof Events>(
    eventName: K,
    listener: Events[K]
  ): this;
  off<K extends keyof Events>(eventName: K, listener: Events[K]): this;
  emit<K extends keyof Events>(
    eventName: K,
    data?: Parameters<Events[K]>
  ): boolean;

  // not common-used types
  // ...more,  prependListener ... etc.
}

// for class usages

type EventType = string | symbol;

// NOTE: potential bug of typescript:
// without as EventType,
// Argument of type 'string | number | symbol' is not assignable to parameter of type 'string | symbol'.
// eventName: string | number | symbol

export class TypedEventEmitter<Events extends EventMap> extends EventEmitter {
  override addListener<K extends keyof Events>(
    eventName: K,
    listener: Events[K]
  ) {
    return super.addListener(eventName as EventType, listener);
  }
  override on<K extends keyof Events>(eventName: K, listener: Events[K]): this {
    return super.on(eventName as EventType, listener);
  }
  override once<K extends keyof Events>(
    eventName: K,
    listener: Events[K]
  ): this {
    return super.once(eventName as EventType, listener);
  }
  override removeListener<K extends keyof Events>(
    eventName: K,
    listener: Events[K]
  ): this {
    return super.removeListener(eventName as EventType, listener);
  }
  override off<K extends keyof Events>(
    eventName: K,
    listener: Events[K]
  ): this {
    return super.off(eventName as EventType, listener);
  }
  override emit<K extends keyof Events>(
    eventName: K,
    data?: Parameters<Events[K]>[0]
  ): boolean {
    return super.emit(eventName as EventType, data);
  }

  // ... more
}
