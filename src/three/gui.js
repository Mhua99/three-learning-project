import * as dat from "dat.gui";

export function useGUI(cameraList, main) {
  const gui = new dat.GUI();
  // const currentCamera = { name: '主界面' }
  // const cameras = [main.camera, ...cameraList]
  // const tags = cameras.map(item => item.tagName);
  cameraList.forEach(item => {
    console.log(item, "___item");
    gui.add(item.rotation, "y").name("视角").min(-10).max(10).step(0.1);
  })
  // gui.add(currentCamera, "name", [...tags]).name("视角").onChange((key) => {
  //   const camera = cameras.find(item => item.tagName == key);
  //   if (camera) {
  //     const {
  //       domElement: { clientWidth, clientHeight },
  //     } = main.renderer
  //     main.camera = camera;
  //     main.camera.aspect = clientWidth / clientHeight
  //     main.camera.updateProjectionMatrix()
  //   }
  // })
}