/**
 * Mergesort 也是一个分而治之的排序算法
 * 
 * 核心步骤：
 * 1. 拆解：将n个元素分成个含n/2个元素的子序列。
 * 2. 解决：用合并排序法对两个子序列递归的排序。
 * 3. 合并：合并两个已排序的子序列已得到排序结果。
 */

/**
 * compare function
 */
export type cmpFunction = (pre: any, next: any) => number

export default function mergeSort(arr: any[], cmpFunc: cmpFunction = cmp, start?: number, end?: number): any[] {
	if (start === undefined || start < 0) {
		start = 0;
		end = arr.length;
	}
	return sort(arr.slice(start, end), cmpFunc);
}

function sort(arr: any[], cmpFunc: cmpFunction): any[] {
	if (arr.length <= 1) {
		return arr;
	}
	let mid = ~~(arr.length / 2);
	// 拆分
	return merge(sort(arr.slice(0, mid), cmpFunc), sort(arr.slice(mid), cmpFunc), cmpFunc);
}

function merge(left: any[], right: any[], cmpFunc: cmpFunction): any[] {
	const total = left.length + right.length, result = new Array(total);
	let curr = 0, lindex = 0, rindex = 0;
	// 合并排序项
	while (lindex < left.length && rindex < right.length) {
		if (cmpFunc(left[lindex], right[rindex]) < 0) {
			result[curr++] = left[lindex++];
		} else {
			result[curr++] = right[rindex++];
		}
	}
	// 合并剩余项
	while (lindex < left.length) {
		result[curr++] = left[lindex++];
	}
	while (rindex < right.length) {
		result[curr++] = right[rindex++];
	}
	return result;
}

function cmp(pre: number, next: number): number {
	return pre - next;
}