import * as THREE$1 from 'https://cdn.skypack.dev/three@0.122.0/build/three.module.js';
import { Group } from 'https://cdn.skypack.dev/three@0.122.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.122.0/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'https://cdn.skypack.dev/three@v0.122.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Input {
  // dictionary of keys that are down
  // clicked previously
  // clicked this frame
  // mouse is actively down
  // dictionary of keys that were pressed previously
  // for click detection
  constructor(surface) {
    _defineProperty(this, "keysDown", {});

    _defineProperty(this, "mousePos", new THREE.Vector2(0, 0));

    _defineProperty(this, "clicked", false);

    _defineProperty(this, "clickedp", false);

    _defineProperty(this, "mouseDown", false);

    _defineProperty(this, "keysPressed", {});

    _defineProperty(this, "raycaster", new THREE.Raycaster());

    if (!surface instanceof Element) {
      console.error("The input surface is not a valid DOM element.");
      return;
    } // various input listeners that set the properties


    const input = this;
    surface.addEventListener("keydown", key => {
      input.keysDown[key.code] = true;
      input.keysPressed[key.code] = true;
    });
    surface.addEventListener("keyup", key => {
      input.keysDown[key.code] = false;
    });
    surface.addEventListener("mousemove", mouse => {
      // hack to get x and y in terms of the threejs context
      input.mousePos.x = mouse.clientX / window.innerWidth * 2 - 1;
      input.mousePos.y = -(mouse.clientY / window.innerHeight) * 2 + 1;
    });
    surface.addEventListener("mousedown", mouse => {
      input.mouseDown = true;
    });
    surface.addEventListener("mouseup", mouse => {
      input.mouseDown = false;
    });
    surface.addEventListener("click", mouse => {
      input.clicked = true;
      input.clickedp = true;
    });
  }

  keyDown(key) {
    return this.keysDown[key];
  }

  keyPressed(key) {
    const result = this.keysPressed[key];
    this.keysPressed[key] = false; // no other calls can check for this keypress after

    return result;
  }

  hasClicked() {
    const result = this.clicked;
    this.clicked = false; // no other calls can check for this click after

    return result;
  }

  pointingAt(camera, meshes) {
    this.raycaster.setFromCamera(this.mousePos, camera); // start ray from camera

    const intersected = this.raycaster.intersectObjects(meshes, true); // check if preselected meshes are on the ray

    return intersected; // return the intersected objects
  }

  clear() {
    this.clickedp = false; // reset click at end of frame
  }

}

class ViewManager {
  // 40; // ms
  constructor(scene) {
    _defineProperty(this, "renderer", void 0);

    _defineProperty(this, "controls", void 0);

    _defineProperty(this, "scene", void 0);

    _defineProperty(this, "camera", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "pTime", void 0);

    _defineProperty(this, "pLogicTime", void 0);

    _defineProperty(this, "logicFrameTime", 20);

    // save the width and height in case we need them
    const width = window.innerWidth;
    const height = window.innerHeight; // set the passed scene as what we'll handle

    this.scene = scene; // initialize the various components we need

    this.initRenderer(width, height);
    this.initCamera(width, height);
    this.initControls(this.camera, this.renderer);
    this.input = new Input(this.renderer.domElement); // pass the game dom to the input. we don't want unintended inputs if there's other stuff on the page
  } // create the rendering surface


  initRenderer(width, height) {
    this.renderer = new THREE$1.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.getContext().enable(this.renderer.getContext().DEPTH_TEST);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  } // set up the perspective camera


  initCamera(width, height) {
    this.camera = new THREE$1.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(10, 5, 5); // position, but will look at (0, 0, 0) by default

    if (this.scene.listener !== undefined) {
      this.camera.add(this.scene.listener); // listen to audio from the scene
    }
  } // add orbit controls


  initControls(camera, renderer) {
    if (renderer === undefined) {
      console.error("The renderer was not initialized before attempting to initialize controls.");
      return;
    }

    if (camera === undefined) {
      console.error("The camera was not initialized before attempting to initialize controls.");
      return;
    }

    this.controls = new OrbitControls(camera, renderer.domElement);
  } // things to do right before starting the loop (edge case. most things should be put in the constructor)


