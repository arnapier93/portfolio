import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";

let painting = new THREE.Group();
const loader = new GLTFLoader();


loader.load(
  './models/painting/scene.gltf',
  // loaded
  (gltf) => {
    painting.add(gltf.scene.children[0]);
    console.log("toast added");
  },
  // loading
  (xhr) => {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  (error) => {
    console.log("Error loading: ", error);
  }
);

export {painting};
export default painting;