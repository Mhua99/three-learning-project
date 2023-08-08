import * as THREE from "three";

export function initAnimate(scene, camera, renderer, css3DRenderer) {
  const clock = new THREE.Clock();
  function animate(t) {
    const time = clock.getElapsedTime();
    requestAnimationFrame(animate);
    // 使用渲染器渲染相机看这个场景的内容渲染出来
    renderer.render(scene, camera);
    css3DRenderer.render(scene, camera);
  }
  return animate
}