  start() {
    window.requestAnimationFrame(time => this.frame(time));
  } // runs the scene at 24fps


  loop(dTime) {
    this.scene.loop(dTime, this.input, this.camera);
  } // runs as fast as the gpu allows


  frame(time) {
    // get the time between frames
    if (this.pTime === undefined) this.pTime = time;
    const dTime = time - this.pTime;
    this.previousTime = dTime; // run this.loop at 24 fps

    if (this.pLogicTime === undefined) this.pLogicTime = time;
    const dLogicTime = time - this.pLogicTime;

    if (dLogicTime > this.logicFrameTime) {
      this.pLogicTime = time;
      this.loop(dLogicTime);
      this.input.clear();
    } // render changes and update the camera


    this.renderer.render(this.scene.scene, this.camera);
    this.controls.update(); // run the loop again

    window.requestAnimationFrame(time => this.frame(time));
  }

}

class CanvasTextureM {
  constructor(filename, x, y) {
    _defineProperty(this, "canvas", void 0);

    _defineProperty(this, "ctx", void 0);

    _defineProperty(this, "texture", void 0);

    console.log("Creating canvas");
    this.canvas = document.createElement("canvas");
    this.canvas.willReadFrequently = true;
    this.canvas.width = x;
    this.canvas.height = y;
    this.ctx = this.canvas.getContext('2d'); // create three.js texture with the canvas

    this.texture = new THREE$1.CanvasTexture(this.canvas);
    if (filename !== undefined) this.applyTexture(filename); // apply image if provided
  } // loads an image to the canvas


  applyTexture(filename) {
    const img = new Image();

    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      console.log("image loaded");
      this.texture.needsUpdate = true;
    };

    img.src = filename;
  } // erases a square/rectangle from the texture


  erase(left, top, width, height) {
    this.ctx.clearRect(left, top, width, height);
    this.texture.needsUpdate = true;
  } // erases an ellipse from the texture (ratio depends on canvas aspect ratio)


  circleErase(x, y, radius) {
    this.ctx.save(); // save before creating mask

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.ctx.clip(); // mask before erasing 

    this.erase(x - radius, y - radius, radius * 2, radius * 2);
    this.ctx.restore(); // remove mask
  }

}

const tex_toastbase = new CanvasTextureM("./models/toast/textures/toast_baseColor.jpeg", 256, 128);
const tex_toastburnt = new CanvasTextureM("./models/toast/textures/toast_burnt.jpeg", 256, 128);
let toast = new THREE$1.Group();
const loader$5 = new GLTFLoader();
const base$2 = tex_toastbase.texture;
const burnt = tex_toastburnt.texture; // create material and inject shader code

const toastShader = new THREE$1.MeshStandardMaterial({
  map: base$2
});

