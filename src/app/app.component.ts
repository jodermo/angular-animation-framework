import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent{
  constructor() {
    // fetch('/thing/stuck/in/cache', {cache: 'reload', credentials: 'include'});
    if(navigator['activeVRDisplays']){
      for(const display of navigator['activeVRDisplays']){
        display.exitPresent();
      }
    }
  }

}
