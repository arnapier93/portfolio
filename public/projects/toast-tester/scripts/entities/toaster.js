import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
import { Entity } from './entity.js';
import {toaster} from '../../models/toaster/toaster.js';
import {MatrixHelper} from '../matrixhelper.js';

MatrixHelper.uniformScale(toaster, 0.7);
MatrixHelper.translate(toaster, 0, -1, 3);
MatrixHelper.rotateY(toaster, 45);

class Toaster extends Entity {
  slot1 = null;
  slot2 = null;
  
  constructor() {
    super();
    this.model = toaster;
  }
  
  animationEnded() {
    // no animations :)
  }
  
  slot(toast) {
    if (this.slot1 == null) {
      this.slot1 = toast;
      // return slot1 position
    } else if (this.slot2 == null) {
      this.slot2 = toast;
      // return slot2 position
    }
    return null;  // no slot available, sorry
  }

  logic(entities, sounds, input, camera) {
    // we don't need to do anything
  }
}

export {Toaster};
export default Toaster;