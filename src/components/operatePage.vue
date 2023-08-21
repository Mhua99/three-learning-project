<template>
  <div id="bigScreen">
    <div class="leftContent">
      <div class="wrapItem">
        <div class="item">
          <h3 class="title">
            <p>视角：</p>
            <select class="selectValue" @change="handleChange">
              <option v-for="(item, index) of state.cameraList" :key="index" :value="item.tagName">
                {{ item.tagName }}
              </option>
            </select>
          </h3>
        </div>
        <div class="bottomStyle"></div>
      </div>
      <div class="wrapItem">
        <div class="item">
          <h3 class="title">路灯总数：{{ state.loader.streetLampCount }}</h3>
          <h4 class="subtitle">路灯损坏数：0</h4>
        </div>
        <div class="bottomStyle"></div>
      </div>
      <div class="wrapItem">
        <div class="item">
          <h3 class="title">停车场车辆：{{ state.carList.length }}</h3>
          <h4 class="subtitle">停车超过1天：{{ moreThan1Day }}</h4>
          <h4 class="subtitle">停车超过2天：{{ moreThan2Day }}</h4>
        </div>
        <div class="bottomStyle"></div>
      </div>
    </div>
    <div class="rightContent">
      <div class="carItem" v-for="item of state.carList" :key="item.name">
        <h3 class="title">{{ item.car.name }}</h3>
        <div class="content">
          <div class="left">停留：{{ item.stopTime }}分</div>
          <div class="right">费用：{{ (item.stopTime * 10 / 60).toFixed(2) }}元</div>
        </div>
        <div class="footer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Mitt from "@/utils/mitt.js";
const state = reactive({
  main: {},
  loader: {},
  cameraList: [],
  carList: []
});

// 超过1天
const moreThan1Day = computed(() => {
  return state.carList.filter(item => item.stopTime > 1140)?.length || 0;
})

// 超过2天
const moreThan2Day = computed(() => {
  return state.carList.filter(item => item.stopTime > 1140)?.length || 0;
})

Mitt.on("loaderMounted", (loader, main) => {
  state.cameraList = [main.camera, ...loader.cameraList];
  state.loader = { ...loader };
  state.main = main;
  state.carList = state.loader.carList.filter(item => item.status == 'cease');
});


Mitt.on("updateCar", () => {
  if (state.loader.carList?.length) {
    state.carList = state.loader.carList.filter(item => item._status == 'cease')
  }
});


function handleChange(event) {
  const camera = state.cameraList.find((item) => {
    return item.tagName == event.target.value;
  });
  if (camera) {
    const {
      domElement: { clientWidth, clientHeight },
    } = state.main.renderer;
    state.main.camera = camera;
    state.main.camera.aspect = clientWidth / clientHeight;
    state.main.camera.updateProjectionMatrix();
  }
}
</script>

<style lang="scss" scoped>
@mixin border-style {
  content: "";
  display: block;
  position: absolute;
  width: 10px;
  height: 10px;
}

#bigScreen {
  position: fixed;
  justify-content: space-between;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  color: white;
  pointer-events: none;

  .leftContent {
    padding: 10px;
    width: 260px;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: auto;

    .wrapItem {
      margin-top: 30px;

      .item {
        position: relative;
        padding: 20px;

        &::before {
          @include border-style;
          top: 0;
          left: 0;
          border-top: 4px solid rgb(34, 133, 247);
          border-left: 4px solid rgb(34, 133, 247);
        }

        &::after {
          @include border-style;
          right: 0;
          top: 0;
          border-top: 4px solid rgb(34, 133, 247);
          border-right: 4px solid rgb(34, 133, 247);
        }

        .title {
          font-size: 26px;
          font-weight: 700;
          color: rgb(115 180 255);

          &:first-child {
            display: flex;
            align-items: center;
          }

          .selectValue {
            background-color: transparent;
            border: none;
            width: 100px;
            height: 30px;
            color: rgb(115, 180, 255);
            appearance: none;
            font-size: 26px;
            padding-left: 10px;
            outline: none;
          }
        }

        .subtitle {
          font-size: 18px;
          font-weight: 700;
          color: rgb(115 180 255);
        }
      }

      .bottomStyle {
        position: relative;

        &::before {
          @include border-style;
          border-bottom: 4px solid rgb(34, 133, 247);
          border-left: 4px solid rgb(34, 133, 247);
        }

        &::after {
          @include border-style;
          right: 0;
          top: 0;
          border-bottom: 4px solid rgb(34, 133, 247);
          border-right: 4px solid rgb(34, 133, 247);
        }
      }
    }
  }

  .rightContent {
    padding: 10px;
    width: 240px;
    background-color: rgba(0, 0, 0, 0.5);

    .carItem {
      padding: 10px;
      color: rgb(115, 180, 255);
      font-size: 13px;

      .title {
        margin-bottom: 10px;
      }

      .content {
        display: flex;
        justify-content: space-between;
      }

      .footer {
        margin-top: 6px;
        border: 3px solid rgb(34, 133, 247);
      }
    }
  }
}
</style>
