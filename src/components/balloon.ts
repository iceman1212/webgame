import { ASSETS_CONFIG, COLORS, GAME_CONFIG } from '../core/gameConfig.js';
import { canvas, ctx } from '../utils/domElements.js';
import { GameErrorHandler } from '../utils/errorHandler.js';
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
export const BALLOON_RADIUS: number = GAME_CONFIG.BALLOON_RADIUS;

// 预加载气球图片
const balloonImagePaths: readonly string[] = ASSETS_CONFIG.IMAGES.BALLOONS;
// 存储预加载的图片对象
export const balloonImages: HTMLImageElement[] = [];
// 遍历图片路径，创建Image对象并加载
balloonImagePaths.forEach(path => {
  const img = new Image();
  img.src = path;
  // 添加错误处理
  img.onerror = (): void => {
    GameErrorHandler.handleResourceLoadError('balloon image', path);
  };
  balloonImages.push(img);
});

// 生成气球函数
export function spawnBalloons(
  currentQuestion: Question | null,
  existingBalloons: Balloon[]
): Balloon[] {
  return (
    GameErrorHandler.safeExecute(
      () => {
        // 如果当前问题不存在或canvas不存在，则返回现有气球数组
        if (!currentQuestion || !canvas) return existingBalloons;
        const canvasWidth = canvas.width; // 在null检查后使用此变量
        // 获取正确答案
        const correctAns: number = currentQuestion.answer;
        // 初始化答案选项数组，首先包含正确答案
        const choices: number[] = [correctAns];
        // 生成另外三个干扰选项
        while (choices.length < GAME_CONFIG.BALLOON_COUNT) {
          // 生成一个在正确答案附近的随机数作为干扰项
          const range = GAME_CONFIG.DISTRACTOR_RANGE * 2 + 1; // -4到+4的范围
          const fake: number =
            correctAns + (Math.floor(Math.random() * range) - GAME_CONFIG.DISTRACTOR_RANGE);
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
          const xPos: number =
            idx * (canvasWidth / GAME_CONFIG.BALLOON_COUNT) +
            canvasWidth / (GAME_CONFIG.BALLOON_COUNT * 2) -
            BALLOON_RADIUS;
          // 随机选择一个气球图片
          const randomImage: HTMLImageElement =
            balloonImages[Math.floor(Math.random() * balloonImages.length)];
          // 返回新的气球对象
          return {
            x: xPos, // x坐标
            y: -(BALLOON_RADIUS * 2 + Math.random() * 80), // y坐标，初始在屏幕上方不可见区域，并带有随机偏移
            val: val, // 气球代表的数值
            image: randomImage, // 气球图片
            speed:
              GAME_CONFIG.BALLOON_SPEED_MIN +
              Math.random() * (GAME_CONFIG.BALLOON_SPEED_MAX - GAME_CONFIG.BALLOON_SPEED_MIN), // 使用配置的速度范围
            floatOffset: Math.random() * Math.PI * 2, // 气球漂浮动画的随机相位偏移
          };
        });
      },
      'spawning balloons',
      existingBalloons
    ) || existingBalloons
  );
}

// 绘制气球函数
export function drawBalloons(balloons: Balloon[]): void {
  GameErrorHandler.safeExecute(() => {
    // 如果canvas上下文不存在，则直接返回
    if (!ctx) return;
    const context = ctx; // 在null检查后使用此变量
    // 设置文字样式
    context.font = 'bold 18px Arial';
    // 遍历所有气球并绘制它们
    balloons.forEach(balloon => {
      // 计算气球的左右摇摆效果
      const sway: number =
        Math.sin(Date.now() / GAME_CONFIG.BALLOON_SWAY_SPEED + balloon.floatOffset) *
        GAME_CONFIG.BALLOON_SWAY_AMPLITUDE;
      // 计算气球的实际x, y坐标 (包含摇摆效果)
      const bx: number = balloon.x + sway;
      const by: number = balloon.y;

      // 绘制气球阴影
      context.beginPath();
      context.arc(
        bx + BALLOON_RADIUS + GAME_CONFIG.SHADOW_OFFSET,
        by + BALLOON_RADIUS + GAME_CONFIG.SHADOW_OFFSET,
        BALLOON_RADIUS,
        0,
        Math.PI * 2
      );
      context.fillStyle = COLORS.SHADOW; // 使用配置中的阴影颜色
      context.fill();

      // 检查气球图片是否已加载完成且有效
      if (balloon.image && balloon.image.complete && balloon.image.naturalHeight !== 0) {
        // 绘制气球图片
        context.drawImage(balloon.image, bx, by, BALLOON_RADIUS * 2, BALLOON_RADIUS * 2);
      } else {
        // 如果图片未加载或无效，则绘制备用形状 (一个简单的圆形)
        context.beginPath();
        context.arc(bx + BALLOON_RADIUS, by + BALLOON_RADIUS, BALLOON_RADIUS, 0, Math.PI * 2);
        context.fillStyle = balloon.color || COLORS.BALLOON_FALLBACK; // 使用配置中的备用颜色
        context.fill();
        // 绘制高光效果
        context.beginPath();
        context.arc(
          bx + BALLOON_RADIUS + GAME_CONFIG.HIGHLIGHT_OFFSET_X,
          by + BALLOON_RADIUS + GAME_CONFIG.HIGHLIGHT_OFFSET_Y,
          BALLOON_RADIUS * GAME_CONFIG.HIGHLIGHT_RADIUS_RATIO,
          0,
          Math.PI * 2
        );
        context.fillStyle = COLORS.HIGHLIGHT; // 使用配置中的高光颜色
        context.fill();
      }

      // 绘制气球绳子
      context.strokeStyle = COLORS.ROPE; // 使用配置中的绳子颜色
      context.lineWidth = GAME_CONFIG.ROPE_WIDTH; // 使用配置中的绳子宽度
      context.beginPath();
      context.moveTo(bx + BALLOON_RADIUS, by + BALLOON_RADIUS * 2); // 绳子起点 (气球底部中心)
      context.lineTo(bx + BALLOON_RADIUS, by + BALLOON_RADIUS * 2 + GAME_CONFIG.ROPE_LENGTH); // 使用配置中的绳子长度
      context.stroke();

      // 在气球上绘制数值 (答案选项)
      context.fillStyle = COLORS.TEXT; // 使用配置中的文字颜色
      context.textAlign = 'center'; // 文字居中对齐
      // 将数值绘制在气球中心略偏下的位置
      context.fillText(balloon.val.toString(), bx + BALLOON_RADIUS, by + BALLOON_RADIUS + 6);
    });
  }, 'drawing balloons');
}
