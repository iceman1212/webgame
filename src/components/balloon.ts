import { canvas, ctx } from '../utils/domElements.js';
import { shuffleArray } from '../utils/helpers.js';

// 类型定义
// 问题接口 (如果后续有共享类型文件，可以从中导入)
export interface Question {
  text: string; // 问题文本
  answer: number; // 问题答案
}

// 气球对象接口
export interface Balloon {
  x: number; // 气球x坐标
  y: number; // 气球y坐标
  val: number; // 气球代表的数值 (答案选项)
  image: HTMLImageElement; // 气球的图像元素
  speed: number; // 气球上升速度
  floatOffset: number; // 气球漂浮动画的偏移量
  color?: string; // 可选: 如果使用备用绘制方式，则为气球颜色
}

// 气球半径常量
export const BALLOON_RADIUS: number = 28;

// 预加载气球图片
const balloonImagePaths: string[] = [
  'assets/images/balloon_rainbow.svg', // 彩虹气球
  'assets/images/balloon_star.svg', // 星星气球
  'assets/images/balloon_happy_face.svg' // 笑脸气球
];
// 存储预加载的图片对象
export const balloonImages: HTMLImageElement[] = [];
// 遍历图片路径，创建Image对象并加载
balloonImagePaths.forEach(path => {
  const img = new Image();
  img.src = path;
  balloonImages.push(img);
});

// 生成气球函数
export function spawnBalloons(currentQuestion: Question | null, existingBalloons: Balloon[]): Balloon[] {
  // 如果当前问题不存在或canvas不存在，则返回现有气球数组
  if (!currentQuestion || !canvas) return existingBalloons;
  const canvasWidth = canvas.width; // 在null检查后使用此变量
  // 获取正确答案
  const correctAns: number = currentQuestion.answer;
  // 初始化答案选项数组，首先包含正确答案
  let choices: number[] = [correctAns];
  // 生成另外三个干扰选项
  while (choices.length < 4) {
    // 生成一个在正确答案附近（-4到+4范围，不包括0）的随机数作为干扰项
    let fake: number = correctAns + (Math.floor(Math.random() * 9) - 4);
    // 确保干扰项不等于正确答案，大于等于0，并且不与现有选项重复
    if (fake !== correctAns && fake >= 0 && !choices.includes(fake)) {
      choices.push(fake);
    }
  }
  // 打乱答案选项的顺序
  shuffleArray(choices);
  // 为每个答案选项创建一个气球对象
  return choices.map((val, idx): Balloon => {
    // 计算气球的初始x坐标，使其在canvas上均匀分布
    const xPos: number = idx * (canvasWidth / 4) + (canvasWidth / 8) - BALLOON_RADIUS; // 使用canvasWidth
    // 随机选择一个气球图片
    const randomImage: HTMLImageElement = balloonImages[Math.floor(Math.random() * balloonImages.length)];
    // 返回新的气球对象
    return {
      x: xPos, // x坐标
      y: -(BALLOON_RADIUS * 2 + Math.random() * 80), // y坐标，初始在屏幕上方不可见区域，并带有随机偏移
      val: val, // 气球代表的数值
      image: randomImage, // 气球图片
      speed: 1 + Math.random() * 1.5, // 气球上升速度，带有随机性
      floatOffset: Math.random() * Math.PI * 2 // 气球漂浮动画的随机相位偏移
    };
  });
}

// 绘制气球函数
export function drawBalloons(balloons: Balloon[]): void {
  // 如果canvas上下文不存在，则直接返回
  if (!ctx) return;
  const context = ctx; // 在null检查后使用此变量
  // 设置文字样式
  context.font = 'bold 18px Arial';
  // 遍历所有气球并绘制它们
  balloons.forEach(balloon => {
    // 计算气球的左右摇摆效果
    const sway: number = Math.sin((Date.now() / 500) + balloon.floatOffset) * 8;
    // 计算气球的实际x, y坐标 (包含摇摆效果)
    const bx: number = balloon.x + sway;
    const by: number = balloon.y;

    // 绘制气球阴影
    context.beginPath();
    context.arc(bx + BALLOON_RADIUS + 3, by + BALLOON_RADIUS + 3, BALLOON_RADIUS, 0, Math.PI * 2);
    context.fillStyle = 'rgba(0,0,0,0.1)'; // 半透明黑色阴影
    context.fill();

    // 检查气球图片是否已加载完成且有效
    if (balloon.image && balloon.image.complete && balloon.image.naturalHeight !== 0) {
      // 绘制气球图片
      context.drawImage(balloon.image, bx, by, BALLOON_RADIUS * 2, BALLOON_RADIUS * 2);
    } else {
      // 如果图片未加载或无效，则绘制备用形状 (一个简单的圆形)
      context.beginPath();
      context.arc(bx + BALLOON_RADIUS, by + BALLOON_RADIUS, BALLOON_RADIUS, 0, Math.PI * 2);
      context.fillStyle = balloon.color || 'gray'; // 使用气球颜色或默认为灰色
      context.fill();
      // 绘制高光效果
      context.beginPath();
      context.arc(bx + BALLOON_RADIUS - 8, by + BALLOON_RADIUS - 12, BALLOON_RADIUS / 4, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255,255,255,0.7)'; // 半透明白色高光
      context.fill();
    }

    // 绘制气球绳子
    context.strokeStyle = '#888'; // 绳子颜色
    context.lineWidth = 2; // 绳子宽度
    context.beginPath();
    context.moveTo(bx + BALLOON_RADIUS, by + BALLOON_RADIUS * 2); // 绳子起点 (气球底部中心)
    context.lineTo(bx + BALLOON_RADIUS, by + BALLOON_RADIUS * 2 + 20); // 绳子终点 (向下延伸20像素)
    context.stroke();

    // 在气球上绘制数值 (答案选项)
    context.fillStyle = '#000000'; // 文字颜色
    context.textAlign = 'center'; // 文字居中对齐
    // 将数值绘制在气球中心略偏下的位置
    context.fillText(balloon.val.toString(), bx + BALLOON_RADIUS, by + BALLOON_RADIUS + 6);
  });
}
