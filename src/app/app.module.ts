import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AudioAnimationDemoComponent } from './demos/audio-animation-demo/audio-animation-demo.component';
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
import { AnimationControlsComponent } from './demos/audio-animation-demo/animation-controls/animation-controls.component';
import { TileDemoComponent } from './demos/tile-demo/tile-demo.component';
import { ThreeAnimationModule } from './three-animation/three-animation.module';
import { AppRoutingModule } from './app-routing.module';
import { DemosComponent } from './demos/demos.component';
import { LandingPageComponent } from './demos/landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AudioAnimationDemoComponent,
    StartViewComponent,
    WebRadioComponent,
    RadioPreviewComponent,
    RadioPreviewSmallComponent,
    AppDescriptionComponent,
    CopyrightComponent,
    AboutComponent,
    AnimationControlsComponent,
    TileDemoComponent,
    DemosComponent,
    LandingPageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ThreeAnimationModule
  ],
  providers: [HttpClient, WebRadioService, AudioAnimationDemoComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
