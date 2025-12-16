import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";
// import {model} from '../models/{model}/{model}.js'
import Input from './input.js';
import {toast, tex_toastbase, tex_toastburnt} from '../models/toast/toast.js';
import toaster from '../models/toaster/toaster.js';
import wall from '../models/wall/wall.js';
import counter from '../models/counter/counter.js';
import painting from '../models/painting/painting.js';
import loaf from '../models/loaf/loaf.js';
import smoke from '../models/smoke/smoke.js';
import shader_smokeceiling from '../models/smoke_ceiling/smoke_ceiling.js';
import {crumbs, tex_crumbs} from '../models/crumbs/crumbs.js';
import {mouse_plane, tex_plane} from '../models/mouse_plane/mouse_plane.js';
import {MatrixHelper} from './matrixhelper.js';
import SceneManager from './scene.js';

// closest thing to enums in JS
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
}

class ToasterScene extends SceneManager {
  scene;
  entities = {};
  sounds = {};
  
  toastPopped = false; 
  toastLevel = 0.0;
  heatLight;
  heatOn = 1;
  
  removeCurvePoints;
  removeRotationPoints;
  popCurvePoints;
  popRotationPoints;
  toastFrame = 0;
  toasterFrame = 0;
  
  alarmSound;
  music;
  musicStartTime;
  musicBPM = 80;
  toasterSound;
  
  stage = -3;
  
  constructor() {
    super();
    this.scene = new THREE.Scene();
    
    // loading all of the audio for the scene
    this.music = new THREE.Audio(this.listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("./sounds/456797__nikosardas__jazz_music_loop.mp3", (buff)=>{
      this.music.setBuffer(buff);
      this.music.setLoop(true);
      this.music.setVolume(1.0);
      this.music.play();
      this.musicStartTime = Date.now();
      console.log("Alarm sound loaded")
    });
    
    this.toasterSound = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/490323__knufds__clock_02.wav", (buff)=>{
      this.toasterSound.setBuffer(buff);
      this.toasterSound.setLoop(true);
      this.toasterSound.setVolume(0.3);
      //this.toasterSound.play();
    });
    
