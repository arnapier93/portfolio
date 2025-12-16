import { Group } from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";

const counter = new Group();
const loader = new GLTFLoader();

loader.load(
  './models/counter/scene.gltf',
  // loaded
  (gltf) => {
    counter.add(gltf.scene.children[0]);
  },
  // loading
  (xhr) => {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  (error) => {
    console.log("Error loading counter: ", error);
  }
);

export {counter};
export default counter;