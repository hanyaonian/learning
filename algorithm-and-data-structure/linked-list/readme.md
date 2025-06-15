# Linked-list

## Usage

- LRU

## Practice

Linked-list practice

- 单链表反转 (leetcode - 206 - reverse-linked-list)
- 链表中环的检测 (leetcode - 141 - linked-list-cycle)
- 两个有序的链表合并 (leetcode - 21 - merge-two-sorted-lists)
- 删除链表倒数第 n 个结点 (leetcode - 19 - remove-nth-node-from-end-of-list)
- 求链表的中间结点 (leet code - 876 - middle-of-the-linked-list)

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
}
```

### Example 2: Detect circle in singly-linked list

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

function hasCycle(head: ListNode | null): boolean {
  let cur = head;
  let visited = new Set();

  while (cur) {
    if (visited.has(cur)) return true;

    visited.add(cur);
    cur = cur.next;
  }

  return false;
}
```

### Example 3: Combine sorted singly-linked list

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

function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  let cur1 = list1;
  let cur2 = list2;

  let head = getNode(cur1, cur2);
  let cur = head;

  while (cur) {
    if (cur === cur1) cur1 = cur1.next;
    if (cur === cur2) cur2 = cur2.next;

    let next = getNode(cur1, cur2);
    cur.next = next;
    cur = next;
  }
  return head;
}

function getNode(cur1: ListNode | null, cur2: ListNode | null) {
  if (!cur1 && !cur2) {
    return null;
  }
  if (!cur1) return cur2;
  if (!cur2) return cur1;

  return cur1.val > cur2.val ? cur2 : cur1;
}
```

### Example 4: Delete Nth Node in singly linked-list

- 添加一个哑节点（dummy node）, 比较好处理边界情况

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

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  let dummny = new ListNode(0, head);

  let length = 0;
  let cur = head;

  while (cur) {
    cur = cur.next;
    length += 1;
  }

  cur = dummny;
  for (let i = 0; i < length - n; i++) {
    cur = cur.next;
  }

  let temp = cur;
  cur = cur.next;
  temp.next = cur?.next ?? null;

  return dummny.next;
}
```

### Example 5: Find middle

快慢指针, O(n/2)

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

function middleNode(head: ListNode | null): ListNode | null {
  let fast = head;
  let slow = head;

  while (fast?.next?.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 偶数
  if (fast.next) {
    return slow.next;
  }
  return slow;
}
```
