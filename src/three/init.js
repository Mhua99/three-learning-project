import { initScene } from "./scene";
import { initCamera } from "./camera"
import { loaderModel } from "./gltfLoader"
import { initLight } from "./light"
import { initAxes } from "./axes"
import { initRenderer } from "./renderer"
import { initAnimate } from "./animate"
import { initControls } from "./controls"

export function init() {

  // 添加场景
  const scene = initScene();
  // 添加相机
  const camera = initCamera(scene);
  const { renderer, css3DRenderer } = initRenderer();
  const animate = initAnimate(scene, camera, renderer, css3DRenderer)

  initControls(camera, renderer);

  // 加载模型
  loaderModel(scene);

  // 初始化灯光
  initLight(scene);

  // 辅助轴
  initAxes(scene);

  return {
    camera,
    renderer,
    animate,
    css3DRenderer
  }

}
