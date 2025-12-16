import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
import { Entity } from './entity.js';
import {toast, tex_toastbase, tex_toastburnt} from '../../models/toast/toast.js';
import {MatrixHelper} from '../matrixhelper.js';

MatrixHelper.uniformScale(toast, 0.3);
MatrixHelper.translate(toast, 0, -0.5, 5);//-0.5, 0);
MatrixHelper.rotateX(toast, 90);
MatrixHelper.rotateY(toast, 90);

class Toast extends Entity {
  stage = 0;
  toastLevel = 0;
  
  constructor() {
    super();
    this.model = toast;
    console.log(this.stage);
    this.tex_base = tex_toastbase;
    this.tex_burnt = tex_toastburnt;
  }
  
  // normalized x, y from toast uv
  bite(x, y) {
    tex_toastbase.circleErase(x * 256, 128 - y * 128, 60);
    tex_toastburnt.circleErase(x * 256, 128 - y * 128, 60);
  }
  
  toast(level) {
    this.toastLevel += level;
    this.model.traverse((mesh)=>{
      if (mesh instanceof THREE.Mesh && mesh.material.shaderData !== undefined) {
        mesh.material.shaderData.uniforms.toastLevel.value = this.toastLevel;
      }
    });
  }
  
  animationEnded() {
    // done animating toast into toaster. start toasting
    if (this.stage == 1) {
      this.stage = 2;
    }
  }

  logic(entities, sounds, input, camera) {
    let toastRef = this;
    switch (this.stage) {
      case 0: // carrying
        input.pointingAt(camera, [entities["mouse_plane"].model]).forEach((item)=>{
          // move to mouse position
          let newPos = new THREE.Vector3(0, item.point.y, item.point.z);
          if (newPos.distanceTo(entities["toaster"].model.position) > 4) // don't let the toast go through the toaster
            toast.position.set(0, (newPos.y + toast.position.y) / 2, (newPos.z + toast.position.z) / 2);
          
          const dist = Math.abs(item.point.z - entities["toaster"].model.position.z);
          if (input.clickedp && dist < 5) {
            toastRef.stage = 1;
            let animation = {};
            animation.len = 10;
            
            let slotPos = new THREE.Vector3(-0.25, 0, -0.25); //entities["toaster"].position.clone();
            
            animation.position = new THREE.CubicBezierCurve3(
              this.model.position, // start
              this.model.position,
              slotPos,//new THREE.Vector3(-0.25, 0, -0.25), // start
              slotPos//new THREE.Vector3(-0.25, 0, -0.25) // start
            ).getPoints(10);
            animation.rotation = MatrixHelper.func2pointsSpecified((value)=>{
              return new THREE.Vector3(MatrixHelper.deg2rad(90), 0, MatrixHelper.deg2rad(-45 + value));
            }, -45, 0, 0, 0, 10);
            toastRef.playAnimation(animation, true);
          }
        });
        break;
      case 1: // loading into toaster
        break;
      case 2:
        // increase toast level
        this.toast(0.005);
        break;
      default:
        console.log(this.stage);
    }
  }
}

export {Toast};
export default Toast;