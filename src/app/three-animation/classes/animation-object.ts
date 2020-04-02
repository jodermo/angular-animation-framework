import TWEEN from '@tweenjs/tween.js';
import * as Physijs from 'physijs-webpack';
import * as THREE from 'three';
import { ThreeAnimationComponent } from '../three-animation.component';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export class AnimationObjectOptions {
  public mesh;
  public child;
  public parent;
  public material: any;
  public geometry: any;
  public light;
  public camera;
  public video: any;
  public image: any;
  public particles: any;
  public alphaImage: any;
  public canvas: any;
  public alphaCanvas: any;
  public obj: any;
  public size: any;
  public position: any;
  public rotation: any;
  public scale: any;
  public radius: any;
  public helper: boolean;
}

export class AnimationObject {
  id: any;
  mesh: any;
  light: any;
  material: any;
  geometry: any;
  camera: any;
  cubeCamera: any;
  cubeCameraAdded = false;
  object = new THREE.Group();
  pivot = new THREE.Vector3();
  children = [];
  particles: any;
  particleSettings: any;
  helper = [];
  tween = {
    position: null,
    rotation: null,
    scale: null,
    materialOffset: null,
  };
  parent: any;
  lookAtTarget: any;
  video: any;
  image: any;
  alphaMap: any;
  canvas: any;
  mouseHover = false;
  mouseDown = false;
  selectable = false;
  selected = false;
  callbacks = {
    mousemove: [],
    mouseover: [],
    mouseout: [],
    mousedown: [],
    mouseup: [],
    keydown: [],
    keyup: [],
    collide: [],
    leave: []
  };
  collisionObjects = {};
  private loadingManager = new THREE.LoadingManager();
  private objLoader = new OBJLoader();

  constructor(public type, public options: AnimationObjectOptions, parentObject = null, private objects, private onCreated = null, private onLoad = null) {
    if (parentObject) {
      if (!options) {
        options = {} as AnimationObjectOptions;
      }
      options.parent = parentObject;
    }

    if (type === 'child') {
      this.mesh = options.child || null;
      this.object = this.mesh;
      this.initMesh(options);
      this.initObject(options);
      this.appendTo(parentObject);
    } else if (type === 'obj') {
      this.loadObj(options, (objMesh) => {
        this.mesh = objMesh;
        this.initObj(options);
        this.initMesh(options);
        this.initObject(options, objMesh);
        this.appendTo(parentObject);

      });
    } else if (type === 'video') {
      this.createVideoObject(options, (videoMesh) => {
        this.mesh = videoMesh;
        this.initMesh(options);
        this.initObject(options, videoMesh);
        this.appendTo(parentObject);
      });
    } else if (type === '360video' || type === 'video-360') {
      this.create360Video(options, (videoMesh) => {
        this.mesh = videoMesh;
        this.initMesh(options);
        this.initObject(options, videoMesh);
        this.appendTo(parentObject);
      });
    } else if (type === 'vrVideo' || type === 'video-vr') {
      this.createVrVideo(options, (videoMesh) => {
        this.mesh = videoMesh;
        this.initMesh(options);
        this.initObject(options, videoMesh);
        this.appendTo(parentObject);
      });
    } else if (type === 'image') {
      this.createImageObject(options, (imageMesh) => {
        this.mesh = imageMesh;
        this.initMesh(options);
        this.initObject(options, imageMesh);
        this.appendTo(parentObject);
      });
    } else if (type === '360image' || type === 'image-360') {
      this.create360Image(options, (imageMesh) => {
        this.mesh = imageMesh;
        this.initMesh(options);
        this.initObject(options, imageMesh);
        this.appendTo(parentObject);
      });
    } else if (type === 'canvas') {
      this.createCanvasObject(options.canvas, options, (canvasMesh) => {
        this.mesh = canvasMesh;
        this.initMesh(options);
        this.initObject(options, canvasMesh);
        this.appendTo(parentObject);
      }, options.alphaCanvas || null);
    } else if (type === 'particles') {
      this.createParticlesObject(options, (particleMesh) => {
        this.particles = particleMesh;
        this.initMesh(options);
        this.initObject(options, particleMesh);
        this.appendTo(parentObject);
      });
    } else {
      let mesh;
      if (type === 'mesh') {
        mesh = this.createMesh(type, options);
      } else if (type === 'camera') {
        this.camera = this.createCamera(type, options);
        mesh = this.camera;
      } else if (type === 'group') {
        mesh = new THREE.Group();
      } else if (type === 'AmbientLight'
        || type === 'DirectionalLight'
        || type === 'HemisphereLight'
        || type === 'PointLight'
        || type === 'RectAreaLight'
        || type === 'SpotLight'
      ) {
        mesh = this.createLight(type, options);
      }
      if (type !== 'clone') {
        this.initMesh(options);
        this.initObject(options, mesh);
        this.appendTo(parentObject);
      }

    }
  }

