import * as THREE from "three";

export function initAnimate(scene, camera, renderer) {
  const clock = new THREE.Clock();
  function animate(t) {
    const time = clock.getElapsedTime();
    requestAnimationFrame(animate);
    // 使用渲染器渲染相机看这个场景的内容渲染出来
    renderer.render(scene, camera);
  }
  return animate
}


