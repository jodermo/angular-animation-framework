import { AnimationPreset } from '../../three-animation/classes/animation-object';

export const AudioAnimationPresets: AnimationPreset[] = [
  {
    name: 'box',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: '#ff00ec',
        receiveShadow: true,
        transparent: true,
        opacity: .25
      },
      geometry: {
        type: 'BoxGeometry',
        width: 60,
        height: 60,
        depth: 60,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  },
  {
    name: 'ball',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: '#ffffff',
      },
      geometry: {
        type: 'SphereGeometry',
        radius: 15,
        widthSegments: 16,
        heightSegments: 12,
        phiStart: 0,
        phiLength: Math.PI * 2,
        thetaStart: 0,
        thetaLength: Math.PI
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  },
  {
    name: 'ground',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        color: 0x8146ff,
        receiveShadow: true,
        texture: {
          image: 'assets/images/textures/ground.jpg',
          wrapS: 'RepeatWrapping',
          wrapT: 'RepeatWrapping',
          repeat: {
            x: 100,
            y: 100,
          }
        }
      },
      geometry: {
        type: 'PlaneGeometry',
        width: 10000,
        height: 10000,
        widthSegments: 50,
        heightSegments: 1
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: -1000,
        y: -.1,
        z: 0
      },
      rotation: {
        x: Math.PI / 2,
        y: 0,
        z: 0
      }
    }
  },
  {
    name: 'street',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        color: 0x666666,
        receiveShadow: true,
        texture: {
          image: 'assets/images/textures/street.jpg',
          wrapS: 'RepeatWrapping',
          repeat: {
            x: 40,
            y: 1,
          }
        }
      },
      geometry: {
        type: 'PlaneGeometry',
        width: 10000,
        height: 120,
        widthSegments: 50,
        heightSegments: 1
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: -1000,
        y: 0,
        z: 0
      },
      rotation: {
        x: Math.PI / 2,
        y: 0,
        z: 0
      }
    }
  },
  {
    name: 'skyline',
    type: 'image',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        transparent: true,
        texture: {
          wrapT: 'ClampToEdgeWrapping',
        }
      },
      image: {
        source: 'assets/images/sprites/skyline_1.jpg',
        alpha: 'assets/images/sprites/skyline_1_alpha.jpg'
      },
      size: {
        x: 16000,
        y: 4000
      },
      position: {
        x: -7000,
        y: 1400,
        z: 0
      },
      rotation: {
        x: 0,
        y: Math.PI / 2,
        z: 0
      }
    }
  },
  {

    name: 'sky',
    type: 'image-360',
    options: {
      material: {
        type: 'MeshBasicMaterial',
      },
      image: {
        source: 'assets/images/environments/stars.jpg'
      },
      radius: 999990,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  {
    name: 'directional-light',
    type: 'DirectionalLight',
    options: {
      light: {
        color: '#ffffff',
        castShadow: true,
        intensity: .5,
        shadow: {
          radius: 8
        }
      },
      position: {
        x: -10000,
        y: 1000,
        z: 0
      }
    }
  },
  {
    name: 'directional-light-orange',
    type: 'DirectionalLight',
    options: {
      light: {
        color: '#ff8400',
        castShadow: true,
        intensity: .5,
        shadow: {
          radius: 8
        }
      },
      position: {
        x: -10000,
        y: 1000,
        z: 0
      }
    }
  }
];
