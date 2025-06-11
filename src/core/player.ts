import { canvas, ctx } from '../utils/domElements.js';
import { ASSETS_CONFIG, COLORS } from './gameConfig.js';
import { GameErrorHandler } from '../utils/errorHandler.js';

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
playerImage.src = ASSETS_CONFIG.IMAGES.PLAYER; // 使用配置中的路径

// 添加图片加载错误处理
playerImage.onerror = () => {
  GameErrorHandler.handleResourceLoadError('player image', ASSETS_CONFIG.IMAGES.PLAYER);
};

// 绘制玩家函数
export function drawPlayer(player: Player | null): void {
  GameErrorHandler.safeExecute(() => {
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
      drawFallbackPlayer(ctx, player);
    }
  }, 'drawing player');
}

/**
 * 绘制备用玩家形状（五角星）
 * @param context Canvas 2D 上下文
 * @param player 玩家对象
 */
function drawFallbackPlayer(context: CanvasRenderingContext2D, player: Player): void {
  const x: number = player.x + player.size / 2;
  const y: number = player.y + player.size / 2;

  // 保存当前canvas状态
  context.save();
  // 将canvas原点移动到玩家中心
  context.translate(x, y);
  // 设置备用填充颜色
  context.fillStyle = COLORS.PLAYER_FALLBACK; // 使用配置中的备用颜色
  // 开始绘制路径
  context.beginPath();
  // 绘制五角星形状
  for (let i = 0; i < 5; i++) {
    context.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * player.size / 2, -Math.sin((18 + i * 72) / 180 * Math.PI) * player.size / 2);
    context.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * player.size / 4, -Math.sin((54 + i * 72) / 180 * Math.PI) * player.size / 4);
  }
  // 关闭路径
  context.closePath();
  // 填充形状
  context.fill();
  // 恢复canvas状态
  context.restore();
}
