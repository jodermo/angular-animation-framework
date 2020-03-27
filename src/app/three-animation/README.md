# Three Animation Component 
Demo:
<a rel="demo" href="http://3d.mucke.online" target="_blank">
  3d.mucke.online
</a>

| Frameworks |  | Links |
|    ---:| :---          | :---         |
| <img src="https://angular.io/assets/images/logos/angular/angular.svg" height="64"  alt="Angular Logo" /><br>Angular CLI | Client Side TypeScript App | [WEBSITE](https://angular.io)<br> [README](https://github.com/angular/angular-cli/blob/master/README.md)|
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/WebGL_Logo.svg/1199px-WebGL_Logo.svg.png" height="64"  alt="WebGL Logo" /><br>Three-js | 3D Graphic API | [WEBSITE](https://threejs.org/)<br> [README](https://github.com/mrdoob/three.js/blob/dev/README.md)|




<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
###### *© 2020 - Moritz Petzka - [petzka.com](https://petzka.com/)*
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.5.

## Installation <sub><sup>(to existing Angular project)</sup></sub>


clone project to any temporary folder <br>
`git clone https://github.com/jodermo/angular-animation-framework`

move or copy the whole component folder `src/app/three-animation` to your project<br>


Install dependencies:
 
 `npm install three --save`<br>
 `npm install stats-js --save`<br>
 `npm install @tweenjs/tween.js --save`<br>
 `npm install physijs-webpack --save`<br>
 `npm install camera-controls --save`<br>
 `npm install three-orbitcontrols-ts --save`<br>

### add to app.module.ts 
```javascript
    import { ThreeAnimationComponent } from './three-animation/three-animation.component';
```

```javascript
   @NgModule({
     declarations: [
       ThreeAnimationComponent,
     ],
    ...
```
## Create animations <sub><sup>(with <a href="https://cli.angular.io/" target="_blank">Angular CLI</a>)</sup></sub>:

To create a new animation, you have to generate a new component:

Run `ng generate component my-animation`



### edit the component.ts file:

imports:
```javascript
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ThreeAnimationComponent } from '../three-animation/three-animation.component';
import { AnimationObject, AnimationObjectOptions } from '../three-animation/classes/animation-object';
```

change tamplateUrl and styleUrls :
```javascript
@Component({
    selector: 'my-animation',
    templateUrl: '../three-animation/three-animation.component.html',
    styleUrls: ['../three-animation/three-animation.component.css']
})
```
set component as ThreeAnimationComponent :
```javascript
export class MyAnimationComponent extends ThreeAnimationComponent {
  
}
```

add constructor :
```javascript
export class MyAnimationComponent extends ThreeAnimationComponent {

    constructor(public elementRef: ElementRef, public _renderer: Renderer2) {
      super(elementRef, _renderer);
    }

}
```

add main functions :
```javascript
export class MyAnimationComponent extends ThreeAnimationComponent {

    constructor(public elementRef: ElementRef, public _renderer: Renderer2) {
      super(elementRef, _renderer);
    }
    
    start(){
        // stuff after three scene is created
    }
    
    animateFrame(){
        // stuff when frame updates...
    }   

}
```

the whole file:
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
            // stuff after three scene is created
    }
        
    animateFrame(){
            // stuff when frame updates...
    }   
}
```

# Example

### create object and let it move on start:

create mesh object (THREE.js <a hraf="https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry">BoxGeometry</a> &
<a hraf="https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial">MeshBasicMaterial</a>):
```javascript
        const box = this.createObject('mesh', {
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
               // attributes: [5, 5, 5] // is the same as above
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
        }, ()=>{
            // stuff after object is successful created
        });
```


let the box move to position X:0, y:0, z:50 in 5 seconds:
```javascript
        box.moveTo({x:0, y:0, z:50}, 5000);
```


the whole file:
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

        const box = this.createObject('mesh', {
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
        }, ()=>{
            // stuff after object is successful created
        });
        
       box.moveTo({x:0, y:0, z:50}, 5000);
    }
}
```
