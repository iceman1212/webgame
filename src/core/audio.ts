// Audio Context
const AudioContextGlobal: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
export const audioCtx: AudioContext | null = AudioContextGlobal ? new AudioContextGlobal() : null;

export function startBackgroundMusic(isRunning: boolean): void {
  if (!isRunning || !audioCtx) return;
  const notes: number[] = [261.63, 293.66, 329.63, 349.23];
  let index: number = 0;
  function playNext(): void {
    if (!isRunning || !audioCtx) return; // Check isRunning inside timeout as well
    const now: number = audioCtx.currentTime;
    const osc: OscillatorNode = audioCtx.createOscillator();
    const gain: GainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[index], now);
    gain.gain.setValueAtTime(0.05, now);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
    index = (index + 1) % notes.length;
    setTimeout(playNext, 400);
  }
  playNext();
}

export function playPopSound(): void {
  if (!audioCtx) return;
  const now: number = audioCtx.currentTime;
  const osc1: OscillatorNode = audioCtx.createOscillator();
  const osc2: OscillatorNode = audioCtx.createOscillator();
  const gain: GainNode = audioCtx.createGain();
  osc1.type = 'triangle';
  osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(880, now);
  osc2.frequency.setValueAtTime(660, now);
  gain.gain.setValueAtTime(0.12, now);
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  osc1.start(now);
  osc2.start(now);
  osc1.frequency.linearRampToValueAtTime(440, now + 0.15);
  osc2.frequency.linearRampToValueAtTime(330, now + 0.15);
  osc1.stop(now + 0.15);
  osc2.stop(now + 0.15);
}

export function playFailSound(): void {
  if (!audioCtx) return;
  const now: number = audioCtx.currentTime;
  const osc: OscillatorNode = audioCtx.createOscillator();
  const gain: GainNode = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, now);
  gain.gain.setValueAtTime(0.15, now);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
  gain.gain.linearRampToValueAtTime(0, now + 0.4);
  osc.stop(now + 0.4);
}
