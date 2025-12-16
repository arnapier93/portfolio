import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";

class Entity {
  model;
  currentAnimation; // {len = 0, position: [], rotation: [], scale: []}
  animationFrame = 0;
  constructor() {
    
  }
  
  logic(entities, sounds, input, camera) {
    // to be defined within Entity implementations
  }
  
  handle(entities, sounds, input, camera) {
    this.animate();
    this.logic(entities, sounds, input, camera);
  }
  
  playAnimation(animation, cancelling) {
    console.log(animation);
    if (cancelling) {// || (this.currentAnimation === undefined || (this.currentAnimation !== undefined && this.currentAnimation.len !== undefined && this.animationFrame == this.currentAnimation.len))) {
      this.animationFrame = 0;
      this.currentAnimation = animation;
    }
  }
  
  animationEnded() {
    // to be defined in implementations
  }
  
  animate() {
    if (this.currentAnimation === undefined || this.currentAnimation == null) return;
    if (this.animationFrame == this.currentAnimation.len) {
      this.animationEnded();
      return;
    }
    if (this.currentAnimation.position !== undefined)
      this.model.position.copy(this.currentAnimation.position[this.animationFrame]);
    
    if (this.currentAnimation.scale !== undefined)
      this.model.scale.copy(this.currentAnimation.scale[this.animationFrame]);
    
    if (this.currentAnimation.rotation !== undefined)
      this.model.rotation.setFromVector3(this.currentAnimation.rotation[this.animationFrame]);
    
    this.animationFrame++;
  }
  
  getModel() {
    return this.model;
  }
}

export { Entity };
export default Entity;