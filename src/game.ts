// Type definitions
interface Player {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Balloon {
  x: number;
  y: number;
  val: number;
  image: HTMLImageElement;
  speed: number;
  floatOffset: number;
  color?: string; // Optional: if fallback drawing is used
}

interface Question {
  text: string;
  answer: number;
}

// DOM Elements - assert types and check for null where necessary
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D | null;

const scoreEl = document.getElementById("score") as HTMLElement | null;
const livesEl = document.getElementById("lives") as HTMLElement | null;
const questionEl = document.getElementById("questionText") as HTMLElement | null;

const startBtn = document.getElementById("startBtn") as HTMLButtonElement | null;
const overlay = document.getElementById("overlay") as HTMLElement | null;
const messageTitle = document.getElementById("messageTitle") as HTMLElement | null;
const messageContent = document.getElementById("messageContent") as HTMLElement | null;
const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement | null;

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

const BALLOON_RADIUS: number = 28;

// Preload player image
const playerImage = new Image();
playerImage.src = 'assets/images/player_character.png'; // Ensure these assets are available

// Preload balloon images
const balloonImagePaths: string[] = [
  'assets/images/balloon_rainbow.svg',
  'assets/images/balloon_star.svg',
  'assets/images/balloon_happy_face.svg'
];
const balloonImages: HTMLImageElement[] = [];
balloonImagePaths.forEach(path => {
  const img = new Image();
  img.src = path;
  balloonImages.push(img);
});

// Audio Context
const AudioContextGlobal: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
const audioCtx: AudioContext | null = AudioContextGlobal ? new AudioContextGlobal() : null;

function startBackgroundMusic(): void {
  if (!isRunning || !audioCtx) return;
  const notes: number[] = [261.63, 293.66, 329.63, 349.23];
  let index: number = 0;
  function playNext(): void {
    if (!isRunning || !audioCtx) return;
    const now: number = audioCtx.currentTime;
    const osc: OscillatorNode = audioCtx.createOscillator();
    const gain: GainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[index], now);
    gain.gain.setValueAtTime(0.05, now);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
    index = (index + 1) % notes.length;
    setTimeout(playNext, 400);
  }
  playNext();
}

function playPopSound(): void {
  if (!audioCtx) return;
  const now: number = audioCtx.currentTime;
  const osc1: OscillatorNode = audioCtx.createOscillator();
  const osc2: OscillatorNode = audioCtx.createOscillator();
  const gain: GainNode = audioCtx.createGain();
  osc1.type = 'triangle';
  osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(880, now);
  osc2.frequency.setValueAtTime(660, now);
  gain.gain.setValueAtTime(0.12, now);
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  osc1.start(now);
  osc2.start(now);
  osc1.frequency.linearRampToValueAtTime(440, now + 0.15);
  osc2.frequency.linearRampToValueAtTime(330, now + 0.15);
  osc1.stop(now + 0.15);
  osc2.stop(now + 0.15);
}

function playFailSound(): void {
  if (!audioCtx) return;
  const now: number = audioCtx.currentTime;
  const osc: OscillatorNode = audioCtx.createOscillator();
  const gain: GainNode = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, now);
  gain.gain.setValueAtTime(0.15, now);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
  gain.gain.linearRampToValueAtTime(0, now + 0.4);
  osc.stop(now + 0.4);
}

function generateQuestion(): void {
  const a: number = Math.floor(Math.random() * 9) + 1;
  const b: number = Math.floor(Math.random() * 9) + 1;
  const ops: string[] = ['+', '-', '*'];
  const op: string = ops[Math.floor(Math.random() * ops.length)];
  let ans: number = 0;
  if (op === '+') ans = a + b;
  if (op === '-') ans = a - b;
  if (op === '*') ans = a * b;
  currentQuestion = { text: `${a} ${op} ${b} = ?`, answer: ans };
  if (questionEl) questionEl.textContent = currentQuestion.text;
}

function spawnBalloons(): void {
  if (!currentQuestion || !canvas) return;
  const correctAns: number = currentQuestion.answer;
  let choices: number[] = [correctAns];
  while (choices.length < 4) {
    let fake: number = correctAns + (Math.floor(Math.random() * 9) - 4);
    if (fake !== correctAns && fake >= 0 && !choices.includes(fake)) choices.push(fake);
  }
  shuffleArray(choices);
  balloons = choices.map((val, idx): Balloon => {
    const xPos: number = idx * (canvas.width / 4) + (canvas.width / 8) - BALLOON_RADIUS;
    const randomImage: HTMLImageElement = balloonImages[Math.floor(Math.random() * balloonImages.length)];
    return {
      x: xPos,
      y: -(BALLOON_RADIUS * 2 + Math.random() * 80),
      val: val,
      image: randomImage,
      speed: 1 + Math.random() * 1.5,
      floatOffset: Math.random() * Math.PI * 2
    };
  });
}

