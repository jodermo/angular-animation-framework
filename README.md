# Angular Animation Framework 
Demo (Retro Audio Visualisation):
<a rel="demo" href="http://3d.mucke.online" target="_blank">
  3d.mucke.online
</a>

• implementation as Angular component<br>
• easy create, animate and do interactions on 3D objects with TypeScript<br>
• attributes based on THREE.js library (<a href="https://threejs.org/docs/" target="_blank">docs</a>)<br>
• tweening methods based on TWEEN.js library (<a href="https://www.createjs.com/tweenjs" target="_blank">website</a>)<br>
• audio analyzer with dynamic frequency data<br>
• 360 Videos<br>
• VR/AR support (still in development)<br>

| Frameworks |  | Links |
|    ---:| :---          | :---         |
| <img src="https://angular.io/assets/images/logos/angular/angular.svg" height="64"  alt="Angular Logo" /><br>Angular CLI | Client Side TypeScript App | [WEBSITE](https://angular.io)<br> [README](https://github.com/angular/angular-cli/blob/master/README.md)|
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/WebGL_Logo.svg/1199px-WebGL_Logo.svg.png" height="64"  alt="WebGL Logo" /><br>Three-js | 3D Graphic API | [WEBSITE](https://threejs.org/)<br> [README](https://github.com/mrdoob/three.js/blob/dev/README.md)|
| <img src="https://www.createjs.com/assets/images/svg/tweenjs-logo-horizontal-gray-darker.svg" height="64"  alt="TWEEN.js Logo" /><br>TWEEN.js | Tweening library | [WEBSITE](https://www.createjs.com/tweenjs)<br> [README](https://github.com/tweenjs/tween.js/blob/master/README.md)|



<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
###### *© 2020 - Moritz Petzka - [petzka.com](https://petzka.com/)*

## Main Component:
 * [/src/](./src)
    * [/app/..](./src/app) 
        * [/three-animation/](./src/app/three-animation) <sub><sup>THREE.js animation framework component</sup></sub>
 - - -
 
For implementation in existing Projects, follow the steps in: [.../three-animation/README.md](./src/app/three-animation/README.md)

# Example 

```javascript

import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ThreeAnimationComponent } from '../three-animation/three-animation.component';
import { AnimationObject, AnimationObjectOptions } from '../three-animation/classes/animation-object';


@Component({
    selector: 'my-animation',
    templateUrl: '../three-animation/three-animation.component.html',
    styleUrls: ['../three-animation/three-animation.component.css']
})
export class MyAnimationComponent extends ThreeAnimationComponent {

    constructor(public elementRef: ElementRef, public _renderer: Renderer2) {
      super(elementRef, _renderer);
    }
    
    start(){

        const box: AnimationObject = this.createObject('mesh', {
            material: {
                type: 'MeshBasicMaterial',
                color: '#ff00ec',
                transparent: true,
                opacity: .25
            },
            geometry: {
                type: 'BoxGeometry',
                width: 5,
                height: 5,
                depth: 5,
            },
            mesh: {
                receiveShadow: true,
                castShadow: true
            },
            position: {
                x: 10,
                y: 0,
                z: 0
            }
        } as AnimationObjectOptions, ()=>{
            // stuff after object is successful created
        });
        
       box.moveTo({x:0, y:0, z:50}, 5000);
    }
}
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.5.


## Installation

Run `npm install -g @angular/cli` to install Angular CLI.
Run `npm install` to install dependencies.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

