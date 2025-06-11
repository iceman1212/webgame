import { canvas, ctx, scoreEl, livesEl, startBtn, overlay, messageTitle, messageContent, restartBtn } from './utils/domElements.js';
import { Player, drawPlayer } from './core/player.js';
import { Balloon, BALLOON_RADIUS, spawnBalloons, drawBalloons } from './components/balloon.js';
import { Question, generateQuestion } from './core/questions.js';
import { audioCtx, startBackgroundMusic, playPopSound, playFailSound } from './core/audio.js';

// 游戏状态变量
// 玩家对象，初始为null，在canvas可用时初始化
let player: Player | null = null;
if (canvas) {
    // 初始化玩家位置、大小和速度
    player = { x: canvas.width / 2 - 20, y: canvas.height - 60, size: 40, speed: 6 };
}

let balloons: Balloon[] = []; // 存储当前屏幕上的气球数组
let currentQuestion: Question | null = null; // 当前问题对象
let score: number = 0; // 玩家得分
let lives: number = 3; // 玩家剩余生命值
let gameInterval: number | null = null; // 存储游戏主循环的Interval ID，用于 clearInterval
let spawnInterval: number | null = null; // 存储气球生成循环的Interval ID
let isRunning: boolean = false; // 游戏是否正在运行的标志

// 游戏主更新函数，作为游戏循环的核心
function update(): void {
  // 确保canvas上下文、canvas元素和玩家对象都存在
  if (!ctx || !canvas || !player) return;
  const context = ctx; // 使用局部变量以确保在后续操作中ctx不为null
  const canvasWidth = canvas.width; // canvas宽度
  const canvasHeight = canvas.height; // canvas高度

  // 清除整个canvas，为新一帧的绘制做准备
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  // 绘制所有气球
  drawBalloons(balloons);
  // 绘制玩家
  drawPlayer(player);

  // 遍历所有气球，更新它们的状态
  balloons.forEach(balloon => {
    // 气球向下移动
    balloon.y += balloon.speed;
    // 如果气球移出屏幕底部
    if (balloon.y > canvasHeight) {
      // 如果该气球是正确答案的气球，则玩家失去一次生命
      if (currentQuestion && balloon.val === currentQuestion.answer) {
        loseLife();
      }
      // 移除该气球
      removeBalloon(balloon);
    }
  });

  // 再次遍历所有气球，检测与玩家的碰撞
  balloons.forEach(balloon => {
    // 计算气球的摇摆效果，使运动更自然
    const sway: number = Math.sin((Date.now() / 500) + balloon.floatOffset) * 8;
    const bx: number = balloon.x + sway; // 气球的实际x坐标 (包含摇摆)
    const by: number = balloon.y; // 气球的实际y坐标
    // 碰撞检测逻辑：检查玩家的边界框是否与气球的边界框重叠
    if (player && currentQuestion &&
        player.x < bx + BALLOON_RADIUS * 2 && // 玩家左边界 < 气球右边界
        player.x + player.size > bx &&          // 玩家右边界 > 气球左边界
        player.y < by + BALLOON_RADIUS * 2 && // 玩家上边界 < 气球下边界
        player.y + player.size > by) {          // 玩家下边界 > 气球上边界
      // 如果发生碰撞
      if (balloon.val === currentQuestion.answer) {
        // 如果碰到的是正确答案的气球
        score += 10; // 增加分数
        playPopSound(); // 播放成功音效
      } else {
        // 如果碰到的是错误答案的气球
        loseLife(); // 失去生命
        playFailSound(); // 播放失败音效
      }
      // 更新界面上的分数和生命值显示
      updateInfo();
      // 移除被碰撞的气球
      removeBalloon(balloon);
    }
  });
}

// 移除指定气球的函数
function removeBalloon(balloonToRemove: Balloon): void {
  // 使用filter方法创建一个不包含要移除气球的新数组
  balloons = balloons.filter(balloon => balloon !== balloonToRemove);
  // 如果移除后屏幕上没有气球了，则准备下一轮
  if (balloons.length === 0) {
    prepareNextRound();
  }
}

// 准备下一轮游戏的函数
function prepareNextRound(): void {
  // 生成一个新的问题
  currentQuestion = generateQuestion();
  // 根据新问题生成新的气球
  balloons = spawnBalloons(currentQuestion, balloons);
  // 更新界面信息
  updateInfo();
}

// 玩家失去生命的函数
function loseLife(): void {
  lives -= 1; // 生命值减1
  updateInfo(); // 更新界面信息
  // 如果生命值小于等于0，则结束游戏
  if (lives <= 0) {
    endGame();
  }
}

// 更新分数和生命值显示的函数
function updateInfo(): void {
  if (scoreEl) scoreEl.textContent = score.toString(); // 更新分数显示
  if (livesEl) livesEl.textContent = lives.toString(); // 更新生命值显示
}