function shuffleArray<T>(arr: T[]): void {
  for (let i: number = arr.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function drawPlayer(): void {
  if (!ctx || !player) return;
  if (playerImage.complete && playerImage.naturalHeight !== 0) {
    ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
  } else {
    const x: number = player.x + player.size / 2;
    const y: number = player.y + player.size / 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#ff69b4'; // Fallback color
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * player.size / 2, -Math.sin((18 + i * 72) / 180 * Math.PI) * player.size / 2);
      ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * player.size / 4, -Math.sin((54 + i * 72) / 180 * Math.PI) * player.size / 4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawBalloons(): void {
  if (!ctx) return;
  ctx.font = 'bold 18px Arial';
  balloons.forEach(balloon => {
    const sway: number = Math.sin((Date.now() / 500) + balloon.floatOffset) * 8;
    const bx: number = balloon.x + sway;
    const by: number = balloon.y;

    ctx.beginPath();
    ctx.arc(bx + BALLOON_RADIUS + 3, by + BALLOON_RADIUS + 3, BALLOON_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fill();

    if (balloon.image && balloon.image.complete && balloon.image.naturalHeight !== 0) {
      ctx.drawImage(balloon.image, bx, by, BALLOON_RADIUS * 2, BALLOON_RADIUS * 2);
    } else {
      ctx.beginPath();
      ctx.arc(bx + BALLOON_RADIUS, by + BALLOON_RADIUS, BALLOON_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = balloon.color || 'gray';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx + BALLOON_RADIUS - 8, by + BALLOON_RADIUS - 12, BALLOON_RADIUS / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fill();
    }

    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + BALLOON_RADIUS, by + BALLOON_RADIUS * 2);
    ctx.lineTo(bx + BALLOON_RADIUS, by + BALLOON_RADIUS * 2 + 20);
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(balloon.val.toString(), bx + BALLOON_RADIUS, by + BALLOON_RADIUS + 6);
  });
}

function update(): void {
  if (!ctx || !canvas || !player) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBalloons();
  drawPlayer();

  balloons.forEach(balloon => {
    balloon.y += balloon.speed;
    if (balloon.y > canvas.height) {
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
  generateQuestion();
  spawnBalloons();
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

  // Initialize player state here if it couldn't be done before due to canvas being null
  if (!player) {
      player = { x: canvas.width / 2 - 20, y: canvas.height - 60, size: 40, speed: 6 };
  } else { // Reset player position
      player.x = canvas.width/2-20;
      player.y = canvas.height-60;
  }

  score = 0; // Reset score
  lives = 3; // Reset lives

  generateQuestion();
  spawnBalloons();
  updateInfo();

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(update, 20) as unknown as number; // Cast to number for Node.js typing if necessary

  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (balloons.length === 0) spawnBalloons();
  }, 3500) as unknown as number;

  audioCtx?.resume().then(() => startBackgroundMusic());
});

restartBtn?.addEventListener('click', () => {
  if (!canvas) return;
  if (overlay) overlay.style.visibility = 'hidden';
  score = 0;
  lives = 3;

  if (player) { // Reset player position
    player.x = canvas.width / 2 - 20;
    player.y = canvas.height - 60;
  } else { // Initialize if null (should not happen if startBtn was clicked)
     player = { x: canvas.width / 2 - 20, y: canvas.height - 60, size: 40, speed: 6 };
  }

  generateQuestion();
  spawnBalloons();
  updateInfo();

  isRunning = true;
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(update, 20) as unknown as number;

  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (balloons.length === 0) spawnBalloons();
  }, 3500) as unknown as number;

  audioCtx?.resume().then(() => startBackgroundMusic());
});

// Ensure assets path is correct if you plan to serve/bundle them
// For example, if assets are in 'dist/assets', paths might need adjustment
// depending on the final file structure and how it's served.
console.log("Game logic loaded. Ensure assets are in the correct path (e.g., ./assets/images/...) relative to index.html");
