/**
 * https://leetcode.cn/problems/lru-cache/
 * @description simple lru cache sample, O(n)
 *
 * On的LRU实现
 */

class NLRUCache<K, V> {
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
 * 首先考虑链表, 因为我们只管首尾顺序
 */

type LNode<K, V> = {
  pre: LNode<K, V> | null;
  next: LNode<K, V> | null;
  val: V;
  key: K;
};

// 用于调试, 可以看lru队列
const debuglog = <K, V>(head: LNode<K, V> | null) => {
  let temp = head;
  if (!temp) return;
  let txt = `[ ${temp.key}`;
  while (temp.next) {
    temp = temp.next;
    txt = `${txt} ${temp.key}`;
  }
  return `${txt} ]`;
};

class LRUCache<K, V> {
  private map: Map<K, LNode<K, V>> = new Map();
  private tail: LNode<K, V> | null = null;
  private head: LNode<K, V> | null = null;
  private count = 0;

  constructor(readonly capacity: number) {}

  get(key: K): V | -1 {
    const result = (() => {
      if (this.map.has(key)) {
        const node = this.map.get(key)!;
        this.remove(node);
        this.toTail(node);
        return node.val;
      }
      return -1;
    })();
    console.log(`get ${key} -> ${debuglog(this.head)}; result is ${result}`);
    return result;
  }

  put(key: K, val: V): void {
    if (!this.map.has(key)) {
      const new_node = this.createNode(key, val);
      this.count += 1;
      this.toTail(new_node);
      this.map.set(key, new_node);
      if (this.count > this.capacity) {
        this.map.delete(this.head!.key);
        this.remove(this.head!);
        this.count -= 1;
      }
    } else {
      // update cache
      const node = this.map.get(key);
      node!.val = val;
      this.remove(node!);
      this.toTail(node!);
    }
    console.log(`put ${key} -> ${debuglog(this.head)}`);
  }

  private createNode(key: K, val: V) {
    return {
      pre: null,
      next: null,
      val,
      key,
    };
  }

  private remove(node: LNode<K, V>) {
    if (node.pre) {
      node.pre.next = node.next;
      if (!node.next) {
        this.tail = node.pre;
      }
    } else {
      this.head = node.pre;
    }
    if (node.next) {
      node.next.pre = node.pre;
      if (!node.pre) {
        this.head = node.next;
      }
    } else {
      this.tail = node.pre;
    }
    node.pre = null;
    node.next = null;
  }

  private toTail(node: LNode<K, V>) {
    if (this.tail) {
      node.next = null;
      node.pre = this.tail;
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
      this.tail.next = null;
    }
  }
}

/*
 * 样例输入
 *
 * test: 1, -1, -1, 3, 4
 */

const cache = new LRUCache(2);

cache.put(1, 1);
cache.put(2, 2);
cache.get(1); // 返回 1
cache.put(3, 3); // 该操作会使得关键字 2 作废
cache.get(2); // 返回 -1 (未找到)
cache.put(4, 4); // 该操作会使得关键字 1 作废
cache.get(1); // 返回 -1 (未找到)
cache.get(3); // 返回 3
cache.get(4); // 返回 4

/**
 * for test case generation in leetcode:
 */

function generateTestCase(pre, next) {
  let result = "";
  pre.forEach((action, index) => {
    const args = next[index];
    if (action === "LRUCache")
      result += `const cache = new LRUCache2(${args.at(0)});`;
    if (action === "put") result += `cache.put(${args.at(0)}, ${args.at(1)});`;
    if (action === "get") result += `cache.get(${next[index].at(0)});`;
  });
  console.log(result);
}
