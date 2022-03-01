<template>
  <div id="app">
    <fullscreen :fullscreen.sync="fullscreen" :teleport="teleport">
      <div class="fullscreen-wrapper" :style="styles" ref="screen">
        <i
          v-if="fullscreen == false"
          class="el-icon-full-screen"
          @click="toggle"
        ></i>
        <div id="data-view">
          <dv-full-screen-container w="auto" h="auto">
            <div id="contain"></div>
          </dv-full-screen-container>
        </div>
      </div>
    </fullscreen>
  </div>
</template>

<script>
import VueFullscreen from "vue-fullscreen";
import Vue from "vue";
import { Line } from "@antv/g2plot";
Vue.use(VueFullscreen);
export default {
  name: "Daddatascreen",
  data() {
    return {
      fullscreen: false,
      teleport: true,
      styles: ""
    };
  },

  mounted() {
    setTimeout(() => {
      this.getDraw();
    }, 300);
  },

  methods: {
    toggle() {
      this.fullscreen = !this.fullscreen;
    },

    getDraw() {
      fetch(
        "https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json"
      )
        .then(res => res.json())
        .then(data => {
          const line = new Line("contain", {
            data,
            padding: "auto",
            xField: "Date",
            yField: "scales",
            xAxis: {
              // type: 'timeCat',
              tickCount: 5
            },
            smooth: true
          });

          line.render();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.fullscreen-wrapper {
  // width: 100%;
  // height: 100%;
  // background: url("https://img.zcool.cn/community/01855b5c513b9ca801203d22fb8c2b.png@1280w_1l_2o_100sh.png")
  //   no-repeat;
  // background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .el-icon-full-screen {
    cursor: pointer;
    font-size: 26px;
    // color: #fff;
    position: absolute;
    top: 5px;
    right: 5px;
  }
  #data-view {
    width: 100%;
    height: 100%;
    color: #fff;
    #dv-full-screen-container {
      background: url("https://img.zcool.cn/community/01855b5c513b9ca801203d22fb8c2b.png@1280w_1l_2o_100sh.png")
        no-repeat top center;
      background-size: 100% 100%;
      #contain {
        height: 400px;
        width: 500px;
        justify-content: center;
        position: relative;
        ::v-deep.amap-container {
          width: 500px !important;
        }
        ::v-deep.l7-scene {
          width: 500px !important;
        }
        ::v-deep.l7-bottom {
          display: none;
        }
      }
    }
  }
}
</style>
