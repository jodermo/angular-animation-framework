import { AnimationPreset } from '../classes/animation-object';

export const DemoPresets: AnimationPreset[] = [
  {

    name: 'environment',
    type: 'video-360',
    options: {
      material: {
        type: 'MeshBasicMaterial',
      },
      video: {
        source: 'assets/videos/360_VR Master Series _ Free Download _ Crystal Shower Falls.mp4',
        autoplay: true,
        loop: true,
        controls: true,
        muted: true,
        volume: 1
      },
      radius: 250,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  {
    name: 'video',
    type: 'video',
    options: {
      material: {
        type: 'MeshStandardMaterial',
        receiveShadow: true,

        texture: {}
      },
      mesh: {
        receiveShadow: false,
        castShadow: true
      },
      video: {
        source: 'assets/videos/demo_clip.mp4',
        autoplay: true,
        loop: true,
        controls: true,
        muted: true,
        volume: 1
      },
      size: {
        x: 16 * 5,
        y: 9 * 5
      },
      position: {
        x: 0,
        y: 0,
        z: -10
      }
    }
  },
  {
    name: 'image',
    type: 'image',
    options: {
      material: {
        type: 'MeshStandardMaterial',
        receiveShadow: true,

        texture: {}
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      },
      image: {
        source: 'assets/images/textures/wall_1.jpg'
      },
      size: {
        x: 10,
        y: 10
      },
      position: {
        x: 0,
        y: 15,
        z: 10
      }
    }
  },
  {
    name: 'title',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshLambertMaterial',
        receiveShadow: true
      },
      geometry: {
        type: 'TextGeometry',
        text: 'Demo Text',
        parameters: {
          fontSet: ['helvetiker', 'regular'],
          size: 1,
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
      position: {
        x: -3.5,
        y: 1,
        z: 0
      }
    }
  },
  {
    name: 'directional-light',
    type: 'DirectionalLight',
    options: {
      light: {
        color: 0xffffff,
        castShadow: true,
        shadow: {
          radius: 8
        }
      },
      position: {
        x: -3.5,
        y: 1,
        z: -50
      }
    }
  }
];
