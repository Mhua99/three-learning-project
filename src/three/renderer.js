import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer"

export function initRenderer() {
  // 初始化渲染器
  const renderer = new THREE.WebGLRenderer({
    // 抗锯齿
    antialias: true,
  });
  // 设置渲染尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const css3DRenderer = new CSS3DRenderer();
  css3DRenderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("#cssrender").appendChild(css3DRenderer.domElement);

  return { renderer, css3DRenderer }
}

