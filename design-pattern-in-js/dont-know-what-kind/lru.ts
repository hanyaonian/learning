/**
 * @description simple lru cache sample
 */
class LRUCache<K, V> {
  private map: Map<K, V> = new Map();
  private recent_keys: K[] = [];
  constructor(readonly capacity: number) {}

  get(key: K): V | -1 {
    if (this.map.has(key)) {
      const k = this.findIndexAndRm(key);
      this.recent_keys.push(k!);
      return this.map.get(key)!;
    }
    return -1;
  }

  put(key: K, val: V): void {
    if (!this.map.has(key)) {
      this.map.set(key, val);
      if (this.recent_keys.length === this.capacity) {
        const k = this.recent_keys.shift();
        this.map.delete(k!);
      }
      this.recent_keys.push(key);
      return;
    }

    // has
    const k = this.findIndexAndRm(key);
    this.recent_keys.push(k!);
  }

  private findIndexAndRm(key: K) {
    const i = this.recent_keys.findIndex((record) => record === key);
    if (i !== -1) {
      const [removed] = this.recent_keys.splice(i, 1);
      return removed;
    }
  }
}

/**
 * 分析
 *
 * findIndex 是 O(n) 的操作
 * 如何优化变为 O1?
 *
 * 首先考虑链表, 因为我们只管顺序其实不用管节点
 */

type ListNode<K, V> = {
  pre: ListNode<K, V> | null;
  next: ListNode<K, V> | null;
  val: V;
  key: K;
};

function debuglog<K, V>(prefix: string, head: ListNode<K, V> | null) {
  let temp = head;
  if (!temp) return console.log("no head");
  let txt = String(temp.key);
  while (temp.next) {
    temp = temp.next;
    txt = `${txt} ${temp.key}`;
  }
  console.log(`${prefix} list is : ${txt}`);
}

class LRUCache2<K, V> {
  private map: Map<K, ListNode<K, V>> = new Map();
  private tail: ListNode<K, V> | null = null;
  private head: ListNode<K, V> | null = null;
  private count = 0;

  constructor(readonly capacity: number) {}

  get(key: K): V | -1 {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      if (node === this.tail) {
        // no change
        return node.val;
      } else if (node === this.head) {
        // swap head & tail
        node.pre = this.tail;
        node.next!.pre = null;
        this.tail!.next = node;
        this.head = node.next;
        node.next = null;
        this.tail = node;
      } else {
        // swap body
        this.tail!.next = node;
        node.pre!.next = node.next;
        node.pre = this.tail;
        node.next = null;
      }
      debuglog(`after get ${key}`, this.head);
      return node.val;
    }
    return -1;
  }

  put(key: K, val: V): void {
    if (!this.map.has(key)) {
      const new_node = {
        pre: this.tail,
        next: null,
        val,
        key,
      };
      // new list
      if (!this.tail || !this.head) {
        this.head = new_node;
        this.tail = new_node;
        this.count += 1;
      } else {
        // remove cache
        if (this.count >= this.capacity) {
          this.map.delete(this.head.key);
          this.head = this.head.next;
          if (this.head?.pre) {
            this.head.pre = null;
          }
        } else {
          this.count += 1;
        }
        // put tail
        this.tail.next = new_node;
        this.tail = new_node;
      }
      this.map.set(key, new_node);
    } else {
      // update cache
      this.get(key);
    }
    debuglog(`after put ${key}`, this.head);
  }
}

/**
 * test: 1, -1, -1, 3, 4
 */

const cache = new LRUCache2(2 /* 缓存容量 */);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1); // 返回 1
cache.put(3, 3); // 该操作会使得关键字 2 作废
cache.get(2); // 返回 -1 (未找到)
cache.put(4, 4); // 该操作会使得关键字 1 作废
cache.get(1); // 返回 -1 (未找到)
cache.get(3); // 返回 3
cache.get(4); // 返回 4