  initObject(options, mesh = null) {
    if (options && this.object) {
      if (this.object.id) {
        this.id = this.object.id;
      } else {
        console.log('no ID in', this.object);
      }
      if (mesh) {
        this.object.add(mesh);
        this.children.push(mesh);
      }
      if (options.position) {
        this.object.position.set(
          (options.position.x || 0),
          (options.position.y || 0),
          (options.position.z || 0),
        );
      }
      if (options.rotation) {
        this.object.rotation.set(
          options.rotation.x || 0,
          options.rotation.y || 0,
          options.rotation.z || 0,
        );
      }
      if (options.scale) {
        this.object.scale.set(
          options.scale.x || 1,
          options.scale.y || 1,
          options.scale.z || 1,
        );
      }
    }
    this.update(null, null);
    // console.log(this);
  }


  initMesh(options) {
    if (this.mesh) {
      if (options && options.mesh) {
        // tslint:disable-next-line:forin
        for (const key in options.mesh) {
          this.mesh[key] = options.mesh[key];
        }
      }
      if (options.helper) {
        const axesHelper = new THREE.AxesHelper(100);
        this.helper.push(axesHelper);
        this.mesh.add(axesHelper);
      }
      this.mesh.userData = this;
      this.mesh.updateMatrix();
    }
  }

