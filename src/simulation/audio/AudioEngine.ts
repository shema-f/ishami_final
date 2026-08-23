// ============================================================
// ISHAMI SIMULATION — Audio Engine
// Web Audio API-based procedural audio system
// ============================================================

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineLfo: OscillatorNode | null = null;
  private engineLfoGain: GainNode | null = null;
  private exhaustNoise: AudioBufferSourceNode | null = null;
  private exhaustGain: GainNode | null = null;
  private exhaustFilter: BiquadFilterNode | null = null;
  private tireScreechNode: AudioBufferSourceNode | null = null;
  private tireScreechGain: GainNode | null = null;
  private ambientNode: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private windNode: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private uiClickGain: GainNode | null = null;
  private isRunning = false;
  private isMuted = false;

  async init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.6;
    this.masterGain.connect(this.ctx.destination);
    this.isRunning = true;
    this.startEngineOscillators();
    this.startExhaustNoise();
    this.startWind();
    this.startAmbient();
  }

  private startEngineOscillators() {
    if (!this.ctx || !this.masterGain) return;

    // Main engine tone
    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 80;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0;

    // LFO for engine rumble
    this.engineLfo = this.ctx.createOscillator();
    this.engineLfo.type = 'sine';
    this.engineLfo.frequency.value = 4;

    this.engineLfoGain = this.ctx.createGain();
    this.engineLfoGain.gain.value = 0.3;

    this.engineLfo.connect(this.engineLfoGain);
    this.engineLfoGain.connect(this.engineOsc.frequency);

    // Distortion for engine character
    const waveshaper = this.ctx.createWaveShaper();
    waveshaper.curve = this.makeDistortionCurve(80);
    waveshaper.oversample = '2x';

    // Low-pass filter to tame harshness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 2;

    this.engineOsc.connect(waveshaper);
    waveshaper.connect(filter);
    filter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.engineOsc.start();
    this.engineLfo.start();
  }

  private startExhaustNoise() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    this.exhaustNoise = this.ctx.createBufferSource();
    this.exhaustNoise.buffer = buffer;
    this.exhaustNoise.loop = true;

    this.exhaustFilter = this.ctx.createBiquadFilter();
    this.exhaustFilter.type = 'bandpass';
    this.exhaustFilter.frequency.value = 200;
    this.exhaustFilter.Q.value = 1.5;

    this.exhaustGain = this.ctx.createGain();
    this.exhaustGain.gain.value = 0;

    this.exhaustNoise.connect(this.exhaustFilter);
    this.exhaustFilter.connect(this.exhaustGain);
    this.exhaustGain.connect(this.masterGain);

    this.exhaustNoise.start();
  }

  private startWind() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    this.windNode = this.ctx.createBufferSource();
    this.windNode.buffer = buffer;
    this.windNode.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'highpass';
    this.windFilter.frequency.value = 800;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0;

    this.windNode.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.windNode.start();
  }

  private startAmbient() {
    if (!this.ctx || !this.masterGain) return;

    // Gentle city ambient - low rumble
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }

    this.ambientNode = this.ctx.createBufferSource();
    this.ambientNode.buffer = buffer;
    this.ambientNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.15;

    this.ambientNode.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    this.ambientNode.start();
  }

  updateEngine(rpm: number, throttle: boolean, gear: string) {
    if (!this.engineOsc || !this.engineGain || !this.engineLfo || !this.engineLfoGain) return;

    const normalizedRpm = rpm / 6500;

    // Engine frequency follows RPM
    const baseFreq = 60 + normalizedRpm * 120;
    this.engineOsc.frequency.setTargetAtTime(baseFreq, this.ctx!.currentTime, 0.05);

    // Engine volume
    const engineVol = throttle ? 0.12 + normalizedRpm * 0.15 : 0.05 + normalizedRpm * 0.06;
    this.engineGain.gain.setTargetAtTime(engineVol, this.ctx!.currentTime, 0.05);

    // LFO speed follows RPM
    this.engineLfo.frequency.setTargetAtTime(3 + normalizedRpm * 15, this.ctx!.currentTime, 0.1);
    this.engineLfoGain.gain.setTargetAtTime(0.2 + normalizedRpm * 0.8, this.ctx!.currentTime, 0.1);

    // Exhaust noise
    if (this.exhaustGain && this.exhaustFilter) {
      const exhaustVol = throttle ? 0.04 + normalizedRpm * 0.08 : 0.02;
      this.exhaustGain.gain.setTargetAtTime(exhaustVol, this.ctx!.currentTime, 0.05);
      this.exhaustFilter.frequency.setTargetAtTime(
        150 + normalizedRpm * 400,
        this.ctx!.currentTime,
        0.1
      );
    }
  }

  updateWind(speed: number) {
    if (!this.windGain || !this.windFilter) return;
    const windVol = Math.min(speed / 80, 1) * 0.15;
    this.windGain.gain.setTargetAtTime(windVol, this.ctx!.currentTime, 0.1);
    this.windFilter.frequency.setTargetAtTime(
      600 + speed * 30,
      this.ctx!.currentTime,
      0.1
    );
  }

  playTireScreech(intensity: number) {
    if (!this.ctx || !this.masterGain) return;
    if (this.tireScreechNode) {
      this.stopTireScreech();
    }

    const bufferSize = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / this.ctx.sampleRate;
      data[i] = Math.sin(t * 3000 * (1 + Math.sin(t * 20) * 0.1)) * 0.3 +
                (Math.random() * 2 - 1) * 0.2;
    }

    this.tireScreechNode = this.ctx.createBufferSource();
    this.tireScreechNode.buffer = buffer;
    this.tireScreechNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2500;
    filter.Q.value = 5;

    this.tireScreechGain = this.ctx.createGain();
    this.tireScreechGain.gain.value = Math.min(intensity, 0.3);

    this.tireScreechNode.connect(filter);
    filter.connect(this.tireScreechGain);
    this.tireScreechGain.connect(this.masterGain);

    this.tireScreechNode.start();
  }

  stopTireScreech() {
    if (this.tireScreechGain) {
      this.tireScreechGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.05);
    }
    if (this.tireScreechNode) {
      try { this.tireScreechNode.stop(this.ctx!.currentTime + 0.1); } catch {}
      this.tireScreechNode = null;
    }
  }

  playCollision(intensity: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 80 + intensity * 60;

    const gain = this.ctx.createGain();
    gain.gain.value = Math.min(intensity * 0.4, 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    // Impact noise
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = Math.min(intensity * 0.5, 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);
    noiseSource.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
    noiseSource.start();
  }

  playUIClick() {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playSuccess() {
    if (!this.ctx || !this.masterGain) return;

    [523, 659, 784].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = this.ctx!.createGain();
      gain.gain.value = 0.12;
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.15 + i * 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(this.ctx!.currentTime + i * 0.12);
      osc.stop(this.ctx!.currentTime + 0.25 + i * 0.12);
    });
  }

  playWarning() {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 440;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.08;
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.setValueAtTime(0, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.6,
        this.ctx!.currentTime,
        0.05
      );
    }
    return this.isMuted;
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
    }
  }

  dispose() {
    this.isRunning = false;
    try {
      this.engineOsc?.stop();
      this.engineLfo?.stop();
      this.exhaustNoise?.stop();
      this.windNode?.stop();
      this.ambientNode?.stop();
      this.tireScreechNode?.stop();
    } catch {}
    this.ctx?.close();
    this.ctx = null;
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}

// Singleton
let _instance: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  if (!_instance) _instance = new AudioEngine();
  return _instance;
}
