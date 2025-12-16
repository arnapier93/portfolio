import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js";
import { CanvasTextureM } from '../canvas_texture.js';

const tex_plane = new CanvasTextureM(undefined, 1920, 1080);

const geom = new THREE.PlaneGeometry( 1, 1 );
const base = tex_plane.texture;

const shader_plane = new THREE.MeshStandardMaterial({ map: base, bumpMap: base });
shader_plane.transparent = true;

const mouse_plane = new THREE.Mesh( geom, shader_plane );
mouse_plane.name = "plane";


export {mouse_plane, tex_plane};
export default mouse_plane;