<template>
  <div>
    <avue-form-design
      style="height: 100vh;"
      storage
      ref="form"
      :undo-redo="false"
      :show-github-star="false"
      :toolbar="toolbar"
      :include-fields="[]"
      :custom-fields="customFields"
    >
      <template slot="toolbar-left">
        <el-button type="text" icon="el-icon-download" @click="handleGetData"
          >获取JSON</el-button
        >
      </template>
    </avue-form-design>
  </div>
</template>

<script>
export default {
  name: "Edit",
  data() {
    return {
      customFields: [
        {
          title: "警告",
          component: "el-alert",
          labelWidth: "0px",
          span: 24,
          icon: "el-icon-warning",
          params: {
            title: "警告警告警告警告",
            type: "success"
          },
          event: {
            close: () => {
              console.log("alert关闭事件");
            }
          }
        },
        {
          title: "时间线",
          component: "custom-timeline",
          labelWidth: "0px",
          span: 24,
          icon: "el-icon-sort",
          params: {
            reverse: false,
            itemList: [
              {
                content: "支持使用图标",
                timestamp: "2018-04-12 20:46",
                size: "large",
                type: "primary",
                icon: "el-icon-more"
              },
              {
                content: "支持自定义颜色",
                timestamp: "2018-04-03 20:46",
                color: "#0bbd87"
              },
              {
                content: "支持自定义尺寸",
                timestamp: "2018-04-03 20:46",
                size: "large"
              },
              {
                content: "默认样式的节点",
                timestamp: "2018-04-03 20:46"
              }
            ]
          }
        },
        {
          title: "图表",
          component: "aisle-info",
          labelWidth: "0px",
          span: 24,
          icon: "el-icon-sort",
          params: {
            reverse: false,
            itemList: [
              {
                content: "支持使用图标",
                timestamp: "2018-04-12 20:46",
                size: "large",
                type: "primary",
                icon: "el-icon-more"
              },
              {
                content: "支持自定义颜色",
                timestamp: "2018-04-03 20:46",
                color: "#0bbd87"
              },
              {
                content: "支持自定义尺寸",
                timestamp: "2018-04-03 20:46",
                size: "large"
              },
              {
                content: "默认样式的节点",
                timestamp: "2018-04-03 20:46"
              }
            ]
          }
        }
      ],
      toolbar: ["generate", "preview", "clear"]
    };
  },

  mounted() {},

  methods: {
    handleGetData() {
      this.$refs.form.getData("string").then(data => {
        this.$message.success("查看控制台");
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
