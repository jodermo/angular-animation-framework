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
| TWEEN.js (github.com) | Tweening library | [WEBSITE](https://github.com/tweenjs/tween.js)<br> [README](https://github.com/tweenjs/tween.js/blob/master/README.md)|



<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
###### *© 2020 - Moritz Petzka - [petzka.com](https://petzka.com/)*
For commercial use, contact: <a href="mailto:info@petzka.com" />info@petzka.com</a>

## Main Component:
 * [/src/](./src)
    * [/app/..](./src/app) 
        * [/three-animation/](./src/app/three-animation)
 - - -
 
For implementation in existing Projects, follow the steps in: [.../three-animation/README.md](./src/app/three-animation/README.md)

# AnimationObject 

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

<details><summary><h3>more available functions</h3></summary>

```javascript

/* set attributes directly */

box.setPosition({x:0, y:0, z:50});

box.setRotation({x:0, y:(Math.PI / 2), z:0});

box.setScale({x:1, y:1, z:1});

box.lookAt({x:0, y:0, z:0});


/* tween attributes */

box.moveTo({x:0, y:0, z:50}, 5000, ()=>{
    // stuff after tween ended
}, 'Linear.None');

box.rotateTo({x:0, y:(Math.PI / 2), z:0}, 5000, ()=>{
    // stuff after tween ended
}, 'Linear.None');

box.scaleTo({x:0, y:(Math.PI / 2), z:0}, 5000, ()=>{
    // stuff after tween ended
}, 'Linear.None');


/* more stuff */

box.appendTo(<THREE.js Object>);


/* mouse events */

box.on('mousemove', (event)=>{});
box.on('mouseover', (event)=>{});
box.on('mouseout', (event)=>{});
box.on('mousedown', (event)=>{});
box.on('mouseup', (event)=>{});


/* collision detection */

box.on('collide', (collisionObject)=>{});

box.on('leave', (collisionObject)=>{});

```
</details>

<details><summary><h3>Available easing types for tween functions</h3></summary>
<ul>
  <li>Linear.None (default)</li>
  <li>Quadratic.In</li>
  <li>Quadratic.Out</li>
  <li>Quadratic.InOut</li>
  <li>Cubic.In</li>
  <li>Cubic.Out</li>
  <li>Cubic.InOut</li>
  <li>Quartic.In</li>
  <li>Quartic.Out</li>
  <li>Quartic.InOut</li>
  <li>Quintic.In</li>
  <li>Quintic.Out</li>
  <li>Quintic.InOut</li>
  <li>Sinusoidal.In</li>
  <li>Sinusoidal.Out</li>
  <li>Sinusoidal.InOut</li>
  <li>Exponential.In</li>
  <li>Exponential.Out</li>
  <li>Exponential.InOut</li>
  <li>Back.In</li>
  <li>Back.Out</li>
  <li>Back.InOut</li>
  <li>Bounce.In</li>
  <li>Bounce.Out</li>
  <li>Bounce.InOut</li>
</ul> 
more infos: <a href="https://sole.github.io/tween.js/examples/03_graphs.html" target="_blank">https://sole.github.io/tween.js/examples/03_graphs.html</a>
</details>

<details><summary><h3>THREE.js mesh object example</h3></summary>
More infos: <a href="https://threejs.org/docs/#api/en/objects/Mesh" target="_blank">https://threejs.org/docs/#api/en/objects/Mesh</a>

```javascript
this.createObject('mesh', {
            material: {
                // properties for THREE.js material (more infos below)
                type: 'MeshBasicMaterial',
                color: '#ff00ec',
                transparent: true,
                opacity: .25
            },
            geometry: {
                // properties for THREE.js geometry (examples below)
                type: 'BoxGeometry',
                width: 5,
                height: 5,
                depth: 5,
            },
            mesh: {
                // properties for THREE.js mesh object
                receiveShadow: true,
                castShadow: true,
            }
        } 
 ``` 
</details>

<details><summary><h3>Mesh material</h3></summary>

For more information about material properties, visit:
<a href="https://threejs.org/docs/#api/en/materials/Material" target="_blank">https://threejs.org/docs/#api/en/materials/Material</a>
<ul>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshBasicMaterial" target="_blank">MeshBasicMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshStandardMaterial" target="_blank">MeshStandardMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshLambertMaterial" target="_blank">MeshLambertMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshPhongMaterial" target="_blank">MeshPhongMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshToonMaterial" target="_blank">MeshToonMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshNormalMaterial" target="_blank">MeshNormalMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshDepthMaterial" target="_blank">MeshDepthMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshDistanceMaterial" target="_blank">MeshDistanceMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshMatcapMaterial" target="_blank">MeshMatcapMaterial</a></li>
<li><a href="https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial" target="_blank">MeshPhysicalMaterial</a></li>
</ul>

</details>

<details><summary><h3>Available geometries</h3></summary>



More infos: <a href="https://threejs.org/docs/#api/en/core/Geometry" target="_blank">https://threejs.org/docs/#api/en/core/Geometry</a>
<h4> <a href="https://threejs.org/docs/#api/en/geometries/BoxGeometry" target="_blank">BoxGeometry</a></h4>

```javascript
geometry: {
    type: 'BoxGeometry',
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1
}
 ```  

<h4> <a href="https://threejs.org/docs/#api/en/geometries/CircleGeometry" target="_blank">CircleGeometry</a></h4>

```javascript
geometry: {
    type: 'CircleGeometry',
    radius: 1,
    segments: 8,
    thetaStart: 0,
    thetaLength: (Math.PI * 2)
}
 ```  

<h4> <a href="https://threejs.org/docs/#api/en/geometries/ConeGeometry" target="_blank">ConeGeometry</a></h4>

```javascript
geometry: {
    type: 'ConeGeometry',
    radius: 1,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: (Math.PI * 2)
}
 ```  

<h4> <a href="https://threejs.org/docs/#api/en/geometries/CylinderGeometry" target="_blank">CylinderGeometry</a></h4>

```javascript
geometry: {
    type: 'CylinderGeometry',
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: (Math.PI * 2)
}
 ```  

<h4> <a href="https://threejs.org/docs/#api/en/geometries/DodecahedronGeometry" target="_blank">DodecahedronGeometry</a></h4>

```javascript
geometry: {
    type: 'DodecahedronGeometry',
    radius: 1,
    detail: 0
}
 ```  

<h4> <a href="https://threejs.org/docs/#api/en/geometries/IcosahedronGeometry" target="_blank">IcosahedronGeometry</a></h4>

```javascript
geometry: {
    type: 'IcosahedronGeometry',
    radius: 1,
    detail: 0
}
 ```  

<h4> <a href="https://threejs.org/docs/#api/en/geometries/LatheGeometry" target="_blank">LatheGeometry</a></h4>

```javascript
geometry: {
    type: 'LatheGeometry',
    points: [],
    segments: 12,
    phiStart: 0,
    phiLength: (Math.PI * 2)
}
 ```  

<h4> <a href="https://threejs.org/docs/#api/en/geometries/OctahedronGeometry" target="_blank">OctahedronGeometry</a></h4>

```javascript
geometry: {
    type: 'OctahedronGeometry',
    radius: 1,
    detail: 0
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/ParametricGeometry" target="_blank">ParametricGeometry</a></h4>

```javascript
geometry: {
    type: 'ParametricGeometry',
    func: () => {
    },
    slices: 25,
    stacks: 25,
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/PlaneGeometry" target="_blank">PlaneGeometry</a></h4>

```javascript
geometry: {
    type: 'PlaneGeometry',
    width: 1,
    height: 1,
    widthSegments: 1,
    heightSegments: 1
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/PolyhedronGeometry" target="_blank">PolyhedronGeometry</a></h4>

```javascript
geometry: {
    type: 'PolyhedronGeometry',
    vertices: [
      -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
      -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
    ],
    indices: [
      2, 1, 0, 0, 3, 2,
      0, 4, 7, 7, 3, 0,
      0, 1, 5, 5, 4, 0,
      1, 2, 6, 6, 5, 1,
      2, 3, 7, 7, 6, 2,
      4, 5, 6, 6, 7, 4
    ],
    radius: 1,
    detail: 1
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/RingGeometry" target="_blank">RingGeometry</a></h4>

```javascript
geometry: {
    type: 'RingGeometry',
    innerRadius: 0.5,
    outerRadius: 1,
    thetaSegments: 8,
    phiSegments: 8,
    thetaStart: 0,
    thetaLength: (Math.PI * 2)
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/ShapeGeometry" target="_blank">ShapeGeometry</a></h4>

```javascript
geometry: {
    type: 'RingGeometry',
    shapes: [],
    curveSegments: 12
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/SphereGeometry" target="_blank">SphereGeometry</a></h4>

```javascript
geometry: {
    type: 'SphereGeometry',
    radius: 1,
    widthSegments: 8,
    heightSegments: 6,
    phiStart: 0,
    phiLength: (Math.PI * 2),
    thetaStart: 0,
    thetaLength: (Math.PI)
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/TetrahedronGeometry" target="_blank">TetrahedronGeometry</a></h4>

```javascript
geometry: {
    type: 'TetrahedronGeometry',
    radius: 1,
    detail: 1
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/TextGeometry" target="_blank">TextGeometry</a></h4>

```javascript
geometry: {
    type: 'TextGeometry',
    text: 'Text',
    parameters: {
      font: null,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    }
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/TorusGeometry" target="_blank">TorusGeometry</a></h4>

```javascript
geometry: {
    type: 'TorusGeometry',
    radius: 1,
    tube: .4,
    radialSegments: 8,
    tubularSegments: 6,
    arc: (Math.PI * 2)
}
 ``` 


<h4> <a href="https://threejs.org/docs/#api/en/geometries/TorusKnotGeometry" target="_blank">TorusKnotGeometry</a></h4>

```javascript
geometry: {
    type: 'TorusKnotGeometry',
    radius: 1,
    tube: .4,
    tubularSegments: 64,
    radialSegments: 8,
    p: 2,
    q: 3
}
 ``` 

<h4> <a href="https://threejs.org/docs/#api/en/geometries/TubeGeometry" target="_blank">TubeGeometry</a></h4>

```javascript
geometry: {
    type: 'TubeGeometry',
    path: null,
    tubularSegments: 64,
    radius: 1,
    radialSegments: 8,
    closed: false
}
 ``` 



</details>




#Angular


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

