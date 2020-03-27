import { Component, Input, Output, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { AnimationObjectOptions, AnimationObject, AnimationPreset } from './classes/animation-object';
import { ThreeVrService } from './services/three-vr.service';
import { AudioService } from './services/audio.service';

import * as THREE from 'three';
import * as Physijs from 'physijs-webpack';
import * as Stats from 'stats-js';
import TWEEN from '@tweenjs/tween.js';
import CameraControls from 'camera-controls';
import { OrbitControls } from 'three-orbitcontrols-ts';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';






(window as any).THREE = THREE;
CameraControls.install({THREE});

@Component({
  selector: 'app-three-animation',
  templateUrl: './three-animation.component.html',
  styleUrls: ['./three-animation.component.css']
})
export class ThreeAnimationComponent implements OnInit, OnDestroy, AfterViewInit {

  // tslint:disable-next-line:variable-name
  constructor(public elementRef: ElementRef, public _renderer: Renderer2) {
  }

  @ViewChild('animationContainer', {static: false}) containerElement: ElementRef;
  @Input() fps = 60;
  @Input() frame = 0;
  @Input() speed = 1;
  @Input() duration = 0;
  @Input() controls = 'default';
  @Input() statsVisible = true;
  @Input() showHelper = false;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpdate = new EventEmitter<number>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFrameChange = new EventEmitter<number>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onEnd = new EventEmitter<number>();
  container: HTMLElement;
  mouse: any = new THREE.Vector2();
  controlPanel = true;

  scene;
  sceneCSS;
  renderer;
  rendererCSS;
  camera;
  cameraControls;
  stats;
  clock = new THREE.Clock();

  width;
  height;
  viewportMode = 'landscape';

  loading = true;
  started = false;
  paused = false;
  inactive = false;

  composer;
  renderPass;
  renderPasses = {};
  renderPassTypes = {
    RenderPass,
    ShaderPass,
    GlitchPass,
    BloomPass,
    FilmPass,
    UnrealBloomPass,
    AfterimagePass
  };
  grid;
  raycaster;
  loadingManager: THREE.LoadingManager = new THREE.LoadingManager();


  time: any = TWEEN.now();
  animationTime = {
    frame: this.frame,
    time: Date.now(),
  };
  renderTime = 0;
  renderNow = 1;
  renderThen = 0;
  deltaTime = 0;

  updateDelay = 10;
  updateTimeout;

  gravity = {x: 0, y: 0, z: 0};

  fonts = {};
  embedFonts = [
    {alias: 'droid_sans', name: 'droid_sans', weight: 'bold'},
    {alias: 'helvetiker', name: 'helvetiker', weight: 'regular'}
  ];
  postProcessing = {
    renderPasses: [] // e.g: {type: 'FilmPass', attributes: [0.35, 0.025, 648, false], options: {renderToScreen: true}}
  };
  preloadAssetCount = 0;


  objects: AnimationObject[] = [];
  objectsToCreate = 0;
  meshes = [];
  videos = {};
  audios = {};
  presets = {};

  customEvents = {};

  vrService: ThreeVrService;
  audioService: AudioService = new AudioService();


  ngOnInit(): void {
    window.addEventListener('beforeunload', (e) => {
      this.destroy();
    });
    window.addEventListener('resize', () => {
      this.updateView();
    });

  }

  ngOnDestroy(): void {
    this.destroy();
  }

  ngAfterViewInit() {
    this.container = this.containerElement.nativeElement;

    const keysdown = {};

    document.body.addEventListener('keydown', (event) => {
      if (!(event.key in keysdown)) {
        keysdown[event.key] = true;
        this.onKeyDown(event);
      }
    });
    document.body.addEventListener('keyup', (event) => {
      delete keysdown[event.key];
      this.onKeyUp(event);
    });

    this.container.addEventListener('resize', () => {
      this.updateView();
    });
    this.initThree(() => {

    });
  }

  onKeyDown(event) {
    for (const object of this.objects) {
      if (object.callbacks.keydown) {
        for (const callback of object.callbacks.keydown) {
          callback(event);
        }
      }
    }
  }

  onKeyUp(event) {
    for (const object of this.objects) {
      if (object.callbacks.keyup) {
        for (const callback of object.callbacks.keyup) {
          callback(event);
        }
      }
    }
  }

  initVr() {
    this.vrService = new ThreeVrService();
    this.vrService.init((this.scene as any), this.renderer, this.raycaster, this.camera);
  }

  vrMode() {
    if (this.vrService) {
      this.vrService.startVrMode();
    }
  }

  initThree(success: any = false) {

    this.scene = new Physijs.Scene();

    // this.scene = new THREE.Scene();

    this.scene.setGravity(new THREE.Vector3(
      this.gravity.x || 0,
      this.gravity.y || 0,
      this.gravity.z || 0,
    ));
    this.camera = new THREE.PerspectiveCamera(45, this.viewSize().width / this.viewSize().height, 1, 100000);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));


    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMapSoft = true;

    this.renderer.setSize(this.viewSize().width, this.viewSize().height);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.zIndex = 1;
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.left = 0;
    // this.renderer.shadowMapEnabled = false;
    //   this.renderer.localClippingEnabled = true;
    this.renderer.sortObjects = true;
    //   this.renderer.autoClear = false;
    this.renderer.setClearColor(new THREE.Color(0x000000), 0);
    this.renderer.clear();

    if (this.controls === 'default') {
      this.cameraControls = new CameraControls(this.camera, this.container);
    } else if (this.controls === 'orbit') {
      this.cameraControls = new OrbitControls(this.camera, this.container);
    }


    this.rendererCSS = new CSS3DRenderer();

    this.rendererCSS.setSize(this.viewSize().width, this.viewSize().height);
    this.rendererCSS.domElement.style.position = 'absolute';
    this.rendererCSS.domElement.style.zIndex = 2;
    this.rendererCSS.domElement.style.top = 0;
    this.rendererCSS.domElement.style.left = 0;

    this.container.innerHTML = null;
    this._renderer.appendChild(this.container, this.renderer.domElement);
    if (this.rendererCSS) {
      this._renderer.appendChild(this.container, this.rendererCSS.domElement);
    }
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster();
    }
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onError = (url) => console.error('there was an error loading: ' + url);
    this.preloadFonts()
      .then(() => {
        this.createScene();
        this.initPostProcessing();
        this.updateView();
        setTimeout(() => {
          this.started = true;
          this.initVr();
          setTimeout(() => {
            this.inactive = true;
            this.start();
            this.checkLoading();
          }, 0);
        }, 0);
        if (success) {
          success();
        }
        return this.preloadAssets();
      })
      .then(() => {
      });
  }

  initPostProcessing() {
    if (this.postProcessing && this.postProcessing.renderPasses) {
      for (const renderPass of this.postProcessing.renderPasses) {
        this.addRenderPass(renderPass.type, renderPass.attributes, renderPass.options || null, renderPass.uniforms || null);
      }
    }
  }

  addRenderPass(name, attributes, options = null, uniforms = null) {

    if (this.composer && this.renderPassTypes[name]) {
      this.renderPasses[name] = new this.renderPassTypes[name](...attributes);
      if (options) {
        // tslint:disable-next-line:forin
        for (const key in options) {
          this.renderPasses[name] [key] = options[key];
        }
      }
      if (uniforms) {
        // tslint:disable-next-line:forin
        for (const uniform of uniforms) {
          this.renderPasses[name].uniforms[uniform[0]][uniform[1]] = uniforms[uniform[2]];
        }
      }
      this.composer.addPass(this.renderPasses[name]);
    }
  }

  getRenderPass(name) {
    return this.renderPasses[name] || null;
  }

  font(name: string, type: string) {
    return this.fonts[name][type] || this.fonts[name] || null;
  }

  createScene() {
    this.renderer.setClearColor(0x000000, 0);
    this.startRendering();
    this.addStats();
  }

  selectCamera(cameraObject: AnimationObject) {
    this.camera = cameraObject.camera;
    if (this.renderPasses) {
      this.renderPass.camera = this.camera;
    }
    if (this.controls === 'default') {
      this.cameraControls = new CameraControls(this.camera, this.container);
    } else if (this.controls === 'orbit') {
      this.cameraControls = new OrbitControls(this.camera, this.container);
    }
    this.updateView();
  }

  randomInt(maximal, minimal = 0) {
    return minimal + Math.trunc((Math.random() * (maximal - minimal)));
  }

  addStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.left = 'auto';
    this.stats.dom.style.top = 'auto';
    this.stats.dom.style.right = 0;
    this.stats.dom.style.bottom = 0;
    this.container.appendChild(this.stats.dom);
  }

  toggleStats() {
    this.statsVisible = !this.statsVisible;
    if (this.stats && this.statsVisible) {
      this.stats.dom.style.display = 'block';
    } else if (this.stats) {
      this.stats.dom.style.display = 'none';
    }
  }

  updateView(camera: any = this.camera) {
    if (this.container) {
      this.width = this.viewSize().width;
      this.height = this.viewSize().height;
      if (this.height > this.width) {
        this.viewportMode = 'portrait';
      } else {
        this.viewportMode = 'landscape';
      }
      if (this.renderer) {
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(this.viewSize().pixelRatio);
      }
      if (this.composer) {
        this.composer.setSize(this.viewSize().width, this.viewSize().height);
      }
      if (this.rendererCSS) {
        this.rendererCSS.setSize(this.width, this.height);
      }
      if (camera) {
        camera.aspect = this.width / this.height;
        camera.updateProjectionMatrix();
      }
    }
  }

  start() {

  }

  pause() {

  }

  stop() {

  }

  destroy() {

  }

  update() {
    this.onUpdate.emit();
  }

  objectLoading() {
    this.objectsToCreate++;
    this.checkLoading();
  }

  objectLoaded() {
    this.objectsToCreate--;
    this.checkLoading();
  }

  checkLoading() {
    if (this.objectsToCreate === 0) {
      this.loading = false;
    } else {
      this.loading = true;
    }
  }


  createObject(type, options: any, parentObject = null, onSuccess = null) {
    this.loading = true;
    this.objectLoading();
    if (!parentObject) {
      parentObject = this.scene;
    }
    if (options) {
      options.helper = this.showHelper;
    }
    if (options && options.geometry && options.geometry.parameters && options.geometry.parameters.fontSet) {
      options.geometry.parameters.font = this.font(options.geometry.parameters.fontSet[0], options.geometry.parameters.fontSet[1] || 'regular');
    }
    const newObject = new AnimationObject(type, options as AnimationObjectOptions, parentObject, this.objects, (e) => {
      this.objectLoaded();
      if (onSuccess) {
        onSuccess(e);
      }
    });
    if (newObject.mesh) {
      let exist = false;
      for (const mesh of this.meshes) {
        if (newObject.mesh === mesh) {
          exist = true;
        }
      }
      if (!exist) {
        this.meshes.push(newObject.mesh);
      }
    }
    if (type === 'camera') {
      newObject.camera.aspect = this.viewSize().width / this.viewSize().height;
    }
    this.objects.push(newObject);
    return newObject;
  }

  createPresetObject(setName, presetName, parentObject = null, onSuccess = null) {

    const preset = this.preset(setName, presetName) as AnimationPreset;
    if (preset) {
      return this.createObject(preset.type, preset.options, parentObject, onSuccess);
    }
  }

  generateChildObject(aniObject: AnimationObject, childName, onSuccess = null) {
    aniObject.childByName(childName, (child) => {
      const childAniObject = new AnimationObject('child', {child} as AnimationObjectOptions, null, this.objects);
      if (childAniObject && onSuccess) {
        onSuccess(childAniObject);
      }
    });
  }

  generateChildObjectGroup(aniObject: AnimationObject, childNames, onSuccess = null) {
    const groupAniObject = new AnimationObject('group', null, aniObject, this.objects);
    const children = [];
    const grabChild = (i) => {
      if (childNames[i]) {
        aniObject.childByName(childNames[i], (child) => {
          children.push(child);
        });
        grabChild(i + 1);
      } else {
        if (groupAniObject && onSuccess) {
          if (aniObject.object) {
            aniObject.object.add(groupAniObject.object);
          }
          for (const child of children) {
            child.geometry.center();
            groupAniObject.object.add(child);
          }
          onSuccess(groupAniObject);
        }
      }
    };
    grabChild(0);


  }

  bindPresets(setName, presets: AnimationPreset[]) {
    if (!this.presets[setName]) {
      this.presets[setName] = [];
    }
    for (const preset of presets) {
      this.presets[setName].push(preset);
    }
  }

  preset(setName, presetName) {
    if (!this.presets[setName]) {
      console.log('no preset set named "' + setName + '"');
    } else {
      for (const preset of this.presets[setName]) {
        if (preset.name === presetName) {
          return preset;
        }
      }
    }
    console.log('no preset in "' + setName + '" named "' + presetName + '"');
    return null;
  }

  lookAtObject(object: AnimationObject) {
    this.camera.lookAt(new THREE.Vector3(
      object.mesh.position.x,
      object.mesh.position.y,
      object.mesh.position.z,
    ));
  }

  preloadFonts() {
    return new Promise(resolve => {
      if (this.embedFonts) {
        let fontsLoading = this.embedFonts.length || 0;
        for (const font of this.embedFonts) {
          // tslint:disable-next-line:variable-name
          this.loadFont(font.name, font.weight, _font => {
            fontsLoading--;
            if (fontsLoading <= 0) {
              resolve();
            }
          });
        }
        if (fontsLoading <= 0) {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }

  loadFont(name: string, weight: string, success: any = false) {
    const loader = new THREE.FontLoader();
    if (!this.fonts || !this.fonts[name] || !this.fonts[name][weight]) {
      loader.load('/assets/fonts/' + name + '_' + weight + '.typeface.json', response => {
        if (!this.fonts[name]) {
          this.fonts[name] = {};
          this.fonts[name][weight] = response;
        } else {
          this.fonts[name][weight] = response;
        }

        if (success) {
          success(response);
        }
      });
    } else {
      if (success) {
        success(this.fonts[name][weight]);
      }
    }
  }

  preloadAssets() {
    return Promise.all([
      new Promise(resolve => {
        const interval = setInterval(() => {
          if (this.preloadAssetCount <= 0) {
            clearInterval(interval);
            resolve();
          }
        }, 200);
      }),
      new Promise(resolve => {
        this.loadingManager.onLoad = () => resolve();
      }),
    ]);
  }

  loadAudio(name, source, options: any = null) {
    this.audioService.load(name, source, options);
  }

  audio(name) {
    return this.audioService.audio(name);
  }

  playAudio(name) {
    this.audioService.play(name);
  }

  pauseAudio(name) {
    this.audioService.pause(name);
  }

  loopAudio() {
    this.audioService.loop(name);
  }

  viewSize() {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      scale: 1,
      pixelRatio: window.devicePixelRatio,
    };
  }

  startRendering() {
    this.renderer.setAnimationLoop(() => {
      this.renderScene();
    });
  }

  renderScene() {

    if (this.stats) {
      this.stats.begin();
    }
    if (this.started && !this.loading) {
      this.animateScene();
    }
    if (this.renderer && this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
    if (this.composer) {
      this.composer.render();
    }
    if (this.rendererCSS && this.sceneCSS) {
      this.rendererCSS.render(this.sceneCSS, this.camera);
    }
    if (this.stats) {
      this.stats.end();
    }
  }

  animateScene(force: any = false, forceTime: boolean = false, preventUpdate: boolean = false) {
    const delta = this.clock.getDelta();
    if (this.scene) {
      if (!force) {
        this.updateFrame(true);
      } else {
        this.updateFrame(false);
      }
    }
    if (this.cameraControls) {
      this.cameraControls.update(delta);
    }

  }

  updateFrame(update: any = false) {

    this.renderNow *= 0.001;  // convert to seconds
    this.deltaTime = this.renderNow - this.renderThen;
    this.renderThen = this.renderNow;

    if (update) {
      const newFrame = this.frame + ((Date.now() - this.animationTime.time) / 1000) * this.speed;
      if (this.duration === 0 || (newFrame <= this.duration - (1 / this.fps) / this.speed)) {
        this.frame = newFrame;
      } else {
        this.animationEnded(this.frame);
      }
      this.frameChange();
      // TWEEN.update(this.frame * 1000);
      TWEEN.update();
    } else if (!update) {
      // TWEEN.update(this.frame * 1000);
      TWEEN.update();
    }
    this.animationTime.time = Date.now();
  }

  frameChange(frame: number = this.frame) {
    this.onFrameChange.emit(frame);
    this.updateObjects();
    // this.calculateCollisions();
    this.animateFrame();
  }

  updateObjects() {
    this.objects.forEach(object => {
      object.update(this.renderer, this.scene);
    });
  }

  animationEnded(frame: number = this.frame) {
    this.onEnd.emit(frame);
  }

  containerMouseEvent(event, eventName = null, deep = false) {

    this.mouse = this.calcMousePosition(event);
    if (eventName) {
      this.mouseEvents(eventName, deep);
    }

  }

  mouseEvents(event: string, deep = false) {
    if (this.raycaster) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.meshes);
      if (intersects.length > 0) {
        if (deep) {
          // go through all elements
          for (const intersect of intersects) {
            this.intersectEvent(intersect, event);
          }
        } else {
          this.intersectEvent(intersects[0], event);
        }
      }
    }
  }

  intersectEvent(intersect, event, data: any = null) {
    const animationObject = intersect.object.userData;
    this.triggerObjectCallback(intersect.object.userData, event, data);
  }

  triggerObjectCallback(animationObject: AnimationObject, callbackName: string, data: any = null) {
    if (animationObject.callbacks && animationObject.callbacks[callbackName]) {
      if (callbackName === 'mousedown') {
        for (const aniObj of this.objects) {
          if (aniObj.object !== animationObject.object) {
            if (aniObj.mouseDown) {
              aniObj.mouseDown = false;
              this.triggerObjectCallback(animationObject, 'mouseup', data);
            }
          }
        }
        animationObject.mouseDown = true;
      } else if (callbackName === 'mouseup') {
        animationObject.mouseDown = false;
      } else if (callbackName === 'mousemove') {
        for (const aniObj of this.objects) {
          if (aniObj.mouseDown) {
            aniObj.mouseDown = false;
            this.triggerObjectCallback(animationObject, 'mouseup', data);
          }
          if (aniObj.object !== animationObject.object) {
            if (aniObj.mouseHover) {
              aniObj.mouseHover = false;
              this.triggerObjectCallback(animationObject, 'mouseout', data);
            }
          }
        }
        if (!animationObject.mouseHover) {
          animationObject.mouseHover = true;
          this.triggerObjectCallback(animationObject, 'mouseover', data);
        }
      }
      for (const callback of animationObject.callbacks[callbackName]) {
        callback(data);
      }
    }
  }

  calcMousePosition(mouseEvenet) {
    return {
      x: ((mouseEvenet.layerX || mouseEvenet.clientX) / this.viewSize().width) * 2 - 1,
      y: -((mouseEvenet.layerY || mouseEvenet.clientY) / this.viewSize().height) * 2 + 1,
    };
  }

  calculateCollisions(objects = this.objects) {
    for (const object of objects) {
      this.detectCollision(object);
    }
  }

  detectCollision(aniObject) {
    const object1: any = aniObject.object;
    if (object1.geometry) {
      object1.geometry.computeBoundingBox();
      for (const targetObject of this.objects) {
        const object2: any = targetObject.object;
        if (object2.geometry) {
          object2.geometry.computeBoundingBox();
          object1.updateMatrixWorld();
          object2.updateMatrixWorld();
          const box1 = object1.geometry.boundingBox.clone();
          box1.applyMatrix4(object1.matrixWorld);
          const box2 = object2.geometry.boundingBox.clone();
          box2.applyMatrix4(object2.matrixWorld);

        }
      }
    }


    // collision detection:
    //   determines if any of the rays from the cube's origin to each vertex
    //		intersects any face of a mesh in the array of target meshes
    //   for increased collision accuracy, add more vertices to the cube;
    //		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
    if (object1.geometry) {
      const originPoint = object1.position.clone();


      for (let vertexIndex = 0; vertexIndex < object1.geometry.vertices.length; vertexIndex++) {
        const localVertex = object1.geometry.vertices[vertexIndex].clone();
        const globalVertex = localVertex.applyMatrix4(object1.matrix);
        const directionVector = globalVertex.sub(object1.position);

        const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        const collisionResults = ray.intersectObjects(this.meshes);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
          aniObject.collide(collisionResults);
        }
      }
    }
  }


  animateFrame() {

  }

  trigger(customEvent: string, data: any = null) {
    if (this.customEvents[customEvent]) {
      this.customEvents[customEvent](data);
    } else {
      console.log('no customEvent named ' + customEvent);
    }
  }
}
