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
  addListener<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this;
  on<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this;
  once<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this;
  removeListener<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this;
  off<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this;
  emit<K extends keyof Event>(
    eventName: K,
    data: Parameters<Events[K]>
  ): boolean;

  // not common-used types
  //   prependListener<E extends keyof Events>(event: E, listener: Events[E]): this;
  //   prependOnceListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  //   removeAllListeners<E extends keyof Events>(event?: E): this;
  //   removeListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  //   // The sloppy `eventNames()` return type is to mitigate type incompatibilities - see #5
  //   eventNames(): (keyof Events | string | symbol)[];
  //   rawListeners<E extends keyof Events>(event: E): Events[E][];
  //   listeners<E extends keyof Events>(event: E): Events[E][];
  //   listenerCount<E extends keyof Events>(event: E): number;

  //   getMaxListeners(): number;
  //   setMaxListeners(maxListeners: number): this;
}

// for class usages

export class TypedEventEmitterClass<
  Events extends EventMap
> extends EventEmitter {
  override addListener<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ) {
    return super.addListener(eventName, listener);
  }
  override on<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this {
    return super.on(eventName, listener);
  }
  override once<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this {
    return super.once(eventName, listener);
  }
  override removeListener<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this {
    return super.removeListener(eventName, listener);
  }
  override off<K extends keyof Event>(
    eventName: K,
    listener: (arg: Events[K]) => void
  ): this {
    return super.off(eventName, listener);
  }
  override emit<K extends keyof Event>(
    eventName: K,
    data: Parameters<Events[K]>
  ): boolean {
    return super.emit(eventName, data);
  }

  // not common-used types
  //   prependListener<E extends keyof Events>(event: E, listener: Events[E]): this;
  //   prependOnceListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  //   removeAllListeners<E extends keyof Events>(event?: E): this;
  //   removeListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  //   // The sloppy `eventNames()` return type is to mitigate type incompatibilities - see #5
  //   eventNames(): (keyof Events | string | symbol)[];
  //   rawListeners<E extends keyof Events>(event: E): Events[E][];
  //   listeners<E extends keyof Events>(event: E): Events[E][];
  //   listenerCount<E extends keyof Events>(event: E): number;

  //   getMaxListeners(): number;
  //   setMaxListeners(maxListeners: number): this;
}
