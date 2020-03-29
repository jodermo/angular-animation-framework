import { Injectable } from '@angular/core';

// @ts-ignore
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var audioTimeUpdate: any = null;

@Injectable({
  providedIn: 'root'
})

export class AudioService {

  audios = {};

  analyzer = (audio: HTMLAudioElement) => {
    return new AudioAnalyzer(audio);
  };

  constructor() {
  }


  audio(name: string) {
    return (this.audios[name] || null);
  }

  load(name: string, source: string, options: any = null) {
    if (!this.audios[name]) {
      this.audios[name] = document.createElement('audio');
      this.audios[name].src = source;
      for (const key in options) {
        if (key !== 'type') {
          this.audios[name][key] = options[key];
        }
      }
      this.audios[name].load();
    } else {
      console.log('audio with name "' + name + '" already loaded');
    }
  }

  play(name: string) {
    const audio = this.audio(name) as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      if (audio.paused) {
        audio.play();
      }
    }
  }

  pause(name: string) {
    const audio = this.audio(name) as HTMLAudioElement;
    if (audio && !audio.paused) {
      audio.pause();
    }
  }

  loop(name: string) {
    const audio = this.audio(name) as HTMLAudioElement;
    if (audio) {
      this.play(name);
      audio.onended = () => {
        this.play(name);
      };
    }
  }
}

export class AudioAnalyzer {
  audioCtx;
  analyser;
  audioSrc;
  frequency = {
    values: [],
    dataArray: null
  };
  frequencyData;
  meterNum = 800 / (10 + 2); // count of the meters
  canvas;
  canvasCtx;
  canvasSettings = {
    gradient: null,
    width: null,
    height: null,
    meterWidth: 10, // width of the meters in the spectrum
    gap: 2, // gap between meters
    capHeight: 2,
    capStyle: '#fff',
    meterNum: 800 / (10 + 2), // count of the meters
    capYPositionArray: [], //// store the vertical position of hte caps for the preivous frame
  };
  callbacks = {
    update: null
  };

  constructor(public audio: HTMLAudioElement) {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.audioSrc = this.audioCtx.createMediaElementSource(audio);
      this.audioSrc.connect(this.analyser);
      this.audioSrc.connect(this.audioCtx.destination);
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }
    this.loop();

  }

  update() {
    this.frequencyDataUpdate();
    this.drawCanvas();
    this.do('update', {
      frequency: this.frequency
    });
  }

  frequencyDataUpdate() {
    this.frequency.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this.frequency.dataArray);
    const step = Math.round(this.frequency.dataArray.length / this.meterNum);
    this.frequency.values = [];
    for (let i = 0; i < this.meterNum; i++) {
      const value = this.frequency.dataArray[i * step];
      this.frequency.values.push(value);
    }
  }

  on(callbackName, callback) {
    if (!this.callbacks[callbackName]) {
      this.callbacks[callbackName] = [];
    }
    this.callbacks[callbackName].push(callback);
  }

  do(callbackName, data: any = null) {
    if (this.callbacks[callbackName]) {
      for (const callback of this.callbacks[callbackName]) {
        callback(data);
      }
    }
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvasCtx = canvas.getContext('2d');
    this.canvasSettings.width = canvas.width;
    this.canvasSettings.height = canvas.height;
    this.canvasSettings.gradient = this.canvasCtx.createLinearGradient(0, 0, 0, 300);
    this.canvasSettings.gradient.addColorStop(1, '#25ffb5');
    this.canvasSettings.gradient.addColorStop(0.25, '#72e9ff');
    this.canvasSettings.gradient.addColorStop(0, '#1f18ff');
  }

  drawCanvas() {
    if (this.canvasCtx) {
      const array = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(array);
      const step = Math.round(array.length / this.canvasSettings.meterNum);
      this.canvasCtx.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);
      for (let i = 0; i < this.canvasSettings.meterNum; i++) {
        const value = array[i * step];
        if (this.canvasSettings.capYPositionArray.length < Math.round(this.canvasSettings.meterNum)) {
          this.canvasSettings.capYPositionArray.push(value);
        }
        this.canvasCtx.fillStyle = this.canvasSettings.capStyle;
        if (value < this.canvasSettings.capYPositionArray[i]) {
          this.canvasCtx.fillRect(
            i * 12,
            this.canvasSettings.height - (--this.canvasSettings.capYPositionArray[i]),
            this.canvasSettings.meterWidth,
            this.canvasSettings.capHeight);
        } else {
          this.canvasCtx.fillRect(
            i * 12,
            this.canvasSettings.height - value,
            this.canvasSettings.meterWidth,
            this.canvasSettings.capHeight);
          this.canvasSettings.capYPositionArray[i] = value;
        }
        this.canvasCtx.fillStyle = this.canvasSettings.gradient;
        this.canvasCtx.fillRect(i * 12,
          this.canvasSettings.height - value + this.canvasSettings.capHeight,
          this.canvasSettings.meterWidth,
          this.canvasSettings.height);
      }
    }
  }

  loop(fps = 30) {
    if (audioTimeUpdate) {
      clearTimeout(audioTimeUpdate)
    }
    this.update();
    audioTimeUpdate = setTimeout(() => {
      this.loop(fps);
    }, 1000 / fps);
  }
}
