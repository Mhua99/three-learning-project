import * as THREE from "three"
import Mitt from "@/utils/mitt.js"
import Main from "./main"
import { LoaderModel } from "./gltfLoader"
import { initLight } from "./light"
import { initAxes } from "./axes"
import initTest from "./test"
import { initEvent } from "./event"
import { useGUI } from "./gui"

export function init() {
  const main = new Main();

  // 加载模型
  const loaderModel = new LoaderModel(main.scene, (load) => {
    Mitt.emit('loaderMounted', load, main)
  });

  // 设置时钟
  const clock = new THREE.Clock();
  main.beforeRender = () => {
    let time = clock.getElapsedTime();
    loaderModel.render(time);
  }

  // 初始化灯光
  initLight(main.scene);

  // 辅助轴
  initAxes(main.scene);

  // 初始化事件
  initEvent(main);

  // 测试
  // initTest(main.scene);

  return {
    main,
    loaderModel
  }

}
