/**
 * 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置.
 * 然后，再从剩余未排序元素中继续寻找最小（大）元素.
 * 然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。
 */

export default function selectSort(arr: number[], start: number = 0, end?: number) {
	if (!end) {
		end = arr.length;
	}
	for (let i = 0; i < end - 1; i++) {
		let min = i;
		for (let j = i + 1; j < end; j++) {
			if (arr[min] > arr[j]) {
				min = j;
			}
		}
		swap(arr, i, min);
	}
	return arr;
}

function swap(arr: number[], a: number, b: number) {
	const temp = arr[a];
	arr[a] = arr[b];
	arr[b] = temp;
}