    this.boing = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/540790__magnuswaker__boing-2.wav", (buff)=>{
      this.boing.setBuffer(buff);
      this.boing.setLoop(false);
      this.boing.setVolume(5.0);
    });
    
    this.grab = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/395328__ihitokage__grab-1.ogg", (buff)=>{
      this.grab.setBuffer(buff);
      this.grab.setLoop(false);
      this.grab.setVolume(5.0);
    });
    
    this.plate = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/447847__anthousai__ceramic-bowl-hit-02.wav", (buff)=>{
      this.plate.setBuffer(buff);
      this.plate.setLoop(false);
      this.plate.setVolume(5.0);
    });
    
    this.chewingNoise = new THREE.Audio(this.listener);
    audioLoader.load("./sounds/364924__rudmer_rotteveel__eating-a-cracker-mouth-closed.wav", (buff)=>{
      this.chewingNoise.setBuffer(buff);
      this.chewingNoise.setLoop(false);
      this.chewingNoise.setVolume(7.0);
      this.chewingNoise.duration = 0.75;
    });
    
    // precalculated animation curves
    this.removeCurvePoints = MatrixHelper.func2pointsSpecified((value)=>{
      return new THREE.Vector3(-0.25, -1 * Math.pow(value - 3, 2) + 9, -0.25 + value);
    }, 0, 3, 4, 6.485); // 0-6
    
    this.removeRotationPoints = MatrixHelper.func2pointsSpecified((value)=>{
      return new THREE.Vector3(MatrixHelper.deg2rad(90 - value), 0, MatrixHelper.deg2rad(-45 + value / 2));
    }, 0, 30, 60, 90);
    
    this.popCurvePoints = MatrixHelper.func2pointsSpecified((value)=>{
      return new THREE.Vector3(-0.25, -1 * Math.pow(value - 3, 2) + 9, -0.25);
    }, 0, 3.5, 4, 0.1);
    
    this.popRotationPoints = MatrixHelper.func2pointsSpecified((value)=>{
      return new THREE.Vector3(MatrixHelper.deg2rad(90), MatrixHelper.deg2rad(value), MatrixHelper.deg2rad(-45));
    }, 0, 50, 290, 360);
    
    this.toasterScalePoints = MatrixHelper.func2pointsSpecified((value)=>{
      return new THREE.Vector3(0.7, value, 0.7);
    }, 0.7, 0.4, 0.2, 1, 10);
    this.toasterPosPoints = MatrixHelper.func2pointsSpecified((value)=>{
      return new THREE.Vector3(2.12132034, value - 1, 2.12132034);
    }, 0, -0.3, -0.5, 1, 10);
    
    
    this.toasterRScalePoints = MatrixHelper.func2pointsSpecified((value)=>{
      return new THREE.Vector3(0.7, value, 0.7);
    }, 1, 0.8, 0.7, 0.7, 30);
    this.toasterRPosPoints = MatrixHelper.func2pointsSpecified((value)=>{
      return new THREE.Vector3(2.12132034, value - 1, 2.12132034);
    }, 1, 0.1, 0, 0, 30);
    
    
    this.addModels();
    
  }
  
  addModels() {
    // three different light sources for the scene
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2);
    directionalLight.position.y = 1;
    const overheadLight = new THREE.PointLight(0xffffff, 2, 20);
    overheadLight.position.y = 10;
    overheadLight.position.x = -3;
    const ambientLight = new THREE.AmbientLight(0xf0f0f0, 0.7);
    
    // pointlight inside of toaster
    this.heatLight = new THREE.PointLight(0xff0000, 10, 4);
    this.heatLight.castShadow = true;
    this.heatLight.position.y = 1;
    this.heatOn = 0.0;
    
    // place counter
    MatrixHelper.uniformScale(counter, 5);
    MatrixHelper.translate(counter, 0, -10, -5);
    
    // place toaster on counter
    MatrixHelper.uniformScale(toaster, 0.7);
    MatrixHelper.translate(toaster, 0, -1, 3);
    MatrixHelper.rotateY(toaster, 45);
    
    // place toast inside of toaster
    MatrixHelper.uniformScale(toast, 0.3);
    MatrixHelper.translate(toast, 0, -0.5, 5);//-0.5, 0);
    MatrixHelper.rotateX(toast, 90);
    MatrixHelper.rotateY(toast, 90);
    
    // place wall behind counter
    MatrixHelper.uniformScale(wall, 3.5);
    MatrixHelper.rotateY(wall, 90);
    MatrixHelper.translate(wall, 11, -12.5, -2.5);
    
    // place painting on wall
    MatrixHelper.uniformScale(painting, 4);
    MatrixHelper.rotateY(painting, 90);
    MatrixHelper.translate(painting, -5.2, 3.5, 0);
    
    // scale smoke and set initial position
    MatrixHelper.uniformScale(smoke, 8);
    MatrixHelper.translate(smoke, 0, 5, 0);
    
    // scale smoke ceiling and set initial position
    //MatrixHelper.uniformScale(smoke_ceiling, 10);
    //MatrixHelper.translate(smoke_ceiling, 0, 5, 0);
    
    // crumbs
    MatrixHelper.uniformScale(crumbs, 5);
    MatrixHelper.rotateX(crumbs, -90);
    MatrixHelper.translate(crumbs, -0.5, -2.65, 6.5);
    
    // mouse plane
    MatrixHelper.rotateY(mouse_plane, 90);
    mouse_plane.scale.set(50, 10, 1);
    mouse_plane.position.set(0, 2.5, 0);
    mouse_plane.visible = false;
    //this.uniformScale(mouse_plane, 100);
    
    // loaf
    MatrixHelper.uniformScale(loaf, 6);
    // on counter, next to toaster
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
    [directionalLight, overheadLight, ambientLight, toast, 
     toaster, wall, counter, this.heatLight, painting, smoke,
     crumbs, loaf, mouse_plane].forEach((model)=>{
      model.recieveShadow = true;
      this.scene.add(model);
    });
  }
  
  loop(dTime, input, camera) {
    
    this.heatLight.intensity = (Math.sin(Date.now() / 2000) + 1) * 10 * this.heatOn; // set the light of the toaster
    smoke.quaternion.copy(camera.quaternion); // make smoke face the camera
    smoke.renderOrder = 10; // ensure nothing clips with the smoke
    smoke.getWorldDirection(smoke.material.uniforms.urot.value); // give the direction of the smoke to the shader
    smoke.material.uniforms.utime.value = (Date.now() % 100000); // current time with modulo to maintain precision
    smoke.material.uniforms.uintensity.value = Math.pow(this.toastLevel, 2) * 5.0; // set smoke level according to toast level
    
    // ideally these would be enums, but javascript doesn't have enums
    switch(this.stage) {
      case Stages.Before: // waiting for loaf to be clicked
        tex_toastbase.texture.needsUpdate = true;
        tex_toastburnt.texture.needsUpdate = true;
        toast.transparent = false;
        
        // if loaf is clicked
        if (input.hasClicked()) {
          input.pointingAt(camera, [loaf]).forEach((item)=>{
            // take a slice from the loaf
            this.stage = Stages.CarryingSlice;
            this.grab.play();
            toast.position.copy(loaf.position);
          });
        }
        break;
        
      case Stages.CarryingSlice:  // slice of bread in hand
        
        // get position with cam->mouse ray on mouse_plane
        input.pointingAt(camera, [mouse_plane]).forEach((item)=>{
          let newPos = new THREE.Vector3(0, item.point.y, item.point.z);
          
          // move slice to position if not overlapping with toaster
          if (newPos.distanceTo(toaster.position) > 4)
            toast.position.set(0, (newPos.y + toast.position.y) / 2, (newPos.z + toast.position.z) / 2);
          
          // drop into toaster if close enough
          if (input.hasClicked() && Math.abs(item.point.z - toaster.position.z) < 5) {
            this.grab.play();
            this.stage++;
            
            // set up the insert animation
            this.insertCurvePoints = new THREE.CubicBezierCurve3(
              toast.position,
              toast.position,
              new THREE.Vector3(-0.25, 0, -0.25),
              new THREE.Vector3(-0.25, 0, -0.25) 
            ).getPoints(10);
            this.insertFrame = 0;
            
            this.insertRotationPoints = MatrixHelper.func2pointsSpecified((value)=>{
              return new THREE.Vector3(MatrixHelper.deg2rad(90), 0, MatrixHelper.deg2rad(-45 + value));
            }, -45, 0, 0, 0, 10);
          } 
        });
        break;
        
      case Stages.InsertSlice: // toast going into toaster
        toast.position.copy(this.insertCurvePoints[this.insertFrame]);
        toast.rotation.setFromVector3(this.insertRotationPoints[this.insertFrame]);
        this.insertFrame++;
        
        // toast is inside toaster
        if (this.insertFrame == this.insertCurvePoints.length) {
          this.toasterSound.play();
          this.heatOn = 1.0;
          this.stage++;
        }
        break;
        
      case Stages.Toasting: // toast is inside toaster
        this.toastLevel += 0.005;
        
        // apply toastLevel uniform to all parts of the toast model
        const currentToastLevel = this.toastLevel;
        toast.traverse((mesh)=>{
          if (mesh instanceof THREE.Mesh && mesh.material.shaderData !== undefined) {
            mesh.material.shaderData.uniforms.toastLevel.value = currentToastLevel;
          }
        });
        
        // wind up to pop the toast
        if (input.keyPressed("Space")) {
          this.stage = Stages.ToasterSpring;
          this.toasterFrame = 0;
        }
        
        // smoke alarm if it gets too smokey
        if (this.toastLevel > 1.5 && this.alarmSound === undefined) {
          this.alarmSound = new THREE.Audio(this.listener);
          const audioLoader = new THREE.AudioLoader();
          audioLoader.load("./sounds/210513__nigelcoop__fire-alarm.wav", (buff)=>{
            this.alarmSound.setBuffer(buff);
            this.alarmSound.setLoop(true);
            this.alarmSound.setVolume(0.5);
            this.alarmSound.play();
          });
        }
        break;
        
      case Stages.ToasterSpring: // backtrack for toaster spring
        toaster.scale.copy(this.toasterScalePoints[this.toasterFrame]);
        toaster.position.copy(this.toasterPosPoints[this.toasterFrame]);
        this.toasterFrame++;
        if (this.toasterFrame >= (this.toasterPosPoints.length / 4) * 2) {
          this.stage = Stages.Popping;
          //this.toasterFrame = 0;
          this.toasterSound.stop();
          this.heatOn = 0.0;
          this.boing.play();
        }
        break;
        
      case Stages.Popping: // toast is popping
        // finish the toaster's spring animation
        if (this.toasterFrame != this.toasterScalePoints.length) {
          toaster.scale.copy(this.toasterScalePoints[this.toasterFrame]);
          toaster.position.copy(this.toasterPosPoints[this.toasterFrame]);
          this.toasterFrame++;
        }
        // run toaster's de-spring animation
        else if (this.toastFrame < 30) {
          toaster.scale.copy(this.toasterRScalePoints[this.toastFrame]);
          toaster.position.copy(this.toasterRPosPoints[this.toastFrame]);
        }
        
        // toast pop motion
        toast.position.copy(this.popCurvePoints[this.toastFrame]);
        toast.rotation.setFromVector3(this.popRotationPoints[this.toastFrame]);
        this.toastFrame++;

        // toast landed back in toaster
        if (this.toastFrame >= this.popCurvePoints.length) {
          this.stage++;
          this.toastFrame = 0;
          this.grab.play();
        }
        break;
        
      case Stages.ToastWaiting: // toast sitting in toaster
        // toast to be removed from toaster when the spacebar is pressed
        if (input.keyPressed("Space")) {
          this.stage++;
          this.grab.play();
        }
        break;
        
      case Stages.RemoveToast: // toast being removed from toaster
        toast.position.copy(this.removeCurvePoints[this.toastFrame]);
        toast.rotation.setFromVector3(this.removeRotationPoints[this.toastFrame]);
        this.toastFrame++;

        // toast is on counter
        if (this.toastFrame >= this.removeCurvePoints.length) {
          this.stage++;
          this.toastFrame = 0;
          
          // change toast material properties to enable "eating"
          toast.children[0].material.transparent = true;
          toast.children[0].material.depthWrite = false;
          toast.renderOrder = 5;
          toast.children[0].material.needsUpdate = true;
          
          // landing sound
          this.plate.detune = (this.toastLevel - 5) * 600;
          this.plate.play();
        }
        break;
        
      case Stages.EatToast: // eating the toast
        // check if clicked
        if (input.hasClicked()) {
          const sup = this; // shouldn't be necessary due to arrow funcs, but 'this' wasn't working
          // check that the toast has been clicked
          input.pointingAt(camera, [toast]).forEach((item)=>{
            if (item.uv !== undefined) {
              // calculate position on texture from uv coords
              const x = Math.floor(item.uv.x * 256);
              const y = 128 - Math.floor(item.uv.y * 128);
              
              // check if pixel clicked is empty and play failure sound
              const imgData = tex_toastbase.ctx.getImageData(x, y, 1, 1);
              if (imgData.data[3] <= 0) {
                sup.plate.duration = 0.1;
                sup.plate.play();
              } else { // otherwise take bite
                // play chewing noise
                sup.chewingNoise.pause();
                const chewingNoiseTimes = [0, 1.2]; // different offsets for variety in chewing noise
                sup.chewingNoise.offset = chewingNoiseTimes[Math.floor(Math.random() * chewingNoiseTimes.length)];
                sup.chewingNoise.play();
                
                // erase bite area from both textures
                tex_toastbase.circleErase(item.uv.x * 256, 128 - item.uv.y * 128, 60);
                tex_toastburnt.circleErase(item.uv.x * 256, 128 - item.uv.y * 128, 60);
                
                // add 500 crubs to the plane on the counter
                const crumb_colors = ["#d8ac87", "#d1d0cb", "#432724", "#3d2620"];
                for (let i = 0; i < 500; i++) {
                  let crumbX = Math.random() * 300 - 150;
                  let crumbY = Math.random() * 300 - 150;
                  tex_crumbs.ctx.fillStyle = crumb_colors[Math.floor(Math.random() * crumb_colors.length)];
                  tex_crumbs.ctx.fillRect(item.uv.x * 256 + 128 - crumbX, 256 - item.uv.y * 256 + 128 - crumbY, 3, 3);
                }
                tex_crumbs.texture.needsUpdate = true;
                
                // check if toast is basically empty
                const completeImageData = tex_toastbase.ctx.getImageData(0, 0, 256, 128);
                let sampleAvg = 0;
                for (let i = 0; i < 30; i++) {
                  sampleAvg += completeImageData.data[Math.floor(Math.random() * 32768) * 4];
                }
                sampleAvg /= 30;
                
                // all 30 points have an average opacity < 10
                if (sampleAvg < 10) {
                  this.stage = Stages.Before;  // go back to first stage
                  
                  // reset alarm
                  if (this.alarmSound !== undefined) {
                    this.alarmSound.stop();
                    this.alarmSound = undefined; // should remove this. keep loaded, control as needed
                  }
                  
                  //reset toast
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
                  toast.traverse((mesh)=>{
                    if (mesh instanceof THREE.Mesh && mesh.material.shaderData !== undefined) {
                      mesh.material.shaderData.uniforms.toastLevel.value = currentToastLevel;
                    }
                  });
                }
              }
            }
          })
        }
        break;
    }
  }
}

export {ToasterScene};
export default ToasterScene;
