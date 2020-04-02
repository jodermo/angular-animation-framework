import { Component, ElementRef, Renderer2 } from '@angular/core';
import {
  ThreeAnimationComponent
} from '../three-animation/three-animation.component';
import {
  AnimationObject,
  AnimationObjectOptions,
  EasingTypes,
} from '../three-animation/classes/animation-object';


import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader';

import { DemoPresets } from '../three-animation/presets/demo-presets';
import { AudioAnimationPresets } from './presets/audio-animation-presets';
import { CarsPresets } from './presets/cars-presets';
import { RandomObjectsPreset } from './presets/random-objects-presets';
import { AudioAnalyzer } from '../three-animation/services/audio.service';
import * as THREE from 'three';
import { TreesPresets } from './presets/trees-presets';
import { SourceInfos } from './presets/source-infos';

// @ts-ignore
@Component({
  selector: 'app-audio-animation-demo',
  templateUrl: './audio-animation-demo.component.html',
  styleUrls: ['../three-animation/three-animation.component.css']
})
export class AudioAnimationDemoComponent extends ThreeAnimationComponent {
  controlPanel = false;
  infoPanel = false;
  sourceInfos = SourceInfos;
  demoVideo: AnimationObject;
  car: any;
  delorean: any;
  street: AnimationObject;
  ground: AnimationObject;
  sky: AnimationObject;
  skyline: AnimationObject;
  sun: AnimationObject;
  directionalLightWhite: AnimationObject;
  directionalLightOrange: AnimationObject;
  audioAnalyzer: AudioAnalyzer;
  mainCamera: AnimationObject;
  sideCameraRight: AnimationObject;
  sideCameraLeft: AnimationObject;
  driverCamera: AnimationObject;
  roofCamera: AnimationObject;
  topCamera1: AnimationObject;
  topCamera2: AnimationObject;
  sunCanvas = document.createElement('canvas');
  sunCanvasAlpha = document.createElement('canvas');
  cameras = [];
  animationSettings = {
    particles: true,
    gain: 1.25,
    speedReaction: 1,
    speed: {
      ground: .075,
      tireRotation: 1.5,
      objects: 3,
      total: 1
    },
    autoCameraSwitch: {min: 1000, max: 16000},
    timeBetweenCameraSwitch: 1250
  };
  defaultSpeed = this.animationSettings.speed.total;
  cameraSettings = {
    type: 'PerspectiveCamera',
    fov: 90,
    new: 1,
    far: 1000000
  };
  randomObjects = [];
  randomObjectSettings = {
    count: 50,
    offsetZ: 500,
    size: {x: 10000, y: 5000, z: 5000},
    position: {x: 0, y: 0, z: 0}
  };

  cameraSwitchTimeout;
  cameraCanSwitch = true;

  customEvents = {
    pause_video: () => {
      if (this.demoVideo && this.demoVideo.video) {
        if (!this.demoVideo.video.paused) {
          this.demoVideo.video.pause();
        } else {
          this.demoVideo.video.play();
        }
      }
    }
  };


  // tslint:disable-next-line:variable-name
  constructor(public elementRef: ElementRef, public _renderer: Renderer2) {
    super(elementRef, _renderer);
    this.bindPresets('demo', DemoPresets);
    this.bindPresets('audio-animation', AudioAnimationPresets);
    this.bindPresets('trees', TreesPresets);
    this.bindPresets('cars', CarsPresets);
    this.bindPresets('random-objects', RandomObjectsPreset);
    this.postProcessing.renderPasses = [
      {name: 'AfterimagePass', type: 'AfterimagePass', attributes: [.75]},
      {name: 'RGBShiftShader',type: 'ShaderPass', attributes: [RGBShiftShader], uniforms: [['amount', 'value', 0.1]]},
      {name: 'UnrealBloomPass',type: 'UnrealBloomPass', attributes: [10, .5, .025, 0.5, 0.2]},
      {name: 'FilmPass',type: 'FilmPass', attributes: [10, .5, 1200, false], options: {renderToScreen: true}},
      {name: 'GlitchPass',type: 'GlitchPass', attributes: [], options: {goWild: true},},
    ];
  }

