import Main from "./main"
import { LoaderModel } from "./gltfLoader"
import { initLight } from "./light"
import { initAxes } from "./axes"
import initTest from "./test"
import { useGUI } from "./gui"

export function init() {
  const main = new Main();
  // 加载模型
  new LoaderModel(main.scene);
  // , (_this) => {
  //   useGUI(_this.cameraList, main);
  // }

  // 初始化灯光
  initLight(main.scene);

  // 辅助轴
  initAxes(main.scene);

  // 测试
  initTest(main.scene);

  return {
    main
  }

}
