import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
import { Entity } from './entity.js';
import {counter} from '../../models/counter/counter.js';
import {MatrixHelper} from '../matrixhelper.js';

MatrixHelper.uniformScale(counter, 5);
MatrixHelper.translate(counter, 0, -10, -5);

class Counter extends Entity {
  constructor() {
    super();
    this.model = counter;
  }
  
  animationEnded() {
    // no animations :)
  }

  logic(entities, sounds, input, camera) {
    // we don't need to do anything
  }
}

export {Counter};
export default Counter;