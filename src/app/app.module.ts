import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AnimationService } from './three-animation/services/animation.service';
import { ThreeAnimationComponent } from './three-animation/three-animation.component';
import { AudioAnimationDemoComponent } from './audio-animation-demo/audio-animation-demo.component';
import { ThreeAnimationPreloaderComponent } from './three-animation/three-animation-preloader/three-animation-preloader.component';
import { StartViewComponent } from './website/start-view/start-view.component';
import { WebRadioService } from './website/web-radio/services/web-radio.service';
import { WebRadioComponent } from './website/web-radio/web-radio.component';
import { RadioPreviewComponent } from './website/web-radio/radio-preview/radio-preview.component';
import { RadioPreviewSmallComponent } from './website/web-radio/radio-preview-small/radio-preview-small.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppDescriptionComponent } from './website/app-description/app-description.component';
import { CopyrightComponent } from './website/copyright/copyright.component';
import { AboutComponent } from './website/about/about.component';
import { AnimationControlsComponent } from './audio-animation-demo/animation-controls/animation-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeAnimationComponent,
    AudioAnimationDemoComponent,
    ThreeAnimationPreloaderComponent,
    StartViewComponent,
    WebRadioComponent,
    RadioPreviewComponent,
    RadioPreviewSmallComponent,
    AppDescriptionComponent,
    CopyrightComponent,
    AboutComponent,
    AnimationControlsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [HttpClient, AnimationService, WebRadioService, AudioAnimationDemoComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
