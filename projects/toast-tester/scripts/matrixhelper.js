import * as THREE from "https://cdn.skypack.dev/three@v0.122.0/build/three.module.js";

// Some basic functions to help out with matrix operations when they're needed (property manipulation is generally preferred over this)
class MatrixHelper {
  constructor() {}
  
  static uniformScale(object, value) {
    const scaleMatrix = new THREE.Matrix4();
    scaleMatrix.set(
      value, 0, 0, 0,
      0, value, 0, 0,
      0, 0, value, 0,
      0, 0, 0, 0
    );
    object.applyMatrix4(scaleMatrix);
  }
  
  static translate(object, x, y, z) {
    const translationMatrix = new THREE.Matrix4();
    translationMatrix.set(
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 0
    );
    object.applyMatrix4(translationMatrix);
  }
  
  static rotateX(object, deg) {
    deg *= (Math.PI / 180);
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.set(
      1, 0, 0, 0,
      0, Math.cos(deg), -Math.sin(deg), 0,
      0, Math.sin(deg), Math.cos(deg), 0,
      0, 0, 0, 0,
    );
    object.applyMatrix4(rotationMatrix);
  }
  
  // converts degrees to radians (three.js, doesn't use degrees)
  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
  static rotateY(object, deg) {
    deg *= (Math.PI / 180);
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.set(
      Math.cos(deg), 0, Math.sin(deg), 0,
      0, 1, 0, 0,
      -Math.sin(deg), 0, Math.cos(deg), 0,
      0, 0, 0, 0,
    );
    object.applyMatrix4(rotationMatrix);
  }
  
  static rotateZ(object, deg) {
    deg *= (Math.PI / 180);
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.set(
      Math.cos(deg), -Math.sin(deg), 0, 0,
      Math.sin(deg), Math.cos(deg), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 0,
    );
    object.applyMatrix4(rotationMatrix);
  }
  
  // given a function, start value, and end value, this converts a function into a 50-point curve
  // you realistically don't want to use this. just create a curve by calling the function 50 times instead
  static func2points(fn, start, end) {
    let curve = new THREE.CubicBezierCurve3(
              fn(start), // start
              fn((start + end) / 3),
              fn(2 * (start + end) / 3),
              fn(end), // end
            );
    return curve.getPoints(50);
  }
  
  // creates a curve from a function with some number of points (def=50) and specified values for each quarter
  // unlike func2points, this one has a clear usecase. you can effectively time the different points, allowing for a more-lively animation
  static func2pointsSpecified(fn, p1, p2, p3, p4, pts) {
    let curve = new THREE.CubicBezierCurve3(
              fn(p1), // start
              fn(p2),
              fn(p3),
              fn(p4), // end
            );
    if (pts == undefined) pts = 50;
    return curve.getPoints(pts);
  }
}

export {MatrixHelper};
export default MatrixHelper;