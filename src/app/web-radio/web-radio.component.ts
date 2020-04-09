import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WebRadioService } from './services/web-radio.service';

@Component({
  selector: 'app-web-radio',
  templateUrl: './web-radio.component.html',
  styleUrls: ['./web-radio.component.scss'],
})
export class WebRadioComponent implements OnInit {
  @Input() radio: WebRadioService;
  @Output() onPlay = new EventEmitter<HTMLAudioElement>();

  constructor() {

  }

  ngOnInit() {


  }
}
