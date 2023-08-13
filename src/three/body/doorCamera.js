export default class DoorCamera {
  constructor(obj, activeCamera, direction = 1) {
    this.camera = obj;
    this.activeCamera = activeCamera;
    this.direction = direction;
    this.activeCamera.position.y += 10;
  }
  update(time) {
    const y = (Math.sin(time) + 1) / 2 * 1.5707 * this.direction;
    this.camera.rotation.y = y - 1.5;
    this.activeCamera && (this.activeCamera.rotation.y = y);
  }
}
