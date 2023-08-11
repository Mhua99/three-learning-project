<template>
  <div class="scene" ref="sceneRef"></div>
</template>

<script setup>
import { init } from "@/three/init.js";

const sceneRef = ref();
const { main, loaderModel } = init();

onMounted(() => {
  sceneRef.value.appendChild(main.renderer.domElement);
  main.render();
});

defineExpose({ loaderModel, main });
</script>

<style lang="scss" scoped></style>
