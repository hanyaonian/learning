# Directed Acyclic Graph

NOTICE: watch [topo](./topo.md) first

有向无环图

https://oi-wiki.org/graph/dag/

## Concept

- 能 拓扑排序 的图，一定是有向无环图；
  如果有环，那么环上的任意两个节点在任意序列中都不满足条件了。

- 有向无环图，一定能拓扑排序；
  （归纳法）假设节点数不超过 [k] 的 有向无环图都能拓扑排序，那么对于节点数等于 [k] 的，考虑执行拓扑排序第一步之后的情形即可。

## Detect

- TOPO
- DFS (todo)

## Application

DP 求最长/短 的路径
