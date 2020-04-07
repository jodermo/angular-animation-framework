import { AnimationPreset } from '../../three-animation/classes/animation-object';

export const AudioAnimationPresets: AnimationPreset[] = [
  {
    name: 'water_tower',
    type: 'obj',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/Water Tower Corona.obj',
        materials: [
          {
            name: 'tower',
            objectNames: ['Water_Tower'],
            material: {
              type: 'MeshToonMaterial',
              color: '#00eaff',
            }
          },
          {
            name: 'legs',
            objectNames: ['Legs', 'Base'],
            material: {
              type: 'MeshToonMaterial',
              color: '#510084',
            }
          },
          {
            name: 'tank',
            objectNames: ['Tank'],
            material: {
              type: 'MeshToonMaterial',
              color: '#03009b',
            }
          },
        ]
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: 2,
        y: 2,
        z: 2
      }
    }
  },
  {
    name: 'deer',
    type: 'obj',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/Deer_type_03_A_OBJ.obj',
        materials: [
          {
            name: 'body',
            objectNames: ['Deer_type_03_A_body'],
            material: {
              type: 'MeshToonMaterial',
              color: '#ff00ec',
            }
          },
          {
            name: 'legs',
            objectNames: ['Deer_type_03_A_horns'],
            material: {
              type: 'MeshToonMaterial',
              color: '#00eaff',
            }
          },
        ]
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: .25,
        y: .25,
        z: .25,
      }
    }
  },
  {
    name: 'chicken',
    type: 'obj',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/chicken_01.obj',
        materials: [
          {
            name: 'body',
            objectNames: ['chicken_lp'],
            material: {
              type: 'MeshToonMaterial',
              color: '#010040',
            }
          },
          {
            name: 'legs',
            objectNames: ['Deer_type_03_A_horns'],
            material: {
              type: 'MeshToonMaterial',
              color: '#00eaff',
            }
          },
        ]
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: .3,
        y: .3,
        z: .3,
      }
    }
  },
  {
    name: 'helicopter',
    type: 'obj',
    options: {
      speed: 3,
      material: {
        type: 'MeshToonMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/Lowpoly_Helicopter.obj',
        materials: [
          {
            name: 'body',
            objectNames: ['Copter'],
            material: {
              type: 'MeshToonMaterial',
              color: '#84007a',
            }
          },
          {
            name: 'legs',
            objectNames: ['Propeller', 'Propeller_1'],
            material: {
              type: 'MeshToonMaterial',
              color: '#00eaff',
            }
          },
        ]
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: 1000,
        z: 0
      },
      scale: {
        x: .1,
        y: .1,
        z: .1,
      }
    }
  },
  {
    name: 'silo',
    type: 'obj',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/Industrial Silo_6_obj.obj',
        materials: [
          {
            name: 'ground',
            objectNames: ["IS06_OBJ_05"],
            material: {
              type: 'MeshToonMaterial',
              color: '#510084',
            }
          },
          {
            name: 'metal1',
            objectNames: ["IS06_OBJ_01", "IS06_OBJ_02", "IS06_OBJ_03"],
            material: {
              type: 'MeshToonMaterial',
              color: '#00eaff',
            }
          },
          {
            name: 'pipes',
            objectNames: ['IS06_OBJ_04'],
            material: {
              type: 'MeshToonMaterial',
              color: '#ff00ec',
            }
          },
          {
            name: 'tanks',
            objectNames: ['IS06_OBJ_06'],
            material: {
              type: 'MeshToonMaterial',
              color: '#510084',
            }
          },
        ]
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {
        x: 0,
        y: -2,
        z: 0
      },
      scale: {
        x: .33,
        y: .33,
        z: .33,
      }
    }
  },
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
          radius: 1
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
          radius: 1
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
    name: 'point-light',
    type: 'PointLight',
    options: {
      light: {
        color: '#00eaff',
        castShadow: true,
        intensity: 2,
        shadow: {
          radius: 2
        }
      },
      position: {
        x: 0,
        y: 150,
        z: 0
      }
    }
  }
];
