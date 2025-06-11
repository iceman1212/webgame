// 辅助函数

/**
 * Fisher-Yates (aka Knuth) Shuffle 算法的实现，用于打乱数组元素的顺序。
 * @param arr 要打乱顺序的数组。该数组会被原地修改。
 * @template T 数组中元素的类型。
 */
export function shuffleArray<T>(arr: T[]): void {
  // 从数组的最后一个元素开始向前遍历
  for (let i: number = arr.length - 1; i > 0; i--) {
    // 生成一个从0到i（包含）的随机索引 j
    const j: number = Math.floor(Math.random() * (i + 1));
    // 交换当前元素 arr[i] 与随机选中的元素 arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
