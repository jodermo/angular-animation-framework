import { AnimationPreset } from '../../../three-animation/classes/animation-object';

const color = {
  text: '#00eaff',
  pyramid: '#510084'
};

export const RandomObjectsPreset: AnimationPreset[] = [
  {
    name: 'text1',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        color: color.text,
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'THREE.js',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 50,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 2,
          bevelOffset: 1,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 650, z: 0}
    }
  },
  {
    name: 'text2',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        color: color.text,
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'Angular',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 60,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 2,
          bevelOffset: 1,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 550, z: 0}
    }
  },
  {
    name: 'text3',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        color: color.text,
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'TWEEN.js',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 90,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 2,
          bevelOffset: 1,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 700, z: 0}
    }
  },
  {
    name: 'text4',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        color: color.text,
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: 'VR',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 80,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 2,
          bevelOffset: 1,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 600, z: 0}
    }
  },
  {
    name: 'text6',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        color: color.text,
        receiveShadow: true,
        transparent: true,
        opacity: 1
      },
      geometry: {
        type: 'TextGeometry',
        text: '3D',
        parameters: {
          fontSet: ['droid_sans', 'bold'],
          size: 100,
          height: .25,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 2,
          bevelOffset: 1,
          bevelSegments: 2
        },
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      position: {x: 0, y: 500, z: 0}
    }
  },
  {
    name: 'pyramid_small',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: color.pyramid,
        receiveShadow: true,
      },
      geometry: {
        type: 'ConeGeometry',
        radius: 200,
        height: 200,
        radialSegments: 4,
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
        y: 100,
        z: 0
      }
    }
  },
  {
    name: 'pyramid_medium',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: color.pyramid,
        receiveShadow: true,
      },
      geometry: {
        type: 'ConeGeometry',
        radius: 300,
        height: 300,
        radialSegments: 4,
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
        y: 150,
        z: 0
      }
    }
  },
  {
    name: 'pyramid_big',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: color.pyramid,
        receiveShadow: true,
      },
      geometry: {
        type: 'ConeGeometry',
        radius: 400,
        height: 400,
        radialSegments: 4,
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
        y: 200,
        z: 0
      }
    }
  },
];
