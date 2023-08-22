import * as THREE from "three";

export function initLight(scene) {
  const positionList = [
    [-150, 0, 0],
    [150, 0, 0],
    [0, 0, -150],
    [0, 0, 150],
    [0, 150, 0],
  ]

  for (let i = 0; i < positionList.length; i++) {
    // 给场景添加平行光
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(...positionList[i]);
    scene.add(light);
  }

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  hemiLight.position.set(0, 500, 0)
  scene.add(hemiLight)
}