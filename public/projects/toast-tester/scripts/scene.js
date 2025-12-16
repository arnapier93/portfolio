import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";

// SceneManager defines the standard interfaces which other scenes should override.
// There is no point to use it on its own.
class SceneManager {
  scene;
  listener;
  
  constructor() {
    this.scene = new THREE.Scene();
    this.listener = new THREE.AudioListener();
  }
  
  // logic loop. to be overridden.
  loop(dTime, input, camera) {
    
  }
}

export {SceneManager};
export default SceneManager;
