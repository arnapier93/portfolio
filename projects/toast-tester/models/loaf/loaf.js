import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";

let loaf = new THREE.Group();
const loader = new GLTFLoader();


loader.load(
  './models/loaf/scene.gltf',
  // loaded
  (gltf) => {
    loaf.add(gltf.scene.children[0]);
  },
  // loading
  (xhr) => {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  (error) => {
    console.log("Error loading: ", error);
  }
);

export {loaf};
export default loaf;