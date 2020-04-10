import { Component } from '@angular/core';
import { WebRadioService } from './website/web-radio/services/web-radio.service';
import { AnimationService } from './three-animation/services/animation.service';
import { TextContent } from './website/text-content';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  text = TextContent;
  radioView = false;
  started = false;
  controlPanel = false;
  infoPanel = false;

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
