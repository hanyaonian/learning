/**
 * @description simple lru cache sample
 */

export type CacheKey = String | Symbol | Number;

export interface CacheItem {
  key: CacheKey;
}

export default class LRUCache {
  private cacheList: CacheItem[];
  private cacheSize: number;

  constructor(size: number) {
    this.cacheList = [];
    this.cacheSize = size;
  }

  /**
   * @description get cache. if cache exist, prioritize to head of list
   * @param key CacheItem key
   * @returns CacheItem | Null
   */
  public getCache(key: CacheKey): null | CacheItem {
    let targetKey;
    for (let i = 0; i < this.cacheList.length; i++) {
      const cacheItem = this.cacheList[i];
      if (cacheItem.key === key) {
        targetKey = i;
        break;
      }
    }
    if (!targetKey) {
      return null;
    }
    const [target] = this.cacheList.splice(targetKey, 1);
    this.cacheList.push(target);
    return target;
  }

  /**
   * @description set cache to list.
   * @param item { CacheItem }
   * @returns void
   */
  public setCache(item: CacheItem): void {
    const isCacheExist = this.getCache(item.key);
    if (isCacheExist !== null) {
      return;
    }
    if (this.cacheList.length >= this.cacheSize) {
      this.cacheList.pop;
    }
    this.cacheList.unshift(item);
  }

  /**
   * @description update cache list size.
   * @param size { number }
   */
  public setCacheSize(size: number) {
    if (size <= 0) {
      throw RangeError('cache size should bigger than 0');
    }
    if (size >= this.cacheSize) {
      this.cacheSize = size;
    } else {
      this.cacheList.length = size;
    }
  }

  public destroy() {
    this.cacheList = [];
    this.cacheSize = 0;
  }
}
