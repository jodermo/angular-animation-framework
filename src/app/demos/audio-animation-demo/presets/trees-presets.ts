import { AnimationPreset } from '../../../three-animation/classes/animation-object';

export const TreesPresets: AnimationPreset[] = [
  {
    name: 'palms',
    type: 'obj',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/palm1.obj',
        materials: [
          {
            name: 'leaves',
            objectNames: ['polySurface336', 'polySurface335', 'polySurface342', 'polySurface343', 'polySurface339', 'polySurface338'],
            material: {
              type: 'MeshToonMaterial',
              color: '#00ff04'
            }
          },
          {
            name: 'trunk',
            objectNames: ['polySurface262 polySurface141', 'polySurface229 polySurface36', 'polySurface290 polySurface62', 'polySurface234 polySurface63', 'polySurface333 polySurface173', 'polySurface328 polySurface200'],
            material: {
              type: 'MeshToonMaterial',
              color: '#ff4f00'
            }
          },
        ]
      },
      mesh: {
        receiveShadow: true,
        castShadow: true
      }
    }
  }
];
