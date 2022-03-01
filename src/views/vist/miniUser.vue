<template>
  <div>
    <!--搜索过滤-->
    <div>
      <table style="font-size: 16px">
        <tr>
          <td>姓名：</td>
          <td>
            <el-input
              v-model="search.mName"
              placeholder="请输入姓名关键字"
            ></el-input>
          </td>
          <td>公司名称：</td>
          <td>
            <el-input
              v-model="search.companyName"
              placeholder="请输入公司关键字"
            ></el-input>
          </td>
          <td>职位：</td>
          <td>
            <el-input
              v-model="search.position"
              placeholder="请输入职位关键字"
            ></el-input>
          </td>
          <td>
            <el-tooltip
              class="item"
              effect="dark"
              content="重置"
              placement="top"
            >
              <el-button
                icon="el-icon-refresh-right"
                circle
                @click="rest"
              ></el-button>
            </el-tooltip>
          </td>
        </tr>
      </table>
    </div>
    <!--数据表格-->
    <el-table
      :data="tableData.
      filter(data=>!search.mName||data.mName.toLowerCase().includes(search.mName.toLowerCase())).
      filter(data => !search.companyName|| data.companyName.toLowerCase().includes(search.companyName.toLowerCase())).
      filter(data=>!search.position||data.position.toLowerCase().includes(search.position.toLowerCase()))"
      border style="width: 100%;height: 512px;overflow-y: scroll">
      <el-table-column prop="portrait" label="头像" align="center" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          <el-avatar
            shape="square"
            fit="fill"
            :size="100"
            :src="handleOssUrl(scope.row.portrait)"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="mName"
        label="姓名"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="openId"
        label="微信"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="companyName"
        label="公司名称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="position"
        label="职位"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="regTime"
        label="注册时间"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="status" label="状态" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tooltip :content="'激活状态'" placement="top">
            <el-switch
              :disabled="true"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            fixed="right"
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editor(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUser(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑弹窗-->
    <el-dialog title="用户信息修改" :visible.sync="showIf">
      <table align="center">
        <tr>
          <td>姓名:</td>
          <td>
            <el-input type="text" v-model="forms.mName"></el-input>
          </td>
        </tr>
        <tr>
          <td>手机号:</td>
          <td>
            <el-input type="text" v-model="forms.phone"></el-input>
          </td>
        </tr>

        <tr>
          <td>身份证:</td>
          <td>
            <el-input type="text" v-model="forms.idCard"></el-input>
          </td>
        </tr>
        <tr>
          <td>公司名称:</td>
          <td>
            <el-input type="text" v-model="forms.companyName"></el-input>
          </td>
        </tr>
        <tr>
          <td>职位:</td>
          <td>
            <el-input type="text" v-model="forms.position"></el-input>
          </td>
        </tr>
        <tr>
          <td>状态:</td>
          <td>
            <el-switch
              v-model="forms.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </td>
        </tr>
      </table>

      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-s-cooperation" @click="serve">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, updateUser, deleteUser } from "@/api/vist/miniUser";
export default {
  name: "miniUser",
  data() {
    return {
      //表格数据
      tableData: [],
      // 搜索字段
      search: { mName: "", companyName: "", position: "" },
      //弹出层显示判断
      showIf: false,
      forms: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //加载数据
    getList() {
      listUser().then(response => {
        this.tableData = response.data;
      });
    },

    //人像返回方法
    handleOssUrl(url) {
      return this.$ossPre + url;
    },

    //编辑方法
    editor(row) {
      this.showIf = true;
      this.forms = row;
    },

    //保存方法
    serve() {
      this.$confirm("确定保存?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateUser(this.forms).then(response => {
            this.$message({
              message: response.msg,
              type: "success"
            });
            this.showIf = false;
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消保存"
          });
        });
    },

    //删除方法
    deleteUser(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(row.id).then(response => {
            this.$message({
              message: response.msg,
              type: "success"
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //搜索重置
    rest() {
      this.search.mName = "";
      this.search.position = "";
      this.search.companyName = "";
    }
  }
};
</script>

<style scoped>
  ::v-deep .el-avatar img{
    width: 100%;
  }
</style>
