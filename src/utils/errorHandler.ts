/**
 * 游戏错误处理工具类
 * 提供统一的错误处理和用户友好的错误提示
 */
export class GameErrorHandler {
  private static readonly ERROR_MESSAGES = {
    CANVAS_NOT_FOUND: '游戏画布未找到，请刷新页面重试',
    AUDIO_INIT_FAILED: '音频初始化失败，游戏将在静音模式下运行',
    RESOURCE_LOAD_FAILED: '游戏资源加载失败，部分功能可能受影响',
    GAME_STATE_ERROR: '游戏状态错误，请重新开始游戏',
    UNKNOWN_ERROR: '发生未知错误，请刷新页面重试'
  } as const;

  /**
   * 处理资源加载错误
   * @param resourceType 资源类型
   * @param resourcePath 资源路径
   * @param error 错误对象
   */
  static handleResourceLoadError(resourceType: string, resourcePath: string, error?: Error): void {
    const message = `Failed to load ${resourceType}: ${resourcePath}`;
    console.warn(message, error);
    
    // 在开发环境中显示更详细的错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('Resource load error details:', {
        type: resourceType,
        path: resourcePath,
        error: error?.message,
        stack: error?.stack
      });
    }
  }

  /**
   * 处理音频相关错误
   * @param operation 操作类型
   * @param error 错误对象
   */
  static handleAudioError(operation: string, error?: Error): void {
    console.warn(`Audio ${operation} failed:`, error?.message);
    
    // 可以在这里添加用户通知逻辑
    // 例如显示一个小提示："音频功能暂时不可用"
  }

  /**
   * 处理游戏状态错误
   * @param operation 操作类型
   * @param error 错误对象
   */
  static handleGameStateError(operation: string, error?: Error): void {
    console.error(`Game state error during ${operation}:`, error);
    
    // 在生产环境中，可以发送错误报告到监控服务
    if (process.env.NODE_ENV === 'production') {
      // 这里可以集成错误监控服务，如 Sentry
      // Sentry.captureException(error);
    }
  }

  /**
   * 处理Canvas相关错误
   * @param operation 操作类型
   * @param error 错误对象
   */
  static handleCanvasError(operation: string, error?: Error): void {
    console.error(`Canvas error during ${operation}:`, error);
    
    // 可以尝试重新初始化Canvas或提示用户刷新页面
  }

  /**
   * 安全执行函数，捕获并处理错误
   * @param fn 要执行的函数
   * @param errorContext 错误上下文
   * @param fallbackValue 出错时的回退值
   */
  static safeExecute<T>(
    fn: () => T, 
    errorContext: string, 
    fallbackValue?: T
  ): T | undefined {
    try {
      return fn();
    } catch (error) {
      console.error(`Error in ${errorContext}:`, error);
      return fallbackValue;
    }
  }

  /**
   * 安全执行异步函数，捕获并处理错误
   * @param fn 要执行的异步函数
   * @param errorContext 错误上下文
   * @param fallbackValue 出错时的回退值
   */
  static async safeExecuteAsync<T>(
    fn: () => Promise<T>, 
    errorContext: string, 
    fallbackValue?: T
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      console.error(`Async error in ${errorContext}:`, error);
      return fallbackValue;
    }
  }

  /**
   * 验证必需的DOM元素是否存在
   * @param elements 要验证的元素对象
   * @returns 验证结果
   */
  static validateRequiredElements(elements: Record<string, Element | null>): boolean {
    const missingElements: string[] = [];
    
    for (const [name, element] of Object.entries(elements)) {
      if (!element) {
        missingElements.push(name);
      }
    }
    
    if (missingElements.length > 0) {
      console.error('Missing required DOM elements:', missingElements);
      return false;
    }
    
    return true;
  }

  /**
   * 创建用户友好的错误提示
   * @param errorType 错误类型
   * @returns 错误消息
   */
  static getUserFriendlyMessage(errorType: keyof typeof GameErrorHandler.ERROR_MESSAGES): string {
    return this.ERROR_MESSAGES[errorType];
  }
}