toastShader.onBeforeCompile = function (shader) {
  console.log("Modifying/compiling Toast shader.");
  toastShader.shaderData = shader;
  shader.uniforms.toastLevel = {
    type: "f",
    value: 0
  }; // float toastLevel

  shader.uniforms.texture1 = {
    // sampler2D texture1
    type: "t",
    value: base$2
  };
  shader.uniforms.texture2 = {
    // sampler2D texture2
    type: "t",
    value: burnt
  }; // pass the uniforms to the shader

  shader.fragmentShader = `uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float toastLevel;
` + shader.fragmentShader; // multiply diffuse color with interpolation of the two toast textures

  shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
    diffuseColor *= (1.0 - toastLevel) * texture2D(texture1, vUv) + toastLevel * texture2D(texture2, vUv);`);
};

loader$5.load('./models/toast/scene.gltf', // loaded
gltf => {
  const obj = gltf.scene.children[0]; // apply the shader to all of the meshes

  obj.traverse(mesh => {
    mesh.material = toastShader;
  });
  toast.add(gltf.scene.children[0]);
}, // loading
xhr => {
  console.log(xhr.loaded / xhr.total * 100 + '% loaded');
}, error => {
  console.log("Error loading toast: ", error);
});
toast.shader = toastShader;
toast.name = "toast";

const toaster = new THREE$1.Group();
const loader$4 = new GLTFLoader();
loader$4.load('./models/toaster/scene.gltf', // loaded
gltf => {
  const obj = gltf.scene.children[0];
  obj.traverse(mesh => {
    mesh.color = new THREE$1.Color(0x330000);
  });
  obj.color = new THREE$1.Color(0x330000);
  toaster.add(gltf.scene.children[0]);
}, // loading
xhr => {
  console.log(xhr.loaded / xhr.total * 100 + '% loaded');
}, error => {
  console.log("Error loading toaster: ", error);
});

const wall = new Group();
const loader$3 = new GLTFLoader();
loader$3.load('./models/wall/scene.gltf', // loaded
gltf => {
  wall.add(gltf.scene.children[0]);
}, // loading
xhr => {
  console.log(xhr.loaded / xhr.total * 100 + '% loaded');
}, error => {
  console.log("Error loading toaster: ", error);
});

const counter = new Group();
const loader$2 = new GLTFLoader();
loader$2.load('./models/counter/scene.gltf', // loaded
gltf => {
  counter.add(gltf.scene.children[0]);
}, // loading
xhr => {
  console.log(xhr.loaded / xhr.total * 100 + '% loaded');
}, error => {
  console.log("Error loading counter: ", error);
});

let painting = new THREE$1.Group();
const loader$1 = new GLTFLoader();
loader$1.load('./models/painting/scene.gltf', // loaded
gltf => {
  painting.add(gltf.scene.children[0]);
  console.log("toast added");
}, // loading
xhr => {
  console.log(xhr.loaded / xhr.total * 100 + '% loaded');
}, error => {
  console.log("Error loading: ", error);
});

let loaf = new THREE$1.Group();
const loader = new GLTFLoader();
loader.load('./models/loaf/scene.gltf', // loaded
gltf => {
  loaf.add(gltf.scene.children[0]);
}, // loading
xhr => {
  console.log(xhr.loaded / xhr.total * 100 + '% loaded');
}, error => {
  console.log("Error loading: ", error);
});

const geom$2 = new THREE$1.PlaneGeometry(1, 1);
const mat = new THREE$1.ShaderMaterial({
  uniforms: {
    urot: {
      // vec4 urot
      type: "v4",
      value: new THREE$1.Vector4(0, 0, 0, 0)
    },
    utime: {
      // float utime
      type: "f",
      value: 0.0
    },
    uintensity: {
      // float uintensity
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
  fragmentShader: `varying vec2 vUv; 
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
});
mat.transparent = true;
const smoke = new THREE$1.Mesh(geom$2, mat);

const tex_crumbs = new CanvasTextureM(undefined, 512, 512);
const geom$1 = new THREE$1.PlaneGeometry(1, 1);
const base$1 = tex_crumbs.texture;
const shader_crumbs = new THREE$1.MeshStandardMaterial({
  map: base$1,
  bumpMap: base$1
});
shader_crumbs.transparent = true; // set the following when the toast is no longer moving:
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

const crumbs = new THREE$1.Mesh(geom$1, shader_crumbs);
crumbs.name = "crumbs";

const tex_plane = new CanvasTextureM(undefined, 1920, 1080);
const geom = new THREE$1.PlaneGeometry(1, 1);
const base = tex_plane.texture;
const shader_plane = new THREE$1.MeshStandardMaterial({
  map: base,
  bumpMap: base
});
shader_plane.transparent = true;
const mouse_plane = new THREE$1.Mesh(geom, shader_plane);
mouse_plane.name = "plane";

class MatrixHelper {
  constructor() {}

  static uniformScale(object, value) {
    const scaleMatrix = new THREE.Matrix4();
    scaleMatrix.set(value, 0, 0, 0, 0, value, 0, 0, 0, 0, value, 0, 0, 0, 0, 0);
    object.applyMatrix4(scaleMatrix);
  }

