import * as THREE from "three";

export default class ParkingSpace {
  constructor(obj, scene, isUse = false) {
    // 车位对象
    this.space = obj;
    // 大门位置入口
    this.entrance = new THREE.Vector3(72, 1, -120);
    // 大门靠近马路点位
    this.roadNearPosition = new THREE.Vector3(72, 1, -190);
    // 车位朝向点位
    this.direction;
    // 车位左边点位
    this.directionLeft;
    // 车位右边点位;
    this.directionRight;
    // 车位是否占用
    this.isUse = isUse;
    // 进入该车位的具体路线
    this.routeList = [];
    // 设置车位正方向
    this.getDirection();
    // 添加进出路线方法
    this.insideAddLine(scene);
  }
  // 克隆
  generate(position, direction, num) {
    const point = position.clone();
    direction && (point[direction] += num)
    return point;
  }
  // 获取线段点位
  getDetailPoint(start, middle, end) {
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      middle,
      end
    );
    return curve.getPoints(50);
  }
  // 计算当前车辆位置到大门路线
  trajectoryDoor(position) {
    return { line: this.getDetailPoint(position, this.roadNearPosition, this.entrance), direction: 1, useTime: 4 }
  }
  // 里面车位添加路线
  insideAddLine() {
    // 左边路线
    if (this.directionLeft) {
      let line1_start = [];
      let line1_end = [];
      line1_start = this.getDetailPoint(this.directionLeft, this.direction, this.space.position);
      line1_end = this.getDetailPoint(this.entrance, this.direction, this.directionLeft);
      this.routeList.push([{ line: line1_end, direction: 1 }, { line: line1_start, direction: -1 }]);
    }
    // 右边路线
    if (this.directionRight) {
      let line2_start = [];
      let line2_end = [];
      line2_start = this.getDetailPoint(this.directionRight, this.direction, this.space.position);
      line2_end = this.getDetailPoint(this.entrance, this.direction, this.directionRight);
      this.routeList.push([{ line: line2_end, direction: 1 }, { line: line2_start, direction: -1 }]);
    }
  }
  // 获取车位朝向
  getDirection() {
    const position = this.space.position;
    const name = this.space.name;
    if (name.includes("里")) {
      this.direction = this.generate(position, "z", -40)
      const isHaveLeft = name.includes("左墙") || name.includes("边");
      const isHaveRight = name.includes("右墙") || name.includes("边");
      if (isHaveLeft) {
        this.directionLeft = this.generate(this.direction, "x", -40);
      }
      if (isHaveRight) {
        this.directionRight = this.generate(this.direction, "x", 40);
      }
    }

    if (name.includes("车位-外-左")) {
      this.direction = this.generate(position, "x", -40);
      this.directionLeft = this.generate(this.direction, "z", 40);
      if (name.includes("2")) {
        this.directionRight = this.generate(this.direction, "z", -40);
      }
    }

    if (name.includes("车位-外-右")) {
      this.direction = this.generate(position, "x", 40);
      this.directionRight = this.generate(this.direction, "z", 40);
      if (name.includes("2")) {
        this.directionLeft = this.generate(this.direction, "z", -40);
      }
    }
  }
}