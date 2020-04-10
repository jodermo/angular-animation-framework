import { Component, ElementRef, Renderer2 } from '@angular/core';
import {
  ThreeAnimationComponent
} from '../three-animation/three-animation.component';
import {
  AnimationObject,
  AnimationObjectOptions,
} from '../three-animation/classes/animation-object';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { DemoPresets } from '../three-animation/presets/demo-presets';
import { AudioAnimationPresets } from './presets/audio-animation-presets';
import { CarsPresets } from './presets/cars-presets';
import { RandomObjectsPreset } from './presets/random-objects-presets';
import { AudioAnalyzer } from '../three-animation/services/audio.service';
import * as THREE from 'three';
import { TreesPresets } from './presets/trees-presets';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

@Component({
  selector: 'app-audio-animation-demo',
  templateUrl: '../three-animation/three-animation.component.html',
  styleUrls: ['../three-animation/three-animation.component.css']
})
export class AudioAnimationDemoComponent extends ThreeAnimationComponent {
  controlPanel = false;
  infoPanel = false;
  demoVideo: AnimationObject;
  musicTrack;
  car: any;
  delorean: any;
  street: AnimationObject;
  ground: AnimationObject;
  sky: AnimationObject;
  skyline: AnimationObject;
  sun: AnimationObject;
  directionalLightWhite: AnimationObject;
  directionalLightOrange: AnimationObject;
  pointLight: AnimationObject;
  audioAnalyzer: AudioAnalyzer;
  audioAni;
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
  carPosition = 0;
  animationSettings = {
    particles: true,
    gain: 1.25,
    speedReaction: 1,
    speed: {
      tireRotation: 1.5,
      ground: .01,
      street: .004,
      objects: 1,
      total: 2
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

  constructor(public elementRef: ElementRef, public renderer2: Renderer2) {
    super(elementRef, renderer2);
  }

  init() {
    this.animation.bindPresets('demo', DemoPresets);
    this.animation.bindPresets('audio-animation', AudioAnimationPresets);
    this.animation.bindPresets('trees', TreesPresets);
    this.animation.bindPresets('cars', CarsPresets);
    this.animation.bindPresets('random-objects', RandomObjectsPreset);
    this.animation.postProcessing.renderPasses = [
      {name: 'AfterimagePass', pass: AfterimagePass, type: 'AfterimagePass', attributes: [.75]},
      {
        name: 'RGBShiftShader',
        pass: ShaderPass,
        type: 'ShaderPass',
        attributes: [RGBShiftShader],
        uniforms: [['amount', 'value', 0.5]]
      },
      {name: 'UnrealBloomPass', pass: UnrealBloomPass, type: 'UnrealBloomPass', attributes: [10, .5, .025, 0.5, 0.2]},
      {
        name: 'GammaCorrectionShader',
        pass: ShaderPass,
        type: 'ShaderPass',
        attributes: [GammaCorrectionShader]
      },
      {
        name: 'FilmPass',
        pass: FilmPass,
        type: 'FilmPass',
        attributes: [10, .5, 1200, false],
        options: {renderToScreen: true}
      },
      {name: 'GlitchPass', pass: GlitchPass, type: 'GlitchPass', attributes: [], options: {goWild: true},},

    ];
  }

  start() {
    this.setupAudio();
    this.setupWorld();
    this.setupLights();
    this.setupCameras();
    this.setupTrees();
    this.setupMisc();
    this.setupCar();
    this.setupRandomObjects();
  }

  frameChange() {
    this.animation.frame += this.animationSettings.speed.total - 1;
    this.updateAnimationSpeed();
    this.animateGround();
    this.animateCar();
    this.animateRandomObjects();
    this.cameraSwitchOnFrequency();
    this.animateRenderPasses();
  }

  setupAudio() {
    if (this.musicTrack) {
      this.musicTrack.pause();
    }

    if (window['radio'] && window['radio'].audio) {
      this.musicTrack = window['radio'].audio;
    } else {
      this.animation.loadAudio('demo', 'assets/audios/No Generation - Give Me Your Soul.mp3', {loop: true});
      this.musicTrack = this.animation.audio('demo');
      this.musicTrack.play();
    }
    this.audioAnalyzer = this.animation.audioService.analyzer(this.musicTrack);
    this.audioAni = this.audioAnimation(this.audioAnalyzer);
    // const audioCanvas: HTMLElement = document.getElementById('audioCanvas');
    // this.audioAnalyzer.setCanvas(audioCanvas as HTMLCanvasElement);

  }

  setupWorld() {
    this.sky = this.animation.createPresetObject('audio-animation', 'sky');
    this.ground = this.animation.createPresetObject('audio-animation', 'ground');
    this.street = this.animation.createPresetObject('audio-animation', 'street');
    this.skyline = this.animation.createPresetObject('audio-animation', 'skyline');
    this.sun = this.animation.createObject('canvas', {
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
    this.directionalLightWhite = this.animation.createPresetObject('audio-animation', 'directional-light');
    this.directionalLightOrange = this.animation.createPresetObject('audio-animation', 'directional-light-orange');
    this.pointLight = this.animation.createPresetObject('audio-animation', 'point-light');

  }

  setupCameras() {
    this.mainCamera = this.animation.createObject('camera', {
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

    this.sideCameraRight = this.animation.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 10,
        y: 15,
        z: -100
      }
    } as AnimationObjectOptions);
    this.sideCameraRight.lookAt({x: 0, y: 0, z: 0});
    this.cameras.push(this.sideCameraRight);

    this.sideCameraLeft = this.animation.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 10,
        y: 15,
        z: 100
      }
    } as AnimationObjectOptions);
    this.sideCameraLeft.lookAt({x: 0, y: 0, z: 0});
    this.cameras.push(this.sideCameraLeft);

    this.driverCamera = this.animation.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 8,
        y: 20,
        z: 7
      }
    } as AnimationObjectOptions);
    this.cameras.push(this.driverCamera);
    this.driverCamera.object.lookAt(1000, 0, 0);


    this.roofCamera = this.animation.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 5,
        y: 30,
        z: 0
      }
    } as AnimationObjectOptions);
    this.cameras.push(this.roofCamera);
    this.roofCamera.object.lookAt(1000, 0, 0);

    this.topCamera1 = this.animation.createObject('camera', {
      camera: this.cameraSettings,
      position: {
        x: 50,
        y: 130,
        z: 0
      }
    } as AnimationObjectOptions);
    this.cameras.push(this.topCamera1);
    this.topCamera1.lookAt(new THREE.Vector3(0, 0, 0));

    this.animation.selectCamera(this.topCamera1);

    this.topCamera2 = this.animation.createObject('camera', {
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
    this.animation.createPresetObject('trees', 'palms', null, (obj) => {
      this.animation.generateChildObjectGroup(obj, ['polySurface262 polySurface141', 'polySurface336'], (childObj) => {
        childObj.setPosition({x: -150, y: 0, z: 200});
        childObj.setScale({x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10, true, obj.options);
        childObj.on('mousedown', () => {
          this.randomObjectClick(obj);
        });
      }, this.animation.scene, false);
      this.animation.generateChildObjectGroup(obj, ['polySurface229 polySurface36', 'polySurface335'], (childObj) => {
        this.animation.scene.add(childObj.object);
        childObj.setPosition({x: -1000, y: 0, z: -300});
        childObj.setScale({x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10, true, obj.options);
        childObj.on('mousedown', () => {
          this.randomObjectClick(obj);
        });
      }, this.animation.scene, false);
      this.animation.generateChildObjectGroup(obj, ['polySurface290 polySurface62', 'polySurface342'], (childObj) => {
        childObj.setPosition({x: -2000, y: 0, z: 250});
        childObj.setScale({x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10, true, obj.options);
        childObj.on('mousedown', () => {
          this.randomObjectClick(obj);
        });
      }, this.animation.scene, false);
      this.animation.generateChildObjectGroup(obj, ['polySurface234 polySurface63', 'polySurface343'], (childObj) => {
        childObj.setPosition({x: -800, y: 0, z: 600});
        childObj.setScale({x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10, true, obj.options);
        childObj.on('mousedown', () => {
          this.randomObjectClick(obj);
        });
      }, this.animation.scene, false);
      this.animation.generateChildObjectGroup(obj, ['polySurface333 polySurface173', 'polySurface339'], (childObj) => {
        childObj.setPosition({x: -1500, y: 0, z: 500});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10, true, obj.options);
        childObj.on('mousedown', () => {
          this.randomObjectClick(obj);
        });
      }, this.animation.scene, false);
      this.animation.generateChildObjectGroup(obj, ['polySurface328 polySurface200', 'polySurface338'], (childObj) => {
        childObj.setPosition({x: -5000, y: 0, z: -500});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 10, true, obj.options);
        childObj.on('mousedown', () => {
          this.randomObjectClick(obj);
        });
      }, this.animation.scene, false);
    })
  }

  setupMisc() {
    const waterTower = this.animation.createPresetObject('audio-animation', 'water_tower', null, (obj) => {
      this.animation.generateChildObjectGroup(obj, ['Water_Tower', 'Legs', 'Tank', 'Base'], (childObj) => {
        childObj.setPosition({x: -1000, y: 0, z: 500});
        childObj.setScale(waterTower.options.scale || {x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 4, true, waterTower.options);
      }, this.animation.scene, false);
    });

    const deer = this.animation.createPresetObject('audio-animation', 'deer', null, (obj) => {
      this.animation.generateChildObjectGroup(obj, ['Deer_type_03_A_body', 'Deer_type_03_A_horns'], (childObj) => {
        childObj.setPosition({x: -1000, y: 0, z: -500});
        childObj.setScale(deer.options.scale || {x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 3, true, deer.options);
      }, this.animation.scene, false);

    });

    const chicken = this.animation.createPresetObject('audio-animation', 'chicken', null, (obj) => {
      this.animation.generateChildObjectGroup(obj, ['chicken_lp'], (childObj) => {
        childObj.setPosition({x: 1000, y: 0, z: -500});
        childObj.setScale(chicken.options.scale || {x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 20, true, chicken.options);
      }, this.animation.scene, false);

    });

    const rotorRotation = (aniObject, duration = 500) => {
      aniObject.rotateTo({
        x: aniObject.object.rotation.x,
        y: Math.PI * 2,
        z: aniObject.object.rotation.z
      }, duration, () => {
        aniObject.setRotation({
          x: aniObject.object.rotation.x,
          y: 0,
          z: aniObject.object.rotation.z
        });
        rotorRotation(aniObject, duration);
      })
    };

    const helicopter = this.animation.createPresetObject('audio-animation', 'helicopter', null, (obj) => {
      this.animation.generateChildObjectGroup(obj, ['Copter', 'Propeller'], (childObj) => {
        const rotor = this.animation.generateChildObjectGroup(obj, ['Propeller_1'], (chilChildObj) => {
          rotorRotation(chilChildObj);
        }, childObj.object, false);
        childObj.options = helicopter.options;
        childObj.setPosition({x: -3200, y: 1000, z: -1500});
        childObj.setRotation({x: 0, y: Math.PI, z: 0});
        childObj.setScale(helicopter.options.scale || {x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        childObj.on('mousedown', () => {
          this.randomObjectClick(obj);
        });
      }, this.animation.scene, false);

    });


    const train = this.animation.createPresetObject('audio-animation', 'silo', null, (obj) => {
      this.animation.generateChildObjectGroup(obj, ["IS06_OBJ_01", "IS06_OBJ_02", "IS06_OBJ_03", "IS06_OBJ_04", "IS06_OBJ_05", "IS06_OBJ_06"], (childObj) => {
        childObj.options = train.options;
        childObj.setPosition({x: -500, y: -1, z: -500});
        childObj.setRotation({x: 0, y: Math.PI / 2, z: 0});
        childObj.setScale(train.options.scale || {x: 4, y: 4, z: 4});
        this.randomObjects.push(childObj);
        this.makeRandomObjectsFrom(childObj, 3, true, train.options);
      }, this.animation.scene, false);

    });
  }

  setupCar() {
    this.animation.createPresetObject('cars', 'delorean', null, (obj) => {
      this.delorean = obj;
      this.delorean.setRotation({x: -(Math.PI / 2), y: 0, z: -(Math.PI / 2)});
      this.delorean.setPosition({x: 0, y: 12, z: 0});
      this.delorean.setScale({x: 2, y: 2, z: 2});
      let particlesFrontL;
      let particlesFrontR;
      let particlesBackL;
      let particlesBackR;
      if (this.animationSettings.particles) {
        this.animation.createObject('particles', {
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
        this.animation.createObject('particles', {
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

        this.animation.createObject('particles', {
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
        this.animation.createObject('particles', {
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

  randomObjectClick(aniObject) {
    aniObject.hide();
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
    const aniObject = this.animation.createPresetObject('random-objects', rObject.name);
    const pos = this.randomObjectPosition(aniObject, rObject.options);
    aniObject.setPosition({x: pos.x, y: pos.y, z: pos.z});
    aniObject.on('mousedown', () => {
      this.randomObjectClick(aniObject);
    });
    if (aniObject) {
      this.randomObjects.push(aniObject);
    }
  }

  makeRandomObjectsFrom(aniObject: AnimationObject, count = 1, randomRotation = true, options = null) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const newAniObject = aniObject.clone(this.animation.scene);
        const pos = this.randomObjectPosition(aniObject, options || aniObject.options);
        newAniObject.setPosition({x: pos.x, y: pos.y, z: pos.z});
        if (randomRotation) {
          newAniObject.object.rotation.set(0, (Math.PI * (Math.random() * 2)), 0);
        }
        if (options && options.scale) {

          if (newAniObject.mesh) {
            newAniObject.mesh.scale.set(options.scale.x, options.scale.y, options.scale.z);
          } else {
            newAniObject.object.scale.set(options.scale.x, options.scale.y, options.scale.z);
          }
        }
        this.randomObjects.push(newAniObject);
      }, i * 10);
    }
  }

  cameraSwitch() {
    if (!this.animation.isControlCamera()) {
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
  }

  randomCamera() {
    if (!this.animation.isControlCamera()) {
      const randomInt = Math.trunc(Math.random() * (this.cameras.length));
      if (this.cameras && this.cameras.length) {
        this.animation.selectCamera(this.cameras[randomInt]);
      }
    }
  }

  moveMainCamera() {
    const minOffset = 50;
    const maxOffset = 150;
    const minDuration = 4000;
    const maxDuration = 16000;
    const randomDuration = this.animation.randomInt(maxDuration, minDuration);
    if (this.mainCamera) {
      this.mainCamera.lookAt({x: 0, y: 0, z: 0});
      this.mainCamera.moveTo({
        x: this.mainCamera.object.position.x,
        y: this.mainCamera.object.position.y,
        z: this.animation.randomInt(maxOffset, minOffset)
      }, randomDuration, () => {
        this.mainCamera.moveTo({
          x: this.mainCamera.object.position.x,
          y: this.mainCamera.object.position.y,
          z: -this.animation.randomInt(maxOffset, minOffset)
        }, randomDuration, () => {
          this.moveMainCamera();
        }, 'Quadratic.InOut');
      }, 'Quadratic.InOut');
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
    const aniObject = this.animation.createObject('Group', {});
    aniObject.setPosition({x: -1000, y: 0, z: 0});
    const initAudioAnimation = (data) => {
      if (data.frequency && data.frequency.values) {
        /* left audio spectrum*/
        for (let i = 0; i < animation.meterNum; i++) {
          const posX = (i * boxSize) + (gap * i) - (totalWidth / 2);
          const boxObject = this.animation.createPresetObject('audio-animation', 'box', aniObject.object);
          boxObject.setPosition({x: posX, y: 0, z: -offsetZ});
          leftItems.boxes.push(boxObject);
          const capTopObject = this.animation.createPresetObject('audio-animation', 'ball', aniObject.object);
          capTopObject.setPosition({x: posX, y: boxSize, z: -offsetZ});
          leftItems.capsTop.push(capTopObject);
          const capBottomObject = this.animation.createPresetObject('audio-animation', 'ball', aniObject.object);
          capBottomObject.setPosition({x: posX, y: -boxSize, z: -offsetZ});
          leftItems.capsBottom.push(capBottomObject);
        }
        /* right audio spectrum*/
        for (let i = 0; i < animation.meterNum; i++) {
          const posX = (i * boxSize) + (gap * i) - (totalWidth / 2);
          const boxObject = this.animation.createPresetObject('audio-animation', 'box', aniObject.object);
          boxObject.setPosition({x: posX, y: 0, z: offsetZ});
          rightItems.boxes.push(boxObject);
          const capTopObject = this.animation.createPresetObject('audio-animation', 'ball', aniObject.object);
          capTopObject.setPosition({x: posX, y: boxSize, z: offsetZ});
          rightItems.capsTop.push(capTopObject);
          const capBottomObject = this.animation.createPresetObject('audio-animation', 'ball', aniObject.object);
          capBottomObject.setPosition({x: posX, y: -boxSize, z: offsetZ});
          rightItems.capsBottom.push(capBottomObject);
        }
      }
      started = true;
    };
    const drawAudioAnimation = (data) => {
      if (!started) {
        initAudioAnimation(data);
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
      drawAudioAnimation(data);
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
    this.carPosition += this.animationSettings.speed.total;
    if (this.car) {
      const rotation = (Math.PI * (this.animationSettings.speed.tireRotation * this.carPosition));
      this.car.tire1.rotateTo({X: 0, y: 0, z: rotation}, 0);
      this.car.tire2.rotateTo({X: 0, y: 0, z: rotation}, 0);
      this.car.tire3.rotateTo({X: 0, y: 0, z: rotation}, 0);
      this.car.tire4.rotateTo({X: 0, y: 0, z: rotation}, 0);
    }
  }

  animateGround() {
    if (this.street) {
      this.ground.materialOffsetTo({
        x: -(this.carPosition * this.animationSettings.speed.ground),
        y: 0
      }, 0);
      this.street.materialOffsetTo({x: -(this.carPosition * this.animationSettings.speed.street), y: 0}, 0);
    }
  }

  animateRandomObjects() {
    if (this.randomObjects) {
      for (const aniObject of this.randomObjects) {
        let speed = 1;
        if (aniObject.options && aniObject.options.speed) {
          speed = aniObject.options.speed;
        }
        let x = aniObject.object.position.x + (this.animationSettings.speed.objects * this.animationSettings.speed.total * speed);
        const y = aniObject.object.position.y;
        let z = aniObject.object.position.z;
        if (x > this.randomObjectSettings.size.x / 2) {
          x = -this.randomObjectSettings.size.x / 2;
          aniObject.show();
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
    const glitchValueA = 280; // 270
    const glitchValueB = 215;

    this.animation.hideRenderPass('GlitchPass');
    if ((this.getAudioFrequencyData(glitchStepA) > glitchValueA / this.animationSettings.gain ||
      this.getAudioFrequencyData(glitchStepB) > glitchValueB / this.animationSettings.gain)) {
      this.animation.showRenderPass('GlitchPass');
      console.log('showRenderPass', 'GlitchPass');
    }
    const afterImageStep = 9;
    const afterImageValue = 180;
    this.animation.hideRenderPass('AfterimagePass');
    if (this.getAudioFrequencyData(afterImageStep) > afterImageValue / this.animationSettings.gain) {
      this.animation.showRenderPass('AfterimagePass');
    }
    const GammaCorrectionStep = 19;
    const GammaCorrectionValue = 180;
    this.animation.hideRenderPass('GammaCorrectionShader');
    if (this.getAudioFrequencyData(GammaCorrectionStep) > GammaCorrectionValue / this.animationSettings.gain) {
      const shaderOn = Math.floor(Math.random() * 1.9);
      if (shaderOn) {
        this.animation.showRenderPass('GammaCorrectionShader');
      }
    }
  }
}
