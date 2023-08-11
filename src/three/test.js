import * as THREE from "three"
import * as dat from "dat.gui";

export default function (scene) {
  const gui = new dat.GUI();
  const params = {
    y: 0
  }
  const curve = new THREE.QuadraticBezierCurve(
    new THREE.Vector2(-10, 0),
    new THREE.Vector2(0, 10),
    new THREE.Vector2(10, 0)
  );
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const curveObject = new THREE.Line(geometry, material);

  gui.add(params, "y").name("视角").min(0).max(1).step(0.01).onChange(() => {
    curveObject.rotation.x = Math.PI * params.y
  });
  // console.log(curveObject);
  scene.add(curveObject);
}