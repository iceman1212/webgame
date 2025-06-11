import { canvas, ctx } from '../utils/domElements.js';

// 类型定义
// 定义玩家对象接口
export interface Player {
  x: number; // 玩家x坐标
  y: number; // 玩家y坐标
  size: number; // 玩家大小
  speed: number; // 玩家速度
}

// 预加载玩家图片
export const playerImage = new Image();
playerImage.src = 'assets/images/player_character.svg'; // 确保这些资源可用

// 绘制玩家函数
export function drawPlayer(player: Player | null): void {
  console.log("drawPlayer called with:", player);
  // 如果canvas上下文不存在或者玩家对象不存在，则直接返回
  if (!ctx || !player) return;

  console.log("playerImage state:", playerImage.src, playerImage.complete, playerImage.naturalWidth, playerImage.naturalHeight);
  // 如果玩家图片已加载完成且高度不为0，则绘制玩家图片
  if (playerImage.complete && playerImage.naturalHeight !== 0) {
    console.log("Drawing player image");
    ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
  } else {
    // 否则绘制备用玩家形状
    console.log("Drawing fallback player shape");
    const x: number = player.x + player.size / 2;
    const y: number = player.y + player.size / 2;
    // 保存当前canvas状态
    ctx.save();
    // 将canvas原点移动到玩家中心
    ctx.translate(x, y);
    // 设置备用填充颜色
    ctx.fillStyle = '#ff69b4'; // Fallback color
    // 开始绘制路径
    ctx.beginPath();
    // 绘制五角星形状
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * player.size / 2, -Math.sin((18 + i * 72) / 180 * Math.PI) * player.size / 2);
      ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * player.size / 4, -Math.sin((54 + i * 72) / 180 * Math.PI) * player.size / 4);
    }
    // 关闭路径
    ctx.closePath();
    // 填充形状
    ctx.fill();
    // 恢复canvas状态
    ctx.restore();
  }
}
