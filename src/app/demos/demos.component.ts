import { Component, OnInit } from '@angular/core';
import { TextContent } from '../website/text-content';
import { AnimationService } from '../three-animation/services/animation.service';
import { WebRadioService } from '../website/web-radio/services/web-radio.service';
import { ActivatedRoute } from '@angular/router';

export const Demos = [
  {name: 'Audio Visualisation', alias: 'audio-visualisation', position: {x: 55, y: 0, z: 0}, scale: 1},
  {name: 'Tile Demo', alias: 'tile-demo', position: {x: 90, y: 0, z: 0}, scale: 1.25},
];

@Component({
  selector: 'app-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.css']
})
export class DemosComponent implements OnInit {
  text = TextContent;
  radioView = false;
  started = false;
  controlPanel = false;
  infoPanel = false;
  showAnimation;
  demos = Demos;

  constructor(public animation: AnimationService, public radio: WebRadioService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    const animationName = this.route.snapshot.paramMap.get('animation');
    if (animationName) {
      this.showAnimation = animationName;
    }
  }

  ngAfterViewInit() {
    // this.radio.init();
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