  static translate(object, x, y, z) {
    const translationMatrix = new THREE.Matrix4();
    translationMatrix.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 0);
    object.applyMatrix4(translationMatrix);
  }

  static rotateX(object, deg) {
    deg *= Math.PI / 180;
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.set(1, 0, 0, 0, 0, Math.cos(deg), -Math.sin(deg), 0, 0, Math.sin(deg), Math.cos(deg), 0, 0, 0, 0, 0);
    object.applyMatrix4(rotationMatrix);
  } // converts degrees to radians (three.js, doesn't use degrees)


  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  static rotateY(object, deg) {
    deg *= Math.PI / 180;
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.set(Math.cos(deg), 0, Math.sin(deg), 0, 0, 1, 0, 0, -Math.sin(deg), 0, Math.cos(deg), 0, 0, 0, 0, 0);
    object.applyMatrix4(rotationMatrix);
  }

  static rotateZ(object, deg) {
    deg *= Math.PI / 180;
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.set(Math.cos(deg), -Math.sin(deg), 0, 0, Math.sin(deg), Math.cos(deg), 0, 0, 0, 0, 1, 0, 0, 0, 0, 0);
    object.applyMatrix4(rotationMatrix);
  } // given a function, start value, and end value, this converts a function into a 50-point curve
  // you realistically don't want to use this. just create a curve by calling the function 50 times instead


  static func2points(fn, start, end) {
    let curve = new THREE.CubicBezierCurve3(fn(start), // start
    fn((start + end) / 3), fn(2 * (start + end) / 3), fn(end));
    return curve.getPoints(50);
  } // creates a curve from a function with some number of points (def=50) and specified values for each quarter
  // unlike func2points, this one has a clear usecase. you can effectively time the different points, allowing for a more-lively animation


  static func2pointsSpecified(fn, p1, p2, p3, p4, pts) {
    let curve = new THREE.CubicBezierCurve3(fn(p1), // start
    fn(p2), fn(p3), fn(p4));
    if (pts == undefined) pts = 50;
    return curve.getPoints(pts);
  }

}

// There is no point to use it on its own.

class SceneManager {
  constructor() {
    _defineProperty(this, "scene", void 0);

    _defineProperty(this, "listener", void 0);

    this.scene = new THREE.Scene();
    this.listener = new THREE.AudioListener();
  } // logic loop. to be overridden.


  loop(dTime, input, camera) {}

}

const Stages = {
  ToasterSpring: -4,
  Before: -3,
  CarryingSlice: -2,
  InsertSlice: -1,
  Toasting: 0,
  Popping: 1,
  ToastWaiting: 2,
  RemoveToast: 3,
  EatToast: 4
};

