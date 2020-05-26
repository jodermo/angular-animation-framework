import { AnimationPreset } from '../../../three-animation/classes/animation-object';

export const EnvironmentPresets: AnimationPreset[] = [
  {
    name: 'sphere',
    type: 'image-360',
    options: {
      environment:true,
      material: {
        type: 'MeshBasicMaterial',
      },
      image: {
        source: 'assets/images/environments/landscape_1.jpg'
      },
      radius: 10000,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  {
    name: 'sphere2',
    type: 'image-360',
    options: {
      environment:true,
      material: {
        type: 'MeshBasicMaterial',
      },
      image: {
        source: 'assets/images/environments/hall_1.jpg'
      },
      radius: 10000,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  {
    name: 'sphere3',
    type: 'image-360',
    options: {
      environment:true,
      material: {
        type: 'MeshBasicMaterial',
      },
      image: {
        source: 'assets/images/environments/grotto_1.jpg'
      },
      radius: 10000,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  {
    name: 'sphere4',
    type: 'image-360',
    options: {
      environment:true,
      material: {
        type: 'MeshBasicMaterial',
      },
      image: {
        source: 'assets/images/environments/stock_room.jpg'
      },
      radius: 10000,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
];
