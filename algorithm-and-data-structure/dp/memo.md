# Memo 记忆化搜索

https://oi-wiki.org/dp/memo/

### Case 1

01 背包问题

- 经典 Case: 山洞里有 [M] 株不同的草药，采每一株都需要一些时间 [t_i] ，每一株也有它自身的价值 [v_i] 。给你一段时间 [T] ，在这段时间里，你可以采到一些草药。让采到的草药的总价值最大。

### Case 2

- 经典 Case2: 打家劫舍 https://leetcode.cn/problems/house-robber/

状态方程: dp[i]=max(dp[i−2]+nums[i],dp[i−1])

dp[i] 记录了此房时最优结果

```ts
function rob(nums: number[]): number {
  const result = new Array(nums.length).fill(0);
  result[0] = nums[0];
  if (nums.length === 1) {
    return nums[0];
  }
  if (nums.length >= 2) {
    result[1] = Math.max(nums[0], nums[1]);
  }
  for (let i = 2; i < nums.length; i++) {
    result[i] = Math.max(result[i - 2] + nums[i], result[i - 1]);
  }
  return result[nums.length - 1];
}
```
