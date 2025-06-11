import { Balloon, BALLOON_RADIUS, drawBalloons, spawnBalloons } from './components/balloon.js';
import { playFailSound, playPopSound } from './core/audio.js';
import { GAME_CONFIG } from './core/gameConfig.js';
import { gameState } from './core/gameState.js';
import { drawPlayer } from './core/player.js';
import { generateQuestion } from './core/questions.js';
import {
  canvas,
  ctx,
  livesEl,
  messageContent,
  messageTitle,
  overlay,
  restartBtn,
  scoreEl,
  startBtn,
} from './utils/domElements.js';
import { GameInitializer } from './utils/gameInitializer.js';

// 游戏主更新函数，作为游戏循环的核心
function update(): void {
  // 确保canvas上下文、canvas元素和玩家对象都存在
  if (!ctx || !canvas || !gameState.player) return;
  const context = ctx; // 使用局部变量以确保在后续操作中ctx不为null
  const canvasWidth = canvas.width; // canvas宽度
  const canvasHeight = canvas.height; // canvas高度

  // 清除整个canvas，为新一帧的绘制做准备
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  // 绘制所有气球
  drawBalloons(gameState.balloons);
  // 绘制玩家
  drawPlayer(gameState.player);

  // 遍历所有气球，更新它们的状态
  gameState.balloons.forEach(balloon => {
    // 气球向下移动
    balloon.y += balloon.speed;
    // 如果气球移出屏幕底部
    if (balloon.y > canvasHeight) {
      // 如果该气球是正确答案的气球，则玩家失去一次生命
      if (gameState.currentQuestion && balloon.val === gameState.currentQuestion.answer) {
        handleLifeLoss();
      }
      // 移除该气球
      handleBalloonRemoval(balloon);
    }
  });

  // 再次遍历所有气球，检测与玩家的碰撞
  gameState.balloons.forEach(balloon => {
    // 计算气球的摇摆效果，使运动更自然
    const sway: number =
      Math.sin(Date.now() / GAME_CONFIG.BALLOON_SWAY_SPEED + balloon.floatOffset) *
      GAME_CONFIG.BALLOON_SWAY_AMPLITUDE;
    const bx: number = balloon.x + sway; // 气球的实际x坐标 (包含摇摆)
    const by: number = balloon.y; // 气球的实际y坐标
    // 碰撞检测逻辑：检查玩家的边界框是否与气球的边界框重叠
    if (
      gameState.player &&
      gameState.currentQuestion &&
      gameState.player.x < bx + BALLOON_RADIUS * 2 && // 玩家左边界 < 气球右边界
      gameState.player.x + gameState.player.size > bx && // 玩家右边界 > 气球左边界
      gameState.player.y < by + BALLOON_RADIUS * 2 && // 玩家上边界 < 气球下边界
      gameState.player.y + gameState.player.size > by
    ) {
      // 玩家下边界 > 气球上边界
      // 如果发生碰撞
      handleBalloonCollision(balloon);
    }
  });
}

// 处理气球碰撞
function handleBalloonCollision(balloon: Balloon): void {
  if (!gameState.currentQuestion) return;

  if (balloon.val === gameState.currentQuestion.answer) {
    // 如果碰到的是正确答案的气球
    gameState.addScore(GAME_CONFIG.POINTS_PER_CORRECT); // 增加分数
    playPopSound(); // 播放成功音效
  } else {
    // 如果碰到的是错误答案的气球
    handleLifeLoss(); // 失去生命
    playFailSound(); // 播放失败音效
  }
  // 更新界面上的分数和生命值显示
  updateInfo();
  // 移除被碰撞的气球
  handleBalloonRemoval(balloon);
}

// 处理气球移除
function handleBalloonRemoval(balloonToRemove: Balloon): void {
  const allBalloonsRemoved = gameState.removeBalloon(balloonToRemove);
  // 如果移除后屏幕上没有气球了，则准备下一轮
  if (allBalloonsRemoved) {
    prepareNextRound();
  }
}

// 准备下一轮游戏的函数
function prepareNextRound(): void {
  // 生成一个新的问题
  const question = generateQuestion();
  gameState.currentQuestion = question;
  // 根据新问题生成新的气球
  gameState.balloons = spawnBalloons(question, []);
  // 更新界面信息
  updateInfo();
}

// 处理生命损失
function handleLifeLoss(): void {
  const gameOver = gameState.loseLife();
  updateInfo(); // 更新界面信息
  // 如果生命值小于等于0，则结束游戏
  if (gameOver) {
    endGame();
  }
}

// 更新分数和生命值显示的函数
function updateInfo(): void {
  if (scoreEl) scoreEl.textContent = gameState.score.toString(); // 更新分数显示
  if (livesEl) livesEl.textContent = gameState.lives.toString(); // 更新生命值显示
}

// 结束游戏的函数
function endGame(): void {
  // 停止游戏状态
  gameState.stop();
  // 显示游戏结束信息
  if (messageTitle) messageTitle.textContent = '游戏结束';
  if (messageContent) messageContent.textContent = `得分:${gameState.score}`;
  // 显示遮罩层和结束信息
  if (overlay) overlay.style.visibility = 'visible';
}

// 事件监听器
// 监听键盘按下事件，用于控制玩家左右移动
document.addEventListener('keydown', (e: KeyboardEvent) => {
  // 如果游戏未运行或玩家对象不存在，则不响应
  if (!gameState.isRunning || !gameState.player) return;
  // 如果按下左箭头键或 'a' 键
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    // 玩家向左移动，但不超出canvas左边界
    gameState.player.x = Math.max(0, gameState.player.x - gameState.player.speed);
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    // 如果按下右箭头键或 'd' 键
    // 玩家向右移动，但不超出canvas右边界
    if (canvas)
      gameState.player.x = Math.min(
        canvas.width - gameState.player.size,
        gameState.player.x + gameState.player.speed
      );
  }
});

// 监听canvas上的鼠标移动事件，用于控制玩家左右移动
canvas?.addEventListener('mousemove', (e: MouseEvent) => {
  // 如果游戏未运行、玩家对象或canvas不存在，则不响应
  if (!gameState.isRunning || !gameState.player || !canvas) return;
  // 获取canvas在页面中的位置和大小
  const rect = canvas.getBoundingClientRect();
  // 计算鼠标在canvas内的x坐标
  const mx = e.clientX - rect.left;
  // 玩家根据鼠标位置移动，但不超出canvas边界，玩家中心对准鼠标
  gameState.player.x = Math.min(
    canvas.width - gameState.player.size,
    Math.max(0, mx - gameState.player.size / 2)
  );
});

// 监听开始按钮的点击事件
startBtn?.addEventListener('click', () => {
  // 如果游戏已在运行或canvas不存在，则不执行任何操作
  if (gameState.isRunning || !canvas) return;

  // 隐藏开始按钮
  if (startBtn) startBtn.style.display = 'none';

  // 使用游戏初始化器启动游戏
  if (GameInitializer.startGame(update)) {
    // 更新界面信息
    updateInfo();
  }
});

// 监听重新开始按钮的点击事件
restartBtn?.addEventListener('click', () => {
  // 如果canvas不存在，则不执行任何操作
  if (!canvas) return;

  // 隐藏游戏结束的遮罩层
  if (overlay) overlay.style.visibility = 'hidden';

  // 使用游戏初始化器重新启动游戏
  if (GameInitializer.startGame(update)) {
    // 更新界面信息
    updateInfo();
  }
});

// Game controller logic loaded
