import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";

const geom = new THREE.PlaneGeometry( 1, 1 );
const mat = new THREE.ShaderMaterial( {
  uniforms: {
    urot: { // vec4 urot
      type: "v4",
      value: new THREE.Vector4(0, 0, 0, 0)
    },
    utime: { // float utime
      type: "f",
      value: 0.0
    },
    uintensity: { // float uintensity
      type: "f",
      value: 0.0
    }
  },
  vertexShader: // pass uv info to fragment shader
`varying vec2 vUv;
varying vec3 pos;

void main() {
  vUv = uv;
  pos = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );
}`,
  fragmentShader:
`varying vec2 vUv; 
varying vec3 pos;
uniform vec4 urot;
uniform float utime;
uniform float uintensity;
  
void main()
{
  float ay = urot.y;
  vec2 bottom = vec2(0.5, ay / 10.0);
  vec2 shifted = vec2(vUv.x * 1.5 - 0.2, vUv.y);
  
  float dist = distance(bottom, shifted);
  vec4 color = vec4(0.4, 0.4, 0.4, 
      log((cos(utime / 500.0 - vUv.y * 20.0 / ay) / 2.0 + 0.9) // make smoke textured
    *(1.0 - dist * 1.5) // fade on edges
    *(cos(gl_FragCoord.x / 20.0 + utime / 250.0) / 4.0 + 0.8) // make smoke move
    *uintensity) / 4.0); // increase smoke with more intensity
  gl_FragColor = color;
}`
} );
mat.transparent = true;
const smoke = new THREE.Mesh( geom, mat );

export { smoke };
export default smoke;