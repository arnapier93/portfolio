import * as THREE from "https://cdn.skypack.dev/three@0.122.0/build/three.module.js";
// window manager
import ViewManager from './view_manager.js';
// toaster scene
import ToasterScene from './toaster_scene.js';//'./toaster_entity_scene.js';

// TODO: finished entity overhaul (permits multiple of each model + easier interactions + easier animations + easier everything)
// DONE: consolidate files for connection/loading reasons (codepen provides main.processed.js)

// Scene logic is in toaster_scene.js
// Camera and frame logic are in view_manager.js
// Matrix and transformation logic are in matrixhelper.js
// Model loading and shaders are located in the main .js file within each subdirectory of '/models/'
// Input and rays are in input.js

// toaster_entity_scene.js, the /scripts/entities subdirectory, and a few models are unused

// Start a view with the toaster scene
const window = new ViewManager(new ToasterScene());
window.start();