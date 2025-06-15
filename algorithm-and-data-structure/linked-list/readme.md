# Linked-list 

## Usage

- LRU

## Practice

Linked-list practice

- 单链表反转 (leetcode - 206)
- 链表中环的检测
- 两个有序的链表合并
- 删除链表倒数第 n 个结点
- 求链表的中间结点

### Example 1: reverse singly-linked list

单链表反转

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function reverseList(head: ListNode | null): ListNode | null {
  let cur = head;
  let pre = null;
  while (cur !== null) {
      let next = cur.next;
      
      cur.next = pre;
      
      pre = cur;
      cur = next;
      
      // at tail
      if (cur === null) {
          return pre;
      }
  }
  
  return cur; 
};
```
