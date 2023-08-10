<template>
  <div class="scene" ref="sceneRef"></div>
</template>

<script setup>
import { init } from "@/three/init.js";

const sceneRef = ref();
const { main } = init();

onMounted(() => {
  sceneRef.value.appendChild(main.renderer.domElement);
  main.render();
});

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
</script>

<style lang="scss" scoped></style>
