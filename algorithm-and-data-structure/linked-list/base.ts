interface DoublyLinkedListNode<T> {
  value: T;
  prev: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
}

export class DoublyLinkedList<T> {
  protected head: DoublyLinkedListNode<T> | null;
  protected tail: DoublyLinkedListNode<T> | null;
  protected length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  get size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  prepend(value: T): void {
    const newNode: DoublyLinkedListNode<T> = {
      value,
      prev: null,
      next: this.head,
    };

    if (this.head) {
      this.head.prev = newNode;
    } else {
      this.tail = newNode;
    }

    this.head = newNode;
    this.length++;
  }

  append(value: T): void {
    const newNode: DoublyLinkedListNode<T> = {
      value,
      prev: this.tail,
      next: null,
    };

    if (this.tail) {
      this.tail.next = newNode;
    } else {
      // 如果链表为空，新节点同时也是头节点
      this.head = newNode;
    }

    this.tail = newNode;
    this.length++;
  }

  insertAt(index: number, value: T): boolean {
    if (index < 0 || index > this.length) {
      return false;
    }

    // 在头部插入
    if (index === 0) {
      this.prepend(value);
      return true;
    }

    // 在尾部插入
    if (index === this.length) {
      this.append(value);
      return true;
    }

    const newNode: DoublyLinkedListNode<T> = {
      value,
      prev: null,
      next: null,
    };

    let current = this.head;
    let currentIndex = 0;

    while (currentIndex < index - 1 && current) {
      current = current.next;
      currentIndex++;
    }

    if (current && current.next) {
      newNode.prev = current;
      newNode.next = current.next;
      current.next.prev = newNode;
      current.next = newNode;
      this.length++;
      return true;
    }

    return false;
  }

  removeHead(): T | null {
    if (!this.head) {
      return null;
    }

    const removedValue = this.head.value;

    if (this.head.next) {
      this.head.next.prev = null;
      this.head = this.head.next;
    } else {
      // 如果只有一个节点
      this.head = null;
      this.tail = null;
    }

    this.length--;
    return removedValue;
  }

  removeTail(): T | null {
    if (!this.tail) {
      return null;
    }

    const removedValue = this.tail.value;

    if (this.tail.prev) {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.length--;
    return removedValue;
  }

  removeAt(index: number): T | null {
    if (index < 0 || index >= this.length) {
      return null;
    }

    if (index === 0) {
      return this.removeHead();
    }

    if (index === this.length - 1) {
      return this.removeTail();
    }

    let current = this.head;
    let currentIndex = 0;

    while (currentIndex < index && current) {
      current = current.next;
      currentIndex++;
    }

    if (current && current.prev && current.next) {
      current.prev.next = current.next;
      current.next.prev = current.prev;
      this.length--;
      return current.value;
    }

    return null;
  }

  remove(value: T): boolean {
    if (!this.head) {
      return false;
    }

    let current: null | DoublyLinkedListNode<T> = this.head;

    while (current) {
      if (current.value === value) {
        if (current === this.head) {
          this.removeHead();
        } else if (current === this.tail) {
          this.removeTail();
        } else if (current.prev && current.next) {
          current.prev.next = current.next;
          current.next.prev = current.prev;
          this.length--;
        }
        return true;
      }
      current = current.next;
    }

    return false;
  }

  indexOf(value: T): number {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  get(index: number): T | null {
    if (index < 0 || index >= this.length) {
      return null;
    }

    let current = this.head;
    let currentIndex = 0;

    while (currentIndex < index && current) {
      current = current.next;
      currentIndex++;
    }

    return current ? current.value : null;
  }

  update(index: number, value: T): boolean {
    if (index < 0 || index >= this.length) {
      return false;
    }

    let current = this.head;
    let currentIndex = 0;

    while (currentIndex < index && current) {
      current = current.next;
      currentIndex++;
    }

    if (current) {
      current.value = value;
      return true;
    }

    return false;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  forEach(callback: (value: T, index: number) => void): void {
    let current = this.head;
    let index = 0;

    while (current) {
      callback(current.value, index);
      current = current.next;
      index++;
    }
  }
}
