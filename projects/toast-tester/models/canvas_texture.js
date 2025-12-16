import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";

// A class to easily create and manage canvas textures
class CanvasTextureM {
  canvas;
  ctx;
  texture;
  constructor(filename, x, y) {
    console.log("Creating canvas");
    this.canvas = document.createElement("canvas");
    this.canvas.willReadFrequently = true;
    this.canvas.width = x;
    this.canvas.height = y;
    this.ctx = this.canvas.getContext('2d');
    
    // create three.js texture with the canvas
    this.texture = new THREE.CanvasTexture(this.canvas);
    if (filename !== undefined)
      this.applyTexture(filename); // apply image if provided
  }
  
  // loads an image to the canvas
  applyTexture(filename) {
    const img = new Image();
    img.onload = ()=>{
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); 
      console.log("image loaded");
      this.texture.needsUpdate = true;
    }
    img.src = filename;
  }
  
  // erases a square/rectangle from the texture
  erase(left, top, width, height) {
    this.ctx.clearRect(left, top, width, height);
    this.texture.needsUpdate = true;
  }
  
  // erases an ellipse from the texture (ratio depends on canvas aspect ratio)
  circleErase(x, y, radius) {
    this.ctx.save(); // save before creating mask
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.ctx.clip(); // mask before erasing 
    this.erase(x - radius, y - radius, radius * 2, radius * 2);
    this.ctx.restore(); // remove mask
  }
}

export { CanvasTextureM };
export default CanvasTextureM;