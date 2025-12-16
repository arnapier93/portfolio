import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";
import { CanvasTextureM } from '../canvas_texture.js';

// load textures as modifiable canvases
const tex_toastbase = new CanvasTextureM("./models/toast/textures/toast_baseColor.jpeg", 256, 128);
const tex_toastburnt = new CanvasTextureM("./models/toast/textures/toast_burnt.jpeg", 256, 128);

let toast = new THREE.Group();
const loader = new GLTFLoader();

const base = tex_toastbase.texture;
const burnt = tex_toastburnt.texture;

// create material and inject shader code
const toastShader = new THREE.MeshStandardMaterial({ map: base });
toastShader.onBeforeCompile = function(shader) {
  console.log("Modifying/compiling Toast shader.");
  toastShader.shaderData = shader;
  shader.uniforms.toastLevel = {type: "f", value: 0}; // float toastLevel
  shader.uniforms.texture1 = { // sampler2D texture1
      type: "t",
      value: base
    };
  shader.uniforms.texture2 = { // sampler2D texture2
      type: "t",
      value: burnt
    };
  
  // pass the uniforms to the shader
  shader.fragmentShader = `uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float toastLevel;
` + shader.fragmentShader;
  
  // multiply diffuse color with interpolation of the two toast textures
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <color_fragment>',
    `#include <color_fragment>
    diffuseColor *= (1.0 - toastLevel) * texture2D(texture1, vUv) + toastLevel * texture2D(texture2, vUv);`
  );
}

loader.load(
  './models/toast/scene.gltf',
  // loaded
  (gltf) => {
    const obj = gltf.scene.children[0];
    
    // apply the shader to all of the meshes
    obj.traverse((mesh)=>{
      mesh.material = toastShader;
    });
    
    toast.add(gltf.scene.children[0]);
  },
  // loading
  (xhr) => {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  (error) => {
    console.log("Error loading toast: ", error);
  }
);

toast.shader = toastShader;
toast.name = "toast";

export {toast, tex_toastbase, tex_toastburnt};
export default toast;