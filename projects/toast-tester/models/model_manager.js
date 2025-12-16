import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";

// A class to ease model loading. Unused.
class ModelManager {
  texturem;
  geometry;
  material;
  model;
  
  constructor() {
    
  }
  
  modelFromFile(path) {
    this.model = new THREE.Group();
    const loader = new GLTFLoader();
    loader.load(
      path,
      // loaded
      (gltf) => {
        const obj = gltf.scene.children[0];
        obj.traverse((mesh)=>{
          if (this.material !== undefined)
            mesh.material = toastShader;
        });
        this.model.add(obj);
      },
      // loading
      (xhr) => console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ),
      (error) => console.log("Error loading toast: ", error)
    );
  }
}