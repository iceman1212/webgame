import { canvas, ctx, scoreEl, livesEl, startBtn, overlay, messageTitle, messageContent, restartBtn } from './utils/domElements';
import { Player, drawPlayer } from './core/player';
import { Balloon, BALLOON_RADIUS, spawnBalloons, drawBalloons } from './components/balloon';
import { Question, generateQuestion } from './core/questions';
import { audioCtx, startBackgroundMusic, playPopSound, playFailSound } from './core/audio';

// Game State Variables
let player: Player | null = null;
if (canvas) {
    player = { x: canvas.width / 2 - 20, y: canvas.height - 60, size: 40, speed: 6 };
}

let balloons: Balloon[] = [];
let currentQuestion: Question | null = null;
let score: number = 0;
let lives: number = 3;
let gameInterval: number | null = null; // Store interval ID for clearInterval
let spawnInterval: number | null = null; // Store interval ID
let isRunning: boolean = false;

function update(): void {
  if (!ctx || !canvas || !player) return;
  const context = ctx;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBalloons(balloons);
  drawPlayer(player);

  balloons.forEach(balloon => {
    balloon.y += balloon.speed;
    if (balloon.y > canvasHeight) { // Use canvasHeight
      if (currentQuestion && balloon.val === currentQuestion.answer) loseLife();
      removeBalloon(balloon);
    }
  });

  balloons.forEach(balloon => {
    const sway: number = Math.sin((Date.now() / 500) + balloon.floatOffset) * 8;
    const bx: number = balloon.x + sway;
    const by: number = balloon.y;
    if (player && currentQuestion &&
        player.x < bx + BALLOON_RADIUS * 2 &&
        player.x + player.size > bx &&
        player.y < by + BALLOON_RADIUS * 2 &&
        player.y + player.size > by) {
      if (balloon.val === currentQuestion.answer) {
        score += 10;
        playPopSound();
      } else {
        loseLife();
        playFailSound();
      }
      updateInfo();
      removeBalloon(balloon);
    }
  });
}

function removeBalloon(balloonToRemove: Balloon): void {
  balloons = balloons.filter(balloon => balloon !== balloonToRemove);
  if (balloons.length === 0) prepareNextRound();
}

function prepareNextRound(): void {
  currentQuestion = generateQuestion();
  balloons = spawnBalloons(currentQuestion, balloons);
  updateInfo();
}

function loseLife(): void {
  lives -= 1;
  updateInfo();
  if (lives <= 0) endGame();
}

function updateInfo(): void {
  if (scoreEl) scoreEl.textContent = score.toString();
  if (livesEl) livesEl.textContent = lives.toString();
}

function endGame(): void {
  if (gameInterval) clearInterval(gameInterval);
  if (spawnInterval) clearInterval(spawnInterval);
  isRunning = false;
  if (messageTitle) messageTitle.textContent = '游戏结束';
  if (messageContent) messageContent.textContent = `得分:${score}`;
  if (overlay) overlay.style.visibility = 'visible';
}

// Event Listeners
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (!isRunning || !player) return;
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.x = Math.max(0, player.x - player.speed);
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    if(canvas) player.x = Math.min(canvas.width - player.size, player.x + player.speed);
  }
});

canvas?.addEventListener('mousemove', (e: MouseEvent) => {
  if (!isRunning || !player || !canvas) return;
  const rect = canvas.getBoundingClientRect();
  let mx = e.clientX - rect.left;
  player.x = Math.min(canvas.width - player.size, Math.max(0, mx - player.size / 2));
});

startBtn?.addEventListener('click', () => {
  if (isRunning || !canvas) return;
  isRunning = true;
  if(startBtn) startBtn.style.display = 'none';

  if (!player) {
      player = { x: canvas.width / 2 - 20, y: canvas.height - 60, size: 40, speed: 6 };
  } else {
      player.x = canvas.width/2-20;
      player.y = canvas.height-60;
  }

  score = 0;
  lives = 3;

  currentQuestion = generateQuestion();
  balloons = spawnBalloons(currentQuestion, balloons);
  updateInfo();

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(update, 20) as unknown as number;

  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (balloons.length === 0) balloons = spawnBalloons(currentQuestion, balloons);
  }, 3500) as unknown as number;

  audioCtx?.resume().then(() => startBackgroundMusic(isRunning));
});

restartBtn?.addEventListener('click', () => {
  if (!canvas) return;
  if (overlay) overlay.style.visibility = 'hidden';
  score = 0;
  lives = 3;

  if (player) {
    player.x = canvas.width / 2 - 20;
    player.y = canvas.height - 60;
  } else {
     player = { x: canvas.width / 2 - 20, y: canvas.height - 60, size: 40, speed: 6 };
  }

  currentQuestion = generateQuestion();
  balloons = spawnBalloons(currentQuestion, balloons);
  updateInfo();

  isRunning = true;
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(update, 20) as unknown as number;

  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (balloons.length === 0) balloons = spawnBalloons(currentQuestion, balloons);
  }, 3500) as unknown as number;

  audioCtx?.resume().then(() => startBackgroundMusic(isRunning));
});

console.log("Game controller logic loaded. Ensure assets are in the correct path (e.g., ./assets/images/...) relative to index.html");
