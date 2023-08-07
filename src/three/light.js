import * as THREE from "three";

export function initLight(scene) {
  // 给场景添加平行光
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(10, 150, 0);
  scene.add(light);
}