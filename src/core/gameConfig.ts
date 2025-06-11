/**
 * 游戏配置常量
 * 统一管理所有游戏相关的配置参数
 */
export const GAME_CONFIG = {
  // 游戏循环配置
  FRAME_RATE: 20, // 毫秒，游戏主循环更新间隔
  BALLOON_SPAWN_INTERVAL: 3500, // 毫秒，气球生成间隔

  // 游戏规则配置
  INITIAL_LIVES: 3, // 初始生命值
  POINTS_PER_CORRECT: 10, // 答对一题的分数

  // 玩家配置
  PLAYER_SIZE: 40, // 玩家大小
  PLAYER_SPEED: 6, // 玩家移动速度
  PLAYER_OFFSET_X: 20, // 玩家初始位置X偏移
  PLAYER_OFFSET_Y: 60, // 玩家初始位置Y偏移

  // 气球配置
  BALLOON_RADIUS: 28, // 气球半径
  BALLOON_COUNT: 4, // 每轮气球数量
  BALLOON_SPEED_MIN: 1, // 气球最小速度
  BALLOON_SPEED_MAX: 2.5, // 气球最大速度
  BALLOON_SWAY_AMPLITUDE: 8, // 气球摇摆幅度
  BALLOON_SWAY_SPEED: 500, // 气球摇摆速度（毫秒）

  // 问题生成配置
  QUESTION_NUMBER_MIN: 1, // 问题中数字的最小值
  QUESTION_NUMBER_MAX: 9, // 问题中数字的最大值
  DISTRACTOR_RANGE: 4, // 干扰项的范围（±4）

  // 音频配置
  BACKGROUND_MUSIC_VOLUME: 0.05, // 背景音乐音量
  POP_SOUND_VOLUME: 0.12, // 成功音效音量
  FAIL_SOUND_VOLUME: 0.15, // 失败音效音量
  SOUND_DURATION_POP: 0.15, // 成功音效持续时间（秒）
  SOUND_DURATION_FAIL: 0.4, // 失败音效持续时间（秒）

  // 视觉效果配置
  SHADOW_OFFSET: 3, // 阴影偏移
  SHADOW_OPACITY: 0.1, // 阴影透明度
  HIGHLIGHT_RADIUS_RATIO: 0.25, // 高光半径比例
  HIGHLIGHT_OFFSET_X: -8, // 高光X偏移
  HIGHLIGHT_OFFSET_Y: -12, // 高光Y偏移
  ROPE_LENGTH: 20, // 气球绳子长度
  ROPE_WIDTH: 2, // 气球绳子宽度
} as const;

/**
 * 资源路径配置
 */
export const ASSETS_CONFIG = {
  IMAGES: {
    PLAYER: 'assets/images/player_character.svg',
    BALLOONS: [
      'assets/images/balloon_rainbow.svg',
      'assets/images/balloon_star.svg',
      'assets/images/balloon_happy_face.svg',
    ],
  },
} as const;

/**
 * 颜色配置
 */
export const COLORS = {
  PLAYER_FALLBACK: '#ff69b4', // 玩家备用颜色
  BALLOON_FALLBACK: 'gray', // 气球备用颜色
  SHADOW: 'rgba(0,0,0,0.1)', // 阴影颜色
  HIGHLIGHT: 'rgba(255,255,255,0.7)', // 高光颜色
  ROPE: '#888', // 绳子颜色
  TEXT: '#000000', // 文字颜色
} as const;

/**
 * 音符频率配置（用于背景音乐）
 */
export const MUSIC_NOTES = [261.63, 293.66, 329.63, 349.23] as const;
