import * as THREE from "three";

export function initCamera(scene) {
  // 创建透视相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerHeight / window.innerHeight,
    1,
    50000
  );

  camera.position.set(30, 250, 250);

  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  scene.add(camera);
  return camera
}
