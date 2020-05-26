import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ThreeAnimationComponent } from '../../three-animation/three-animation.component';
import { Demos } from '../demos.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationObjectOptions } from '../../three-animation/classes/animation-object';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent extends ThreeAnimationComponent {
  demos = Demos;
  titleText = '3D Animations';
  subtitleText = 'Angular & Three.js';
  textGroup;
  textColor = '#fff';
  titleMaterial = {
    type: 'MeshStandardMaterial',
    color: 0xffffff,
    metalness: 1,
    roughness: .5,
  };
  titleParameters = {
    fontSet: ['droid_sans', 'bold'],
    size: 20,
    height: .2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: .5,
    bevelOffset: 1,
    bevelSegments: 2
  };
  textMaterial = {
    type: 'MeshStandardMaterial',
    color: 0xffffff,
    metalness: 1,
    roughness: .5,
  };
  textMaterialHover = {
    type: 'MeshStandardMaterial',
    color: 0x00ff00,
    metalness: 1,
    roughness: .5,
  };
  textParameters = {
    fontSet: ['droid_sans', 'bold'],
    size: 15,
    height: .2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: .5,
    bevelOffset: 1,
    bevelSegments: 2
  };
  textPosition = {x: 0, y: 0, z: 150};
  textRotation = {x: 0, y: (Math.PI / 2), z: 0};
  textOffsetY = 30;

  cameraSettings = {
    type: 'PerspectiveCamera',
    fov: 90,
    new: 1,
    far: 1000000
  };

  mainCamera;

  constructor(public elementRef: ElementRef, public renderer2: Renderer2, private router: Router) {
    super(elementRef, renderer2);
  }


  start() {
    this.setupCamera();
    this.createScene();
    this.createText();

  }

  setupCamera() {
    this.mainCamera = this.animation.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 80,
        y: -11,
        z: 0
      }
    } as AnimationObjectOptions);
    this.mainCamera.lookAt({x: 0, y: 15, z: 0});
    this.animation.selectCamera(this.mainCamera);
  }

  createScene() {
    this.addLight()
  }

  addLight() {
    const directionalLight = this.animation.createObject('DirectionalLight', {
      light: {
        color: '#ffffff',
        castShadow: true,
        intensity: .8,
        distance: 1000,
        decay: 2,
        shadow: {
          radius: 10
        }
      },
      position: {
        x: 200,
        y: 150,
        z: 50
      }
    });
  }

  createText() {
    this.textGroup = this.animation.createObject('group');
    let y = 0;
    const title = this.addTitle(this.titleText, {x: 30, y: 80, z: 0}, this.textGroup);
    let scale = 1.2;
    title.setScale({x: scale, y: scale, z: scale});
    const subtitle = this.addTitle(this.subtitleText, {x: 85, y: 60, z: 0}, this.textGroup);
    scale = .5;
    subtitle.setScale({x: scale, y: scale, z: scale});

    for (const demo of this.demos) {
      const position = demo.position || {x: 0, y: 0, z: 0};
      position.y -= y;
      this.addDemoObject(demo, position, this.textGroup);
      y += this.textOffsetY;
    }
    this.textGroup.setPosition(this.textPosition);
    this.textGroup.setRotation(this.textRotation);
    this.animateTextGroup();
  }

  animateTextGroup() {
    const maxRotation = .003;
    const newRotation = {
      x: this.textRotation.x + this.random(maxRotation),
      y: this.textRotation.y + this.random(maxRotation),
      z: this.textRotation.z + this.random(maxRotation)
    };
    this.textGroup.rotateTo(newRotation, 1500, () => {
      this.animateTextGroup();
    });
  }

  bounce(aniObject, onEnd: any = null) {
    const height = 2, scale = .05, duration = 500;
    if (!aniObject.bouncing) {
      aniObject.bouncing = true;
      if (!aniObject.oldPosition) {
        aniObject.oldPosition = {
          x: aniObject.object.position.x,
          y: aniObject.object.position.y,
          z: aniObject.object.position.z
        };
        aniObject.oldScale = {
          x: aniObject.object.scale.x,
          y: aniObject.object.scale.y,
          z: aniObject.object.scale.z
        };
      }

      const bouncePosition = {
        x: aniObject.oldPosition.x,
        y: aniObject.oldPosition.y + height,
        z: aniObject.oldPosition.z
      };
      aniObject.scaleTo({
        x: aniObject.oldScale.x + scale,
        y: aniObject.oldScale.y + scale,
        z: aniObject.oldScale.z + scale
      }, Math.floor(duration / 2), () => {
        aniObject.scaleTo({
          x: aniObject.oldScale.x,
          y: aniObject.oldScale.y,
          z: aniObject.oldScale.z
        }, Math.floor(duration / 2));
      });
      aniObject.moveTo(bouncePosition, Math.floor(duration / 2), () => {
        aniObject.moveTo(aniObject.oldPosition, Math.floor(duration / 2), () => {
          aniObject.bouncing = false;
          if (aniObject.mouseHover) {
            this.bounce(aniObject, onEnd);
          } else {
            if (onEnd) {
              onEnd();
            }
          }
        });
      });
    }

  }

  addTitle(text, position: any = {x: 0, y: 0, z: 0}, parentObject = this.textGroup) {

    return this.animation.createObject('mesh', {
      material: this.titleMaterial,
      geometry: {
        type: 'TextGeometry',
        text: text,
        parameters: this.titleParameters,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position
    }, parentObject);
  }

  addDemoObject(demo, position: any = {x: 0, y: 0, z: 0}, parentObject = this.textGroup) {
    const scale = {x: 1, y: 1, z: 1};

    if (demo.scale) {
      scale.x = demo.scale;
      scale.y = demo.scale;
      scale.z = demo.scale;
    }

    const demoObject = this.animation.createObject('mesh', {
      material: this.textMaterial,
      geometry: {
        type: 'TextGeometry',
        text: demo.name,
        parameters: this.textParameters,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position,
      scale
    }, parentObject);

    const hoverObject = this.animation.createObject('mesh', {
      material: this.textMaterialHover,
      geometry: {
        type: 'TextGeometry',
        text: demo.name,
        parameters: this.textParameters,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position,
      scale
    }, parentObject);
    hoverObject.hide();

    demoObject['hoverObject'] = hoverObject;

    demoObject.on('mousedown', () => {
      this.showAnimation(demo.alias);
    });
    demoObject.on('mouseover', () => {
      if (demoObject['hoverObject']) {
        demoObject['hoverObject'].show()
        demoObject.hide();
        this.bounce(demoObject['hoverObject'], () => {
          demoObject['hoverObject'].hide()
          demoObject.show();
        });

      }
    });
  }

  showAnimation(name) {
    window.open(name, '_top');
  }

  random(max) {
    return Math.PI * (Math.random() * (max * 2)) - Math.PI * max;
  };
}
