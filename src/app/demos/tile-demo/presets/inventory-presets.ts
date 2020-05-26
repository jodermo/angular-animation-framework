import { AnimationPreset } from '../../../three-animation/classes/animation-object';

export const InventoryPresets: AnimationPreset[] = [
  {
    name: 'roof_lamp',
    type: 'obj',
    options: {
      material: {
        type: 'MeshBasicMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/lamp.obj',
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  },
  {
    name: 'wall_lamp',
    type: 'obj',
    options: {
      material: {
        type: 'MeshStandardMaterial',
        color: 0x666666,
        emissive: 0x000000,
        metalness: .9,
        roughness: 0,
        receiveShadow: true
      },
      obj: {
        source: 'assets/obj/wall_lamp.obj',
        materials: [
          {
            name: 'lamp',
            objectNames: ['lamp_Cylinder.004'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0x666666,
              emissive: 0x000000,
              metalness: .9,
              roughness: 0,
              receiveShadow: true
            }
          }
        ]
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  },
  {
    name: 'wall_lamp_light',
    type: 'PointLight',
    options: {
      light: {
        color: '#fffbdc',
        castShadow: true,
        intensity: 3,
        decay: 2,
        shadow: {
          radius: 24
        },
        target: {
          x: 0,
          y: 0,
          z: 0
        }
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
];
