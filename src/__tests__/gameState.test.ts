import { GameState } from '../core/gameState';
import { Player } from '../core/player';
import { Balloon } from '../components/balloon';
import { Question } from '../core/questions';

describe('GameState', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  describe('初始状态', () => {
    it('应该有正确的初始值', () => {
      expect(gameState.player).toBeNull();
      expect(gameState.balloons).toEqual([]);
      expect(gameState.currentQuestion).toBeNull();
      expect(gameState.score).toBe(0);
      expect(gameState.lives).toBe(3);
      expect(gameState.isRunning).toBe(false);
      expect(gameState.gameInterval).toBeNull();
      expect(gameState.spawnInterval).toBeNull();
    });
  });

  describe('initializePlayer', () => {
    it('应该正确初始化玩家', () => {
      const canvasWidth = 480;
      const canvasHeight = 640;

      gameState.initializePlayer(canvasWidth, canvasHeight);

      expect(gameState.player).not.toBeNull();
      expect(gameState.player?.x).toBe(canvasWidth / 2 - 20);
      expect(gameState.player?.y).toBe(canvasHeight - 60);
      expect(gameState.player?.size).toBe(40);
      expect(gameState.player?.speed).toBe(6);
    });
  });

  describe('reset', () => {
    it('应该重置所有状态到初始值', () => {
      // 设置一些非初始值
      gameState.player = { x: 100, y: 100, size: 40, speed: 6 };
      gameState.balloons = [
        { x: 0, y: 0, val: 5, image: {} as HTMLImageElement, speed: 1, floatOffset: 0 },
      ];
      gameState.currentQuestion = { text: '2+2=?', answer: 4 };
      gameState.addScore(50);
      gameState.start();

      // 重置
      gameState.reset();

      // 验证重置后的状态
      expect(gameState.score).toBe(0);
      expect(gameState.lives).toBe(3);
      expect(gameState.balloons).toEqual([]);
      expect(gameState.currentQuestion).toBeNull();
      expect(gameState.isRunning).toBe(false);
    });
  });

  describe('start 和 stop', () => {
    it('start 应该设置 isRunning 为 true', () => {
      gameState.start();
      expect(gameState.isRunning).toBe(true);
    });

    it('stop 应该设置 isRunning 为 false', () => {
      gameState.start();
      gameState.stop();
      expect(gameState.isRunning).toBe(false);
    });
  });

  describe('addScore', () => {
    it('应该正确增加分数', () => {
      gameState.addScore(10);
      expect(gameState.score).toBe(10);

      gameState.addScore(5);
      expect(gameState.score).toBe(15);
    });
  });

  describe('loseLife', () => {
    it('应该减少生命值', () => {
      const gameOver = gameState.loseLife();
      expect(gameState.lives).toBe(2);
      expect(gameOver).toBe(false);
    });

    it('当生命值为0时应该返回游戏结束', () => {
      // 失去所有生命
      gameState.loseLife(); // 3 -> 2
      gameState.loseLife(); // 2 -> 1
      const gameOver = gameState.loseLife(); // 1 -> 0

      expect(gameState.lives).toBe(0);
      expect(gameOver).toBe(true);
    });
  });

  describe('removeBalloon', () => {
    it('应该移除指定的气球', () => {
      const balloon1: Balloon = {
        x: 0,
        y: 0,
        val: 5,
        image: {} as HTMLImageElement,
        speed: 1,
        floatOffset: 0,
      };
      const balloon2: Balloon = {
        x: 100,
        y: 0,
        val: 3,
        image: {} as HTMLImageElement,
        speed: 1,
        floatOffset: 0,
      };

      gameState.balloons = [balloon1, balloon2];

      const allRemoved = gameState.removeBalloon(balloon1);

      expect(gameState.balloons).toEqual([balloon2]);
      expect(allRemoved).toBe(false);
    });

    it('当移除最后一个气球时应该返回 true', () => {
      const balloon: Balloon = {
        x: 0,
        y: 0,
        val: 5,
        image: {} as HTMLImageElement,
        speed: 1,
        floatOffset: 0,
      };

      gameState.balloons = [balloon];

      const allRemoved = gameState.removeBalloon(balloon);

      expect(gameState.balloons).toEqual([]);
      expect(allRemoved).toBe(true);
    });
  });

  describe('setters', () => {
    it('应该正确设置玩家', () => {
      const player: Player = { x: 100, y: 200, size: 40, speed: 6 };
      gameState.player = player;
      expect(gameState.player).toBe(player);
    });

    it('应该正确设置气球数组', () => {
      const balloons: Balloon[] = [
        { x: 0, y: 0, val: 5, image: {} as HTMLImageElement, speed: 1, floatOffset: 0 },
      ];
      gameState.balloons = balloons;
      expect(gameState.balloons).toBe(balloons);
    });

    it('应该正确设置当前问题', () => {
      const question: Question = { text: '3+4=?', answer: 7 };
      gameState.currentQuestion = question;
      expect(gameState.currentQuestion).toBe(question);
    });

    it('应该正确设置游戏间隔', () => {
      const interval = 123;
      gameState.gameInterval = interval;
      expect(gameState.gameInterval).toBe(interval);
    });

    it('应该正确设置生成间隔', () => {
      const interval = 456;
      gameState.spawnInterval = interval;
      expect(gameState.spawnInterval).toBe(interval);
    });
  });
});
