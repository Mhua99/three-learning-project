import * as THREE from "three";

export default class Sign {
  constructor(position = new THREE.Vector3(0, 0, 0)) {
    const textureLoader = new THREE.TextureLoader();
    const url = "./image/show.png";
    this.material = new THREE.SpriteMaterial({
      map: textureLoader.load(url),
      color: 0xffffff,
      transparent: true,
      depthTest: false,
    });

    this.mesh = new THREE.Sprite(this.material);
    this.mesh.scale.set(20, 20, 20);
    this.mesh.visible = false;

    // 封装点击事件
    this.fns = [];

    // 创建射线
    // this.raycaster = new THREE.Raycaster();
    // this.mouse = new THREE.Vector2();

    // 事件的监听
    // window.addEventListener("click", (event) => {
    //   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

    //   this.raycaster.setFromCamera(this.mouse, camera);

    //   event.mesh = this.mesh;
    //   event.alarm = this;

    //   const intersects = this.raycaster.intersectObject(this.mesh);
    //   if (intersects.length > 0) {
    //     this.fns.forEach((fn) => {
    //       fn(event);
    //     });
    //   }
    // });
  }
  hide() {
    this.mesh.visible = false;
  }
  show(position) {
    // 设置位置
    this.mesh.position.copy(position)
    this.mesh.visible = true;
  }
  onClick(fn) {
    this.fns.push(fn);
  }
}
