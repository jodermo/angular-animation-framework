import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-three-animation-preloader',
  templateUrl: './three-animation-preloader.component.html',
  styleUrls: ['./three-animation-preloader.component.css']
})
export class ThreeAnimationPreloaderComponent implements OnInit {
  @Input() loader: any = null;

  constructor() { }

  ngOnInit(): void {
  }

}
