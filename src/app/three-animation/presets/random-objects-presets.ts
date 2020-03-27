import { AnimationPreset } from '../classes/animation-object';

export const RandomObjectsPreset: AnimationPreset[] = [
  {
    name: 'text1',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: '#ffffff',
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'electro',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 50,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: .05,
          bevelSize: .02,
          bevelOffset: 0,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 250, z: 0}
    }
  },
  {
    name: 'text2',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: '#ffffff',
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'psy',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 50,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: .05,
          bevelSize: .02,
          bevelOffset: 0,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 300, z: 0}
    }
  },
  {
    name: 'text3',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: '#ffffff',
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'beat',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 50,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: .05,
          bevelSize: .02,
          bevelOffset: 0,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 400, z: 0}
    }
  },
  {
    name: 'text4',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: '#ffffff',
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'melody',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 50,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: .05,
          bevelSize: .02,
          bevelOffset: 0,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 300, z: 0}
    }
  },
  {
    name: 'text6',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: '#ffffff',
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'rhythm',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 50,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: .05,
          bevelSize: .02,
          bevelOffset: 0,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 250, z: 0}
    }
  },
  {
    name: 'box1',
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
            x: 1.5,
            y: 1.5,
          }
        }
      },
      geometry: {
        type: 'BoxGeometry',
        width: 100,
        height: 100,
        depth: 100,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: 40,
        z: 0
      }
    }
  },
  {
    name: 'box2',
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
            x: 2.5,
            y: 2.5,
          }
        }
      },
      geometry: {
        type: 'BoxGeometry',
        width: 200,
        height: 200,
        depth: 200,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: 80,
        z: 0
      }
    }
  },
  {
    name: 'cylinder1',
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
            x: 2.5,
            y: 2.5,
          }
        }
      },
      geometry: {
        type: 'CylinderGeometry',
        radiusTop: 100,
        radiusBottom: 100,
        height: 200,
        radialSegments: 32,
        heightSegments: 1,
        openEnded: false,
        thetaStart: 0,
        thetaLength: (Math.PI * 2)
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: 80,
        z: 0
      }
    }
  },
  {
    name: 'sphere1',
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
            x: 2.5,
            y: 2.5,
          }
        }
      },
      geometry: {
        type: 'CylinderGeometry',
        radius: 100,
        widthSegments: 8,
        heightSegments: 6,
        phiStart: 0,
        phiLength: (Math.PI * 2),
        thetaStart: 0,
        thetaLength: (Math.PI)
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
];