  start() {
    this.setupAudio();
    this.setupWorld();
    this.setupLights();
    this.setupCameras();
    this.setupTrees();
    this.setupCar();
    this.setupRandomObjects();
  }

  setupAudio() {
    this.loadAudio('demo', 'assets/audios/No Generation - Give Me Your Soul.mp3', {loop: true});
    const audioCanvas: HTMLElement = document.getElementById('audioCanvas');
    this.audioAnalyzer = this.audioService.analyzer(this.audio('demo'));
    const audioAni = this.audioAnimation(this.audioAnalyzer);
    // this.audioAnalyzer.setCanvas(audioCanvas as HTMLCanvasElement);

    this.playAudio('demo');

  }

  setupWorld() {
    this.sky = this.createPresetObject('audio-animation', 'sky');
    this.ground = this.createPresetObject('audio-animation', 'ground');
    this.street = this.createPresetObject('audio-animation', 'street');
    this.skyline = this.createPresetObject('audio-animation', 'skyline');
    this.sun = this.createObject('canvas', {
      canvas: this.sunCanvas,
      alphaCanvas: this.sunCanvasAlpha,
      material: {
        type: 'MeshBasicMaterial',
        color: '#000',
      },
      size: {
        x: 400000,
        y: 400000
      },
      position: {
        x: -890000,
        y: 16000,
        z: 0
      },
      rotation: {
        x: 0,
        y: Math.PI / 2,
        z: 0
      }
    });
    this.drawSunCanvas();
    if (this.audioAnalyzer) {
      this.audioAnalyzer.on('update', (data) => {
        this.drawSunCanvas(data);
      });
    }
  }

  setupLights() {
    this.directionalLightWhite = this.createPresetObject('audio-animation', 'directional-light');
    this.directionalLightOrange = this.createPresetObject('audio-animation', 'directional-light-orange');
  }

