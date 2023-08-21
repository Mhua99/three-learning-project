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