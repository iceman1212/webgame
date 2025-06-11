import { GameErrorHandler } from '../utils/errorHandler';

describe('GameErrorHandler', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
  });

  describe('handleResourceLoadError', () => {
    it('应该记录资源加载错误', () => {
      const error = new Error('Load failed');
      GameErrorHandler.handleResourceLoadError('image', '/path/to/image.png', error);
      
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to load image: /path/to/image.png',
        error
      );
    });

    it('应该处理没有错误对象的情况', () => {
      GameErrorHandler.handleResourceLoadError('audio', '/path/to/audio.mp3');
      
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to load audio: /path/to/audio.mp3',
        undefined
      );
    });
  });

  describe('handleAudioError', () => {
    it('应该记录音频错误', () => {
      const error = new Error('Audio context failed');
      GameErrorHandler.handleAudioError('initialization', error);
      
      expect(console.warn).toHaveBeenCalledWith(
        'Audio initialization failed:',
        'Audio context failed'
      );
    });
  });

  describe('handleGameStateError', () => {
    it('应该记录游戏状态错误', () => {
      const error = new Error('State corruption');
      GameErrorHandler.handleGameStateError('update', error);
      
      expect(console.error).toHaveBeenCalledWith(
        'Game state error during update:',
        error
      );
    });
  });

  describe('handleCanvasError', () => {
    it('应该记录Canvas错误', () => {
      const error = new Error('Canvas not found');
      GameErrorHandler.handleCanvasError('rendering', error);
      
      expect(console.error).toHaveBeenCalledWith(
        'Canvas error during rendering:',
        error
      );
    });
  });

  describe('safeExecute', () => {
    it('应该成功执行函数并返回结果', () => {
      const testFn = jest.fn().mockReturnValue('success');
      const result = GameErrorHandler.safeExecute(testFn, 'test operation');
      
      expect(testFn).toHaveBeenCalled();
      expect(result).toBe('success');
    });

    it('应该捕获错误并返回回退值', () => {
      const testFn = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      const result = GameErrorHandler.safeExecute(testFn, 'test operation', 'fallback');
      
      expect(console.error).toHaveBeenCalledWith(
        'Error in test operation:',
        expect.any(Error)
      );
      expect(result).toBe('fallback');
    });

    it('应该在没有回退值时返回undefined', () => {
      const testFn = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      const result = GameErrorHandler.safeExecute(testFn, 'test operation');
      
      expect(result).toBeUndefined();
    });
  });

  describe('safeExecuteAsync', () => {
    it('应该成功执行异步函数并返回结果', async () => {
      const testFn = jest.fn().mockResolvedValue('async success');
      const result = await GameErrorHandler.safeExecuteAsync(testFn, 'async test');
      
      expect(testFn).toHaveBeenCalled();
      expect(result).toBe('async success');
    });

    it('应该捕获异步错误并返回回退值', async () => {
      const testFn = jest.fn().mockRejectedValue(new Error('Async error'));
      const result = await GameErrorHandler.safeExecuteAsync(testFn, 'async test', 'async fallback');
      
      expect(console.error).toHaveBeenCalledWith(
        'Async error in async test:',
        expect.any(Error)
      );
      expect(result).toBe('async fallback');
    });
  });

  describe('validateRequiredElements', () => {
    it('应该在所有元素存在时返回true', () => {
      const elements = {
        canvas: document.createElement('canvas'),
        button: document.createElement('button')
      };
      
      const result = GameErrorHandler.validateRequiredElements(elements);
      expect(result).toBe(true);
    });

    it('应该在有元素缺失时返回false', () => {
      const elements = {
        canvas: document.createElement('canvas'),
        button: null
      };
      
      const result = GameErrorHandler.validateRequiredElements(elements);
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Missing required DOM elements:',
        ['button']
      );
    });

    it('应该记录所有缺失的元素', () => {
      const elements = {
        canvas: null,
        button: null,
        input: document.createElement('input')
      };
      
      const result = GameErrorHandler.validateRequiredElements(elements);
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Missing required DOM elements:',
        ['canvas', 'button']
      );
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('应该返回正确的用户友好消息', () => {
      const message = GameErrorHandler.getUserFriendlyMessage('CANVAS_NOT_FOUND');
      expect(message).toBe('游戏画布未找到，请刷新页面重试');
    });

    it('应该为所有错误类型返回消息', () => {
      const errorTypes = [
        'CANVAS_NOT_FOUND',
        'AUDIO_INIT_FAILED',
        'RESOURCE_LOAD_FAILED',
        'GAME_STATE_ERROR',
        'UNKNOWN_ERROR'
      ] as const;

      errorTypes.forEach(errorType => {
        const message = GameErrorHandler.getUserFriendlyMessage(errorType);
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });
});
