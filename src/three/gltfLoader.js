import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"
import gsap from "gsap";


export class RotateAroundPointClass {
  curr = 0;
  aroundCount;
  obj;
  axis;
  spaceAngle;
  center;
  dir = 1;
  repeat;
  length;

  constructor(
    /**
     * 旋转的物体
     */
    obj,
    /**
     * 绕哪一轴旋转
     */
    axis,
    /**
     * 围绕旋转的点坐标
     */
    center,
    /**
     * 旋转一周设置的旋转度数需要几次 决定速度
     * 默认一次旋转一度 默认360次
     */
    aroundCount = 360,
    /**
     * 旋转多少度
     * 默认 360度
     */
    aroundAngle = 360,
    /**
     * 是否反复运动 默认false
     */
    repeat = false
  ) {
    this.obj = obj;
    this.center = center;
    this.aroundCount = aroundCount;
    this.axis = ["x", "y", "z"].filter((a) => a != axis);
    this.repeat = repeat;
    const onceAngle = (Math.PI * 2) / 360;
    this.spaceAngle = (aroundAngle / aroundCount) * onceAngle;
    this.length = center.distanceTo(obj.position);
  }

  update() {
    this.curr = (this.curr + this.dir) % this.aroundCount;
    if (this.repeat && (this.curr >= this.aroundCount - 1 || this.curr == 0)) {
      this.dir *= -1;
    }
    const x = Math.sin(this.spaceAngle * this.curr) * this.length;
    const y = Math.cos(this.spaceAngle * this.curr) * this.length;
    this.obj.position[this.axis[0]] = x + this.center[this.axis[0]];
    this.obj.position[this.axis[1]] = y + this.center[this.axis[1]];
  }
}

// 停车场门口摄像头
class DoorCamera {
  time = 0;
  second = 1;
  aroundCount = 360;
  constructor(obj) {
    this.camera = obj;
  }
  update() {
    this.time = (this.time + this.second) % this.aroundCount;
    if (Math.abs(this.time) < 150) {
      this.time = 150
      this.second = Math.sign(this.second) ? -this.second : this.second
    } else if (Math.abs(this.time) > 340) {
      this.time = 340;
      this.second = Math.sign(this.second) ? -this.second : this.second
    }
    const y = (this.time / this.aroundCount) * Math.PI * 2
    this.camera.rotation.y = y
    this.activeCamera && (this.activeCamera.rotation.y = y)
  }
}

export class LoaderModel {
  constructor(scene, cb) {
    this.streetLampCount = 0;
    this.stopCarCount = 0;
    this.carList = []
    this.cameraList = []
    this.points = [];
    this.parkingLotDoorCamera = [];
    this.loader(scene, cb);
  }
  loader(scene, cb) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load("./model/city.glb", (gltf) => {
      console.log(gltf.scene);
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
          this.stopCarCount++;
          scene.add(board);
        }

        if (child.name.includes('停车场门口摄像头')) {
          const doorCamera = new DoorCamera(child)
          doorCamera.activeCamera = this.addCamera(child.position.x, child.position.y, child.position.z);
          doorCamera.activeCamera.tagName = child.name;
          this.cameraList.push(doorCamera.activeCamera);
          this.parkingLotDoorCamera.push(doorCamera);
        }

        if (child.name.includes('路灯')) {
          this.streetLampCount++;
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
