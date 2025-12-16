import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
import { Entity } from './entity.js';
import {mouse_plane} from '../../models/mouse_plane/mouse_plane.js';
import {MatrixHelper} from '../matrixhelper.js';


MatrixHelper.rotateY(mouse_plane, 90);
mouse_plane.scale.set(50, 10, 1);
mouse_plane.position.set(0, 2.5, 0);
mouse_plane.visible = false;

class MousePlane extends Entity {
  constructor() {
    super();
    this.model = mouse_plane;
  }
  
  animationEnded() {
    // no animations :)
  }

  logic(entities, sounds, input, camera) {
    // we don't need to do anything
  }
}

export {MousePlane};
export default MousePlane;