import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
import SceneManager from './scene.js';
import Toast from './entities/toast.js';
import MousePlane from './entities/mouse_plane.js';
import Toaster from './entities/toaster.js';
import Counter from './entities/counter.js';
import Wall from './entities/wall.js';
import Painting from './entities/painting.js';
import Loaf from './entities/loaf.js';

class ToasterScene extends SceneManager {
  entities = {
    "toast": new Toast(),
    "mouse_plane": new MousePlane(),
    "toaster": new Toaster(),
    "counter": new Counter(),
    "wall": new Wall(),
    "painting": new Painting(),
    "loaf": new Loaf()
  };
  constructor() {
    super();
    this.scene = new THREE.Scene();
    
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2);
    directionalLight.position.y = 1;
    const overheadLight = new THREE.PointLight(0xffffff, 2, 20);
    overheadLight.position.y = 10;
    overheadLight.position.x = -3;
    const ambientLight = new THREE.AmbientLight(0xf0f0f0, 0.7);
    
    [directionalLight, overheadLight, ambientLight].forEach((e)=>{
      this.scene.add(e);
    })
    
    for (const [k, e] of Object.entries(this.entities)) {
      try {
        this.scene.add(e.model);
        console.log(e);
      } catch (err) {
        this.scene.add(e);
        //console.log(err);
      }
    }
  }
  
  loop(dTime, input, camera) {
    for (const [k, e] of Object.entries(this.entities)) {
      try {
        e.handle(this.entities, this.sounds, input, camera);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export {ToasterScene};
export default ToasterScene;