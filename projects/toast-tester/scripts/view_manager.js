import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/controls/OrbitControls.js";
import Input from './input.js';

// ViewManager handles some boilerplate for the scene, such as managing frames.
class ViewManager {
  renderer;
  controls;
  scene;
  camera;
  input;
  
  pTime;
  pLogicTime;
  logicFrameTime = 20; // 40; // ms
  
  constructor(scene) {
    // save the width and height in case we need them
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // set the passed scene as what we'll handle
    this.scene = scene;
    
    // initialize the various components we need
    this.initRenderer(width, height);
    this.initCamera(width, height);
    this.initControls(this.camera, this.renderer);
    this.input = new Input(this.renderer.domElement); // pass the game dom to the input. we don't want unintended inputs if there's other stuff on the page
  }
   
  // create the rendering surface
  initRenderer(width, height) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.getContext().enable(this.renderer.getContext().DEPTH_TEST);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }
  
  // set up the perspective camera
  initCamera(width, height) {
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(10, 5, 5); // position, but will look at (0, 0, 0) by default
    if (this.scene.listener !== undefined) {
      this.camera.add(this.scene.listener); // listen to audio from the scene
    }
  }
  
  // add orbit controls
  initControls(camera, renderer) {
    if (renderer === undefined) {
      console.error("The renderer was not initialized before attempting to initialize controls.");
      return;
    }
    if (camera === undefined) {
      console.error("The camera was not initialized before attempting to initialize controls.");
      return;
    }
    
    this.controls = new OrbitControls(camera, renderer.domElement);
  }
  
  // things to do right before starting the loop (edge case. most things should be put in the constructor)
  start() {
    window.requestAnimationFrame((time)=>this.frame(time));
  }
  
  // runs the scene at 24fps
  loop(dTime) {
    this.scene.loop(dTime, this.input, this.camera);
  }
  
  // runs as fast as the gpu allows
  frame(time) {
    // get the time between frames
    if (this.pTime === undefined) this.pTime = time;
    const dTime = time - this.pTime;
    this.previousTime = dTime;
    
    // run this.loop at 24 fps
    if (this.pLogicTime === undefined) this.pLogicTime = time;
    const dLogicTime = time - this.pLogicTime;
    if (dLogicTime > this.logicFrameTime) {
      this.pLogicTime = time;
      this.loop(dLogicTime);
      this.input.clear();
    }
    
    // render changes and update the camera
    this.renderer.render(this.scene.scene, this.camera);
    this.controls.update();
    
    // run the loop again
    window.requestAnimationFrame((time)=>this.frame(time));
  }
}

export {ViewManager};
export default ViewManager;