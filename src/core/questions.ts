import { questionEl } from '../utils/domElements';

export interface Question {
  text: string;
  answer: number;
}

export function generateQuestion(): Question {
  const a: number = Math.floor(Math.random() * 9) + 1;
  const b: number = Math.floor(Math.random() * 9) + 1;
  const ops: string[] = ['+', '-', '*'];
  const op: string = ops[Math.floor(Math.random() * ops.length)];
  let ans: number = 0;
  if (op === '+') ans = a + b;
  if (op === '-') ans = a - b;
  if (op === '*') ans = a * b;
  const newQuestion = { text: `${a} ${op} ${b} = ?`, answer: ans };
  if (questionEl) questionEl.textContent = newQuestion.text;
  return newQuestion;
}
