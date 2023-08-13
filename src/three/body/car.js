import * as THREE from "three";
import gsap from "gsap";

export default class Car {
  constructor(car, status = 'motion') {
    this.car = car;
    this.camera = null;
    this.originalTrajectory = [];
    this.trajectory = [];
    this.isDirection = [];
    // 车辆状态
    this.status = status;
    // 10秒花费时间
    this.useTime = 10;
    // 上次路线索引索引值
    this.lastIndex = 0;
    // 使用路线索引
    this.index = 0;
    // 方向
    this.direction = 1;
  }
  carAnimation() {
    const len = Math.floor(Math.random() * this.trajectory.length);
    const splitPoint = this.trajectory.splice(0, len);
    const curve = new THREE.CatmullRomCurve3([...this.trajectory, ...splitPoint]);
    const params = {
      curveProgress: 0
    }
    gsap.to(params, {
      curveProgress: 0.999,
      duration: 10,
      // repeat: -1,
      onUpdate: () => {
        const point = curve.getPoint(params.curveProgress);
        this.car.position.set(point.x, point.y, point.z);
        this.camera.position.set(point.x, point.y + 10, point.z);
        if (params.curveProgress + 0.001 < 1) {
          const point = curve.getPoint(params.curveProgress + 0.001);
          const newPoint = point.clone();
          newPoint.y = -10;
          this.car.lookAt(point);
          this.camera.lookAt(newPoint);
        }
      },
    });
  }
  addTrajectory(trajectory, useTime = 4) {
    this.originalTrajectory = trajectory;
    this.useTime = useTime;
    this.dealTrajectory();
  }
  dealTrajectory() {
    if (this.index == this.originalTrajectory.length) {
      this.status = 'cease';
      this.index = 0;
      return;
    }
    const route = this.originalTrajectory[this.index];
    this.useTime = route.useTime ? route.useTime : this.useTime;
    this.direction = route.direction ? route.direction : 1;
    this.curve = new THREE.CatmullRomCurve3(route.line);
  }
  update(time) {
    if (this.status == 'cease') return;
    const index = (time % this.useTime) / this.useTime;
    const point = this.curve.getPoint(index);
    if (this.lastIndex < index && index + 0.001 * this.direction < 1) {
      this.lastIndex = index;
      this.car.position.set(point.x, point.y, point.z);
      const newPoint = this.curve.getPoint(index + 0.001 * this.direction);
      this.car.lookAt(newPoint);
    } else {
      this.index++;
      this.dealTrajectory();
      this.lastIndex = 0;
    }
  }
}