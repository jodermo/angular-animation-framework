import { Component, OnInit, Input } from '@angular/core';
import { WebRadioComponent } from '../web-radio.component';

@Component({
  selector: 'app-radio-preview',
  templateUrl: './radio-preview.component.html',
  styleUrls: ['./radio-preview.component.scss'],
})
export class RadioPreviewComponent implements OnInit {
  @Input() radio = null;
  @Input() details = false;
  lastVolume = 1;

  constructor(public webRadio: WebRadioComponent) {
  }

  ngOnInit() {
  }

}
