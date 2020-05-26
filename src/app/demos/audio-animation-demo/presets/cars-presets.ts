import { AnimationPreset } from '../../../three-animation/classes/animation-object';

export const CarsPresets: AnimationPreset[] = [
  {
    name: 'delorean',
    type: 'obj',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/CyberpunkDeLorean.obj',
        materials: [
          {
            name: 'body',
            objectNames: ['CPDeLorean_MainBody', 'CPDeLorean_WingSx', 'CPDeLorean_WingDx'],
            material: {
              type: 'MeshToonMaterial',
              color: '#510084',
            }
          },
          {
            name: 'pipes',
            objectNames: ['CPDeLorean_RoofTopDevice', 'CPDeLorean_EngineFrontL_pipes', 'CPDeLorean_EngineFrontR_pipes', 'CPDeLorean_EngineRearL_pipes', 'CPDeLorean_EngineRearR_pipes'],
            material: {
              type: 'MeshToonMaterial',
              color: '#006e7a'
            }
          },
          {
            name: 'tires',
            objectNames: ['CPDeLorean_EngineFrontR', 'CPDeLorean_EngineRearR', 'CPDeLorean_EngineRearL', 'CPDeLorean_EngineFrontL'],
            material: {
              type: 'MeshToonMaterial',
              color: '#00eaff'
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
    name: 'mercedes-190-sl',
    type: 'obj',
    options: {
      material: {
        type: 'MeshStandardMaterial',
        color: 0xffffff,
        receiveShadow: true,
        shininess: 100
      },
      obj: {
        source: 'assets/obj/Z3_OBJ.obj',
        materials: [
          {
            name: 'paint',
            objectNames: ['Z3_body', 'Z3_body2', 'Z3_body3', 'Z3_body4', 'Z3_body5'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0xFF0000,
              emissive: 0x000000,
              metalness: .5,
              roughness: 0,
              receiveShadow: true
            }
          },
          {
            name: 'roof',
            objectNames: ['Z3_roof1'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0x333333,
              roughness: .75,
              shininess: 80,
              receiveShadow: true
            }
          },
          {
            name: 'glas',
            objectNames: ['Z3_glass1', 'Z3_glass2', 'Z3_glass3', 'Z3_glass4', 'Z3_roof2'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0xFFFFFF,
              roughness: 0,
              shininess: 100,
              receiveShadow: true,
              transparent: true,
              opacity: .5,
            }
          },
          {
            name: 'mirror',
            objectNames: ['Z3_mirror1', 'Z3_left_mirror04', 'Z3_left_mirror2'],
            material: {
              type: 'MeshPhongMaterial',
              color: 0xffffff,
              receiveShadow: true,
              transparent: true,
              opacity: 1,
              shininess: 100
            }
          },
          {
            name: 'chrome',
            objectNames: ['Z3_body6', 'Z3_molding', 'Z3_handles', 'Z3_lock', 'Z3_grill1', 'Z3_grill2', 'Z3_grill4', 'Z3_hood1',
              'Z3_wheel1(1)', 'Z3_wheel1(2)', 'Z3_wheel1(3)', 'Z3_wheel1(4)',
              'Z3_wheel2(1)', 'Z3_wheel2(2)', 'Z3_wheel2(3)', 'Z3_wheel2(4)',
              'Z3_wheel3(1)', 'Z3_wheel3(2)', 'Z3_wheel3(3)', 'Z3_wheel3(4)',
              'Z3_wheel4(1)', 'Z3_wheel4(2)', 'Z3_wheel4(3)', 'Z3_wheel4(4)',
              'Z3_right_turnlight3', 'Z3_right_turnlight5',
              'Z3_left_turnlight3', 'Z3_left_turnlight5',
              'Z3_right_rearlight2', 'Z3_left_rearlight2', 'Z3_right_headlight1', 'Z3_left_headlight1',
              'Z3_interior5', 'Z3_right_mirror1', 'Z3_left_mirror1', 'Z3_mirror2', 'Z3_left_mirror03',
              'Z3_front_bumper', 'Z3_rear_bumper'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0xFFFFFF,
              shininess: 100,
              roughness: 0,
              reflectivity: 1.0,
              metalness: 1,
              receiveShadow: true
            }
          },
          {
            name: 'metal',
            objectNames: ['Z3_bottom', 'Z3_grill3', 'Z3_grill5', 'Z3_hood2', 'Z3_exhaust', 'Z3_number'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0x000000,
              shininess: 100,
              roughness: 0,
              reflectivity: 1.0,
              metalness: 1,
              receiveShadow: true
            }
          },
          {
            name: 'interior',
            objectNames: ['Z3_interior1', 'Z3_interior2', 'Z3_interior3', 'Z3_interior4', 'Z3_dashboard'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0x311309,
              roughness: .33,
              shininess: 66,
              receiveShadow: true
            }
          },
          {
            name: 'leather',
            objectNames: ['Z3_seats', 'Z3_gearbox', 'Z3_steering_wheel'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0xCACBB2,
              roughness: .75,
              shininess: 80,
              receiveShadow: true
            }
          },
          {
            name: 'rubber',
            objectNames: ['Z3_tyre1', 'Z3_tyre2', 'Z3_tyre3', 'Z3_tyre4'],
            material: {
              type: 'MeshStandardMaterial',
              color: 0x111111,
              roughness: .8,
              shininess: 50,
              receiveShadow: true
            }
          },
          {
            name: 'led-light',
            objectNames: ['Z3_right_rearlight6', 'Z3_left_rearlight6'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFFFFFF,
              receiveShadow: true,
            }
          },
          {
            name: 'front-light',
            objectNames: ['Z3_right_headlight2', 'Z3_left_headlight2'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFFFFFF,
              receiveShadow: true,
            }
          },
          {
            name: 'turn-light',
            objectNames: ['Z3_right_turnlight1', 'Z3_left_turnlight1', 'Z3_right_turnlight4', 'Z3_left_turnlight4'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFF8A00,
              receiveShadow: true
            }
          },
          {
            name: 'rare-light',
            objectNames: ['Z3_right_rearlight3', 'Z3_left_rearlight3'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFF0000,
              receiveShadow: true
            }
          },
          {
            name: 'break-light',
            objectNames: ['Z3_right_rearlight5', 'Z3_left_rearlight5', 'Z3_ledlight1'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFF0000,
              receiveShadow: true
            }
          },
          {
            name: 'backward-light',
            objectNames: ['Z3_right_rearlight4', 'Z3_left_rearlight4'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFFFFFF,
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
    name: 'mercedes-190-sl-retro',
    type: 'obj',
    options: {
      material: {
        type: 'MeshToonMaterial',
        color: 0xffffff,
        receiveShadow: true,
      },
      obj: {
        source: 'assets/obj/Z3_OBJ.obj',
        materials: [
          {
            name: 'paint',
            objectNames: ['Z3_body', 'Z3_body2', 'Z3_body3', 'Z3_body4', 'Z3_body5'],
            material: {
              type: 'MeshToonMaterial',
              color: '#8c00ff',
              shininess: Math.pow( 2, .5 * 10 ),
            }
          },
          {
            name: 'roof',
            objectNames: ['Z3_roof1'],
            material: {
              type: 'MeshToonMaterial',
              color: '#03009b'
            }
          },
          {
            name: 'glas',
            objectNames: ['Z3_glass1', 'Z3_glass2', 'Z3_glass3', 'Z3_glass4', 'Z3_roof2'],
            material: {
              type: 'MeshToonMaterial',
              color: '#010040',
              transparent: true,
              opacity: .5,
            }
          },
          {
            name: 'mirror',
            objectNames: ['Z3_mirror1', 'Z3_left_mirror04', 'Z3_left_mirror2'],
            material: {
              type: 'MeshToonMaterial',
              color: '#ff00ec',
            }
          },
          {
            name: 'chrome',
            objectNames: ['Z3_body6', 'Z3_molding', 'Z3_handles', 'Z3_lock', 'Z3_grill1', 'Z3_grill2', 'Z3_grill4', 'Z3_hood1',
              'Z3_wheel1(1)', 'Z3_wheel1(2)', 'Z3_wheel1(3)', 'Z3_wheel1(4)',
              'Z3_wheel2(1)', 'Z3_wheel2(2)', 'Z3_wheel2(3)', 'Z3_wheel2(4)',
              'Z3_wheel3(1)', 'Z3_wheel3(2)', 'Z3_wheel3(3)', 'Z3_wheel3(4)',
              'Z3_wheel4(1)', 'Z3_wheel4(2)', 'Z3_wheel4(3)', 'Z3_wheel4(4)',
              'Z3_right_turnlight3', 'Z3_right_turnlight5',
              'Z3_left_turnlight3', 'Z3_left_turnlight5',
              'Z3_right_rearlight2', 'Z3_left_rearlight2', 'Z3_right_headlight1', 'Z3_left_headlight1',
              'Z3_interior5', 'Z3_right_mirror1', 'Z3_left_mirror1', 'Z3_mirror2', 'Z3_left_mirror03',
              'Z3_front_bumper', 'Z3_rear_bumper'],
            material: {
              type: 'MeshToonMaterial',
              color: '#6fa5ff',
            }
          },
          {
            name: 'metal',
            objectNames: ['Z3_bottom', 'Z3_grill3', 'Z3_grill5', 'Z3_hood2', 'Z3_exhaust', 'Z3_number'],
            material: {
              type: 'MeshToonMaterial',
              color: '#510084',
            }
          },
          {
            name: 'interior',
            objectNames: ['Z3_interior1', 'Z3_interior2', 'Z3_interior3', 'Z3_interior4', 'Z3_dashboard'],
            material: {
              type: 'MeshToonMaterial',
              color: '#510084',
            }
          },
          {
            name: 'leather',
            objectNames: ['Z3_seats', 'Z3_gearbox', 'Z3_steering_wheel'],
            material: {
              type: 'MeshToonMaterial',
              color: '#84007a',
            }
          },
          {
            name: 'rubber',
            objectNames: ['Z3_tyre1', 'Z3_tyre2', 'Z3_tyre3', 'Z3_tyre4'],
            material: {
              type: 'MeshToonMaterial',
              color: '#080011',
            }
          },
          {
            name: 'led-light',
            objectNames: ['Z3_right_rearlight6', 'Z3_left_rearlight6'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFFFFFF
            }
          },
          {
            name: 'front-light',
            objectNames: ['Z3_right_headlight2', 'Z3_left_headlight2'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFFFFFF
            }
          },
          {
            name: 'turn-light',
            objectNames: ['Z3_right_turnlight1', 'Z3_left_turnlight1', 'Z3_right_turnlight4', 'Z3_left_turnlight4'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFF8A00
            }
          },
          {
            name: 'rare-light',
            objectNames: ['Z3_right_rearlight3', 'Z3_left_rearlight3'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFF0000
            }
          },
          {
            name: 'break-light',
            objectNames: ['Z3_right_rearlight5', 'Z3_left_rearlight5', 'Z3_ledlight1'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFF0000
            }
          },
          {
            name: 'backward-light',
            objectNames: ['Z3_right_rearlight4', 'Z3_left_rearlight4'],
            material: {
              type: 'MeshToonMaterial',
              color: 0xFFFFFF
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
    name: 'front-light-left',
    type: 'SpotLight',
    options: {
      light: {
        color: 0xffffff,
        intensity: 1,
        distance: 0,
        angle: Math.PI,
        penumbra: 0,
        decay: 500,
        castShadow: true,
        shadow: {
          radius: 8
        }
      },
      position: {
        x: -77,
        y: 25,
        z: 25
      }
    }
  },
  {
    name: 'front-light-right',
    type: 'SpotLight',
    options: {
      light: {
        color: 0xffffff,
        intensity: 1,
        distance: 0,
        angle: Math.PI,
        penumbra: 0,
        decay: 500
      },
      position: {
        x: -77,
        y: 25,
        z: -25
      }
    }
  }
];
