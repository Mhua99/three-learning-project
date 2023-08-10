<template>
  <div id="bigScreen">
    <div class="leftContent">
      <div class="wrapItem">
        <div class="item">
          <h3 class="title">
            <p>视角：</p>
            <select class="selectValue">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </h3>
        </div>
        <div class="bottomStyle"></div>
      </div>
      <div class="wrapItem">
        <div class="item">
          <h3 class="title">路灯总数：20</h3>
          <h4 class="subtitle">路灯损坏数：0</h4>
        </div>
        <div class="bottomStyle"></div>
      </div>
      <div class="wrapItem">
        <div class="item">
          <h3 class="title">停车场车辆：20</h3>
          <h4 class="subtitle">停车超过3天：0</h4>
        </div>
        <div class="bottomStyle"></div>
      </div>
    </div>
    <div class="rightContent"></div>
  </div>
</template>

<script setup>
const showWall = () => {
  console.log(1);
};

const showFloor1 = () => {
  console.log(1);
};

const showFloor2 = () => {
  console.log(1);
};

let open = false;
const showAll = () => {
  console.log(1);
};

const flatFighter = () => {
  console.log(1);
};

const recoverFighter = () => {
  console.log(1);
};

const pointsFighter = () => {
  console.log(1);
};

const pointsBlast = () => {
  console.log(1);
};

const pointsBack = () => {
  console.log(1);
};
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
  }
}
</style>
