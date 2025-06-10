import { canvas, ctx } from '../utils/domElements.js';
import { shuffleArray } from '../utils/helpers.js';

// Type definitions
export interface Question { // Define it locally or import from a shared types file if created
  text: string;
  answer: number;
}

export interface Balloon {
  x: number;
  y: number;
  val: number;
  image: HTMLImageElement;
  speed: number;
  floatOffset: number;
  color?: string; // Optional: if fallback drawing is used
}

export const BALLOON_RADIUS: number = 28;

// Preload balloon images
const balloonImagePaths: string[] = [
  'assets/images/balloon_rainbow.svg',
  'assets/images/balloon_star.svg',
  'assets/images/balloon_happy_face.svg'
];
export const balloonImages: HTMLImageElement[] = [];
balloonImagePaths.forEach(path => {
  const img = new Image();
  img.src = path;
  balloonImages.push(img);
});

export function spawnBalloons(currentQuestion: Question | null, existingBalloons: Balloon[]): Balloon[] {
  if (!currentQuestion || !canvas) return existingBalloons;
  const canvasWidth = canvas.width; // Use this variable after null check
  const correctAns: number = currentQuestion.answer;
  let choices: number[] = [correctAns];
  while (choices.length < 4) {
    let fake: number = correctAns + (Math.floor(Math.random() * 9) - 4);
    if (fake !== correctAns && fake >= 0 && !choices.includes(fake)) choices.push(fake);
  }
  shuffleArray(choices);
  return choices.map((val, idx): Balloon => {
    const xPos: number = idx * (canvasWidth / 4) + (canvasWidth / 8) - BALLOON_RADIUS; // Use canvasWidth
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

export function drawBalloons(balloons: Balloon[]): void {
  if (!ctx) return;
  const context = ctx; // Use this variable after null check
  context.font = 'bold 18px Arial';
  balloons.forEach(balloon => {
    const sway: number = Math.sin((Date.now() / 500) + balloon.floatOffset) * 8;
    const bx: number = balloon.x + sway;
    const by: number = balloon.y;

    context.beginPath();
    context.arc(bx + BALLOON_RADIUS + 3, by + BALLOON_RADIUS + 3, BALLOON_RADIUS, 0, Math.PI * 2);
    context.fillStyle = 'rgba(0,0,0,0.1)';
    context.fill();

    if (balloon.image && balloon.image.complete && balloon.image.naturalHeight !== 0) {
      context.drawImage(balloon.image, bx, by, BALLOON_RADIUS * 2, BALLOON_RADIUS * 2);
    } else {
      context.beginPath();
      context.arc(bx + BALLOON_RADIUS, by + BALLOON_RADIUS, BALLOON_RADIUS, 0, Math.PI * 2);
      context.fillStyle = balloon.color || 'gray';
      context.fill();
      context.beginPath();
      context.arc(bx + BALLOON_RADIUS - 8, by + BALLOON_RADIUS - 12, BALLOON_RADIUS / 4, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255,255,255,0.7)';
      context.fill();
    }

    context.strokeStyle = '#888';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(bx + BALLOON_RADIUS, by + BALLOON_RADIUS * 2);
    context.lineTo(bx + BALLOON_RADIUS, by + BALLOON_RADIUS * 2 + 20);
    context.stroke();

    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.fillText(balloon.val.toString(), bx + BALLOON_RADIUS, by + BALLOON_RADIUS + 6);
  });
}
