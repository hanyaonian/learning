/**
 * 核心思想四步：
 * 1. 选取一个pivot点，随机的。
 * 2. pivot右边放大的
 * 3. pivot左边放小的
 * 4. 重复
 */

 /**
  * compare function type
  */
export type compareFunction = (pre: any, next: any) => number;

export default function quickSort(arr: any[], compare: compareFunction = cmp, start?: number, end?: number): void {
	if (!start || start < 0) {
		start = 0;
	}
	if (!end || end > arr.length - 1) {
		end = arr.length - 1;
	}
	sort(arr, compare, start, end);
}

/**
 * get random number
 * @param min minus range
 * @param max max range
 */
function getRandom(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * default compare function
 * @param pre 
 * @param next 
 */
function cmp(pre: number, next: number): number {
	return pre - next;
}

/**
  * swap array elements
  * @param arr 
  * @param pos1 
  * @param pos2 
  */
function swap(arr: any[], pos1: number, pos2: number): void {
	let temp = arr[pos1];
	arr[pos1] = arr[pos2];
	arr[pos2] = temp;
}
 /**
  * real sort function
  * @param arr 
  * @param compare 
  * @param start 
  * @param end 
  */
 function sort(arr: any[], compare: compareFunction, left: number, right: number): void {
	 if (left >= right) {
		 return;
	 }
	 let start = left, end = right;
	 // optimize: random pivot
	 let pivot = getRandom(start, end);
	 let temp = arr[pivot];
	 swap(arr, pivot, start);
	 while (start < end) {
		 // 右比pivot大
		 while (end > start && compare(arr[end], temp) >= 0) {
			 end -= 1;
		 }
		 arr[start] = arr[end];
		 while (end > start && compare(arr[start], temp) < 0) {
			 start += 1;
		 }
		 arr[end] = arr[start];
	 }
	 // start === end
	 arr[start] = temp;
	 // remember to lower the boundary
	 sort(arr, compare, left, start - 1);
	 sort(arr, compare, start + 1, right);
 }
