<template>
  <div class="scene" ref="sceneRef"></div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 导入dat.gui
import * as dat from "dat.gui";

const sceneRef = ref();

// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  1,
  50000
);

camera.position.set(30, 250, 250);

// const gui = new dat.GUI();
// gui
//   .add(cube.position, "x")
//   .min(0)
//   .max(500)
//   .step(10)
//   .name("移动x轴")
//   .onChange((value) => {
//     console.log("值被修改：", value);
//   })
//   .onFinishChange((value) => {
//     console.log("完全停下来:", value);
//   });

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 给场景添加平行光
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(10, 150, 0);
scene.add(light);


const carList = [];
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./model/city.glb", (gltf) => {
  scene.add(gltf.scene);

  // 场景子元素遍历
  let curve;
  gltf.scene.traverse((child) => {

    if (child.name === "轨迹") {
      const line = child;
      console.log(line, "___");
      // line.visible = false;
      // 根据点创建曲线
      const points = [];
      for (
        let i = line.geometry.attributes.position.count - 1;
        i >= 0;
        i--
      ) {
        points.push(
          new THREE.Vector3(
            line.geometry.attributes.position.getX(i) * 36,
            line.geometry.attributes.position.getY(i) ,
            line.geometry.attributes.position.getZ(i) * 36  
          )
        );
      }

      curve = new THREE.CatmullRomCurve3(points);
      console.log(curve, "___curve");
    }

    if (child.name.includes("小车")) {
      carList.push(child);
    }

  });

  // console.log(carList);
  // console.log(curve);
  carList.forEach(car => {
    // car.lookAt(cube.position)
    carAnimation(car, curve)
  })
});


function carAnimation(car, curve) {
  const params = {
    curveProgress: 0
  }
  gsap.to(params, {
    curveProgress: 0.999,
    duration: 30 + Math.floor(Math.random() * 10),
    repeat: -1,
    onUpdate: () => {
      const point = curve.getPoint(params.curveProgress);
      car.position.set(point.x, point.y, point.z);
      if (params.curveProgress + 0.001 < 1) {
        const point = curve.getPoint(params.curveProgress + 0.001);
        car.lookAt(point);
      }
    },
  });
}

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
});
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});


const clock = new THREE.Clock();
function animate(t) {
  // controls.update();
  const time = clock.getElapsedTime();
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

onMounted(() => {
  sceneRef.value.appendChild(renderer.domElement);
  animate();
});
</script>

<style lang="scss" scoped></style>