  setupCameras() {

    this.mainCamera = this.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 150,
        y: 50,
        z: 0
      }
    } as AnimationObjectOptions);
    this.mainCamera.lookAt({x: 0, y: 0, z: 0});
    this.cameras.push(this.mainCamera);
    this.moveMainCamera();

    this.sideCameraRight = this.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 10,
        y: 15,
        z: -100
      }
    } as AnimationObjectOptions);
    this.sideCameraRight.lookAt({x: 0, y: 0, z: 0});
    this.cameras.push(this.sideCameraRight);

    this.sideCameraLeft = this.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 10,
        y: 15,
        z: 100
      }
    } as AnimationObjectOptions);
    this.sideCameraLeft.lookAt({x: 0, y: 0, z: 0});
    this.cameras.push(this.sideCameraLeft);

    this.driverCamera = this.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 8,
        y: 20,
        z: 7
      }
    } as AnimationObjectOptions);
    this.cameras.push(this.driverCamera);
    this.driverCamera.object.lookAt(1000, 0, 0);


    this.roofCamera = this.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 5,
        y: 30,
        z: 0
      }
    } as AnimationObjectOptions);
    this.cameras.push(this.roofCamera);
    this.roofCamera.object.lookAt(1000, 0, 0);

    this.topCamera1 = this.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 50,
        y: 130,
        z: 0
      }
    } as AnimationObjectOptions);
    this.cameras.push(this.topCamera1);
    this.topCamera1.lookAt(new THREE.Vector3(0, 0, 0));

    this.selectCamera(this.topCamera1);

    this.topCamera2 = this.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 0,
        y: 90,
        z: 0
      }
    } as AnimationObjectOptions);
    this.cameras.push(this.topCamera2);
    this.topCamera2.lookAt(new THREE.Vector3(0, 0, 0));

    this.cameraSwitch();
  }

  setupTrees() {
    this.createPresetObject('trees', 'palms', null, (obj) => {


      const palms = [];

      this.generateChildObjectGroup(obj, ['polySurface262 polySurface141', 'polySurface336'], (childObj) => {
        childObj.setPosition({x: -150, y: 0, z: 200});
        childObj.setScale({x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10);
      }, this.scene, false);
      this.generateChildObjectGroup(obj, ['polySurface229 polySurface36', 'polySurface335'], (childObj) => {
        this.scene.add(childObj.object);
        childObj.setPosition({x: -1000, y: 0, z: -300});
        childObj.setScale({x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10);
      }, this.scene, false);
      this.generateChildObjectGroup(obj, ['polySurface290 polySurface62', 'polySurface342'], (childObj) => {
        childObj.setPosition({x: -2000, y: 0, z: 250});
        childObj.setScale({x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10);
      }, this.scene, false);
      this.generateChildObjectGroup(obj, ['polySurface234 polySurface63', 'polySurface343'], (childObj) => {
        childObj.setPosition({x: -800, y: 0, z: 600});
        childObj.setScale({x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10);
      }, this.scene, false);
      this.generateChildObjectGroup(obj, ['polySurface333 polySurface173', 'polySurface339'], (childObj) => {
        childObj.setPosition({x: -1500, y: 0, z: 500});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10);
      }, this.scene, false);
      this.generateChildObjectGroup(obj, ['polySurface328 polySurface200', 'polySurface338'], (childObj) => {
        childObj.setPosition({x: -5000, y: 0, z: -500});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10);
      }, this.scene, false);
    })
  }

  setupCar() {
    this.createPresetObject('cars', 'delorean', null, (obj) => {
      this.delorean = obj;
      this.delorean.setRotation({x: -(Math.PI / 2), y: 0, z: -(Math.PI / 2)});
      this.delorean.setPosition({x: 0, y: 12, z: 0});
      this.delorean.setScale({x: 2, y: 2, z: 2});
      let particlesFrontL;
      let particlesFrontR;
      let particlesBackL;
      let particlesBackR;
      if (this.animationSettings.particles) {
        this.createObject('particles', {
          particles: {
            count: 300,
            startRange: .5,
            endRange: 20,
            emitDelay: 250,
            size: 10,
            sprite: 'assets/images/sprites/cloud_2.png',
            gravity: {
              x: .1,
              y: .075,
              z: -.05
            },
            velocity: {
              x: .05,
              y: .05,
              z: .05
            }
          },
          position: {
            x: 5, // left right
            y: -15, // front rare
            z: -3 // top bottom
          }
        }, this.delorean.object, (pObj) => {
          particlesFrontL = pObj;
        });
        this.createObject('particles', {
          particles: {
            count: 300,
            startRange: .5,
            endRange: 20,
            emitDelay: 250,
            size: 10,
            sprite: 'assets/images/sprites/cloud_2.png',
            gravity: {
              x: -.1,
              y: .075,
              z: -.05
            },
            velocity: {
              x: -.05,
              y: .05,
              z: .05
            }
          },
          position: {
            x: -5, // left right
            y: -15, // front rare
            z: -3 // top bottom
          }
        }, this.delorean.object, (pObj) => {
          particlesFrontR = pObj;
        });

        this.createObject('particles', {
          particles: {
            count: 300,
            startRange: .5,
            endRange: 20,
            emitDelay: 250,
            size: 10,
            sprite: 'assets/images/sprites/cloud_2.png',
            gravity: {
              x: .1,
              y: .075,
              z: -.05
            },
            velocity: {
              x: .05,
              y: .05,
              z: .05
            }
          },
          position: {
            x: 5, // left right
            y: 3, // front rare
            z: -3 // top bottom
          }
        }, this.delorean.object, (pObj) => {
          particlesBackL = pObj;
        });
        this.createObject('particles', {
          particles: {
            count: 300,
            startRange: .5,
            endRange: 20,
            emitDelay: 250,
            size: 10,
            sprite: 'assets/images/sprites/cloud_2.png',
            gravity: {
              x: -.1,
              y: .075,
              z: -.05
            },
            velocity: {
              x: -.05,
              y: .05,
              z: .05
            }
          },
          position: {
            x: -5, // left right
            y: 3, // front rare
            z: -3 // top bottom
          }
        }, this.delorean.object, (pObj) => {
          particlesBackR = pObj;
        });
      }

    });

    /*
     this.createPresetObject('cars', 'mercedes-190-sl', null, (obj) => {
      let tire1;
      let tire2;
      let tire3;
      let tire4;
      let extParticlesLeft;
      let extParticlesRight;
      // const frontLightLeft = this.createPresetObject('cars', 'front-light-left', obj.object);
      // frontLightLeft.lookAt({x: 0, y: 1000, z: 0});
      // const frontLightRight = this.createPresetObject('cars', 'front-light-right', obj.object);
      if (this.animationSettings.particles) {
        this.createObject('particles', {
          particles: {
            count: 300,
            startRange: 1,
            endRange: 500,
            emitDelay: 200,
            size: 10,
            sprite: 'assets/images/sprites/cloud_1.png',
            gravity: {
              x: 2,
              y: 0,
              z: 0
            },
            velocity: {
              x: 0,
              y: .25,
              z: .25
            }
          },
          position: {
            x: 84,
            y: 11,
            z: 10
          }
        }, obj.object, (pObj) => {
          extParticlesLeft = pObj;
        });


        this.createObject('particles', {
          particles: {
            count: 300,
            startRange: 1,
            endRange: 500,
            emitDelay: 200,
            size: 10,
            sprite: 'assets/images/sprites/cloud_1.png',
            gravity: {
              x: 2,
              y: 0,
              z: 0
            },
            velocity: {
              x: 0,
              y: .25,
              z: .25
            }
          },
          position: {
            x: 84,
            y: 11,
            z: -10
          }
        }, obj.object, (pObj) => {
          extParticlesRight = pObj;
        });
      }
      ;
      this.generateChildObjectGroup(obj, ['Z3_tyre1', 'Z3_wheel1(1)', 'Z3_wheel1(2)', 'Z3_wheel1(3)'], (childObj) => {
        tire1 = childObj;
      });
      this.generateChildObjectGroup(obj, ['Z3_tyre2', 'Z3_wheel2(1)', 'Z3_wheel2(2)', 'Z3_wheel2(3)'], (childObj) => {
        tire2 = childObj;
      });
      this.generateChildObjectGroup(obj, ['Z3_tyre3', 'Z3_wheel3(1)', 'Z3_wheel3(2)', 'Z3_wheel3(3)'], (childObj) => {
        tire3 = childObj;
      });
      this.generateChildObjectGroup(obj, ['Z3_tyre4', 'Z3_wheel4(1)', 'Z3_wheel4(2)', 'Z3_wheel4(3)'], (childObj) => {
        tire4 = childObj;
      });
      obj.setScale({x: .5, y: .5, z: .5});


      setTimeout(() => {
        tire1.setPosition({x: -47, y: 13, z: 28});
        tire2.setPosition({x: -47, y: 13, z: -28});
        tire3.setPosition({x: 49, y: 13, z: 28});
        tire4.setPosition({x: 49, y: 13, z: -28});
        this.car = {body: obj, tire1, tire2, tire3, tire4, extParticlesLeft};
      }, 500);

    });

     */


  }

  setupRandomObjects() {
    for (let i = 0; i < this.randomObjectSettings.count; i++) {
      this.addRandomObject();
    }
  }

  randomObjectPosition(aniObject, options) {
    const x = (Math.random() * this.randomObjectSettings.size.x) - (this.randomObjectSettings.size.x / 2);
    let y = 0;
    if (options && (options as any).position) {
      y = (options as any).position.y;
    }
    const offsetSize = (this.randomObjectSettings.size.y - this.randomObjectSettings.offsetZ * 2);
    let z = (Math.random() * offsetSize) - (offsetSize / 2);
    if (z <= 0) {
      z -= this.randomObjectSettings.offsetZ;
      if (aniObject.mesh) {
        aniObject.mesh.rotation.set(0, 0, 0);
      }
    } else {
      z += this.randomObjectSettings.offsetZ;
      if (aniObject.mesh) {
        aniObject.mesh.rotation.set(0, Math.PI, 0);
      }
    }
    return {x, y, z};
  }

  addRandomObject() {
    const radomInt = Math.trunc(Math.random() * (RandomObjectsPreset.length));
    const rObject = RandomObjectsPreset[radomInt];
    const aniObject = this.createPresetObject('random-objects', rObject.name);
    const pos = this.randomObjectPosition(aniObject, rObject.options);
    aniObject.setPosition({x: pos.x, y: pos.y, z: pos.z});
    if (aniObject) {
      this.randomObjects.push(aniObject);
    }
  }

  makeRandomObjectsFrom(aniObject: AnimationObject, count = 1, randomRotation = true) {
    for (let i = 0; i < count; i++) {
      const newAniObject = aniObject.clone(this.scene);
      const pos = this.randomObjectPosition(aniObject, aniObject.options);
      newAniObject.setPosition({x: pos.x, y: pos.y, z: pos.z});
      if (randomRotation) {
        aniObject.object.rotation.set(0, (Math.PI * (Math.random() * 2)), 0);
      }
      this.randomObjects.push(newAniObject);
    }
  }

  cameraSwitch() {
    const minTime = this.animationSettings.autoCameraSwitch.min;
    const maxTime = this.animationSettings.autoCameraSwitch.max;
    const nextSwitchIn = minTime + Math.trunc((Math.random() * (maxTime - minTime)));
    if (this.animationSettings.autoCameraSwitch && this.cameraCanSwitch) {
      this.cameraCanSwitch = false;
      this.randomCamera();
      if (this.cameraSwitchTimeout) {
        clearTimeout(this.cameraSwitchTimeout);
      }
      this.cameraSwitch();
      setTimeout(() => {
        this.cameraCanSwitch = true;
      }, this.animationSettings.timeBetweenCameraSwitch);
    }
    this.cameraSwitchTimeout = setTimeout(() => {
      this.cameraSwitch();
    }, nextSwitchIn);
  }

  randomCamera() {
    const randomInt = Math.trunc(Math.random() * (this.cameras.length));
    if (this.cameras && this.cameras.length) {
      this.selectCamera(this.cameras[randomInt]);
    }
  }

  moveMainCamera() {
    const minOffset = 50;
    const maxOffset = 150;
    const minDuration = 4000;
    const maxDuration = 16000;
    const randomDuration = this.randomInt(maxDuration, minDuration);
    if (this.mainCamera) {
      this.mainCamera.lookAt({x: 0, y: 0, z: 0});
      this.mainCamera.moveTo({
        x: this.mainCamera.object.position.x,
        y: this.mainCamera.object.position.y,
        z: this.randomInt(maxOffset, minOffset)
      }, randomDuration, 'Quadratic.InOut', () => {
        this.mainCamera.moveTo({
          x: this.mainCamera.object.position.x,
          y: this.mainCamera.object.position.y,
          z: -this.randomInt(maxOffset, minOffset)
        }, randomDuration, 'Quadratic.InOut', () => {
          this.moveMainCamera();
        });
      });
    }

  }

  audioAnimation(analyzer) {
    let started = false;
    const gap = 2;
    const offsetZ = 5000;
    const multiply = 40;

    const animation = {
      width: 20,
      height: 10,
      meterWidth: 1,
      gap: 50,
      capHeight: 10000,
      capStyle: '#fff',
      meterNum: 800 / (10 + 2),
      vAlign: 'center',
      capYPositionArray: []
    };
    const leftItems = {
      boxes: [],
      capsTop: [],
      capsBottom: []
    };
    const rightItems = {
      boxes: [],
      capsTop: [],
      capsBottom: []

    };
    const boxSize = 200;
    const totalWidth = boxSize * animation.meterNum + gap * (animation.meterNum - 1);
    const aniObject = this.createObject('Group', {});
    aniObject.setPosition({x: -1000, y: 0, z: 0});
    const initAnimation = (data) => {
      if (data.frequency && data.frequency.values) {
        /* left audio spectrum*/
        for (let i = 0; i < animation.meterNum; i++) {
          const posX = (i * boxSize) + (gap * i) - (totalWidth / 2);
          const boxObject = this.createPresetObject('audio-animation', 'box', aniObject.object);
          boxObject.setPosition({x: posX, y: 0, z: -offsetZ});
          leftItems.boxes.push(boxObject);
          const capTopObject = this.createPresetObject('audio-animation', 'ball', aniObject.object);
          capTopObject.setPosition({x: posX, y: boxSize, z: -offsetZ});
          leftItems.capsTop.push(capTopObject);
          const capBottomObject = this.createPresetObject('audio-animation', 'ball', aniObject.object);
          capBottomObject.setPosition({x: posX, y: -boxSize, z: -offsetZ});
          leftItems.capsBottom.push(capBottomObject);
        }
        /* right audio spectrum*/
        for (let i = 0; i < animation.meterNum; i++) {
          const posX = (i * boxSize) + (gap * i) - (totalWidth / 2);
          const boxObject = this.createPresetObject('audio-animation', 'box', aniObject.object);
          boxObject.setPosition({x: posX, y: 0, z: offsetZ});
          rightItems.boxes.push(boxObject);
          const capTopObject = this.createPresetObject('audio-animation', 'ball', aniObject.object);
          capTopObject.setPosition({x: posX, y: boxSize, z: offsetZ});
          rightItems.capsTop.push(capTopObject);
          const capBottomObject = this.createPresetObject('audio-animation', 'ball', aniObject.object);
          capBottomObject.setPosition({x: posX, y: -boxSize, z: offsetZ});
          rightItems.capsBottom.push(capBottomObject);
        }
      }
      started = true;
    };
    const drawAnimation = (data) => {
      if (!started) {
        initAnimation(data);
      } else {
        const array = new Uint8Array(this.audioAnalyzer.analyser.frequencyBinCount);
        this.audioAnalyzer.analyser.getByteFrequencyData(array);
        const step = Math.round(array.length / animation.meterNum);

        for (let i = 0; i < animation.meterNum; i++) {
          const value = array[i * step] / 10;
          const posX = (i * boxSize) + (gap * i) - (totalWidth / 2);
          if (animation.capYPositionArray.length < Math.round(animation.meterNum)) {
            animation.capYPositionArray.push(value);
          }
          if (value < animation.capYPositionArray[i]) {
            if (leftItems.capsTop[i]) {
              leftItems.capsTop[i].setPosition({
                x: posX,
                y: (boxSize / 2) + (--animation.capYPositionArray[i] * multiply),
                z: -offsetZ
              });
              rightItems.capsTop[i].setPosition({
                x: posX,
                y: (boxSize / 2) + (--animation.capYPositionArray[i] * multiply),
                z: offsetZ
              });
            }
            if (leftItems.capsBottom[i]) {
              leftItems.capsBottom[i].setPosition({
                x: posX,
                y: -(boxSize / 2) - (--animation.capYPositionArray[i] * multiply),
                z: -offsetZ
              });
              rightItems.capsBottom[i].setPosition({
                x: posX,
                y: -(boxSize / 2) - (--animation.capYPositionArray[i] * multiply),
                z: offsetZ
              });
            }
          } else {
            if (leftItems.capsTop[i]) {
              leftItems.capsTop[i].setPosition({x: posX, y: (boxSize / 2) + value * multiply, z: -offsetZ});
              rightItems.capsTop[i].setPosition({x: posX, y: (boxSize / 2) + value * multiply, z: offsetZ});
            }
            if (leftItems.capsBottom[i]) {
              leftItems.capsBottom[i].setPosition({x: posX, y: -(boxSize / 2) - value * multiply, z: -offsetZ});
              rightItems.capsBottom[i].setPosition({x: posX, y: -(boxSize / 2) - value * multiply, z: offsetZ});
            }
            animation.capYPositionArray[i] = value;
          }
          if (leftItems.boxes[i]) {
            const scaleY = value + 1;
            leftItems.boxes[i].setScale({x: 1, y: scaleY, z: 1});
            rightItems.boxes[i].setScale({x: 1, y: scaleY, z: 1});
          }
        }
      }
    };
    analyzer.on('update', (data) => {
      // console.log('Audio Data', data);
      drawAnimation(data);
    });
    return aniObject;
  }

  getAudioFrequencyData(step = 0) {
    if (this.audioAnalyzer && this.audioAnalyzer.frequency && this.audioAnalyzer.frequency.values[step]) {
      return this.audioAnalyzer.frequency.values[step];
    }
    return 0;
  }

  drawSunCanvas(analyzerData = null) {
    const size = 1024;

    function randInt(min, max = null) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      // tslint:disable-next-line:no-bitwise
      const result = Math.random() * (max - min) + min | 0;
      return result;
    }

    const ctx = this.sunCanvas.getContext('2d');
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, '#ffca00');
    gradient.addColorStop(.33, '#ff6700');
    gradient.addColorStop(1, '#ff0050');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (analyzerData && analyzerData.frequency) {
      const offsetY = ctx.canvas.height / analyzerData.frequency.values.length;
      const lineSize = .5;
      for (let i = 0; i < analyzerData.frequency.values.length; i += 2) {
        const value = analyzerData.frequency.values[i];
        const lineHeight = Math.trunc(Math.abs(value * lineSize));
        const posY = Math.trunc(Math.abs(offsetY * i));
        let alpha = Math.trunc(Math.abs(value / 100));
        if (alpha > 1) {
          alpha = 1;
        }
        if (lineHeight) {
          ctx.fillStyle = '#ffca00';
          ctx.fillRect(0, posY, size, lineHeight);
        }
      }
    }

    const ctxAlpha = this.sunCanvasAlpha.getContext('2d');
    ctxAlpha.canvas.width = size;
    ctxAlpha.canvas.height = size;
    ctxAlpha.fillStyle = '#000';
    ctxAlpha.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctxAlpha.fillStyle = '#fff';
    ctxAlpha.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, size / 2, 0, Math.PI * 2);
    ctxAlpha.fill();


    if (analyzerData && analyzerData.frequency) {
      const offsetY = ctxAlpha.canvas.height / analyzerData.frequency.values.length;
      const lineSize = .1;
      for (let i = 0; i < analyzerData.frequency.values.length; i += 2) {
        const value = analyzerData.frequency.values[i];
        const lineHeight = Math.trunc(Math.abs(value * lineSize));
        const posY = ctxAlpha.canvas.height - Math.trunc(Math.abs(offsetY * i));
        let alpha = Math.trunc(Math.abs(value / 75));
        if (alpha > 1) {
          alpha = 1;
        }
        if (lineHeight) {
          ctxAlpha.fillStyle = 'rgba(0,0,0,' + alpha + ')';
          ctxAlpha.fillRect(0, posY, size, lineHeight);
        }
      }
    }

    if (this.sun && this.sun.mesh && this.sun.mesh.material && this.sun.mesh.material.map) {
      this.sun.mesh.material.map.needsUpdate = true;
      if (this.sun && this.sun.mesh && this.sun.mesh.material && this.sun.mesh.material.alphaMap) {
        this.sun.mesh.material.alphaMap.needsUpdate = true;
      }
    }
  }

  cameraSwitchOnFrequency() {
    const step = 0;
    const value = 220;
    if (this.getAudioFrequencyData(step) > value / this.animationSettings.gain) {
      this.cameraSwitch();
    }

  }

  updateAnimationSpeed() {
    const step = 22;
    let value = this.getAudioFrequencyData(step) / 1000;
    if (value < 0) {
      value = 0;
    }
    this.animationSettings.speed.total = this.defaultSpeed + ((value / this.animationSettings.gain * this.animationSettings.speedReaction));
  }

  animateCar() {
    if (this.car) {
      const rotation = (Math.PI * (this.animationSettings.speed.tireRotation * this.animationSettings.speed.total * this.frame));
      this.car.tire1.rotateTo({X: 0, y: 0, z: rotation}, 0);
      this.car.tire2.rotateTo({X: 0, y: 0, z: rotation}, 0);
      this.car.tire3.rotateTo({X: 0, y: 0, z: rotation}, 0);
      this.car.tire4.rotateTo({X: 0, y: 0, z: rotation}, 0);
    }
  }

  animateGround() {
    if (this.street) {
      this.ground.materialOffsetTo({
        x: -(this.animationSettings.speed.ground * this.frame) * 3,
        y: 0
      }, 0);
      this.street.materialOffsetTo({x: -(this.animationSettings.speed.ground * this.frame), y: 0}, 0);
    }
  }

  animateRandomObjects() {
    if (this.randomObjects) {
      for (const aniObject of this.randomObjects) {
        let x = aniObject.object.position.x + (this.animationSettings.speed.objects * this.animationSettings.speed.total) / this.animationSettings.gain;
        const y = aniObject.object.position.y;
        let z = aniObject.object.position.z;
        if (x > this.randomObjectSettings.size.x / 2) {
          x = -this.randomObjectSettings.size.x / 2;
          const offsetSize = (this.randomObjectSettings.size.y - this.randomObjectSettings.offsetZ * 2);
          z = (Math.random() * offsetSize) - (offsetSize / 2);
          if (z <= 0) {
            z -= this.randomObjectSettings.offsetZ;
            if (aniObject.mesh) {
              aniObject.mesh.rotation.set(0, 0, 0);
            }
          } else {
            z += this.randomObjectSettings.offsetZ;
            if (aniObject.mesh) {
              aniObject.mesh.rotation.set(0, Math.PI, 0);
            }
          }
        }
        aniObject.setPosition({x, y, z});
      }
    }

  }

  animateRenderPasses() {
    const glitchStepA = 1;
    const glitchStepB = 19;
    const glitchValueA = 140;
    const glitchValueB = 120;
    if (this.cameraCanSwitch &&
      (this.getAudioFrequencyData(glitchStepA) > glitchValueA / this.animationSettings.gain ||
        this.getAudioFrequencyData(glitchStepB) > glitchValueB / this.animationSettings.gain)) {
      this.showRenderPass('GlitchPass');
    } else {
      this.hideRenderPass('GlitchPass');
    }
    const afterImageStep = 9;
    const afterImageValue = 50;
    if (this.cameraCanSwitch && this.getAudioFrequencyData(afterImageStep) > afterImageValue / this.animationSettings.gain) {
      this.showRenderPass('AfterimagePass');
    } else {
      this.hideRenderPass('AfterimagePass');
    }
  }

  animateFrame() {
    this.frame += this.animationSettings.speed.total - 1;
    this.updateAnimationSpeed();
    this.animateGround();
    this.animateCar();
    this.animateRandomObjects();
    this.cameraSwitchOnFrequency();
    this.animateRenderPasses();
  }


}