  initObj(options) {
    if (this.mesh) {
      if (options.material && options.material.type) {

        this.material = this.createMaterial(options.material.type, options.material || null);

      } else {
        this.material = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
      }
      this.geometry = this.mesh.geometry || null;


      const names = [];
      let timeout = null;

      const addName = (name) => {
        if (name && !names.filter((nName) => {
          return nName === name;
        }).length) {
          names.push(name);
        }
      };

      this.mesh.traverse((child) => {
        if (!child.name) {
          // console.log(child.type, child);
        } else {
          addName(child.name);
        }

        if (!(child instanceof THREE.Mesh) && child.material) {
          console.log('no material', child);
        }


        if (child instanceof THREE.Mesh) {
          child.material = this.material;
          // Store original position
          const bbox = new THREE.Box3().setFromObject(this.mesh);

          const offset = child.position;
          bbox.getCenter(offset).negate();

          const group = new THREE.Object3D();
          child.position.set(0, 0, 0);
          group.add(child);

// Offset pivot group by original position
          group.position.set(offset.x, offset.y, offset.z);
          this.mesh.add(group);

        }
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          console.log(names); // show object names in js console
        }, 500);
      });
      if (options.obj) {
        if (options.obj.materials) {
          options.obj.materials.forEach((materialOption) => {
            if (materialOption.objectNames) {
              materialOption.objectNames.forEach((name) => {
                this.childByName(name, (childObject) => {
                  childObject.material = this.createMaterial(materialOption.material.type, materialOption.material || null);
                  childObject.receiveShadow = true;
                  childObject.castShadow = true;
                });
              });
            }

          });
        }
      }

    }
  }

  childByName(name: string, onSuccess = null) {
    if (this.mesh) {
      let exist = false;
      this.mesh.traverse((child) => {
        if (child.name && child.name === name) {
          if (onSuccess && !exist) {
            exist = true;
            onSuccess(child);
          }
        }
      });
    }
  }

  createMesh(type, options) {
    if (options.geometry) {
      this.geometry = this.createGeometry(options.geometry.type, options.geometry || null);
    } else {
      console.log('no geometry options', type, options);
      return;
    }
    if (options.material) {
      if (options.material.type === 'mirror' || options.material.type === 'Mirror') {
        this.material = this.createMirrorMaterial(options);
      } else {
        this.material = this.createMaterial(options.material.type, options.material || null);
      }
    } else {
      console.log('no material options', type, options);
      return;
    }
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }

  createCamera(type, options) {
    const camera = new THREE[options.camera.type || 'PerspectiveCamera'](options.camera.fov || 45
      , options.camera.aspect || 16 / 9
      , options.camera.new || 1
      , options.camera.far || 1000);
    return camera;
  }

  createLight(type, options = null) {
    if (type === 'AmbientLight') {
      this.light = new THREE.AmbientLight(options.color || 0x404040); // soft white light

    } else if (type === 'DirectionalLight') {
      this.light = new THREE.DirectionalLight(
        new THREE.Color(options.light.color || 0xffffff),
        options.light.intensity || 1,
      );
      this.light.castShadow = true;
      this.light.shadow.mapSize.width = 512;
      this.light.shadow.mapSize.height = 512;
      this.light.shadow.camera.near = 0.5;
      this.light.shadow.camera.far = 100000;
    } else if (type === 'HemisphereLight') {
      this.light = new THREE.HemisphereLight(
        0xffffbb,
        0x080820,
        1,
      );
    } else if (type === 'PointLight') {
      this.light = new THREE.PointLight(
        0xffffff,
        1,
        1000,
      );
    } else if (type === 'RectAreaLight') {
      const width = options.size.x || 10;
      const height = options.size.y || 10;
      const intensity = options.intensity || 1;
      this.light = new THREE.RectAreaLight(
        0xffffff,
        intensity,
        width,
        height,
      );
    } else if (type === 'SpotLight') {
      this.light = new THREE.SpotLight(0xffffff);
      this.light.position.set(100, 1000, 100);
      if (options.helper) {
        const spotLightHelper = new THREE.SpotLightHelper(this.light);
        if (options.parent) {
          if (options.parent.parent) {
            options.parent.parent.add(spotLightHelper);
          } else {
            options.parent.add(spotLightHelper);
          }

        }

      }

    }

    if (options.light) {
      for (const key in options.light) {
        if (key !== 'type' && key !== 'color' && key !== 'shadow') {
          this.light[key] = options.light[key];
        }
      }
      if (options.light.color) {
        this.light.color = new THREE.Color(options.light.color || 0xffffff);
      }
      if (options.light.shadow) {
        // tslint:disable-next-line:forin
        for (const sKey in options.light.shadow) {
          this.light.shadow[sKey] = options.light.shadow[sKey];
        }
      }
    }
    return this.light;
  }

  loadObj(options, success: any = false) {
    if (options.obj && options.obj.source) {
      const loadStart = false;
      this.objLoader.load(options.obj.source, (object) => {
        if (success) {
          success(object);
        }
      }, (xhr) => {
        if (this.onLoad) {
          this.onLoad(options.obj.source, xhr.total, xhr.loaded);
        }
      }, (error) => {
        this.onLoad(options.obj.source, 0);
        console.log('objLoader error', error);
      });
    }

  }

  createParticlesObject(options, success: any = false) {
    this.particleSettings = {
      count: options.particles.count || 1000,
      startRange: options.particles.startRange || 2000,
      endRange: options.particles.endRange || 2000,
      gravity: options.particles.gravity || new THREE.Vector3(),
      particles: []
    };
    this.geometry = new THREE.BufferGeometry();
    if (options.particles.sprite) {
      const sprite = new THREE.TextureLoader().load(options.particles.sprite);
      this.material = new THREE.PointsMaterial({
        size: options.particles.size || 1,
        sizeAttenuation: false,
        map: sprite,
        transparent: true,
        alphaTest: .5,
      });
      this.material.color.setHSL(1.0, 0.3, 0.7);
    } else {
      this.material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: options.particles.size || 1,
      });
    }

    const vertices = [];
    for (let p = 0; p < this.particleSettings.count; p++) {
      const x = THREE.MathUtils.randFloatSpread(this.particleSettings.startRange);
      const y = THREE.MathUtils.randFloatSpread(this.particleSettings.startRange);
      const z = THREE.MathUtils.randFloatSpread(this.particleSettings.startRange);
      const velocity = new THREE.Vector3();
      if (options.particles.velocity) {
        velocity.x = Math.random() * (options.particles.velocity.x * 2) - options.particles.velocity.x;
        velocity.y = Math.random() * (options.particles.velocity.y * 2) - options.particles.velocity.y;
        velocity.z = Math.random() * (options.particles.velocity.z * 2) - options.particles.velocity.z;
      }
      const rotation = new THREE.Vector3();
      if (options.particles.rotation) {
        rotation.x = Math.random() * (options.particles.rotation.x * 2) - options.particles.rotation.x;
        rotation.y = Math.random() * (options.particles.rotation.y * 2) - options.particles.rotation.y;
        rotation.z = Math.random() * (options.particles.rotation.z * 2) - options.particles.rotation.z;
      }
      /*
      if (velocity.x !== 0) {
        x = THREE.MathUtils.randFloatSpread(this.particleSettings.endRange);
      }
      if (velocity.y !== 0) {
        y = THREE.MathUtils.randFloatSpread(this.particleSettings.endRange);
      }
      if (velocity.z !== 0) {
        z = THREE.MathUtils.randFloatSpread(this.particleSettings.endRange);
      }

       */
      vertices.push(x, y, z);
      let delay = 0;
      if (options.particles.emitDelay) {
        delay = Math.trunc(Math.random() * options.particles.emitDelay);
      }
      this.particleSettings.particles.push({index: p, velocity, rotation, delay});
    }
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const points = new THREE.Points(this.geometry, this.material);

    if (success) {
      success(points);
    }
    return points;
  }

  createImageObject(options, success: any = false) {
    const defaultSize = {
      x: 2,
      y: 2
    };
    const onReady = (imageSource, alphaMap) => {
      const texture = new THREE.TextureLoader().load(imageSource);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;

      let alphaTexture = null;
      if (alphaMap) {
        alphaTexture = new THREE.TextureLoader().load(alphaMap);

      }
      const material = this.createTextureMaterial(options.material.type, options.material, texture, alphaTexture);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(options.size.x || defaultSize.x, options.size.y || defaultSize.y), material);

      if (success) {
        success(mesh);
      }
    };
    if (!this.image) {
      this.image = options.image.source;
      this.alphaMap = options.image.alpha || null;
    }
    onReady(this.image, this.alphaMap);
  }

  createCanvasObject(canvas, options, success: any = false, alphaCanvas = null) {
    const defaultSize = {
      x: 2,
      y: 2
    };
    const onReady = () => {
      const material = this.createCanvasMaterial(options.material.type, options, canvas, alphaCanvas);
      const size = {
        x: defaultSize.x,
        y: defaultSize.y
      };
      if (options.size) {
        size.x = options.size.x;
        size.y = options.size.y;
      }
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size.x, size.y), material);
      if (success) {
        success(mesh);
      }
    };
    if (!this.canvas) {
      this.canvas = canvas;
    }
    onReady();
  }

  createVideoObject(options, success: any = false) {
    const defaultSize = {
      x: (16 / 10),
      y: (9 / 10)
    };
    const onReady = (video) => {
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
      const material = this.createTextureMaterial(options.material.type, options.material, texture);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(options.size.x || defaultSize.x, options.size.y || defaultSize.y), material);
      if (success) {
        success(mesh);
      }
    };
    if (this.video as HTMLVideoElement) {
      onReady(this.video);
    } else {
      this.video = document.createElement('video');
      // tslint:disable-next-line:forin
      this.initVideoOptions(options);
      const checkforVideo = (video) => {
        if (video.error) {
        } else if (video.readyState >= 3) {
          onReady(video);
        } else {
          setTimeout(() => {
            checkforVideo(video);
          }, 500);
        }
      };
      this.video.load();
      checkforVideo(this.video);
    }
  }

  create360Image(options: any, success: any = null) {

    const onReady = (imageSource, alphaMap) => {
      const texture = new THREE.TextureLoader().load(imageSource);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;

      let alphaTexture = null;
      if (alphaMap) {
        alphaTexture = new THREE.TextureLoader().load(alphaMap);

      }

      const geometry = new THREE.SphereGeometry(options.radius || 100, 60, 40);
      geometry.scale(-1, 1, 1);
      const materialType = options.material.type || 'MeshBasicMaterial';
      const material = this.createTextureMaterial(materialType, options.material || {}, texture, alphaTexture);
      // material.side = THREE.BackSide;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = -Math.PI / 2;
      if (success) {
        success(mesh);
      }
    };
    if (!this.image) {
      this.image = options.image.source;
      this.alphaMap = options.image.alpha || null;
    }
    onReady(this.image, this.alphaMap);
  }

  create360Video(options: any, success: any = null) {
    this.video = document.createElement('video');

    const onReady = (video) => {
      const texture = new THREE.VideoTexture(video);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.format = THREE.RGBFormat;
      const geometry = new THREE.SphereGeometry(options.radius || 100, 60, 40);
      geometry.scale(-1, 1, 1);
      const materialType = options.material.type || 'MeshBasicMaterial';
      const material = new THREE[materialType]({map: texture});
      // material.side = THREE.BackSide;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = -Math.PI / 2;
      if (success) {
        success(mesh);
      }
    };
    this.initVideoOptions(options);

    const checkforVideo = (video) => {
      if (video.error) {
      } else if (video.readyState >= 3) {
        onReady(video);
      } else {
        setTimeout(() => {
          checkforVideo(video);
        }, 500);
      }
    };

    checkforVideo(this.video);
  }

  createVrVideo(options: any, success: any = null) {
    this.video = document.createElement('video');

    const generateVideoMesh = (video, position, split = 'x') => {
      const materialType = options.material.type || 'MeshBasicMaterial';
      const texture = new THREE.VideoTexture(video);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.format = THREE.RGBFormat;
      // textureLeft.wrapS = THREE.ClampToEdgeWrapping;
      if (split === 'y') {
        texture.repeat.set(1, .5);
        if (position === 'right') {
          texture.offset.y = .5;
        }
      } else {
        texture.repeat.set(.5, 1);
        if (position === 'right') {
          texture.offset.x = .5;
        }
      }

      const geometry = new THREE.PlaneGeometry(160, 90);
      // geometry.scale(-1, 1, 1);
      const material = new THREE[materialType]({map: texture});
      const mesh = new THREE.Mesh(geometry, material);
      if (position === 'right') {
        mesh.layers.set(2); // display in right eye only
      } else if (position === 'left') {
        mesh.layers.set(1); // display in left eye only
      }
      return mesh;


    };

    const onReady = (video) => {

      const group = new THREE.Group();

      // const mesh = generateVideoMesh(video, null, 'horizontal');
      const meshLeft = generateVideoMesh(video, 'left', 'horizontal');
      const meshRight = generateVideoMesh(video, 'left', 'horizontal');

      // group.add(mesh);
      group.add(meshLeft);
      group.add(meshRight);

      if (success) {
        success(group);
      }
    };
    this.initVideoOptions(options);

    const checkforVideo = (video) => {

      if (video.error) {
        console.log('createVrVideo error', video.error);
      } else if (video.readyState >= 3) {
        onReady(video);
      } else {
        console.log('createVrVideo state', video.readyState);
        setTimeout(() => {
          checkforVideo(video);
        }, 500);
      }
    };

    checkforVideo(this.video);
  }

  initVideoOptions(options) {
    if (options.video) {
      this.video.src = options.video.source;
      if (options.video.autoplay) {
        if (this.video.readyState !== 4) {
          this.video.addEventListener('canplay', () => {
            this.video.play();
          });
        } else {
          this.video.play();
        }
      }
      this.video.controls = options.video.controls || false;
      this.video.loop = options.video.loop || false;
      this.video.muted = options.video.muted || false;
      this.video.volume = options.video.volume || 0;
      this.video.load();
    }
  }

  clickButton(size, icon, onClick, success) {
    const loader = new THREE.TextureLoader(this.loadingManager);
    loader.load(
      '/assets/images/ui/' + icon,
      (texture) => {
        const material = this.createTextureMaterial('MeshStandardMaterial', texture);
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size.x, size.y), material);
        mesh.userData = {
          click: onClick
        };
        success(mesh);
      }
    );
  }

  createGeometry(type, options: any) {
    if (THREE[type]) {

      const attributes = [];
      if (options && GeometryTypes[type]) {
        // tslint:disable-next-line:forin
        for (const key in GeometryTypes[type]) {
          let attr = GeometryTypes[type][key];
          if (options[key] || options[key] === 0 || options[key] === false) {
            attr = options[key];
          }
          attributes.push(attr);
          if (options.attributes) {
            for (let i = 0; i < options.attributes.length; i++) {
              attributes[i] = options.attributes[i];
            }
          }
        }
      }
      const threeGeometry = new THREE[type](...attributes);
      return threeGeometry;
    } else {
      console.log('geometry Errror', type, options);
    }
  }

  createMaterial(type, options: any) {
    if (THREE[type]) {
      let threeMaterial;
      if (type !== 'LineBasicMaterial'
        && type !== 'LineDashedMaterial'
        && options.texture
      ) {
        threeMaterial = this.createTextureMaterial(type, options);
      } else {
        threeMaterial = new THREE[options.type]();
      }
      if (type !== 'MeshNormalMaterial') {
        threeMaterial.color = new THREE.Color(0xCCCCCC);
      }
      for (const key in options) {
        if (key !== 'type' && key !== 'color' && key !== 'texture' && key !== 'reflection') {
          threeMaterial[key] = options[key];
        }
      }
      if (options.reflection) {

      }
      if (options.color) {
        threeMaterial.color = new THREE.Color(options.color);
      }
      if (options.side && THREE[options.side]) {
        threeMaterial.side = THREE[options.side];
      } else {
        threeMaterial.side = THREE.DoubleSide;
      }
      let physicMaterial = null;
      if (options.physical) {
        physicMaterial = Physijs.createMaterial(threeMaterial, options.physical.friction || .6, options.physical.restitution || .3);
      }
      return physicMaterial || threeMaterial;
    } else {
      console.log('material Errror', type, options);
    }
  }

  createMirrorMaterial(options: any) {
    console.log('createMirrorMaterial', options);
    this.cubeCamera = new THREE.CubeCamera(0.1, 100000, 512);
    // this.cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    const material = new THREE.MeshBasicMaterial({
      envMap: this.cubeCamera.renderTarget.texture
    });
    console.log('createMirrorMaterial', material);
    return material;
  }

  createTextureMaterial(type, options: any, texture = null, alphaMap = null) {
    let threeMaterial;
    if (THREE[type]) {
      if (!texture && options.texture && options.texture.image) {
        texture = new THREE.TextureLoader().load(options.texture.image);
      }
      if (alphaMap) {
        threeMaterial = new THREE[options.type]({map: texture, alphaMap});
        if (alphaMap) {
          threeMaterial.transparent = true;
          threeMaterial.alphaTest = .5;
        }
      } else {
        threeMaterial = new THREE[options.type]({map: texture});
      }

      if (options.texture && options.texture.blendSrc && THREE[options.texture.blendSrc]) {
        threeMaterial.blendSrc = THREE[options.texture.blendSrc];
      }
      if (options.texture && options.texture.blendDst && THREE[options.texture.blendDst]) {
        threeMaterial.blendDst = THREE[options.texture.blendDst];
      }

      if (options.texture && options.side && THREE[options.side]) {
        threeMaterial.side = THREE[options.side];
      } else {
        threeMaterial.side = THREE.DoubleSide;
      }

      if (options.texture && options.texture.magFilter && THREE[options.texture.magFilter]) {
        texture.magFilter = THREE[options.texture.magFilter];
      } else {
        texture.magFilter = THREE.LinearFilter;
      }
      if (options.texture && options.texture.minFilter && THREE[options.texture.minFilter]) {
        texture.minFilter = THREE[options.minFilter];
      } else {
        texture.minFilter = THREE.NearestFilter;
      }
      if (options.texture && options.texture.anisotropy) {
        texture.anisotropy = options.anisotropy;
      } else {
        texture.anisotropy = 1;
      }
      if (options.texture && options.texture.wrapS && THREE[options.texture.wrapS]) {
        texture.wrapS = THREE[options.texture.wrapS];
      }
      if (options.texture && options.texture.wrapT && THREE[options.texture.wrapT]) {
        texture.wrapT = THREE[options.texture.wrapT];
      }
      if (options.texture && options.texture.offset) {
        texture.offset = new THREE.Vector2(options.texture.offset.x, options.texture.offset.y);
      } else {
        texture.offset = new THREE.Vector2();
      }
      if (options.texture && options.texture.repeat) {
        texture.repeat = new THREE.Vector2(options.texture.repeat.x, options.texture.repeat.y);
      }
      if (options.texture && options.texture.center) {
        texture.center = options.texture.center;
      }
      if (options.texture && options.texture.rotation || options.texture && options.texture.rotation === 0) {
        texture.rotation = options.texture.rotation;
      }
    } else {
      console.log('texture material Errror', type, options);
    }
    return threeMaterial;
  }

  createCanvasMaterial(type, options, canvas, alphaCanvas = null) {
    let threeMaterial;
    if (THREE[type]) {
      const texture = new THREE.CanvasTexture(canvas);
      let textureAlpha;
      if (alphaCanvas) {
        textureAlpha = new THREE.CanvasTexture(alphaCanvas);
        threeMaterial = new THREE[type]({
          map: texture, alphaMap: textureAlpha, transparent: true,
          depthWrite: false
        });
      } else {
        threeMaterial = new THREE[type]({map: texture});
      }

      threeMaterial.side = THREE.DoubleSide;
    } else {
      console.log('texture material Errror', type, options);
    }
    return threeMaterial;
  }

  appendTo(parentObject) {
    if (parentObject && parentObject.add) {
      parentObject.add(this.object);
      this.parent = parentObject;
    }
    if (this.onCreated) {
      this.onCreated(this);
    }
  }

  moveTo(position, duration, onEnd: any = null, easingType = 'Linear.None') {
    if (this.tween.position) {
      this.tween.position.stop();
      this.tween.position = null;
    }
    this.tween.position = new TWEEN.Tween({
      x: this.object.position.x,
      y: this.object.position.y,
      z: this.object.position.z,
    }).to({x: position.x, y: position.y, z: position.z}, duration)
      .easing(EasingType(easingType))
      .onUpdate((d) => {
        this.object.position.x = d.x;
        this.object.position.y = d.y;
        this.object.position.z = d.z;
        this.lookAt();
      }).onComplete((d) => {
        if (onEnd) {
          onEnd(d);
        }
      });
    this.tween.position.start();
  }

  scaleTo(scale, duration, onEnd: any = null, easingType = 'Linear.None') {
    if (this.tween.scale) {
      this.tween.scale.stop();
      this.tween.scale = null;
    }
    this.tween.scale = new TWEEN.Tween({
      x: this.object.scale.x,
      y: this.object.scale.y,
      z: this.object.scale.z,
    }).to({x: scale.x, y: scale.y, z: scale.z}, duration)
      .easing(EasingType(easingType))
      .onUpdate((d) => {
        this.object.scale.x = d.x;
        this.object.scale.y = d.y;
        this.object.scale.z = d.z;
      }).onComplete((d) => {
        if (onEnd) {
          onEnd(d);
        }
      });
    this.tween.scale.start();
  }

  rotateTo(rotation, duration, onEnd: any = null, easingType = 'Linear.None') {
    if (this.tween.rotation) {
      this.tween.rotation.stop();
      this.tween.rotation = null;
    }
    if (this.lookAtTarget) {
      this.lookAtTarget = null;
    }
    this.tween.rotation = new TWEEN.Tween({
      x: this.object.rotation.x,
      y: this.object.rotation.y,
      z: this.object.rotation.z,
    }).to({x: rotation.x, y: rotation.y, z: rotation.z}, duration)
      .easing(EasingType(easingType))
      .onUpdate((d) => {
        this.object.rotation.x = d.x;
        this.object.rotation.y = d.y;
        this.object.rotation.z = d.z;
      }).onComplete((d) => {
        if (onEnd) {
          onEnd(d);
        }
      });
    this.tween.rotation.start();
  }

  lookAt(position = this.lookAtTarget) {
    this.lookAtTarget = position;
    if (this.lookAtTarget) {
      if (this.camera) {
        this.camera.lookAt(this.lookAtTarget.x, this.lookAtTarget.y, this.lookAtTarget.z);
      } else {
        this.object.lookAt(this.lookAtTarget.x, this.lookAtTarget.y, this.lookAtTarget.z);
      }
    }
  }

  materialOffsetTo(offset, duration, onEnd: any = null, easingType = 'Linear.None') {
    if (this.tween.materialOffset) {
      this.tween.materialOffset.stop();
      this.tween.materialOffset = null;
    }
    if (this.mesh && this.mesh.material && this.mesh.material.map) {
      this.tween.materialOffset = new TWEEN.Tween({
        x: this.mesh.material.map.offset.x,
        y: this.mesh.material.map.offset.y
      }).to({x: offset.x, y: offset.y}, duration)
        .easing(EasingType(easingType))
        .onUpdate((d) => {
          this.mesh.material.map.offset.x = d.x;
          this.mesh.material.map.offset.y = d.y;
        }).onComplete((d) => {
          if (onEnd) {
            onEnd(d);
          }
        });
      this.tween.materialOffset.start();
    }
  }

  setPosition(position, destroyTween = true) {
    if (destroyTween && this.tween.position) {
      this.tween.position.stop();
      this.tween.position = null;
    }
    this.object.position.set(
      position.x,
      position.y,
      position.z
    );
    this.lookAt();
  }

  setScale(scale, destroyTween = true) {
    if (destroyTween && this.tween.scale) {
      this.tween.scale.stop();
      this.tween.scale = null;
    }
    this.object.scale.set(
      scale.x,
      scale.y,
      scale.z
    );
  }

  setScalar(scale) {
    this.object.scale.setScalar(scale);
  }

  setRotation(rotation, destroyTween = true) {
    if (destroyTween && this.tween.rotation) {
      this.tween.rotation.stop();
      this.tween.rotation = null;
    }
    this.object.rotation.set(
      rotation.x,
      rotation.y,
      rotation.z
    );
  }

  update(renderer, scene) {
    this.children.forEach((child) => {
      child.position.set(
        -this.pivot.x,
        -this.pivot.y,
        -this.pivot.z,
      );
      child.updateMatrix();
    });


    if (this.particles && this.object.children) {
      const positions = this.geometry.attributes.position;
      const initialPositions = this.geometry.attributes.initialPosition;
      const count = positions.count;
      const inRange = (value, range = this.particleSettings.endRange) => {
        if (value > range || value < -range) {
          return false;
        }
        return true;
      };
      for (let i = 0; i < count; i++) {
        if (this.particleSettings.particles[i] && this.particleSettings.particles[i].delay) {
          this.particleSettings.particles[i].delay--;
        } else {
          let x = positions.getX(i);
          let y = positions.getY(i);
          let z = positions.getZ(i);

          if (this.particleSettings && this.particleSettings.gravity) {
            x += this.particleSettings.gravity.x;
            y += this.particleSettings.gravity.y;
            z += this.particleSettings.gravity.z;
          }
          if (this.particleSettings && this.particleSettings.particles && this.particleSettings.particles[i]) {
            if (this.particleSettings.particles[i].velocity) {
              x += this.particleSettings.particles[i].velocity.x;
              y += this.particleSettings.particles[i].velocity.y;
              z += this.particleSettings.particles[i].velocity.z;
            }


          }

          if (!inRange(x) || !inRange(y) || !inRange(z)) {
            x = THREE.MathUtils.randFloatSpread(this.particleSettings.startRange);
            y = THREE.MathUtils.randFloatSpread(this.particleSettings.startRange);
            z = THREE.MathUtils.randFloatSpread(this.particleSettings.startRange);
          }
          positions.setXYZ(i,
            x,
            y,
            z
          );

        }
      }
      positions.needsUpdate = true;
    }


    if (this.cubeCamera) {
      if (scene && !this.cubeCameraAdded) {
        scene.add(this.cubeCamera);
        this.cubeCameraAdded = true;
      }

      // this.cubeCamera.position = this.object.position;
      if (scene && renderer) {
        if (this.mesh) {
          this.mesh.visible = false;
          this.cubeCamera.position.set(this.mesh.position);
        }
        this.cubeCamera.update(renderer, scene);
        this.cubeCamera.updateCubeMap(renderer, scene);
        if (this.mesh) {
          this.mesh.visible = true;
        }
      }

    }

    this.object.updateMatrix();
  }

  collide(collisionResults) {
    // console.log('collide', collisionResults);
  }

  hide() {
    console.log('hide', this.id, this.type);
    if (this.mesh) {
      this.mesh.visible = false;
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.visible = false;
        }
      });
    }

  }

  show() {
    console.log('show', this.id, this.type);
    if (this.mesh) {
      this.mesh.visible = true;
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.visible = true;
        }
      });
    }
  }

  clone(parentObject = null) {
    const clone = new AnimationObject('clone', this.options, parentObject, this.objects);
    if (this.mesh) {
      clone.mesh = this.mesh.clone();
      clone.object.add(clone.mesh);
      clone.initMesh(clone.options);
      clone.initObject(clone.options, clone.mesh);
    } else {
      clone.object = this.object.clone();
      clone.initObject(clone.options, clone.mesh);
    }
    if (parentObject) {
      clone.appendTo(parentObject);
    }
    return clone;
  }

  remove() {
    this.objects.forEach((item, index) => {
      if (item === this) {
        this.objects.splice(index, 1);
      }
    });
    this.parent.remove(this.object);
    this.object.remove();
  }

  on(event: string, callback: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    } else {
      console.log('event ' + event + ' not exist');
    }
  }

  do(event, data) {
    if (this.callbacks[event]) {
      for (const callback of this.callbacks[event]) {
        callback(data);
      }
    } else {
      console.log('event ' + event + ' not exist');
    }
  }
}