// 结束游戏的函数
function endGame(): void {
  // 清除游戏主循环和气球生成循环的定时器
  if (gameInterval) clearInterval(gameInterval);
  if (spawnInterval) clearInterval(spawnInterval);
  isRunning = false; // 将游戏状态设置为未运行
  // 显示游戏结束信息
  if (messageTitle) messageTitle.textContent = '游戏结束';
  if (messageContent) messageContent.textContent = `得分:${score}`;
  // 显示遮罩层和结束信息
  if (overlay) overlay.style.visibility = 'visible';
}

// 事件监听器
// 监听键盘按下事件，用于控制玩家左右移动
document.addEventListener('keydown', (e: KeyboardEvent) => {
  // 如果游戏未运行或玩家对象不存在，则不响应
  if (!isRunning || !player) return;
  // 如果按下左箭头键或 'a' 键
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    // 玩家向左移动，但不超出canvas左边界
    player.x = Math.max(0, player.x - player.speed);
  } else if (e.key === 'ArrowRight' || e.key === 'd') { // 如果按下右箭头键或 'd' 键
    // 玩家向右移动，但不超出canvas右边界
    if(canvas) player.x = Math.min(canvas.width - player.size, player.x + player.speed);
  }
});

// 监听canvas上的鼠标移动事件，用于控制玩家左右移动
canvas?.addEventListener('mousemove', (e: MouseEvent) => {
  // 如果游戏未运行、玩家对象或canvas不存在，则不响应
  if (!isRunning || !player || !canvas) return;
  // 获取canvas在页面中的位置和大小
  const rect = canvas.getBoundingClientRect();
  // 计算鼠标在canvas内的x坐标
  let mx = e.clientX - rect.left;
  // 玩家根据鼠标位置移动，但不超出canvas边界，玩家中心对准鼠标
  player.x = Math.min(canvas.width - player.size, Math.max(0, mx - player.size / 2));
});

// 监听开始按钮的点击事件
startBtn?.addEventListener('click', () => {
  // 如果游戏已在运行或canvas不存在，则不执行任何操作
  if (isRunning || !canvas) return;
  isRunning = true; // 设置游戏状态为运行中
  // 隐藏开始按钮
  if(startBtn) startBtn.style.display = 'none';

  // 初始化或重置玩家位置
  if (!player) {
      player = { x: canvas.width / 2 - 20, y: canvas.height - 60, size: 40, speed: 6 };
  } else {
      player.x = canvas.width/2-20;
      player.y = canvas.height-60;
  }

  // 重置分数和生命值
  score = 0;
  lives = 3;

  // 生成第一个问题和对应的气球
  currentQuestion = generateQuestion();
  balloons = spawnBalloons(currentQuestion, balloons);
  // 更新界面信息
  updateInfo();

  // 清除可能存在的旧的游戏循环定时器，并启动新的游戏循环
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(update, 20) as unknown as number; // 每20毫秒更新一次游戏状态

  // 清除可能存在的旧的气球生成定时器，并启动新的气球生成循环
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    // 如果屏幕上没有气球了，则生成新的一批气球 (通常在成功清除所有气球后)
    if (balloons.length === 0) balloons = spawnBalloons(currentQuestion, balloons);
  }, 3500) as unknown as number; // 每3.5秒检查并可能生成新气球

  // 尝试恢复音频上下文并开始播放背景音乐
  audioCtx?.resume().then(() => startBackgroundMusic(isRunning));
});

// 监听重新开始按钮的点击事件
restartBtn?.addEventListener('click', () => {
  // 如果canvas不存在，则不执行任何操作
  if (!canvas) return;
  // 隐藏游戏结束的遮罩层
  if (overlay) overlay.style.visibility = 'hidden';
  // 重置分数和生命值
  score = 0;
  lives = 3;

  // 重置玩家位置
  if (player) {
    player.x = canvas.width / 2 - 20;
    player.y = canvas.height - 60;
  } else {
     player = { x: canvas.width / 2 - 20, y: canvas.height - 60, size: 40, speed: 6 };
  }

  // 生成新的问题和气球
  currentQuestion = generateQuestion();
  balloons = spawnBalloons(currentQuestion, balloons);
  // 更新界面信息
  updateInfo();

  // 设置游戏状态为运行中
  isRunning = true;
  // 清除并重启游戏主循环
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(update, 20) as unknown as number;

  // 清除并重启气球生成循环
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (balloons.length === 0) balloons = spawnBalloons(currentQuestion, balloons);
  }, 3500) as unknown as number;

  // 尝试恢复音频上下文并开始播放背景音乐
  audioCtx?.resume().then(() => startBackgroundMusic(isRunning));
});

console.log("Game controller logic loaded. Ensure assets are in the correct path (e.g., ./assets/images/...) relative to index.html");
