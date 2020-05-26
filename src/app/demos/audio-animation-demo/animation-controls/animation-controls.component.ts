import { Component, Input } from '@angular/core';
import { AnimationService } from '../../../three-animation/services/animation.service';

@Component({
  selector: 'app-animation-controls',
  templateUrl: './animation-controls.component.html',
  styleUrls: ['./animation-controls.component.css']
})
export class AnimationControlsComponent {
  @Input() animation: AnimationService;

  constructor() {
  }

}
