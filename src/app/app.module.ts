import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ThreeAnimationComponent } from './three-animation/three-animation.component';
import { AudioAnimationDemoComponent } from './audio-animation-demo/audio-animation-demo.component';
import { ThreeAnimationPreloaderComponent } from './three-animation/three-animation-preloader/three-animation-preloader.component';
import { StartViewComponent } from './start-view/start-view.component';
import { WebRadioComponent } from './web-radio/web-radio.component';
import { RadioPreviewComponent } from './web-radio/radio-preview/radio-preview.component';
import { RadioPreviewSmallComponent } from './web-radio/radio-preview-small/radio-preview-small.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppDescriptionComponent } from './app-description/app-description.component';
import { WebRadioService } from './web-radio/services/web-radio.service';
import { AnimationService } from './three-animation/services/animation.service';
import { CopyrightComponent } from './copyright/copyright.component';

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
    CopyrightComponent
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
