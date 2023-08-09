import Main from "./main"
import { loaderModel } from "./gltfLoader"
import { initLight } from "./light"
import { initAxes } from "./axes"
import initTest from "./test"

export function init() {

  const main = new Main();

  // 加载模型
  loaderModel(main.scene);

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
