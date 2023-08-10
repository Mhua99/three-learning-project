import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"
import gsap from "gsap";


export class LoaderModel {
  constructor(scene, cb) {
    this.carList = []
    this.cameraList = []
    this.points = [];
    this.loader(scene, cb);
  }
  loader(scene, cb) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load("./model/city.glb", (gltf) => {
      scene.add(gltf.scene);
      // 场景子元素遍历
      gltf.scene.traverse((child) => {
        if (child.name === "轨迹") {
          this.getTrajectory(child);
        }

        if (child.name.includes("小车") && !child.name.includes("停车")) {
          this.carList.push(child);
        }

        if (child.name.includes("停车") && !child.name.includes("停车场")) {
          const board = this.createBoard(child, child.name);
          scene.add(board);
        }
      });

      this.carList.forEach(car => {
        const camera = this.addCamera(car.position.x, car.position.y, car.position.z);
        camera.tagName = car.name;
        car.camera = camera;
        car.children.push(camera)
        this.cameraList.push(camera);
        this.carAnimation(car, this.points)
      })
      cb && cb(this)
    });
  }

  getTrajectory(child) {
    child.visible = false;
    // 根据点创建曲线
    for (
      let i = child.geometry.attributes.position.count - 1;
      i >= 0;
      i--
    ) {
      this.points.push(
        new THREE.Vector3(
          child.geometry.attributes.position.getX(i) * 36,
          child.geometry.attributes.position.getY(i),
          child.geometry.attributes.position.getZ(i) * 36
        )
      );
    }
  }

  addCamera(x, y, z) {
    // 创建透视相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerHeight / window.innerHeight,
      1,
      50000
    );

    camera.position.set(x, y, z);
    return camera
  }

  carAnimation(car, points) {
    const newPoints = [...points]
    const len = Math.floor(Math.random() * newPoints.length);
    const splitPoint = newPoints.splice(0, len);
    const curve = new THREE.CatmullRomCurve3([...newPoints, ...splitPoint]);
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
        car.camera.position.set(point.x, point.y + 10, point.z);
        if (params.curveProgress + 0.001 < 1) {
          const point = curve.getPoint(params.curveProgress + 0.001);
          const newPoint = point.clone();
          newPoint.y += 9;
          car.lookAt(point);
          car.camera.lookAt(newPoint);
        }
      },
    });
  }

  createBoard(car, name) {
    const element = document.createElement("div");
    element.className = "carStopInfo";
    element.innerHTML = `
      <div class="main">
        <h3>${name}</h3>
        <p>停留时间：25分钟</p>
      </div>
    `;

    const objectCss3D = new CSS3DObject(element);
    objectCss3D.position.copy(car.position);
    objectCss3D.position.x += 50;
    objectCss3D.scale.set(0.1, 0.1, 0.2);
    objectCss3D.rotation.y = Math.PI
    return objectCss3D;
  }

  test(scene, x, y, z) {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z)
    scene.add(cube);
  }
}