export class AnimationPreset {
  constructor(public name: string, public type = 'mesh', public options = {}) {

  }
}

export const GeometryTypes = {
  BoxGeometry: {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1
  },
  CircleGeometry: {
    radius: 1,
    segments: 8,
    thetaStart: 0,
    thetaLength: (Math.PI * 2)
  },
  ConeGeometry: {
    radius: 1,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: (Math.PI * 2)
  },
  CylinderGeometry: {
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: (Math.PI * 2)
  },
  DodecahedronGeometry: {
    radius: 1,
    detail: 0
  },
  IcosahedronGeometry: {
    radius: 1,
    detail: 0
  },
  LatheGeometry: {
    points: [],
    segments: 12,
    phiStart: 0,
    phiLength: (Math.PI * 2)
  },
  OctahedronGeometry: {
    radius: 1,
    detail: 0
  },
  ParametricGeometry: {
    func: () => {
    },
    slices: 25,
    stacks: 25,
  },
  PlaneGeometry: {
    width: 1,
    height: 1,
    widthSegments: 1,
    heightSegments: 1
  },
  PolyhedronGeometry: {
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
  },
  RingGeometry: {
    innerRadius: 0.5,
    outerRadius: 1,
    thetaSegments: 8,
    phiSegments: 8,
    thetaStart: 0,
    thetaLength: (Math.PI * 2)
  },
  ShapeGeometry: {
    shapes: [],
    curveSegments: 12
  },
  SphereGeometry: {
    radius: 1,
    widthSegments: 8,
    heightSegments: 6,
    phiStart: 0,
    phiLength: (Math.PI * 2),
    thetaStart: 0,
    thetaLength: (Math.PI)
  },
  TetrahedronGeometry: {
    radius: 1,
    detail: 1
  },
  TextGeometry: {
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
  },
  TorusGeometry: {
    radius: 1,
    tube: .4,
    radialSegments: 8,
    tubularSegments: 6,
    arc: (Math.PI * 2)
  },
  TorusKnotGeometry: {
    radius: 1,
    tube: .4,
    tubularSegments: 64,
    radialSegments: 8,
    p: 2,
    q: 3
  },
  TubeGeometry: {
    path: null,
    tubularSegments: 64,
    radius: 1,
    radialSegments: 8,
    closed: false
  },
};

