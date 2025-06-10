import { canvas, ctx } from '../utils/domElements';

// Type definitions
export interface Player {
  x: number;
  y: number;
  size: number;
  speed: number;
}

// Preload player image
export const playerImage = new Image();
playerImage.src = 'assets/images/player_character.png'; // Ensure these assets are available

export function drawPlayer(player: Player | null): void {
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
