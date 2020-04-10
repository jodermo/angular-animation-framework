import { Injectable, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { AnimationObject, AnimationObjectOptions, AnimationPreset } from '../classes/animation-object';
import { ThreeVrService } from './three-vr.service';
import { AudioService } from './audio.service';
import * as Stats from 'stats-js';
import TWEEN from '@tweenjs/tween.js';
import CameraControls from 'camera-controls';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

(window as any).THREE = THREE;
CameraControls.install({THREE});

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  settings = {
    stats: false,
    helper: false,
    html: false,
    composer: true,
    controls: 'orbit', // 'orbit' , 'default',
    requestAnimationFrame: false,
    clearColor: 0x000000,
    alpha: 0
  };

  embedFonts = [
    {alias: 'droid_sans', name: 'droid_sans', weight: 'bold'},
    {alias: 'helvetiker', name: 'helvetiker', weight: 'regular'}
  ];

  loading = true;
  started = false;
  paused = false;
  inactive = false;

  width;
  height;
  fps = 60;
  frame = 0;
  speed = 1;
  duration = 0;

  scene;
  sceneCSS;
  camera;
  renderer;
  rendererCSS;
  composer;
  renderPass;

  cameraControls;
  controlCamera;
  lastCamera;
  stats;
  clock = new THREE.Clock();

  container: HTMLElement;
  mouse: any = new THREE.Vector2();

  renderPasses = {};
  activeRenderPasses = [];
  raycaster;
  loadingManager: THREE.LoadingManager = new THREE.LoadingManager();
  loader = {
    sources: {},
    total: 0,
    loaded: 0,
    loadedPercent: 0,
    info: null
  };
  time: any = TWEEN.now();
  animationTime = {
    frame: this.frame,
    time: Date.now(),
  };

  renderNow = 1;
  renderThen = 0;
  deltaTime = 0;

  fonts = {};

  postProcessing = {
    renderPasses: [] // e.g: {type: 'FilmPass', attributes: [0.35, 0.025, 648, false], options: {renderToScreen: true}}
  };
  preloadAssetCount = 0;
  objects: AnimationObject[] = [];
  objectsToCreate = 0;
  meshes = [];
  presets = {};
  customEvents = {};
  callbacks = {
    start: [],
    onUpdate: [],
    onFrameChange: [],
    onEnd: []
  };
  renderer2;
  vrService: ThreeVrService = new ThreeVrService();
  audioService: AudioService = new AudioService();

  constructor() {
  }

  init() {
    window.addEventListener('beforeunload', (e) => {
      this.destroy();
    });
    window.addEventListener('resize', () => {
      this.updateView();
    });
  }

  setupAnimationContainer(container: HTMLElement, renderer2: Renderer2) {
    this.container = container;
    this.renderer2 = renderer2;

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

  updateLoading(source = null, total = 0, loaded = 0) {
    if (total && source) {
      this.loader.sources[source] = {total, loaded};
      this.loader.info = source;
    } else if (source) {
      this.removeFromLoader(source);
    }
    const result = {
      total: 0,
      loaded: 0
    };
    for (const key in this.loader.sources) {
      if (this.loader.sources[key]) {
        result.total += this.loader.sources[key].total;
        result.loaded += this.loader.sources[key].loaded;
      }
    }
    this.loader.total = result.total;
    this.loader.loaded = result.loaded;
    this.loader.loadedPercent = Math.floor(result.loaded / result.total * 100);
  }

  removeFromLoader(source) {
    this.loader.sources[source] = null;
  }

  initVr() {
    this.vrService.init((this.scene as any), this.renderer, this.raycaster, this.camera);
  }

  vrMode() {
    if (this.vrService) {
      this.vrService.startVrMode();
    }
  }

  initThree(success: any = false) {

    this.container.innerHTML = null;
    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onError = (url) => console.error('there was an error loading: ' + url);

    this.addRenderer();
    this.initCamera();
    if (this.settings.html) {
      this.addCssRenderer();
    }
    if (this.settings.composer) {
      this.addComposer();
    }
    this.preloadFonts()
      .then(() => {
        this.createScene();
        this.initPostProcessing();
        this.updateView();
        setTimeout(() => {
          this.started = true;
          this.initVr();
          this.triggerStart();
          this.checkLoading();
        }, 0);
        if (success) {
          success();
        }
        return this.preloadAssets();
      })
      .then(() => {
      });
  }

  addRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMapSoft = true;
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.zIndex = 1;
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.left = 0;
    this.renderer.sortObjects = true;
    this.renderer.setSize(this.viewSize().width, this.viewSize().height);
    this.renderer.setClearColor(new THREE.Color(this.settings.clearColor), this.settings.alpha);
    this.renderer.clear();
    this.renderer2.appendChild(this.container, this.renderer.domElement);
  }

  addCssRenderer() {
    this.rendererCSS = new CSS3DRenderer();
    this.rendererCSS.setSize(this.viewSize().width, this.viewSize().height);
    this.rendererCSS.domElement.style.position = 'absolute';
    this.rendererCSS.domElement.style.zIndex = 2;
    this.rendererCSS.domElement.style.top = 0;
    this.rendererCSS.domElement.style.left = 0;
    this.renderer2.appendChild(this.container, this.rendererCSS.domElement);
  }

  addComposer() {
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
  }

  initCamera() {
    this.controlCamera = new THREE.PerspectiveCamera(45, this.viewSize().width / this.viewSize().height, 1, 100000);
    this.camera = this.controlCamera;
    this.camera.position.set(250, 100, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
    if (this.settings.controls === 'default') {
      this.cameraControls = new CameraControls(this.camera, this.container);
    } else if (this.settings.controls === 'orbit') {
      this.cameraControls = new OrbitControls(this.camera, this.container);
    }
  }

  initPostProcessing() {
    if (this.postProcessing && this.postProcessing.renderPasses) {
      for (const renderPass of this.postProcessing.renderPasses) {
        this.addRenderPass(renderPass.name || renderPass.type, renderPass.pass, renderPass.attributes, renderPass.options || null, renderPass.uniforms || null);
      }
    }
  }

  addRenderPass(name, pass, attributes, options = null, uniforms = null) {
    if (this.settings.composer) {
      if (this.composer && pass) {
        this.renderPasses[name] = new pass(...attributes);
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
        this.activateRenderPass(name);
      }
    } else {
      console.log('can´t add render pass "' + name + '", composer not activated');
    }
  }

  getRenderPass(name) {
    return this.renderPasses[name] || null;
  }

  activateRenderPass(name) {
    this.activeRenderPasses[name] = true;
    this.showRenderPass(name);
  }

  deactivateRenderPass(name) {
    this.activeRenderPasses[name] = false;
    this.hideRenderPass(name);
  }

  toggleRenderPassActive(name) {
    if (!this.renderPassActive(name)) {
      this.activateRenderPass(name);
    } else {
      this.deactivateRenderPass(name);
    }
  }

  renderPassActive(name) {
    return this.activeRenderPasses[name] || false;
  }

  showRenderPass(name) {
    if (this.renderPassActive(name)) {
      const pass = this.getRenderPass(name);
      if (pass) {
        pass.camera = this.camera;
        pass.enabled = true;
      }
    }
  }

  hideRenderPass(name) {
    const pass = this.getRenderPass(name);
    if (pass) {
      pass.enabled = false;
    }
  }

  font(name: string, type: string) {
    return this.fonts[name][type] || this.fonts[name] || null;
  }

  createScene() {
    this.renderer.setClearColor(0x000000, 0);
    this.startRendering();
    if (this.settings.stats) {
      this.addStats();
    }

  }

  selectCamera(cameraObject: AnimationObject) {
    this.camera = cameraObject.camera;
    this.setRenderPassCamera();
    this.updateView();
  }

  setRenderPassCamera(camera = this.camera) {
    if (this.renderPass && this.composer) {
      this.renderPass.camera = camera;
    }
    if (this.renderPasses && this.composer) {
      for (const key in this.renderPasses) {
        this.renderPasses[key].camera = camera;
      }
    }
  }


  selectControlCamera(camera = this.controlCamera) {
    if (this.camera && this.camera !== camera) {
      this.lastCamera = this.camera;
    }
    this.camera = camera;
    this.controlCamera = camera;
    this.setRenderPassCamera();
    if (this.cameraControls) {
      this.cameraControls.camera = this.camera;
    } else {
      if (this.settings.controls === 'default') {
        this.cameraControls = new CameraControls(this.camera, this.container);
      } else if (this.settings.controls === 'orbit') {
        this.cameraControls = new OrbitControls(this.camera, this.container);
      }
    }

    this.updateView();
  }

  unselectControlCamera() {
    if (this.lastCamera) {
      this.selectCamera(this.lastCamera);
    }
  }

  isControlCamera() {
    return (this.cameraControls && this.cameraControls.camera === this.camera);
  }

  randomInt(maximal, minimal = 0) {
    return minimal + Math.trunc((Math.random() * (maximal - minimal)));
  }

  addStats() {
    if (!this.stats) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      this.stats.dom.style.position = 'absolute';
      this.stats.dom.style.left = 'auto';
      this.stats.dom.style.top = 'auto';
      this.stats.dom.style.right = 0;
      this.stats.dom.style.bottom = 0;
      this.container.appendChild(this.stats.dom);
    }
  }

  toggleStats() {
    this.settings.stats = !this.settings.stats;
    if (this.stats && this.settings.stats) {
      this.stats.dom.style.display = 'block';
    } else if (!this.stats && this.settings.stats) {
      this.addStats();
    } else if (this.stats) {
      this.stats.dom.style.display = 'none';
    }
  }

  updateView(camera: any = this.camera) {
    if (this.container) {
      this.width = this.viewSize().width;
      this.height = this.viewSize().height;
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


  update() {
    this.triggerOnUpdate();
  }

  destroy() {

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
      options.helper = this.settings.helper;
    }
    if (options && options.geometry && options.geometry.parameters && options.geometry.parameters.fontSet) {
      options.geometry.parameters.font = this.font(options.geometry.parameters.fontSet[0], options.geometry.parameters.fontSet[1] || 'regular');
    }
    const newObject = new AnimationObject(type, options as AnimationObjectOptions, parentObject, this.objects, (e) => {
      this.objectLoaded();
      if (onSuccess) {
        onSuccess(e);
      }
    }, (source, total, loaded) => {
      this.updateLoading(source, total, loaded)
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

  generateChildObjectGroup(aniObject: AnimationObject, childNames, onSuccess = null, parentObject: any = null, centerObjects = true) {
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
          if (parentObject) {
            parentObject.add(groupAniObject.object);
          } else if (aniObject.object) {
            aniObject.object.add(groupAniObject.object);
          }
          for (const child of children) {
            if (centerObjects) {
              child.geometry.center();
            }
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
    if (this.settings.requestAnimationFrame) {
      this.requestAnimationFrameLoop();
    } else {
      this.renderer.setAnimationLoop(() => {
        this.renderScene();
      });
    }

  }

  requestAnimationFrameLoop() {
    this.renderScene();
    requestAnimationFrame(() => {
      this.requestAnimationFrameLoop();
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
      this.updateFrame(!force);
    }
    if (this.cameraControls && this.cameraControls.camera == this.camera) {
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
    this.triggerOnFrameChange(frame);
    this.updateObjects();
    // this.calculateCollisions();
  }

  updateObjects() {
    this.objects.forEach(object => {
      object.update(this.renderer, this.scene);
    });
  }

  animationEnded(frame: number = this.frame) {
    this.triggerOnEnd(frame);
  }


  triggerStart(event: any = null) {
    for (const callback of this.callbacks.start) {
      callback(event);
    }
  }

  onStart(callback) {
    this.callbacks.start.push(callback);
  }

  triggerOnUpdate(event: any = null) {
    for (const callback of this.callbacks.onUpdate) {
      callback(event);
    }
  }

  onUpdate(callback) {
    this.callbacks.onUpdate.push(callback);
  }

  triggerOnFrameChange(event: any = null) {
    for (const callback of this.callbacks.onFrameChange) {
      callback(event);
    }
  }

  onFrameChange(callback) {
    this.callbacks.onFrameChange.push(callback);
  }

  triggerOnEnd(event: any = null) {
    for (const callback of this.callbacks.onEnd) {
      callback(event);
    }
  }

  onEnd(callback) {
    this.callbacks.onEnd.push(callback);
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

  trigger(customEvent: string, data: any = null) {
    if (this.customEvents[customEvent]) {
      this.customEvents[customEvent](data);
    } else {
      console.log('no customEvent named ' + customEvent);
    }
  }
}
