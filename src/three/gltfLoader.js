import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import Car from "./body/car"
import DoorCamera from "./body/doorCamera"
import ParkingSpace from "./body/parkingSpace"

export class LoaderModel {
  constructor(scene, cb) {
    // 路灯数量
    this.streetLampCount = 0;
    // 停车场车辆数量
    this.stopCarCount = 0;
    // 车辆数组
    this.carList = []
    // 摄像机数组
    this.cameraList = []
    // 停车位数组
    this.parkingLotDoorCamera = [];
    // 主要道路轨迹
    this.mainRoadTrajectory = [];
    // 停车位
    this.parkingSpaceList = [];
    // 场景
    this.scene = scene;
    // 渲染函数
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

        if (child.name.includes("小车")) {
          child.visible = false;
          this.templateCar = child;
        }

        if (child.name.includes('停车场门口摄像头')) {
          const activeCamera = this.addCamera(child.position.x, child.position.y, child.position.z);
          activeCamera.tagName = child.name;
          const doorCamera = new DoorCamera(child, activeCamera, child.name.includes('右') ? -1 : 1)
          this.cameraList.push(activeCamera);
          this.parkingLotDoorCamera.push(doorCamera);
        }

        if (child.name.includes('路灯')) {
          this.streetLampCount++;
        }

        if (child.name.includes("车位")) {
          this.parkingSpaceList.push(new ParkingSpace(child, scene));
        }
      });

      // 生成汽车
      for (let i = 0; i < 8; i++) {
        const num = Math.round(Math.random());
        const car = this.createCar(this.templateCar, num);
        const newCar = new Car(car);
        this.carList.push(newCar);
        scene.add(car);
      }

      this.carList.forEach((item) => {
        const camera = this.addCamera(item.car.position.x, item.car.position.y + 10, item.car.position.z);
        camera.tagName = item.car.name;
        item.place = item.car.place;
        item.addCamera(camera)
        this.cameraList.push(camera);
        item.car.status == 'motion' && item.addTrajectory(this.mainRoadTrajectory, true);
        item.car.status == 'cease' && (item.stopInitTime = parseInt(Math.random() * 3000));
        item.loop = true;
        item.status = item.car.status;
        item.createBoard(scene);
      })
      cb && cb(this)
    });
  }

  // 创建小车 status 0/1 (停车/运动)
  createCar(car, status) {
    const newCar = car.clone();
    const newMatril = newCar.children[0].material.clone();
    newCar.visible = true;
    newCar.children[0].material = newMatril;
    newCar.name = "小车" + Math.floor(Math.random() * 100000);
    newMatril.color.set(new THREE.Color(Math.random(), Math.random(), Math.random()));
    const list = this.parkingSpaceList.filter(item => !item.isUse);
    const index = Math.floor(Math.random() * list.length);
    const place = list[index];
    // 停车位上
    if (status == 0) {
      const { x, y, z } = place.space.position
      newCar.position.set(x, y, z);
      newCar.lookAt(place.direction);
      newCar.status = 'cease'
    } else {
      newCar.status = 'motion';
    }
    place.isUse = true;
    newCar.place = place;
    return newCar
  }

  getTrajectory(child) {
    child.visible = false;
    // 根据点创建曲线
    const points = []
    for (
      let i = child.geometry.attributes.position.count - 1;
      i >= 0;
      i--
    ) {
      points.push(
        new THREE.Vector3(
          child.geometry.attributes.position.getX(i) * 36,
          child.geometry.attributes.position.getY(i),
          child.geometry.attributes.position.getZ(i) * 36
        )
      );
    }

    this.mainRoadTrajectory.push({ line: points, direction: 1 });
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

  test(scene, x, y, z) {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z)
    scene.add(cube);
  }

  render(time) {
    // 停车场监控旋转
    this.parkingLotDoorCamera.forEach(item => {
      item.update(time);
    });

    // 车辆运动
    this.carList.forEach(item => {
      item.update(time, this.scene);
    })
  }
}
