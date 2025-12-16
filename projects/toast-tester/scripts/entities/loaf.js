import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
import { Entity } from './entity.js';
import {loaf} from '../../models/loaf/loaf.js';
import {MatrixHelper} from '../matrixhelper.js';

MatrixHelper.uniformScale(loaf, 6);
MatrixHelper.rotateX(loaf, -13);
MatrixHelper.rotateZ(loaf, -22);
MatrixHelper.rotateY(loaf, -120);
MatrixHelper.translate(loaf, -1, -3, -21);

class Loaf extends Entity {
  constructor() {
    super();
    this.model = loaf;
    /*
    this.grab = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/395328__ihitokage__grab-1.ogg", (buff)=>{
      this.grab.setBuffer(buff);
      this.grab.setLoop(false);
      this.grab.setVolume(5.0);
    });*/
  }

  logic(entities, sounds, input, camera) {
    if (input.hasClicked()) {
      input.pointingAt(camera, [loaf]).forEach((item)=>{
        this.grab.play();
        entities["toast"].model.position.copy(loaf.model.position);
      });
    }
  }
}

export {Loaf};
export default Loaf;