export const EasingTypes = [
  {category: 'Linear', type: 'None', value: 'Linear.None', graph: TWEEN.Easing.Linear.None},
  {category: 'Quadratic', type: 'In', value: 'Quadratic.In', graph: TWEEN.Easing.Linear.None},
  {category: 'Quadratic', type: 'Out', value: 'Quadratic.Out', graph: TWEEN.Easing.Linear.None},
  {category: 'Quadratic', type: 'InOut', value: 'Quadratic.InOut', graph: TWEEN.Easing.Linear.None},
  {category: 'Cubic', type: 'In', value: 'Cubic.In', graph: TWEEN.Easing.Linear.None},
  {category: 'Cubic', type: 'Out', value: 'Cubic.Out', graph: TWEEN.Easing.Linear.None},
  {category: 'Cubic', type: 'InOut', value: 'Cubic.InOut', graph: TWEEN.Easing.Linear.None},
  {category: 'Quartic', type: 'In', value: 'Quartic.In', graph: TWEEN.Easing.Linear.None},
  {category: 'Quartic', type: 'Out', value: 'Quartic.Out', graph: TWEEN.Easing.Linear.None},
  {category: 'Quartic', type: 'InOut', value: 'Quartic.InOut', graph: TWEEN.Easing.Linear.None},
  {category: 'Quintic', type: 'In', value: 'Quintic.In', graph: TWEEN.Easing.Linear.None},
  {category: 'Quintic', type: 'Out', value: 'Quintic.Out', graph: TWEEN.Easing.Linear.None},
  {category: 'Quintic', type: 'InOut', value: 'Quintic.InOut', graph: TWEEN.Easing.Linear.None},
  {category: 'Sinusoidal', type: 'In', value: 'Sinusoidal.In', graph: TWEEN.Easing.Linear.None},
  {category: 'Sinusoidal', type: 'Out', value: 'Sinusoidal.Out', graph: TWEEN.Easing.Linear.None},
  {category: 'Sinusoidal', type: 'InOut', value: 'Sinusoidal.InOut', graph: TWEEN.Easing.Linear.None},
  {category: 'Exponential', type: 'In', value: 'Exponential.In', graph: TWEEN.Easing.Linear.None},
  {category: 'Exponential', type: 'Out', value: 'Exponential.Out', graph: TWEEN.Easing.Linear.None},
  {category: 'Exponential', type: 'InOut', value: 'Exponential.InOut', graph: TWEEN.Easing.Linear.None},
  {category: 'Back', type: 'In', value: 'Back.In', graph: TWEEN.Easing.Linear.None},
  {category: 'Back', type: 'Out', value: 'Back.Out', graph: TWEEN.Easing.Linear.None},
  {category: 'Back', type: 'InOut', value: 'Back.InOut', graph: TWEEN.Easing.Linear.None},
  {category: 'Bounce', type: 'In', value: 'Bounce.In', graph: TWEEN.Easing.Linear.None},
  {category: 'Bounce', type: 'Out', value: 'Bounce.Out', graph: TWEEN.Easing.Linear.None},
  {category: 'Bounce', type: 'InOut', value: 'Bounce.InOut', graph: TWEEN.Easing.Linear.None},
];

export const EasingType = (type: string = 'Linear.None') => {
  for (const easing of EasingTypes) {
    if (easing.value === type) {
      return easing.graph;
    }
  }
  return EasingTypes[0].graph;
};


