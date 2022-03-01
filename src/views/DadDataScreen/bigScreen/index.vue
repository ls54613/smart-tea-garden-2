<template>
  <div class="box">
    <el-row
      class="demo-input-suffix"
      :gutter="20"
      tag="div"
      type="flex"
      justify="center"
      align="bottom"
    >
      <el-col :span="5" tag="div" class="ipt">
        <span style="width:40px">名称</span>
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="input"
          size="small"
        >
        </el-input>
      </el-col>
      <el-col :span="5" tag="div" class="ipt">
        <span>报码编号</span>
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="input1"
          size="small"
        >
        </el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="mini">查询</el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button type="danger" size="mini">重置</el-button>
      </el-col>
    </el-row>

    <div class="statement">
      <div class="screen" v-for="(item, index) in screenList" :key="index">
        <span>{{ item.title }}</span>
        <span>{{ item.date }}</span>
        <div>
          <i class="el-icon-view" @click="getView()"></i>
          <i class="el-icon-edit-outline" @click="getEdit()"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "viewerIndex",

  data() {
    return {
      input: "",
      input1: "",
      screenList: [
        { title: "日志大屏", date: "2021-08-23 14:32:53" },
        { title: "日志大屏", date: "2021-08-23 14:32:53" },
        { title: "日志大屏", date: "2021-08-23 14:32:53" },
        { title: "日志大屏", date: "2021-08-23 14:32:53" },
        { title: "日志大屏", date: "2021-08-23 14:32:53" },
        { title: "日志大屏", date: "2021-08-23 14:32:53" }
      ]
    };
  },

  mounted() {},

  methods: {
    getView() {
      let viewer = this.$router.resolve({
        name: "Viewer"
      });
      window.open(viewer.href, "_blank");
    },
    getEdit() {
      let edit = this.$router.resolve({
        name: "Edit"
      });
      window.open(edit.href, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  .statement {
    display: flex;
    flex-wrap: wrap;
    margin-top: 50px;
    .screen {
      width: 20%;
      height: 160px;
      color: #fff;
      background: url("https://img.zcool.cn/community/0139645bbb23c4a8012099c86c6ac2.png@1280w_1l_2o_100sh.png")
        center bottom no-repeat;
      background-size: 100% 100%;

      margin-left: 50px;
      margin-bottom: 50px;
      box-shadow: 2px 2px 10px 5px #c7c7c7;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      span:first-child {
        font-size: 24px;
        margin-top: 40px;
      }
      span:nth-child(2) {
        font-size: 14px;
        align-self: start;
        margin-left: 10px;
      }
      div {
        align-self: end;
        i {
          font-size: 18px;
          margin-right: 10px;
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
    }
  }

  .demo-input-suffix {
    padding-top: 20px;
    .ipt {
      display: flex;
      align-items: center;
      span {
        width: 80px;
        font-size: 14px;
      }
    }
  }
}
</style>
