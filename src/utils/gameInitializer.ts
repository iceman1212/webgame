import { canvas } from './domElements.js';
import { gameState } from '../core/gameState.js';
import { generateQuestion } from '../core/questions.js';
import { spawnBalloons } from '../components/balloon.js';
import { audioCtx, startBackgroundMusic } from '../core/audio.js';
import { GAME_CONFIG } from '../core/gameConfig.js';
import { GameErrorHandler } from './errorHandler.js';

/**
 * 游戏初始化工具类
 * 提供游戏初始化和重置的统一方法
 */
export class GameInitializer {
  /**
   * 初始化游戏
   * 用于开始新游戏和重新开始游戏
   */
  static initializeGame(): boolean {
    return (
      GameErrorHandler.safeExecute(
        () => {
          if (!canvas) {
            GameErrorHandler.handleCanvasError('initialization');
            return false;
          }

          // 重置游戏状态
          gameState.reset();

          // 初始化玩家
          gameState.initializePlayer(canvas.width, canvas.height);

          // 生成第一个问题和对应的气球
          const question = generateQuestion();
          gameState.currentQuestion = question;
          gameState.balloons = spawnBalloons(question, []);

          // 开始游戏
          gameState.start();

          return true;
        },
        'game initialization',
        false
      ) || false
    );
  }

  /**
   * 启动游戏循环
   * @param updateFunction 游戏更新函数
   */
  static startGameLoop(updateFunction: () => void): void {
    // 清除可能存在的旧循环
    if (gameState.gameInterval) {
      clearInterval(gameState.gameInterval);
    }

    // 启动主游戏循环
    gameState.gameInterval = setInterval(
      updateFunction,
      GAME_CONFIG.FRAME_RATE
    ) as unknown as number;
  }

  /**
   * 启动气球生成循环
   */
  static startBalloonSpawnLoop(): void {
    // 清除可能存在的旧循环
    if (gameState.spawnInterval) {
      clearInterval(gameState.spawnInterval);
    }

    // 启动气球生成循环
    gameState.spawnInterval = setInterval(() => {
      // 如果屏幕上没有气球了，则生成新的一批气球
      if (gameState.balloons.length === 0 && gameState.currentQuestion) {
        gameState.balloons = spawnBalloons(gameState.currentQuestion, []);
      }
    }, GAME_CONFIG.BALLOON_SPAWN_INTERVAL) as unknown as number;
  }

  /**
   * 启动音频
   */
  static async startAudio(): Promise<void> {
    await GameErrorHandler.safeExecuteAsync(async () => {
      if (!audioCtx) {
        GameErrorHandler.handleAudioError('initialization - AudioContext not available');
        return;
      }

      await audioCtx.resume();
      if (gameState.isRunning) {
        startBackgroundMusic(gameState.isRunning);
      }
    }, 'audio initialization');
  }

  /**
   * 完整的游戏启动流程
   * @param updateFunction 游戏更新函数
   */
  static startGame(updateFunction: () => void): boolean {
    if (!this.initializeGame()) {
      return false;
    }

    this.startGameLoop(updateFunction);
    this.startBalloonSpawnLoop();
    this.startAudio();

    return true;
  }

  /**
   * 停止游戏
   */
  static stopGame(): void {
    gameState.stop();
  }
}
