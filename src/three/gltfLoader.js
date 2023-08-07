import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import gsap from "gsap";

function carAnimation(car, points) {
  // const newCurve = curve.copy();
  console.log(points, "___points", points.length);
  const newPoints = [...points]
  const len = Math.floor(Math.random() * newPoints.length);
  const splitArr = newPoints.splice(0, len);
  console.log(len, splitArr, "___splitArr", newPoints);
  const curve = new THREE.CatmullRomCurve3([...newPoints, ...splitArr]);
  // console.log(curve, "___");
  // newCurve.points.splice(0, 99)
  const params = {
    curveProgress: 0
  }
  gsap.to(params, {
    curveProgress: 0.999,
    duration: 30,
    repeat: -1,
    onUpdate: () => {
      const point = curve.getPoint(params.curveProgress);
      car.position.set(point.x, point.y, point.z);
      if (params.curveProgress + 0.001 < 1) {
        const point = curve.getPoint(params.curveProgress + 0.001);
        car.lookAt(point);
      }
    },
  });
}

export function loaderModel(scene) {
  const carList = [];
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load("./model/city.glb", (gltf) => {
    scene.add(gltf.scene);

    // 场景子元素遍历
    const points = [];
    gltf.scene.traverse((child) => {
      if (child.name === "轨迹") {
        const line = child;
        // line.visible = false;
        // 根据点创建曲线
        for (
          let i = line.geometry.attributes.position.count - 1;
          i >= 0;
          i--
        ) {
          points.push(
            new THREE.Vector3(
              line.geometry.attributes.position.getX(i) * 36,
              line.geometry.attributes.position.getY(i),
              line.geometry.attributes.position.getZ(i) * 36
            )
          );
        }
      }

      if (child.name.includes("小车")) {
        carList.push(child);
      }
    });

    carList.forEach(car => {
      carAnimation(car, points)
    })
  });

}
