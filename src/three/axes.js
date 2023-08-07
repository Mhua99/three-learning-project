import * as THREE from "three";

export function initAxes(scene) {
  // 加入辅助轴，帮助我们查看3维坐标轴
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}