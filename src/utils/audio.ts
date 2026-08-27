// Web Audio API sound generator for Pomodoro Focus timer

let audioCtx: AudioContext | null = null;
let ambientNode: AudioNode | null = null;
let ambientGainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a resonant meditation bell / chime sound
 */
export function playBellChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic frequencies for bell chime (Tibetan/Zen bowl)
    const freqs = [528, 1056, 1584, 2112];
    const gains = [0.4, 0.2, 0.1, 0.05];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // slight shimmer
      osc.frequency.exponentialRampToValueAtTime(freq * 0.998, now + 3.0);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gains[idx], now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  } catch {
    // AudioContext blocked before user interaction
  }
}

/**
 * Play a subtle mechanical or digital tick
 */
export function playTickSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {
    // Ignored
  }
}

/**
 * Start ambient background noise (Brown noise, White noise, Rain, Campfire)
 */
export function startAmbientSound(type: 'brown-noise' | 'white-noise' | 'rain' | 'campfire' | 'none', volume = 0.2): void {
  stopAmbientSound();
  if (type === 'none') return;

  try {
    const ctx = getAudioContext();
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'white-noise') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'brown-noise') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // boost gain
      }
    } else if (type === 'rain' || type === 'campfire') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.05 * white) / 1.05;
        lastOut = output[i];
        // add sporadic droplet/crackle peaks
        if (Math.random() < 0.002) {
          output[i] += (Math.random() - 0.5) * 1.5;
        }
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    if (type === 'brown-noise') {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
    } else if (type === 'rain') {
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 1.0;
    } else if (type === 'campfire') {
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 3000;
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 1.0);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();

    ambientNode = whiteNoise;
    ambientGainNode = gain;
  } catch {
    // AudioContext blocked
  }
}

/**
 * Update ambient sound volume
 */
export function setAmbientVolume(volume: number): void {
  if (ambientGainNode && audioCtx) {
    ambientGainNode.gain.setValueAtTime(volume * 0.4, audioCtx.currentTime);
  }
}

/**
 * Stop ambient sound
 */
export function stopAmbientSound(): void {
  if (ambientNode) {
    try {
      (ambientNode as AudioBufferSourceNode).stop();
      ambientNode.disconnect();
    } catch {
      // Ignored
    }
    ambientNode = null;
  }
  if (ambientGainNode) {
    ambientGainNode.disconnect();
    ambientGainNode = null;
  }
}
