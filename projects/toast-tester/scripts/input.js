import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";

class Input {
  keysDown = {}; // dictionary of keys that are down
  mousePos = new THREE.Vector2(0, 0);
  clicked = false; // clicked previously
  clickedp = false; // clicked this frame
  mouseDown = false; // mouse is actively down
  keysPressed = {}; // dictionary of keys that were pressed previously
  raycaster = new THREE.Raycaster(); // for click detection
  
  constructor(surface) {
    if (!surface instanceof Element) {
      console.error("The input surface is not a valid DOM element.");
      return;
    }
    
    // various input listeners that set the properties
    const input = this;
    surface.addEventListener("keydown", (key)=>{
      input.keysDown[key.code] = true;
      input.keysPressed[key.code] = true;
    });
    surface.addEventListener("keyup", (key)=>{
      input.keysDown[key.code] = false;
    });
    surface.addEventListener("mousemove", (mouse)=>{
      // hack to get x and y in terms of the threejs context
      input.mousePos.x = ( mouse.clientX / window.innerWidth ) * 2 - 1;
      input.mousePos.y =  - ( mouse.clientY / window.innerHeight ) * 2 + 1;
    });
    surface.addEventListener("mousedown", (mouse)=>{
      input.mouseDown = true;
    });
    surface.addEventListener("mouseup", (mouse)=>{
      input.mouseDown = false;
    });
    surface.addEventListener("click", (mouse)=>{
      input.clicked = true;
      input.clickedp = true;
    });
  }
  
  keyDown(key) {
    return this.keysDown[key];
  }
  
  keyPressed(key) {
    const result = this.keysPressed[key];
    this.keysPressed[key] = false; // no other calls can check for this keypress after
    return result;
  }
  
  hasClicked() {
    const result = this.clicked;
    this.clicked = false; // no other calls can check for this click after
    return result;
  }
  
  pointingAt(camera, meshes) {
    this.raycaster.setFromCamera(this.mousePos, camera); // start ray from camera
    const intersected = this.raycaster.intersectObjects(meshes, true); // check if preselected meshes are on the ray
    return intersected; // return the intersected objects
  }
  
  clear() {
    this.clickedp = false; // reset click at end of frame
  }
}

export {Input};
export default Input;