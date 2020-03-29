import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// import { VRButton } from 'three/examples/jsm/webxr/VRButton';

export class GamepadBinding {
  hand = 'left';
  axeIndex = 0;
  buttonIndex = 0;
  pressed = false;

  onTouch = (value: any) => {
  };
  onPress = (value: any) => {
  };
  onAxe = (value: any) => {
  };
  onValue = (value: any) => {
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThreeVrService {
  currentSession;

  vrMode;
  vrDevice;
  vrDisplays = [];
  savedCameraPosition;

  gamepads;
  vrController = new THREE.Group();
  vrControllers;
  vrController1;
  vrControllerInput1;
  vrController2;
  vrControllerInput2;

  vrControllerOffset = new THREE.Vector3(0, 0, 0);
  tempMatrix = new THREE.Matrix4();

  gamepadBinding: GamepadBinding[] = [
    {
      hand: 'left',
      axeIndex: 0,
      onAxe: (value) => {
        // joystick axes Y
      },
    } as GamepadBinding,
    {
      hand: 'left',
      axeIndex: 2,
      onAxe: (value) => {
        // joystick axes Y
      },
    } as GamepadBinding,
    {
      hand: 'right',
      axeIndex: 0,
      onAxe: (value) => {
        // joystick axes Y
      },
    } as GamepadBinding,
    {
      hand: 'right',
      axeIndex: 2,
      onAxe: (value) => {
        // joystick axes Y
      },
    } as GamepadBinding,
    {
      hand: 'left',
      axeIndex: 1,
      onAxe: (value) => {
        // joystick axes X
      },
    } as GamepadBinding,
    {
      hand: 'left',
      buttonIndex: 1,
      onPress: (value) => {
      },
    } as GamepadBinding,
    {
      hand: 'left',
      buttonIndex: 2,
      onPress: (value) => {
        // bottom button
      },
    } as GamepadBinding,
    {
      hand: 'left',
      buttonIndex: 4,
      onPress: (value) => {
        // touch pad
      },
    } as GamepadBinding,
  ];

  objLoader = new OBJLoader();

  scene;
  camera;
  renderer;
  raycaster;
  interactiveObjects = [];

  constructor() {

  }

  init(scene: any, renderer, raycaster, camera) {

    this.scene = scene;
    this.renderer = renderer;
    this.raycaster = raycaster;
    this.camera = camera;

    this.onPageVrLoad();
  }

  onPageVrLoad() {


    if (navigator.activeVRDisplays) {
      for (const display of navigator.activeVRDisplays) {
        display.exitPresent();
      }
    }
  }

  enterVrMode(device) {
    this.vrMode = 'started';
    if (this.vrDevice && !this.vrDevice.isPresenting) {
      this.vrDevice.requestPresent([{source: this.renderer.domElement}]);
    } else if (this.vrDevice && this.vrDevice.isPresenting) {
      this.stopVrMode();
      setTimeout(() => {
        this.enterVrMode(device);
      }, 1000);
    }
  }

  setVrCamera() {
    this.savedCameraPosition = {
      position: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      },
      rotation: {
        x: this.camera.rotation.x,
        y: this.camera.rotation.y,
        z: this.camera.rotation.z,
      },
    };

    // this.camera.position.set(0, 0, 100);
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // this.camera.position.set(-60, 2, 2);
  }

  unsetVrCamera() {
    if (this.savedCameraPosition) {
      this.camera.position.set(
        this.savedCameraPosition.position.x,
        this.savedCameraPosition.position.y,
        this.savedCameraPosition.position.z,
      );
      this.camera.rotation.set(
        this.savedCameraPosition.rotation.x,
        this.savedCameraPosition.rotation.y,
        this.savedCameraPosition.rotation.z,
      );
    }
  }

  initVrController() {
    this.gamepads = navigator.getGamepads();
    if (this.vrController1) {
      this.vrController1 = this.removeVrController(this.vrController1);
    }
    this.vrController1 = this.addController(this.vrController1, 0);
    if (this.vrController2) {
      this.vrController2 = this.removeVrController(this.vrController2);
    }
    // this.showGui();
    this.vrController2 = this.addController(this.vrController2, 1);

    if (this.vrController1 && !this.vrControllerInput1) {
      if (this.gamepads && this.gamepads[0]) {
        this.vrController1.userData.gamepad = this.gamepads[0];
      }
      // this.vrControllerInput1 = this.gui.addInput(this.vrController1);
      this.vrController1.userData.input = this.vrControllerInput1;
    } else {
      this.vrControllerInput1 = null;
    }
    if (this.vrController2 && !this.vrControllerInput2) {
      if (this.gamepads && this.gamepads[1]) {
        this.vrController2.userData.gamepad = this.gamepads[1];
      }
      //  this.vrControllerInput2 = this.gui.addInput(this.vrController2);
      this.vrController2.userData.input = this.vrControllerInput2;
    } else {
      this.vrControllerInput2 = null;
    }
    //  this.gui.setCamera(this.camera, this.renderer);
  }

  addController(controller: any, int: number) {
    controller = this.renderer.xr.getController(int);
    if (controller) {
      controller.addEventListener('selectstart', (event) => {
        if (controller.userData.input) {
          controller.userData.input.pressed(true);
        }
        const intersections = this.getVrIntersections(controller, this.interactiveObjects);
        if (intersections.length > 0) {
          const intersection = intersections[0];
          let object = intersection.object;
          controller.userData.selectedMesh = object;
          let parent = this.scene;
          if (object.userData) {
            object = object.userData;
          }
          if (object.userData.parent) {
            parent = object.userData.parent;
          }
          object.userData.selected = true;
          if (object.selectable) {
            SceneUtils.attach(object, parent, controller);
            controller.userData.selectedObject = object;
          }
        }
      });
      controller.addEventListener('selectend', (event) => {
        if (controller.userData.input) {
          controller.userData.input.pressed(false);
        }
        if (controller.userData.selectedMesh) {
          controller.userData.selectedMesh = null;
        }
        if (controller.userData.selectedObject) {
          const object = controller.userData.selectedObject;
          SceneUtils.attach(object, controller, object.userData.parent);
          object.userData.selected = false;
          controller.userData.selectedObject = null;
        }
      });
      this.controllerModel(controller, int);
      this.vrController.add(controller);
      if (this.camera.userData.object) {
        this.camera.userData.object.add(controller);
      } else {
        this.scene.add(controller);
      }

    }
    return controller;
  }

  getVrIntersections(controller, objects = this.interactiveObjects) {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
    return this.raycaster.intersectObjects(objects);
  }

  removeVrController(controller) {
    this.scene.remove(controller);
    controller.remove();
    controller = null;
    return controller;
  }

  handleVrController(controller) {
    if (controller && controller.update) {
      controller.update();
    }

  }

  gamepadAxe(axeIndex, hand, value) {
    // console.log('gamepadAxe', axeIndex, hand, value);
    for (const binding of this.gamepadBinding) {
      if (binding.onAxe && binding.axeIndex === axeIndex && binding.hand === hand) {
        binding.onAxe(value);
      }
    }
  }

  gamepadButtonPressed(buttonIndex, hand, value) {
    // console.log('gamepadButtonPressed', buttonIndex, hand, value);
    for (const binding of this.gamepadBinding) {
      if (binding.onPress && binding.buttonIndex === buttonIndex && binding.hand === hand) {
        if (!binding.pressed) {
          binding.pressed = true;
          binding.onPress(value);
        }
      }
    }
  }

  gamepadButtonFree(buttonIndex, hand, value) {
    // console.log('gamepadButtonPressed', buttonIndex, hand, value);
    for (const binding of this.gamepadBinding) {
      if (binding.buttonIndex === buttonIndex && binding.hand === hand && binding.pressed) {
        binding.pressed = false;
      }
    }
  }

  gamepadButtonTouched(buttonIndex, hand, value) {
    // console.log('gamepadButtonTouched', buttonIndex, hand, value);
    for (const binding of this.gamepadBinding) {
      if (binding.onTouch && binding.buttonIndex === buttonIndex && binding.hand === hand) {
        binding.onTouch(value);
      }
    }
  }

  gamepadButtonValue(buttonIndex, hand, value) {
    // console.log('gamepadButtonValue', buttonIndex, hand, value);
    for (const binding of this.gamepadBinding) {
      if (binding.onValue && binding.buttonIndex === buttonIndex && binding.hand === hand) {
        binding.onValue(value);
      }
    }
  }

  controllerModel(controller: any, int: number) {

    const controllerLineLength = 10;
    const controllerMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
    });

