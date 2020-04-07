import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-start-view',
  templateUrl: './start-view.component.html',
  styleUrls: ['./start-view.component.css']
})
export class StartViewComponent implements OnInit {
  @Output() onStart = new EventEmitter<boolean>();
  @Output() onSearchRadio = new EventEmitter<string>();
  radioSearchQuery = 'electro';


  constructor() {
  }

  ngOnInit(): void {
  }

  clickStart() {
    this.onStart.emit(true);
  }

  searchRadio() {
    if (this.radioSearchQuery && this.radioSearchQuery.length >= 2) {
      this.onSearchRadio.emit(this.radioSearchQuery);
    }
  }

}
