import { AnimationPreset } from '../../../three-animation/classes/animation-object';

export const TilePresets: AnimationPreset[] = [
  {
    name: 'gap',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshPhongMaterial',
        color: '#222222',
      },
      geometry: {
        type: 'BoxGeometry',
        width: .25,
        height: 102,
        depth: 102,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  },
  {
    name: 'tile_1',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshStandardMaterial',
        color: 0xcccccc,
        emissive: 0x000000,
        metalness: .2,
        roughness: .6,
        texture: {
          image: 'assets/images/textures/tiles/tile_2.jpg',
          bump: 'assets/images/textures/tiles/tile_2_bump.jpg',
          bumpScale: .5
        }
      },
      geometry: {
        type: 'BoxGeometry',
        width: 1,
        height: 20,
        depth: 20,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  },
  {
    name: 'tile_2',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshStandardMaterial',
        color: 0x666666,
        metalness: .2,
        roughness: .4,
        texture: {
          image: 'assets/images/textures/tiles/tile_1.jpg'
        }
      },
      geometry: {
        type: 'BoxGeometry',
        width: 1,
        height: 20,
        depth: 20,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  },
  {
    name: 'tile_3',
    type: 'mesh',
    options: {
      material: {
        type: 'MeshStandardMaterial',
        color: 0xcccccc,
        emissive: 0x000000,
        metalness: .2,
        roughness: .6,
        texture: {
          image: 'assets/images/textures/tiles/tile_3.jpg'
        }
      },
      geometry: {
        type: 'BoxGeometry',
        width: 1,
        height: 20,
        depth: 20,
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  },
];
