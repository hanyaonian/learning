/**
 * example of blocking queue
 */
class BlockingQueue<T> {
  private queue: T[] = [];
  private wating_produce_list: Array<() => void> = [];
  private wating_consume_list: Array<(value: T) => void> = [];

  get size(): number {
    return this.queue.length;
  }

  get isEmpty(): boolean {
    return this.queue.length === 0;
  }

  get isFull(): boolean {
    return this.queue.length >= this.max_size;
  }

  constructor(private readonly max_size: number = Infinity) {}

  async enqueue(item: T): Promise<void> {
    if (this.queue.length >= this.max_size) {
      await new Promise<void>((resolve) => {
        this.wating_produce_list.push(resolve);
      });
    }

    this.queue.push(item);
    if (this.wating_consume_list.length > 0) {
      const consumer = this.wating_consume_list.shift()!;
      const item = this.queue.shift()!;
      consumer(item);
    }
  }

  async dequeue(): Promise<T> {
    if (this.queue.length === 0) {
      return new Promise<T>((resolve) => {
        this.wating_consume_list.push(resolve);
      });
    }

    const item = this.queue.shift()!;
    if (this.wating_produce_list.length > 0) {
      const producer = this.wating_produce_list.shift()!;
      producer();
    }

    return item;
  }
}
