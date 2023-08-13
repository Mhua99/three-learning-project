import * as THREE from "three";

export default class ParkingSpace {
  constructor(obj, scene, isUse = false, entrance = new THREE.Vector3(72, 1, -120)) {
    this.space = obj;
    this.entrance = entrance;
    this.isUse = isUse;
    this.routeList = [];
    this.addIfRoute(scene);
  }
  addLine(start, middle, end) {
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      middle,
      end
    );
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    //Create the final object to add to the scene
    return new THREE.Line(geometry, material);
  }
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
  // 里面车位添加路线
  insideAddLine(scene) {
    const name = this.space.name;
    const isHaveLeft = name.includes("左墙") || name.includes("边");
    const isHaveRight = name.includes("右墙") || name.includes("边");
    const point = this.space.position;
    const startPoint = this.generate(point);
    const middleRightPoint = this.generate(point, "z", -40);
    const middleLeftPoint = this.generate(point, "z", -40);
    const endPoint = this.generate(middleLeftPoint, "x", -40);
    let line1_start = [];
    let line1_end = []
    if (isHaveLeft) {
      line1_start = this.getDetailPoint(endPoint, middleLeftPoint, startPoint);
      line1_end = this.getDetailPoint(this.entrance, middleLeftPoint, endPoint);
      this.routeList.push([{ line: line1_end, direction: 1 }, { line: line1_start, direction: -1 }]);
    }

    let line2_start = [];
    let line2_end = []
    if (isHaveRight) {
      line2_start = this.getDetailPoint(startPoint, middleRightPoint, endPoint);
      line2_end = this.getDetailPoint(this.entrance, middleRightPoint, endPoint);
      this.routeList.push([{ line: line2_start, direction: -1 }, { line: line2_end, direction: 1 }]);
    }
  }
  // 判断添加的路线
  addIfRoute(scene) {
    if (this.space.name.includes("里")) {
      this.insideAddLine(scene);
    }
  }
}