    if (int === 0) {
      const lineMaterial = new THREE.MeshToonMaterial({
        color: 0x0000ff,
      });

      const lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, controllerLineLength),
      );
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.visible = false;
      controller.add(line);
      controller.userData.line = line;

      this.objLoader.load('assets/obj/wrench.obj', (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = controllerMaterial;
          }
        });
        object.position.set(-.02, -.02, .15);
        object.scale.set(.02, .02, .02);
        controller.add(object);
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      }, (error) => {
        console.log('objLoader error', error);
      });
    } else {
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000ff,
      });
      const lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -controllerLineLength),
      );
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.visible = true;
      controller.add(line);
      controller.userData.line = line;
      this.objLoader.load('assets/obj/FlareGun.obj', (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = controllerMaterial;
          }
        });
        object.position.set(0, -.123, .1);
        controller.add(object);
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      }, (error) => {
        console.log('objLoader error', error);
      });
    }
  }

  toggleVrMode() {
    if (!this.vrMode) {


      this.startVrMode({
        frameOfReferenceType: 'stage',
      });

    } else {
      this.stopVrMode();
    }
  }

  startVrMode(options: any = null) {
    if (this.currentSession) {
      this.stopVrMode();
      return;
    }

    if (this.vrController) {
      this.vrController.position.set(
        this.vrControllerOffset.x,
        this.vrControllerOffset.y,
        this.vrControllerOffset.z,
      );
    }


    if (options && options.frameOfReferenceType) {
      // this.renderer.xr.setFrameOfReferenceType(options.frameOfReferenceType);
    }
    // tslint:disable-next-line
    if ('xr' in navigator) {
      // tslint:disable-next-line

      // tslint:disable-next-line
      (navigator['xr'] as any).isSessionSupported('immersive-vr').then((supported) => {

        supported ? this.enterVRDevice() : this.vrNotFound();

      });
      return;
    } else if (navigator.getVRDisplays) {
      window.addEventListener('vrdisplayconnect', (event: any) => {
        console.log('vrdisplayconnect', event);
        if (event.display) {
          this.enterVRDevice(event.display);
        }
      }, false);
      window.addEventListener('vrdisplaydisconnect', (event) => {
        this.vrNotFound();
      }, false);
      window.addEventListener('vrdisplaypresentchange', (event: any) => {
        if (event.display) {
          if (event.display.isPresenting) {
            this.vrMode = 'started';
          } else {
            this.vrMode = 'available';
          }
        }
      }, false);
      window.addEventListener('vrdisplayactivate', (event: any) => {
        if (event.display) {
          event.display.requestPresent([{source: this.renderer.domElement}]);
        }
      }, false);
      window.addEventListener('gamepadconnected', (event: any) => {
        if (event.gamepad) {
          console.log('Gamepad ' + event.gamepad.index + ' connected.');
          this.initVrController();
        }
      });
      window.addEventListener('gamepaddisconnected', (event: any) => {
        if (event.gamepad) {
          console.log('Gamepad ' + event.gamepad.index + ' disconnected.');
          this.initVrController();
        }
      });
      this.vrControllers = [];
      this.vrDisplays = [];
      if (navigator.getVRDisplays) {
        navigator.getVRDisplays()
          .then((displays) => {
            if (displays.length > 0) {
              this.enterVRDevice(displays[0]);
            } else {
              this.vrNotFound();
            }
            console.log(displays.length + ' VR displays');
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < displays.length; i++) {
              this.vrDisplays.push(displays[i]);
            }
            if (navigator.getGamepads) {
              setTimeout(() => {
                const gamepads = navigator.getGamepads();
                console.log(gamepads.length + ' VR controllers');
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < gamepads.length; ++i) {
                  this.vrControllers.push(gamepads[i]);
                }
                this.initVrController();
              }, 1000);
            }
          }).catch(() => {
          this.vrNotFound();
        });

      } else {
        console.log('WebVR API and/or Gamepad API not supported by this browser.');
      }

      return;
    } else {
      console.log(navigator);
      const underline = (s) => {
        const arr = s.split('');
        s = arr.join('\u0332');
        if (s) {
          s = s + '\u0332';
        }
        return s;
      };

      alert(
        underline('No VR support found. ') + '\n\n' +
        'The best support for VR is in current version of Mozilla FireFox.\n\n' +
        'If you whant to use the ' + underline('experimental VR mode') + ' in Google Chrome, \ngo to the address bar and type: ' +
        underline('chrome://flags') + '. \nThen in the ' + underline('search bar') + ' for the flags, type ' +
        underline('vr') + '. \n' +
        'Enable the flags regarding WebVR and the runtime that you usually use for virtual reality. \nClick the ' +
        underline('RELAUNCH NOW') + '* button and try out again.',
      );
      return;

    }

  }

  stopVrMode() {
    this.unsetVrCamera();
    this.vrMode = false;
    if (this.vrDevice) {
      this.vrDevice.exitPresent();
      this.vrDevice = null;
    }

    if (this.renderer.xr) {
      this.renderer.xr.enabled = false;
    }
    this.currentSession.end();
    this.currentSession = null;
    for (const display of this.vrDisplays) {
      display.exitPresent();
    }

  }

  exitVrMode() {
    this.stopVrMode();
  }

  vrNotFound() {
    this.vrMode = 'unavailable';
    setTimeout(() => {
      this.stopVrMode();
    }, 500);
  }

  enterVRDevice(display = null) {

    const onSessionStarted = (session) => {
      session.addEventListener('end', onSessionEnded);
      this.setVrCamera();
      this.vrMode = 'available';
      this.renderer.xr.enabled = true;
      this.renderer.xr.setSession(session);
      this.currentSession = session;
    };
    const onSessionEnded = ( /*event*/) => {
      this.currentSession.removeEventListener('end', onSessionEnded);
      this.exitVrMode();
    };
    const sessionInit = {optionalFeatures: ['local-floor', 'bounded-floor']};
    if ('xr' in navigator) {
      // tslint:disable-next-line
      (navigator['xr'] as any).requestSession('immersive-vr', sessionInit).then(onSessionStarted);
    } else if (display) {
      this.vrDevice = display;
      if ('setDevice' in this.renderer.xr) {
        this.renderer.xr.setDevice(display);
        this.renderer.xr.enabled = true;
      } else if ('setDevice' in this.renderer.vr) {
        this.renderer.vr.setDevice(display);
        this.renderer.vr.enabled = true;
      }

    }

  }

  animateControllers() {
    const gamepadAxesTolerance = .3;
    if (this.gamepads) {
      for (const gamepad of this.gamepads) {
        if (gamepad && gamepad.axes) {
          for (let i = 0; i < gamepad.axes.length; i++) {
            if (Math.abs(gamepad.axes[i]) > gamepadAxesTolerance) {
              this.gamepadAxe(i, gamepad.hand || null, gamepad.axes[i]);
            }
          }
        }
        if (gamepad && gamepad.buttons) {
          for (let i = 0; i < gamepad.buttons.length; i++) {
            if (gamepad.buttons[i].pressed) {
              this.gamepadButtonPressed(i, gamepad.hand || null, gamepad.buttons[i].value);
            } else {
              this.gamepadButtonFree(i, gamepad.hand || null, gamepad.buttons[i].value);
            }
            if (gamepad.buttons[i].touched) {
              this.gamepadButtonTouched(i, gamepad.hand || null, gamepad.buttons[i].value);
            }
            if (gamepad.buttons[i].value) {
              this.gamepadButtonValue(i, gamepad.hand || null, gamepad.buttons[i].value);
            }
          }
        }

      }
    }


    if (this.vrController1) {
      this.handleVrController(this.vrController1);

    }

    if (this.vrController2) {
      this.handleVrController(this.vrController2);
    }


  }
}
