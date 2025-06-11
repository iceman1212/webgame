// 音频上下文
// 获取全局的AudioContext，用于处理和播放音频
const AudioContextGlobal: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
// 创建音频上下文实例，如果浏览器不支持则为null
export const audioCtx: AudioContext | null = AudioContextGlobal ? new AudioContextGlobal() : null;

// 开始播放背景音乐函数
export function startBackgroundMusic(isRunning: boolean): void {
  // 如果游戏未运行或音频上下文不存在，则直接返回
  if (!isRunning || !audioCtx) return;
  // 定义音符频率数组
  const notes: number[] = [261.63, 293.66, 329.63, 349.23];
  // 初始化音符索引
  let index: number = 0;
  // 播放下一个音符函数
  function playNext(): void {
    // 如果游戏未运行或音频上下文不存在（在超时回调中也需要检查），则直接返回
    if (!isRunning || !audioCtx) return;
    // 获取当前音频时间
    const now: number = audioCtx.currentTime;
    // 创建振荡器节点，用于生成声音波形
    const osc: OscillatorNode = audioCtx.createOscillator();
    // 创建增益节点，用于控制音量
    const gain: GainNode = audioCtx.createGain();
    // 设置振荡器类型为正弦波
    osc.type = 'sine';
    // 设置振荡器频率为当前音符的频率
    osc.frequency.setValueAtTime(notes[index], now);
    // 设置增益（音量）
    gain.gain.setValueAtTime(0.05, now);
    // 连接振荡器到增益节点
    osc.connect(gain);
    // 连接增益节点到音频输出目标（扬声器）
    gain.connect(audioCtx.destination);
    // 开始播放声音
    osc.start(now);
    // 在0.3秒后停止播放声音
    osc.stop(now + 0.3);
    // 更新音符索引，循环播放
    index = (index + 1) % notes.length;
    // 400毫秒后播放下一个音符
    setTimeout(playNext, 400);
  }
  // 开始播放第一个音符
  playNext();
}

// 播放泡泡音效函数
export function playPopSound(): void {
  // 如果音频上下文不存在，则直接返回
  if (!audioCtx) return;
  // 获取当前音频时间
  const now: number = audioCtx.currentTime;
  // 创建两个振荡器节点
  const osc1: OscillatorNode = audioCtx.createOscillator();
  const osc2: OscillatorNode = audioCtx.createOscillator();
  // 创建增益节点
  const gain: GainNode = audioCtx.createGain();
  // 设置振荡器类型为三角波
  osc1.type = 'triangle';
  osc2.type = 'triangle';
  // 设置初始频率
  osc1.frequency.setValueAtTime(880, now); // A5音
  osc2.frequency.setValueAtTime(660, now); // E5音
  // 设置音量
  gain.gain.setValueAtTime(0.12, now);
  // 连接振荡器到增益节点
  osc1.connect(gain);
  osc2.connect(gain);
  // 连接增益节点到音频输出
  gain.connect(audioCtx.destination);
  // 开始播放
  osc1.start(now);
  osc2.start(now);
  // 在0.15秒内线性降低频率，产生“pop”效果
  osc1.frequency.linearRampToValueAtTime(440, now + 0.15); // A4音
  osc2.frequency.linearRampToValueAtTime(330, now + 0.15); // E4音
  // 0.15秒后停止播放
  osc1.stop(now + 0.15);
  osc2.stop(now + 0.15);
}

// 播放失败音效函数
export function playFailSound(): void {
  // 如果音频上下文不存在，则直接返回
  if (!audioCtx) return;
  // 获取当前音频时间
  const now: number = audioCtx.currentTime;
  // 创建振荡器节点
  const osc: OscillatorNode = audioCtx.createOscillator();
  // 创建增益节点
  const gain: GainNode = audioCtx.createGain();
  // 设置振荡器类型为锯齿波
  osc.type = 'sawtooth';
  // 设置初始频率
  osc.frequency.setValueAtTime(200, now);
  // 设置音量
  gain.gain.setValueAtTime(0.15, now);
  // 连接振荡器到增益节点
  osc.connect(gain);
  // 连接增益节点到音频输出
  gain.connect(audioCtx.destination);
  // 开始播放
  osc.start(now);
  // 在0.4秒内指数级降低频率，产生“失败”效果
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
  // 在0.4秒内线性降低音量至0
  gain.gain.linearRampToValueAtTime(0, now + 0.4);
  // 0.4秒后停止播放
  osc.stop(now + 0.4);
}
