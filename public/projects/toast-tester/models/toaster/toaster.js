import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";

const toaster = new THREE.Group();
const loader = new GLTFLoader();

loader.load(
  './models/toaster/scene.gltf',
  // loaded
  (gltf) => {
    const obj = gltf.scene.children[0];
    obj.traverse((mesh)=>{
      mesh.color = new THREE.Color( 0x330000 );
    });
    obj.color = new THREE.Color( 0x330000 );
    toaster.add(gltf.scene.children[0]);
  },
  // loading
  (xhr) => {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  (error) => {
    console.log("Error loading toaster: ", error);
  }
);

export {toaster};
export default toaster;