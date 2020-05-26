import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeAnimationComponent } from './three-animation.component';
import { AnimationService } from './services/animation.service';
import { ThreeAnimationPreloaderComponent } from './three-animation-preloader/three-animation-preloader.component';


@NgModule({
  declarations: [
    ThreeAnimationComponent,
    ThreeAnimationPreloaderComponent,
  ],
  imports: [
    CommonModule
  ],
  providers: [AnimationService],
  exports: [ThreeAnimationComponent, ThreeAnimationPreloaderComponent],
})
export class ThreeAnimationModule {
}
