import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ThreeAnimationComponent } from './three-animation/three-animation.component';
import { AudioAnimationDemoComponent } from './audio-animation-demo/audio-animation-demo.component';
import { ThreeAnimationPreloaderComponent } from './three-animation/three-animation-preloader/three-animation-preloader.component';
import { StartViewComponent } from './start-view/start-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeAnimationComponent,
    AudioAnimationDemoComponent,
    ThreeAnimationPreloaderComponent,
    StartViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
