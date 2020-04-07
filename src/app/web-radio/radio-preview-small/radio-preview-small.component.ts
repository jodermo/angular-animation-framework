import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RadioPreviewComponent } from '../radio-preview/radio-preview.component';
import { WebRadioComponent } from '../web-radio.component';

@Component({
  selector: 'app-radio-preview-small',
  templateUrl: './radio-preview-small.component.html',
  styleUrls: ['./radio-preview-small.component.scss'],
})
export class RadioPreviewSmallComponent extends RadioPreviewComponent {
  @Output()  onClose = new EventEmitter();


  constructor(public webRadio: WebRadioComponent) {
    super(webRadio);

  }

  ngOnInit() {
  }


  play() {
    if (window['radio'] && window['radio'].audio) {
      window['radio'].audio.play();
    }
  }

  pause() {
    if (window['radio'] && window['radio'].audio) {
      window['radio'].audio.pause();
    }
  }

  mute() {
    if (window['radio'] && window['radio'].audio) {
      window['radio'].audio.muted = !window['radio'].audio.muted;
    }
  }


  prev() {
    if (this.webRadio) {
      this.webRadio.selectPrevRadio();
    }
  }

  next() {
    if (this.webRadio) {
      this.webRadio.selectNextRadio();
    }
  }

  close() {
    this.pause();
    if (this.webRadio) {
      this.webRadio.removeStream();
    }

    this.onClose.emit();
  }

}
