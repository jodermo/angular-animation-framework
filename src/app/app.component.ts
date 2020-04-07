import { Component } from '@angular/core';
import { ThreeAnimationComponent } from './three-animation/three-animation.component';
import { AudioAnimationDemoComponent } from './audio-animation-demo/audio-animation-demo.component';
import { AudioService } from './three-animation/services/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  radioView = false;
  started = false;

  constructor() {

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
    localStorage.clear();

  }

  searchRadio(radioQuery = '') {
    this.radioView = false;
    localStorage.setItem('radio-name', radioQuery);
    localStorage.setItem('radio-search', 'true');
    setTimeout(() => {
      this.radioView = true;
    }, 100);
  }
}
