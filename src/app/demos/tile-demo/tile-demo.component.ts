import { Component } from '@angular/core';

import { TilePresets } from './presets/tile-presets';
import { LightPresets } from './presets/light-presets';
import { EnvironmentPresets } from './presets/environment-presets';
import { InventoryPresets } from './presets/inventory-presets';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { CarsPresets } from '../audio-animation-demo/presets/cars-presets';
import { ThreeAnimationComponent } from '../../three-animation/three-animation.component';

@Component({
  selector: 'app-tile-demo',
  templateUrl: './tile-demo.component.html',
  styleUrls: ['../../three-animation/three-animation.component.css']
})
export class TileDemoComponent extends ThreeAnimationComponent {
  directionalLightMain;
  directionalLightSecondary;
  pointLightLeft;
  pointLightRight;

  environments = [];
  currentEnvironment;

  tiles;
  gap;
  room;
  roomRotation = 0; // 0
  wall1;
  wall2;
  wall3;

  car;
  carRotation = .35;

  roofLamp;
  roofLampLight;
  wallLamp;
  wallLampLight;

  tileSettings = {
    repeatH: 5,
    repeatV: 5,
    gapSize: .25
  };

  tile1Preset = 'tile_1';
  tile2Preset = 'tile_2';
  tile3Preset = 'tile_3';

  selectedTile;

  init() {
    this.animation.bindPresets('lights', LightPresets);
    this.animation.bindPresets('environment', EnvironmentPresets);
    this.animation.bindPresets('tiles', TilePresets);
    this.animation.bindPresets('inventory', InventoryPresets);
    this.animation.bindPresets('cars', CarsPresets);
    this.animation.postProcessing.renderPasses = [
      // {name: 'GammaCorrectionShader', pass: ShaderPass, type: 'ShaderPass', attributes: [GammaCorrectionShader]},
      {name: 'UnrealBloomPass', pass: UnrealBloomPass, type: 'UnrealBloomPass', attributes: [100, 1, .05, .95, 0.9]},
    ];
  }

  start() {
    this.createScene();
    this.createEnvironment();
    this.createRoom();
  }


  loadCar() {
    this.car = this.animation.createPresetObject('cars', 'mercedes-190-sl');
    this.car.setPosition({x: -600, y: -900, z: -1800});
    this.car.setRotation({x: 0, y: (Math.PI * this.carRotation), z: 0});
    this.car.setScale({x: 10, y: 10, z: 10});
  }

  createScene() {
    this.directionalLightMain = this.animation.createPresetObject('lights', 'directional-light-main');
    this.directionalLightSecondary = this.animation.createPresetObject('lights', 'directional-light-secondary');
    // this.pointLightLeft = this.animation.createPresetObject('lights', 'point-light-left');
    // this.pointLightRight = this.animation.createPresetObject('lights', 'point-light-right');
  }

  createEnvironment() {
    for (const env of EnvironmentPresets) {
      const environment = this.animation.createPresetObject('environment', env.name);
      this.environments.push(environment);
    }
    this.switchEnvironment();
  }

  createRoom() {
    this.room = this.animation.createObject('group');
    this.room.setPosition({x: -200, y: -75, z: 250});
    this.room.setRotation({x: 0, y: (Math.PI * this.roomRotation), z: 0});
    this.room.setScale({x: 3, y: 3, z: 3});
    this.createWalls(this.room);
    this.createLamps(this.room);
  }

  createWalls(room = this.room) {
    this.wall1 = this.animation.createObject('group', null, room.object);
    this.wall1.setPosition({x: 0, y: 25.5, z: -51});
    this.createTiles(this.wall1, this.tile1Preset);

    this.wall2 = this.animation.createObject('group', null, room.object);
    this.wall2.setPosition({x: 51, y: 25.5, z: 0});
    this.wall2.setRotation({x: 0, y: Math.PI / 2, z: 0});
    this.createTiles(this.wall2, this.tile2Preset);

    this.wall3 = this.animation.createObject('group', null, room.object);
    this.wall3.setPosition({x: 51, y: -25.5, z: -51});
    this.wall3.setRotation({x: 0, y: 0, z: -Math.PI / 2});
    this.createTiles(this.wall3, this.tile3Preset);
  }

