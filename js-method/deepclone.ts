/**
 * @description deep clone function
 * @param obj any object needs to be clone;
 * @param cache to check if circular exists
 * @returns
 */
export function deepclone(obj: any, cache: Map<any, any> = new Map()) {
  if (typeof obj !== 'object' && obj !== null) {
    return obj;
  }
  if (obj === null) {
    return obj;
  }
  // Circular reference 循环引用
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[key] = deepclone(obj[key], cache);
  });
  return newObj;
}

/**
 * other 2 simple methods
 */
// shallow one
export function simpleClone1(obj: any) {
  return { ...obj };
}

// deep but bad perf
export function simpleClone2(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
