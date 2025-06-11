import { questionEl } from '../utils/domElements.js';
import { GAME_CONFIG } from './gameConfig.js';

// 定义问题对象接口
export interface Question {
  text: string; // 问题文本
  answer: number; // 问题答案
}

// 生成问题函数
export function generateQuestion(): Question {
  // 生成配置范围内的随机数a
  const a: number =
    Math.floor(
      Math.random() * (GAME_CONFIG.QUESTION_NUMBER_MAX - GAME_CONFIG.QUESTION_NUMBER_MIN + 1)
    ) + GAME_CONFIG.QUESTION_NUMBER_MIN;
  // 生成配置范围内的随机数b
  const b: number =
    Math.floor(
      Math.random() * (GAME_CONFIG.QUESTION_NUMBER_MAX - GAME_CONFIG.QUESTION_NUMBER_MIN + 1)
    ) + GAME_CONFIG.QUESTION_NUMBER_MIN;
  // 定义操作符数组
  const ops: string[] = ['+', '-', '*'];
  // 随机选择一个操作符
  const op: string = ops[Math.floor(Math.random() * ops.length)];
  // 初始化答案变量
  let ans: number = 0;
  // 根据操作符计算答案
  if (op === '+') ans = a + b;
  if (op === '-') ans = a - b;
  if (op === '*') ans = a * b;
  // 创建新的问题对象
  const newQuestion = { text: `${a} ${op} ${b} = ?`, answer: ans };
  // 如果存在问题元素，则更新问题元素的文本内容
  if (questionEl) questionEl.textContent = newQuestion.text;
  // 返回新的问题对象
  return newQuestion;
}