  createLamps(room = this.room) {
    this.roofLamp = this.animation.createPresetObject('inventory', 'roof_lamp', room.object);
    this.roofLamp.setScale({x: 400, y: 400, z: 400});
    //this.roofLamp.setPosition({x: 0, y: 0, z: 0});


    this.wallLamp = this.animation.createPresetObject('inventory', 'wall_lamp', room.object);
    const scale = 150;
    this.wallLamp.setPosition({x: 72, y: 65, z: -18});
    this.wallLamp.setRotation({x: 0, y: Math.PI, z: 0});
    this.wallLamp.setScale({x: scale, y: scale, z: scale});

    this.wallLampLight = this.animation.createPresetObject('inventory', 'wall_lamp_light', room.object);
    this.wallLampLight.setPosition({x: 72, y: 64, z: -26});

    const light = this.wallLampLight.light;


    const bulb = this.animation.createObject('mesh', {
      material: {
        type: 'MeshBasicMaterial',
        color: '#ffffff',
      },
      geometry: {
        type: 'SphereGeometry',
        radius: 5,
        widthSegments: 16,
        heightSegments: 12,
        phiStart: 0,
        phiLength: Math.PI * 2,
        thetaStart: 0,
        thetaLength: Math.PI
      },
      mesh: {
        receiveShadow: false,
        castShadow: false
      }
    }, room.object);
    bulb.setPosition({x: 72, y: 62, z: -26});
    if (this.wallLampLight.light.target) {
      this.wallLampLight.light.target.position.set(72, 0, -26);
    }

  }

  createTiles(wall, presetName) {
    const gap = this.animation.createPresetObject('tiles', 'gap', wall.object);
    this.tiles = [];
    for (let h = 0; h < this.tileSettings.repeatH; h++) {
      for (let v = 0; v < this.tileSettings.repeatV; v++) {
        this.addTile(h, v, wall, presetName);
      }
    }
  }

  selectTile(tile) {
    this.selectedTile = tile;
  }

  switchTile(tile) {
    if (this.selectedTile && this.selectedTile !== tile) {
      const newParent = this.selectedTile.parent;
      const oldParent = tile.parent;
      const oldPosition = {
        x: tile.object.position.x,
        y: tile.object.position.y,
        z: tile.object.position.z
      };
      const newPosition = {
        x: this.selectedTile.object.position.x,
        y: this.selectedTile.object.position.y,
        z: this.selectedTile.object.position.z
      };
      tile.object.position.set(newPosition.x, newPosition.y, newPosition.z);
      tile.appendTo(newParent);
      tile.parent = newParent;
      this.selectedTile.object.position.set(oldPosition.x, oldPosition.y, oldPosition.z);
      this.selectedTile.appendTo(oldParent);
      this.selectedTile.parent = oldParent;
      this.selectedTile = null;
      this.animation.loading = false;
    } else if (this.selectedTile && this.selectedTile === tile) {
      this.selectedTile = null;
    } else {
      this.selectTile(tile);
    }
  }

  addTile(h, v, parentObject, presetName) {
    const tile = this.animation.createPresetObject('tiles', presetName, parentObject.object);
    const horizontal = tile.options.geometry.depth;
    const vertical = tile.options.geometry.height;
    const centerH = (this.tileSettings.repeatH * (horizontal + this.tileSettings.gapSize)) / 2;
    const centerV = (this.tileSettings.repeatV * (vertical + this.tileSettings.gapSize)) / 2;
    tile.on('mousedown', () => {
      this.switchTile(tile);
    });
    h = h * (horizontal + this.tileSettings.gapSize);
    h -= centerH;
    h += (horizontal + this.tileSettings.gapSize) / 2;
    v = v * (vertical + this.tileSettings.gapSize);
    v -= centerV;
    v += (vertical + this.tileSettings.gapSize) / 2;
    tile.setPosition({x: 0, y: v, z: h});
    this.tiles.push(tile);
  }

  switchEnvironment() {
    if (this.environments.length) {
      const random = Math.floor(Math.random() * this.environments.length);
      this.showEnvironment(this.environments[random], true);
    }
  }

  showEnvironment(environment, forceSwitch = false) {
    if (forceSwitch && environment === this.currentEnvironment) {
      this.switchEnvironment();
      return;
    }
    this.hideAllEnvironments();
    this.currentEnvironment = environment;
    this.currentEnvironment.show();
  }

  hideAllEnvironments() {
    for (const environment of this.environments) {
      environment.hide();
    }
  }
}
