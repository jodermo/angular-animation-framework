import { Component, AfterViewInit } from '@angular/core';
import { ThreeAnimationComponent } from './three-animation/three-animation.component';
import { AudioAnimationDemoComponent } from './audio-animation-demo/audio-animation-demo.component';
import { AudioService } from './three-animation/services/audio.service';
import { WebRadioService } from './web-radio/services/web-radio.service';
import { AnimationService } from './three-animation/services/animation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  radioView = false;
  started = false;

  constructor(public animation: AnimationService, public radio: WebRadioService) {

  }

  ngAfterViewInit() {
    this.radio.init();
  }

  windowRadio() {
    if (window['radio'] && window['radio'].station) {
      return window['radio'];
    }
    return false;
  }

  changeMusicTrack(audio: HTMLAudioElement) {
    console.log('changeMusicTrack', audio);
  }

  killRadioStation() {

    if (window['radio']) {
      if (window['radio'].audio) {
        window['radio'].audio.pause();
        window['radio'].audio.remove();
        window['radio'].audio = null;
      }
      window['radio'].station = null;
    }
    this.radio.clearStorage();

  }

  searchRadio() {
    this.radioView = true;
    this.radio.searchStations();
  }
}
