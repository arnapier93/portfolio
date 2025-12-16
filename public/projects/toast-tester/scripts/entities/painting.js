import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
import { Entity } from './entity.js';
import {painting} from '../../models/painting/painting.js';
import {MatrixHelper} from '../matrixhelper.js';


MatrixHelper.uniformScale(painting, 4);
MatrixHelper.rotateY(painting, 90);
MatrixHelper.translate(painting, -5.2, 3.5, 0);

class Painting extends Entity {
  constructor() {
    super();
    this.model = painting;
  }
  
  animationEnded() {
    // no animations :)
  }

  logic(entities, sounds, input, camera) {
    // we don't need to do anything
  }
}

export {Painting};
export default Painting;