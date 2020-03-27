import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-start-view',
  templateUrl: './start-view.component.html',
  styleUrls: ['./start-view.component.css']
})
export class StartViewComponent implements OnInit {
  @Output() onStart = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  clickStart() {
    this.onStart.emit(true);
  }

}
