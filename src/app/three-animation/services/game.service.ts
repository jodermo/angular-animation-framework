import { Injectable } from '@angular/core';
import { AnimationObject } from '../classes/animation-object';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  level = 1;

  constructor() {
  }
}


export class GamePlayer {

  level = 1;
  points = 1;
  strength = 1;
  speed = 1;

  callbacks = {
    onLevelUp: [],
    onHit: [],
    onGetHit: []
  };

  constructor(public aniObject: AnimationObject, public options: any = null) {
    if (options) {
      for (const key in options) {
        if (this[key]) {
          this[key] = options[key];
        }
      }
    }
  }

  move(x, y, z) {
    if (this.aniObject && this.aniObject.mesh) {
      const distance = this.aniObject.mesh.distanceTo({x, y, z});
      console.log('distance', distance);
      this.aniObject.moveTo({x, y, z}, this.speed * 1000);
    }

  }

  attack(targetPlayer: GamePlayer) {
    targetPlayer.getAttacked(this);
  }

  getAttacked(attackingPlayer: GamePlayer) {
    attackingPlayer.hit(this);
  }

  hit(targetPlayer: GamePlayer) {
    targetPlayer.getAttacked(this);
  }

  on(eventName, callback) {
    if (this.callbacks[eventName]) {
      this.callbacks[eventName].push(callback);
    }
  }

  do(eventName, event) {
    if (this.callbacks[eventName]) {
      for (const callback of this.callbacks[eventName]) {
        callback(event);
      }
    }
  }
}
