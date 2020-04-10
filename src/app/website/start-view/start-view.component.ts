import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebRadioService } from '../web-radio/services/web-radio.service';
import { TextContent } from '../text-content';
import { WebsiteConfig } from '../website-config';

@Component({
  selector: 'app-start-view',
  templateUrl: './start-view.component.html',
  styleUrls: ['./start-view.component.css']
})
export class StartViewComponent {
  @Input() radio: WebRadioService;
  @Output() onStart = new EventEmitter();
  @Output() onSearchRadio = new EventEmitter();
  text = TextContent;
  radioSearchQuery = WebsiteConfig.defaultSearchQuery;

  clickStart() {
    this.onStart.emit();
  }

  searchRadio() {
    if(this.radioSearchQuery){
      this.radio.filter.value = this.radioSearchQuery;
    }
    this.onSearchRadio.emit();
  }

}
