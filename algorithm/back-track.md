# 回溯模板--伪代码

````text
void backtracking(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
        处理节点;
        backtracking(路径，选择列表); // 递归
        回溯，撤销处理结果
    }
}
````

eg:
<https://github.com/hanyaonian/leetcode_record/blob/master/46*.js>
<https://github.com/hanyaonian/leetcode_record/blob/master/47.js>
