import { Player } from './player.js';
import { Balloon } from '../components/balloon.js';
import { Question } from './questions.js';
import { GAME_CONFIG } from './gameConfig.js';

/**
 * 游戏状态管理类
 * 统一管理所有游戏相关的状态和配置
 */
export class GameState {
  // 游戏状态
  private _player: Player | null = null;
  private _balloons: Balloon[] = [];
  private _currentQuestion: Question | null = null;
  private _score: number = 0;
  private _lives: number = GAME_CONFIG.INITIAL_LIVES;
  private _isRunning: boolean = false;

  // 游戏循环相关
  private _gameInterval: number | null = null;
  private _spawnInterval: number | null = null;

  // Getters
  get player(): Player | null {
    return this._player;
  }
  get balloons(): Balloon[] {
    return this._balloons;
  }
  get currentQuestion(): Question | null {
    return this._currentQuestion;
  }
  get score(): number {
    return this._score;
  }
  get lives(): number {
    return this._lives;
  }
  get isRunning(): boolean {
    return this._isRunning;
  }
  get gameInterval(): number | null {
    return this._gameInterval;
  }
  get spawnInterval(): number | null {
    return this._spawnInterval;
  }

  // Setters
  set player(value: Player | null) {
    this._player = value;
  }
  set balloons(value: Balloon[]) {
    this._balloons = value;
  }
  set currentQuestion(value: Question | null) {
    this._currentQuestion = value;
  }
  set gameInterval(value: number | null) {
    this._gameInterval = value;
  }
  set spawnInterval(value: number | null) {
    this._spawnInterval = value;
  }

  /**
   * 初始化玩家
   * @param canvasWidth 画布宽度
   * @param canvasHeight 画布高度
   */
  initializePlayer(canvasWidth: number, canvasHeight: number): void {
    this._player = {
      x: canvasWidth / 2 - GAME_CONFIG.PLAYER_OFFSET_X,
      y: canvasHeight - GAME_CONFIG.PLAYER_OFFSET_Y,
      size: GAME_CONFIG.PLAYER_SIZE,
      speed: GAME_CONFIG.PLAYER_SPEED,
    };
  }

  /**
   * 重置游戏状态
   */
  reset(): void {
    this._score = 0;
    this._lives = GAME_CONFIG.INITIAL_LIVES;
    this._balloons = [];
    this._currentQuestion = null;
    this._isRunning = false;
    this.clearIntervals();
  }

  /**
   * 开始游戏
   */
  start(): void {
    this._isRunning = true;
  }

  /**
   * 停止游戏
   */
  stop(): void {
    this._isRunning = false;
    this.clearIntervals();
  }

  /**
   * 增加分数
   * @param points 要增加的分数
   */
  addScore(points: number): void {
    this._score += points;
  }

  /**
   * 失去生命
   * @returns 是否游戏结束
   */
  loseLife(): boolean {
    this._lives -= 1;
    return this._lives <= 0;
  }

  /**
   * 移除指定气球
   * @param balloonToRemove 要移除的气球
   * @returns 是否所有气球都被移除
   */
  removeBalloon(balloonToRemove: Balloon): boolean {
    this._balloons = this._balloons.filter(balloon => balloon !== balloonToRemove);
    return this._balloons.length === 0;
  }

  /**
   * 清除所有定时器
   */
  private clearIntervals(): void {
    if (this._gameInterval) {
      clearInterval(this._gameInterval);
      this._gameInterval = null;
    }
    if (this._spawnInterval) {
      clearInterval(this._spawnInterval);
      this._spawnInterval = null;
    }
  }
}

// 导出单例实例
export const gameState = new GameState();
