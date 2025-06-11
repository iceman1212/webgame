// DOM 元素 - 在必要时断言类型并检查null
// 获取游戏画布元素，用于绘制游戏内容
export const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
// 获取2D渲染上下文，用于在画布上绘图，如果canvas不存在则为null
export const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D | null;

// 获取用于显示分数的HTML元素
export const scoreEl = document.getElementById("score") as HTMLElement | null;
// 获取用于显示剩余生命值的HTML元素
export const livesEl = document.getElementById("lives") as HTMLElement | null;
// 获取用于显示问题文本的HTML元素
export const questionEl = document.getElementById("questionText") as HTMLElement | null;

// 获取开始游戏按钮元素
export const startBtn = document.getElementById("startBtn") as HTMLButtonElement | null;
// 获取游戏结束或暂停时的遮罩层元素
export const overlay = document.getElementById("overlay") as HTMLElement | null;
// 获取遮罩层上显示消息标题的元素 (例如 "游戏结束")
export const messageTitle = document.getElementById("messageTitle") as HTMLElement | null;
// 获取遮罩层上显示消息内容的元素 (例如 具体得分)
export const messageContent = document.getElementById("messageContent") as HTMLElement | null;
// 获取重新开始游戏按钮元素
export const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement | null;