class ToasterScene extends SceneManager {
  constructor() {
    super();

    _defineProperty(this, "scene", void 0);

    _defineProperty(this, "entities", {});

    _defineProperty(this, "sounds", {});

    _defineProperty(this, "toastPopped", false);

    _defineProperty(this, "toastLevel", 0.0);

    _defineProperty(this, "heatLight", void 0);

    _defineProperty(this, "heatOn", 1);

    _defineProperty(this, "removeCurvePoints", void 0);

    _defineProperty(this, "removeRotationPoints", void 0);

    _defineProperty(this, "popCurvePoints", void 0);

    _defineProperty(this, "popRotationPoints", void 0);

    _defineProperty(this, "toastFrame", 0);

    _defineProperty(this, "toasterFrame", 0);

    _defineProperty(this, "alarmSound", void 0);

    _defineProperty(this, "music", void 0);

    _defineProperty(this, "musicStartTime", void 0);

    _defineProperty(this, "musicBPM", 80);

    _defineProperty(this, "toasterSound", void 0);

    _defineProperty(this, "stage", -3);

    this.scene = new THREE.Scene(); // loading all of the audio for the scene

    this.music = new THREE.Audio(this.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("./sounds/456797__nikosardas__jazz_music_loop.mp3", buff => {
      this.music.setBuffer(buff);
      this.music.setLoop(true);
      this.music.setVolume(1.0);
      this.music.play();
      this.musicStartTime = Date.now();
      console.log("Alarm sound loaded");
    });
    this.toasterSound = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/490323__knufds__clock_02.wav", buff => {
      this.toasterSound.setBuffer(buff);
      this.toasterSound.setLoop(true);
      this.toasterSound.setVolume(0.3); //this.toasterSound.play();
    });
    this.boing = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/540790__magnuswaker__boing-2.wav", buff => {
      this.boing.setBuffer(buff);
      this.boing.setLoop(false);
      this.boing.setVolume(5.0);
    });
    this.grab = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/395328__ihitokage__grab-1.ogg", buff => {
      this.grab.setBuffer(buff);
      this.grab.setLoop(false);
      this.grab.setVolume(5.0);
    });
    this.plate = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/447847__anthousai__ceramic-bowl-hit-02.wav", buff => {
      this.plate.setBuffer(buff);
      this.plate.setLoop(false);
      this.plate.setVolume(5.0);
    });
    this.chewingNoise = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/364924__rudmer_rotteveel__eating-a-cracker-mouth-closed.wav", buff => {
      this.chewingNoise.setBuffer(buff);
      this.chewingNoise.setLoop(false);
      this.chewingNoise.setVolume(7.0);
      this.chewingNoise.duration = 0.75;
    });

    this.removeCurvePoints = MatrixHelper.func2pointsSpecified(value => {
      return new THREE.Vector3(-0.25, -1 * Math.pow(value - 3, 2) + 9, -0.25 + value);
    }, 0, 3, 4, 6.485); // 0-6

    this.removeRotationPoints = MatrixHelper.func2pointsSpecified(value => {
      return new THREE.Vector3(MatrixHelper.deg2rad(90 - value), 0, MatrixHelper.deg2rad(-45 + value / 2));
    }, 0, 30, 60, 90);
    this.popCurvePoints = MatrixHelper.func2pointsSpecified(value => {
      return new THREE.Vector3(-0.25, -1 * Math.pow(value - 3, 2) + 9, -0.25);
    }, 0, 3.5, 4, 0.1);
    this.popRotationPoints = MatrixHelper.func2pointsSpecified(value => {
      return new THREE.Vector3(MatrixHelper.deg2rad(90), MatrixHelper.deg2rad(value), MatrixHelper.deg2rad(-45));
    }, 0, 50, 290, 360);
    this.toasterScalePoints = MatrixHelper.func2pointsSpecified(value => {
      return new THREE.Vector3(0.7, value, 0.7);
    }, 0.7, 0.4, 0.2, 1, 10);
    this.toasterPosPoints = MatrixHelper.func2pointsSpecified(value => {
      return new THREE.Vector3(2.12132034, value - 1, 2.12132034);
    }, 0, -0.3, -0.5, 1, 10);
    this.toasterRScalePoints = MatrixHelper.func2pointsSpecified(value => {
      return new THREE.Vector3(0.7, value, 0.7);
    }, 1, 0.8, 0.7, 0.7, 30);
    this.toasterRPosPoints = MatrixHelper.func2pointsSpecified(value => {
      return new THREE.Vector3(2.12132034, value - 1, 2.12132034);
    }, 1, 0.1, 0, 0, 30);
    this.addModels();
  }

  addModels() {
    // three different light sources for the scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.y = 1;
    const overheadLight = new THREE.PointLight(0xffffff, 2, 20);
    overheadLight.position.y = 10;
    overheadLight.position.x = -3;
    const ambientLight = new THREE.AmbientLight(0xf0f0f0, 0.7); // pointlight inside of toaster

    this.heatLight = new THREE.PointLight(0xff0000, 10, 4);
    this.heatLight.castShadow = true;
    this.heatLight.position.y = 1;
    this.heatOn = 0.0; // place counter

    MatrixHelper.uniformScale(counter, 5);
    MatrixHelper.translate(counter, 0, -10, -5); // place toaster on counter

    MatrixHelper.uniformScale(toaster, 0.7);
    MatrixHelper.translate(toaster, 0, -1, 3);
    MatrixHelper.rotateY(toaster, 45); // place toast inside of toaster

    MatrixHelper.uniformScale(toast, 0.3);
    MatrixHelper.translate(toast, 0, -0.5, 5); //-0.5, 0);

    MatrixHelper.rotateX(toast, 90);
    MatrixHelper.rotateY(toast, 90); // place wall behind counter

    MatrixHelper.uniformScale(wall, 3.5);
    MatrixHelper.rotateY(wall, 90);
    MatrixHelper.translate(wall, 11, -12.5, -2.5); // place painting on wall

    MatrixHelper.uniformScale(painting, 4);
    MatrixHelper.rotateY(painting, 90);
    MatrixHelper.translate(painting, -5.2, 3.5, 0); // scale smoke and set initial position

    MatrixHelper.uniformScale(smoke, 8);
    MatrixHelper.translate(smoke, 0, 5, 0); // scale smoke ceiling and set initial position
    //MatrixHelper.uniformScale(smoke_ceiling, 10);
    //MatrixHelper.translate(smoke_ceiling, 0, 5, 0);
    // crumbs

    MatrixHelper.uniformScale(crumbs, 5);
    MatrixHelper.rotateX(crumbs, -90);
    MatrixHelper.translate(crumbs, -0.5, -2.65, 6.5); // mouse plane

    MatrixHelper.rotateY(mouse_plane, 90);
    mouse_plane.scale.set(50, 10, 1);
    mouse_plane.position.set(0, 2.5, 0);
    mouse_plane.visible = false; //this.uniformScale(mouse_plane, 100);
    // loaf

    MatrixHelper.uniformScale(loaf, 6); // on counter, next to toaster

    MatrixHelper.rotateX(loaf, -13);
    MatrixHelper.rotateZ(loaf, -22);
    MatrixHelper.rotateY(loaf, -120);
    MatrixHelper.translate(loaf, -1, -3, -21);
    /* // in sink
    MatrixHelper.rotateX(loaf, 45);
    MatrixHelper.rotateZ(loaf, -22);
    MatrixHelper.rotateY(loaf, -120);
    MatrixHelper.translate(loaf, 2, -3, -10);
    */
    // add all models into the scene

    [directionalLight, overheadLight, ambientLight, toast, toaster, wall, counter, this.heatLight, painting, smoke, crumbs, loaf, mouse_plane].forEach(model => {
      model.recieveShadow = true;
      this.scene.add(model);
    });
  }

  loop(dTime, input, camera) {
    this.heatLight.intensity = (Math.sin(Date.now() / 2000) + 1) * 10 * this.heatOn; // set the light of the toaster

    smoke.quaternion.copy(camera.quaternion); // make smoke face the camera

    smoke.renderOrder = 10; // ensure nothing clips with the smoke

    smoke.getWorldDirection(smoke.material.uniforms.urot.value); // give the direction of the smoke to the shader

    smoke.material.uniforms.utime.value = Date.now() % 100000; // current time with modulo to maintain precision

    smoke.material.uniforms.uintensity.value = Math.pow(this.toastLevel, 2) * 5.0; // set smoke level according to toast level
    // ideally these would be enums, but javascript doesn't have enums

    switch (this.stage) {
      case Stages.Before:
        // waiting for loaf to be clicked
        tex_toastbase.texture.needsUpdate = true;
        tex_toastburnt.texture.needsUpdate = true;
        toast.transparent = false; // if loaf is clicked

        if (input.hasClicked()) {
          input.pointingAt(camera, [loaf]).forEach(item => {
            // take a slice from the loaf
            this.stage = Stages.CarryingSlice;
            this.grab.play();
            toast.position.copy(loaf.position);
          });
        }

        break;

      case Stages.CarryingSlice:
        // slice of bread in hand
        // get position with cam->mouse ray on mouse_plane
        input.pointingAt(camera, [mouse_plane]).forEach(item => {
          let newPos = new THREE.Vector3(0, item.point.y, item.point.z); // move slice to position if not overlapping with toaster

          if (newPos.distanceTo(toaster.position) > 4) toast.position.set(0, (newPos.y + toast.position.y) / 2, (newPos.z + toast.position.z) / 2); // drop into toaster if close enough

          if (input.hasClicked() && Math.abs(item.point.z - toaster.position.z) < 5) {
            this.grab.play();
            this.stage++; // set up the insert animation

            this.insertCurvePoints = new THREE.CubicBezierCurve3(toast.position, toast.position, new THREE.Vector3(-0.25, 0, -0.25), new THREE.Vector3(-0.25, 0, -0.25)).getPoints(10);
            this.insertFrame = 0;
            this.insertRotationPoints = MatrixHelper.func2pointsSpecified(value => {
              return new THREE.Vector3(MatrixHelper.deg2rad(90), 0, MatrixHelper.deg2rad(-45 + value));
            }, -45, 0, 0, 0, 10);
          }
        });
        break;

      case Stages.InsertSlice:
        // toast going into toaster
        toast.position.copy(this.insertCurvePoints[this.insertFrame]);
        toast.rotation.setFromVector3(this.insertRotationPoints[this.insertFrame]);
        this.insertFrame++; // toast is inside toaster

        if (this.insertFrame == this.insertCurvePoints.length) {
          this.toasterSound.play();
          this.heatOn = 1.0;
          this.stage++;
        }

        break;

      case Stages.Toasting:
        // toast is inside toaster
        this.toastLevel += 0.005; // apply toastLevel uniform to all parts of the toast model

        const currentToastLevel = this.toastLevel;
        toast.traverse(mesh => {
          if (mesh instanceof THREE.Mesh && mesh.material.shaderData !== undefined) {
            mesh.material.shaderData.uniforms.toastLevel.value = currentToastLevel;
          }
        }); // wind up to pop the toast

        if (input.keyPressed("Space")) {
          this.stage = Stages.ToasterSpring;
          this.toasterFrame = 0;
        } // smoke alarm if it gets too smokey


        if (this.toastLevel > 1.5 && this.alarmSound === undefined) {
          this.alarmSound = new THREE.Audio(this.listener);
          const audioLoader = new THREE.AudioLoader();
          audioLoader.load("./sounds/210513__nigelcoop__fire-alarm.wav", buff => {
            this.alarmSound.setBuffer(buff);
            this.alarmSound.setLoop(true);
            this.alarmSound.setVolume(0.5);
            this.alarmSound.play();
          });
        }

        break;

      case Stages.ToasterSpring:
        // backtrack for toaster spring
        toaster.scale.copy(this.toasterScalePoints[this.toasterFrame]);
        toaster.position.copy(this.toasterPosPoints[this.toasterFrame]);
        this.toasterFrame++;

        if (this.toasterFrame >= this.toasterPosPoints.length / 4 * 2) {
          this.stage = Stages.Popping; //this.toasterFrame = 0;

          this.toasterSound.stop();
          this.heatOn = 0.0;
          this.boing.play();
        }

        break;

      case Stages.Popping:
        // toast is popping
        // finish the toaster's spring animation
        if (this.toasterFrame != this.toasterScalePoints.length) {
          toaster.scale.copy(this.toasterScalePoints[this.toasterFrame]);
          toaster.position.copy(this.toasterPosPoints[this.toasterFrame]);
          this.toasterFrame++;
        } // run toaster's de-spring animation
        else if (this.toastFrame < 30) {
          toaster.scale.copy(this.toasterRScalePoints[this.toastFrame]);
          toaster.position.copy(this.toasterRPosPoints[this.toastFrame]);
        } // toast pop motion


        toast.position.copy(this.popCurvePoints[this.toastFrame]);
        toast.rotation.setFromVector3(this.popRotationPoints[this.toastFrame]);
        this.toastFrame++; // toast landed back in toaster

        if (this.toastFrame >= this.popCurvePoints.length) {
          this.stage++;
          this.toastFrame = 0;
          this.grab.play();
        }

        break;

      case Stages.ToastWaiting:
        // toast sitting in toaster
        // toast to be removed from toaster when the spacebar is pressed
        if (input.keyPressed("Space")) {
          this.stage++;
          this.grab.play();
        }

        break;

      case Stages.RemoveToast:
        // toast being removed from toaster
        toast.position.copy(this.removeCurvePoints[this.toastFrame]);
        toast.rotation.setFromVector3(this.removeRotationPoints[this.toastFrame]);
        this.toastFrame++; // toast is on counter

        if (this.toastFrame >= this.removeCurvePoints.length) {
          this.stage++;
          this.toastFrame = 0; // change toast material properties to enable "eating"

          toast.children[0].material.transparent = true;
          toast.children[0].material.depthWrite = false;
          toast.renderOrder = 5;
          toast.children[0].material.needsUpdate = true; // landing sound

          this.plate.detune = (this.toastLevel - 5) * 600;
          this.plate.play();
        }

        break;

      case Stages.EatToast:
        // eating the toast
        // check if clicked
        if (input.hasClicked()) {
          const sup = this; // shouldn't be necessary due to arrow funcs, but 'this' wasn't working
          // check that the toast has been clicked

          input.pointingAt(camera, [toast]).forEach(item => {
            if (item.uv !== undefined) {
              // calculate position on texture from uv coords
              const x = Math.floor(item.uv.x * 256);
              const y = 128 - Math.floor(item.uv.y * 128); // check if pixel clicked is empty and play failure sound

              const imgData = tex_toastbase.ctx.getImageData(x, y, 1, 1);

              if (imgData.data[3] <= 0) {
                sup.plate.duration = 0.1;
                sup.plate.play();
              } else {
                // otherwise take bite
                // play chewing noise
                sup.chewingNoise.pause();
                const chewingNoiseTimes = [0, 1.2]; // different offsets for variety in chewing noise

                sup.chewingNoise.offset = chewingNoiseTimes[Math.floor(Math.random() * chewingNoiseTimes.length)];
                sup.chewingNoise.play(); // erase bite area from both textures

                tex_toastbase.circleErase(item.uv.x * 256, 128 - item.uv.y * 128, 60);
                tex_toastburnt.circleErase(item.uv.x * 256, 128 - item.uv.y * 128, 60); // add 500 crubs to the plane on the counter

                const crumb_colors = ["#d8ac87", "#d1d0cb", "#432724", "#3d2620"];

                for (let i = 0; i < 500; i++) {
                  let crumbX = Math.random() * 300 - 150;
                  let crumbY = Math.random() * 300 - 150;
                  tex_crumbs.ctx.fillStyle = crumb_colors[Math.floor(Math.random() * crumb_colors.length)];
                  tex_crumbs.ctx.fillRect(item.uv.x * 256 + 128 - crumbX, 256 - item.uv.y * 256 + 128 - crumbY, 3, 3);
                }

                tex_crumbs.texture.needsUpdate = true; // check if toast is basically empty

                const completeImageData = tex_toastbase.ctx.getImageData(0, 0, 256, 128);
                let sampleAvg = 0;

                for (let i = 0; i < 30; i++) {
                  sampleAvg += completeImageData.data[Math.floor(Math.random() * 32768) * 4];
                }

                sampleAvg /= 30; // all 30 points have an average opacity < 10

                if (sampleAvg < 10) {
                  this.stage = Stages.Before; // go back to first stage
                  // reset alarm

                  if (this.alarmSound !== undefined) {
                    this.alarmSound.stop();
                    this.alarmSound = undefined; // should remove this. keep loaded, control as needed
                  } //reset toast


                  tex_toastbase.applyTexture("./models/toast/textures/toast_baseColor.jpeg");
                  tex_toastburnt.applyTexture("./models/toast/textures/toast_burnt.jpeg");
                  tex_toastbase.texture.needsUpdate = true;
                  tex_toastburnt.texture.needsUpdate = true;
                  toast.transparent = false;
                  toast.renderOrder = 0;
                  MatrixHelper.translate(toast, 0, -2, 0);
                  toast.rotation.set(0, 0, MatrixHelper.deg2rad(90));
                  this.toastLevel = 0;
                  const currentToastLevel = this.toastLevel;
                  toast.traverse(mesh => {
                    if (mesh instanceof THREE.Mesh && mesh.material.shaderData !== undefined) {
                      mesh.material.shaderData.uniforms.toastLevel.value = currentToastLevel;
                    }
                  });
                }
              }
            }
          });
        }

        break;
    }
  }

}

// TODO: finished entity overhaul (permits multiple of each model + easier interactions + easier animations + easier everything)
// DONE: consolidate files for connection/loading reasons (codepen provides main.processed.js)
// Scene logic is in toaster_scene.js
// Camera and frame logic are in view_manager.js
// Matrix and transformation logic are in matrixhelper.js
// Model loading and shaders are located in the main .js file within each subdirectory of '/models/'
// Input and rays are in input.js
// toaster_entity_scene.js, the /scripts/entities subdirectory, and a few models are unused
// Start a view with the toaster scene

const window$1 = new ViewManager(new ToasterScene());
window$1.start();
