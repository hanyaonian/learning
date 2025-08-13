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
import { DoublyLinkedList } from "./base";

class LRUCache<K, V> {
  private map: Map<K, V> = new Map();
  private list = new DoublyLinkedList<K>();

  constructor(readonly capacity: number) {}

  get(key: K): V | null {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      this.list.remove(key);
      this.list.append(key);
      return node;
    }
    return null;
  }

  delete(key: K): void {
    if (this.map.has(key)) {
      this.map.delete(key);
      this.list.remove(key);
    }
  }

  put(key: K, val: V): void {
    if (!this.map.has(key)) {
      this.list.append(key);
      this.map.set(key, val);
      if (this.list.size > this.capacity) {
        const head = this.list.get(0);
        this.map.delete(head!);
        this.list.remove(head!);
      }
    } else {
      // update cache
      this.map.set(key, val);
      this.list.remove(key!);
      this.list.append(key!);
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
