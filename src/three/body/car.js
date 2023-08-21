import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"
import Mitt from "@/utils/mitt.js";

export default class Car {
  constructor(car, status = 'cease') {
    // 小车
    this.car = car;
    // 摄像头
    this.camera = null;
    // 路线数据
    this.originalTrajectory = [];
    // 车辆状态 cease （停止） wait (等待下一步) motion （运动）
    this._status = status;
    // 走完一圈花费时间
    this.useTime = 10;
    // 上次路线索引索引值
    this.lastIndex = 0;
    // 使用路线索引
    this.index = 0;
    // 方向
    this.direction = 1;
    // 运动是否循环
    this.loop = false;
    // 运动时间 s
    this.sportTime = 20 + Math.floor(Math.random() * 100);
    // 运动开始时间
    this.startTime = 0;
    // 运动结束时间
    this.endTime = 0;
    // 面板
    this.board = null;
    // 停留时长计算
    this.stopTime = 0;
    // 上一个停留时长
    this.lastStopTime = 0;
    // 停留初始值
    this.stopInitTime = 0;
  }
  get status() {
    return this._status;
  }
  set status(val) {
    this._status = val;
    if (val == 'cease') Mitt.emit('updateCar');
  }
  // 从外界接收经纬度数据
  addTrajectory(trajectory, isMix = false) {
    this.status = "motion";
    this.originalTrajectory = trajectory;
    this.startTime = this.endTime;
    if (isMix) {
      this.startPosition = Math.random() * this.useTime;
    } else {
      this.startPosition = 0;
    }
    this.dealTrajectory();
  }
  // 处理坐标点位数据
  dealTrajectory() {
    if (this.index == this.originalTrajectory.length && !this.loop) {
      this.status = 'cease';
      this.index = 0;
      return;
    }
    const route = this.originalTrajectory[this.index % this.originalTrajectory.length];
    this.useTime = route.useTime ? route.useTime : this.useTime;
    this.direction = route.direction ? route.direction : 1;
    this.curve = new THREE.CatmullRomCurve3(route.line);
  }
  // 计算距离大门距离
  distanceTo() {
    const isDist = ((this.endTime - this.startTime) > this.sportTime);
    if (this.sportTime && isDist) {
      this.sportTime = 0;
      this.status = "wait";
    }
    return isDist && this.car.position.distanceTo(this.place.roadNearPosition) < 20 && this.status == 'wait';
  }
  // 创建面板
  createBoard(scene) {
    if (this.status == 'motion') return;
    this.element = document.createElement("div");
    this.element.className = "carStopInfo";
    this.element.innerHTML = `
      <div class="main">
        <h3>${this.car.name}</h3>
        <p class="timeText">停留时间：0</p>
      </div>
    `;

    this.board = new CSS3DObject(this.element);
    this.board.position.copy(this.car.position);
    this.board.position.x += 50;
    this.board.scale.set(0.1, 0.15, 0.3);
    this.board.rotation.y = Math.PI;
    scene.add(this.board);
  }
  // 面板计时器
  computedBoard(scene) {
    if (this.status == 'cease') {
      if (!this.board) {
        this.createBoard(scene);
      }
      this.stopTime = this.stopInitTime + parseInt(((this.endTime - this.startTime) / 60));
      const diff = "停留时长：" + this.stopTime + "分钟";
      this.element.querySelector(".timeText").innerText = diff;
      if (this.lastStopTime != this.stopTime) {
        this.lastStopTime = this.stopTime;
        Mitt.emit('updateCar');
      }
    }
  }
  addCamera(camera) {
    this.camera = camera;
    this.camera.lookAt(this.place.direction);
  }
  // 让小车运动
  update(time, scene) {
    this.endTime = time;
    // 更新面板停车时长
    this.computedBoard(scene);
    if (this.status == 'cease' || !this.curve) return;
    const index = ((time - this.startTime + this.startPosition) % this.useTime) / this.useTime;
    const point = this.curve.getPoint(index);
    const isTrigger = index + 0.001 * this.direction;

    if (this.distanceTo()) {
      this.index = 0;
      this.lastIndex = 0;
      this.loop = false;
      const patLine = this.place.trajectoryDoor(this.car.position);
      this.addTrajectory([patLine, ...(this.place.routeList[0] || [])]);
    } else if (this.lastIndex < index && 0 <= isTrigger && isTrigger < 1) {
      this.lastIndex = index;
      this.car.position.set(point.x, point.y, point.z);
      this.camera.position.set(point.x, point.y + 6, point.z);
      const newPoint = this.curve.getPoint(index + 0.001 * this.direction);
      const cameraPoint = newPoint.clone();
      cameraPoint.y += 6;
      this.car.lookAt(newPoint);
      this.camera.lookAt(cameraPoint);
    } else {
      this.index++;
      this.dealTrajectory();
      this.lastIndex = 0;
    }
  }
}