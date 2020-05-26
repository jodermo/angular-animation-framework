import { AnimationPreset } from '../../../three-animation/classes/animation-object';

export const LightPresets: AnimationPreset[] = [
  {
    name: 'directional-light-main',
    type: 'DirectionalLight',
    options: {
      helper: true,
      light: {
        color: '#ffffff',
        castShadow: true,
        intensity: .8,
        distance:1000,
        decay: 2,
        shadow: {
          radius: 10
        }
      },
      position: {
        x: 0,
        y: 150,
        z: -400
      }
    }
  },
  {
    name: 'directional-light-secondary',
    type: 'DirectionalLight',
    options: {
      helper: true,
      light: {
        color: '#ffffff',
        castShadow: true,
        intensity: .5,
        distance:1000,
        decay: 2,
        shadow: {
          radius: 5
        }
      },
      position: {
        x: 400,
        y: 250,
        z: 100
      }
    }
  },
  {
    name: 'point-light-left',
    type: 'PointLight',
    options: {
      helper: true,
      light: {
        color: '#ffffff',
        castShadow: true,
        intensity: 1,
        decay: 2,
        shadow: {
          radius: 5
        }
      },
      position: {
        x: -150,
        y: 75,
        z: -240
      }
    }
  },
  {
    name: 'point-light-right',
    type: 'PointLight',
    options: {
      helper: true,
      light: {
        color: '#ffffff',
        castShadow: true,
        intensity: 1,
        decay: 2,
        shadow: {
          radius: 2
        }
      },
      position: {
        x: 150,
        y: 75,
        z: -240
      }
    }
  },
];
