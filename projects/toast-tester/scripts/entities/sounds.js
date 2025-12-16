import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
import { Entity } from './entity.js';
import {wall} from '../../models/wall/wall.js';
import {MatrixHelper} from '../matrixhelper.js';

MatrixHelper.uniformScale(wall, 3.5);
MatrixHelper.rotateY(wall, 90);
MatrixHelper.translate(wall, 11, -12.5, -2.5);

class Wall extends Entity {
  constructor() {
    super();
    this.model = wall;
  }
  
  animationEnded() {
    // no animations :)
  }

  logic(entities, sounds, input, camera) {
    // we don't need to do anything
  }
}

export {Wall};
export default Wall;