# TOPO 拓扑排序

- oi-wiki https://oi-wiki.org/graph/topo/

## Concept

在一个 DAG（有向无环图） 中，我们将图中的顶点以线性方式进行排序，使得对于任何的顶点 [u] 到 [v] 的有向边 [(u,v)] , 都可以有 [u] 在 [v] 的前面。

最前边的点就是顶点

## Case

WXG: 前端打包找根入口;

类似题:
https://leetcode.cn/problems/course-schedule/description/
https://leetcode.cn/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/description/

## Implement

实现思路:

1 从图中选择一个入度为零的点。
2 输出该顶点，从图中删除此顶点及其所有的出边。
重复上面两步，直到所有顶点都输出，拓扑排序完成，或者图中不存在入度为零的点，此时说明图是有环图，拓扑排序无法完成，陷入死锁。

## DFS

对于图中的任意一个节点，它在搜索的过程中有三种状态，即：

- 「未搜索」：我们还没有搜索到这个节点；
- 「搜索中」：我们搜索过这个节点，但还没有回溯到该节点，即该节点还没有入栈，还有相邻的节点没有搜索完成）；
- 「已完成」：我们搜索过并且回溯过这个节点，即该节点已经入栈，并且所有该节点的相邻节点都出现在栈的更底部的位置，满足拓扑排序的要求。

通过上述的三种状态，我们就可以给出使用深度优先搜索得到拓扑排序的算法流程，在每一轮的搜索搜索开始时，我们任取一个「未搜索」的节点开始进行深度优先搜索。
我们将当前搜索的节点 u 标记为「搜索中」，遍历该节点的每一个相邻节点 v：

- 如果 v 为「未搜索」，那么我们开始搜索 v，待搜索完成回溯到 u；
- 如果 v 为「搜索中」，那么我们就找到了图中的一个环，因此是不存在拓扑排序的；
- 如果 v 为「已完成」，那么说明 v 已经在栈中了，而 u 还不在栈中，因此 u 无论何时入栈都不会影响到 (u,v) 之前的拓扑关系，以及不用进行任何操作。

当 u 的所有相邻节点都为「已完成」时，我们将 u 放入栈中，并将其标记为「已完成」。
在整个深度优先搜索的过程结束后，如果我们没有找到图中的环，那么栈中存储这所有的 n 个节点，从栈顶到栈底的顺序即为一种拓扑排序。

```ts
// https://leetcode.cn/problems/course-schedule-ii/
enum State {
  Searching,
  Searched,
  Unsearched,
}

function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  let is_valid = true;
  const result: number[] = [];
  const res_map = new Map<number, Set<number>>();
  const search_mark = new Array(numCourses).fill(State.Unsearched);
  for (let i = 0; i < numCourses; i++) {
    res_map.set(i, new Set());
  }
  for (const line of prerequisites) {
    const [pre, next] = line;
    const deps = res_map.get(pre);
    deps!.add(next);
  }

  const dfs = (i: number) => {
    search_mark[i] = State.Searching;
    const near = Array.from(res_map.get(i)!);
    for (let j = 0; j < near.length; j++) {
      const val = near[j];
      if (search_mark[val] === State.Unsearched) {
        dfs(val);
      } else if (search_mark[val] === State.Searching) {
        is_valid = false;
      }
    }
    result.push(i);
    search_mark[i] = State.Searched;
  };

  for (let i = 0; i < numCourses; i++) {
    if (is_valid && search_mark[i] === State.Unsearched) {
      dfs(i);
    }
  }
  if (is_valid) {
    return result;
  }
  return [];
}
```

## Kahn 算法

```txt
L ← Empty list that will contain the sorted elements
S ← Set of all nodes with no incoming edges
while S is not empty do
    remove a node n from S
    insert n into L
    for each node m with an edge e from n to m do
        remove edge e from the graph
        if m has no other incoming edges then
            insert m into S
if graph has edges then
    return error (graph has at least one cycle)
else
    return L (a topologically sorted order)
```
