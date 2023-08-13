import * as THREE from "three"
import * as dat from "dat.gui";

export default function (scene, {x, y, z}) {
  const gui = new dat.GUI();
  const params = {
    y: 0
  }
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, y, z),
    new THREE.Vector3(10, 0, 0)
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  //Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  console.log(curveObject, "___curveObject");
  gui.add(params, "y").name("视角").min(0).max(1).step(0.01).onChange(() => {
    curveObject.rotation.x = Math.PI * params.y
  });
  // console.log(curveObject);
  scene.add(curveObject);
}