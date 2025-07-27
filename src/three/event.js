import * as THREE from "three";

export function initEvent(main) {
  // 监听屏幕大小改变的变化，设置渲染的尺寸
  window.addEventListener("resize", () => {
    // 更新摄像头
    main.camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    main.camera.updateProjectionMatrix();
    //   更新渲染器
    main.renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比例
    main.renderer.setPixelRatio(window.devicePixelRatio);
    //   更新css3d渲染器
    main.css3DRenderer.setSize(window.innerWidth, window.innerHeight);
  });

  const mouse = new THREE.Vector2();

  // 点击屏幕事件 
  window.addEventListener("click", (event) => {
    if(event.target.tagName !== 'CANVAS') {
      return;
    }
    // event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

    const vector = new THREE.Vector3(); //三维坐标对象
    vector.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    vector.unproject(main.camera);
    const raycaster = new THREE.Raycaster(
      main.camera.position,
      vector.sub(main.camera.position).normalize()
    );
    raycaster.setFromCamera(vector, main.camera);
    const intersects = raycaster.intersectObjects(main.scene.children);
    if (intersects.length > 0) {
      const selected = intersects[0]; //取第一个物体
      console.log("x坐标:" + selected.point.x);
      console.log("y坐标:" + selected.point.y);
      console.log("z坐标:" + selected.point.z);
    }
  });
}