import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";
import { CanvasTextureM } from '../canvas_texture.js';
//import { LoopSubdivision } from 'https://unpkg.com/three-subdivide/build/index.module.js';

const tex_crumbs = new CanvasTextureM(undefined, 512, 512);

const geom = new THREE.PlaneGeometry( 1, 1 );
const base = tex_crumbs.texture;

const shader_crumbs = new THREE.MeshStandardMaterial({ map: base, bumpMap: base });
shader_crumbs.transparent = true;
// set the following when the toast is no longer moving:
// toastShader.transparent = true;
/*toastShader.onBeforeCompile = function(shader) {
  console.log("Modifying/compiling Toast shader.");
  toastShader.shaderData = shader;
  shader.uniforms.toastLevel = {type: "f", value: 0};
  shader.uniforms.texture1 = { 
      type: "t",
      value: base
    };
  shader.uniforms.texture2 = { 
      type: "t",
      value: burnt
    };
  shader.fragmentShader = `uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float toastLevel;
` + shader.fragmentShader;
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
*/
const crumbs = new THREE.Mesh( geom, shader_crumbs );
crumbs.name = "crumbs";


export {crumbs, tex_crumbs};
export default crumbs;