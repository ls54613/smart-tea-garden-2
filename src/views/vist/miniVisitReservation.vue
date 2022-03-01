<template>
  <div>
    <div>
      <table style="font-size: 16px">
        <tr>
          <td>被访问人：</td>
          <td>
            <el-input v-model="search.name" placeholder="请输入被访问人关键字"></el-input>
          </td>
          <td>部门名称：</td>
          <td>
            <el-input v-model="search.deptName" placeholder="请输入部门名称关键字"></el-input>
          </td>
          <td>访问者姓名：</td>
          <td>
            <el-input v-model="search.mName" placeholder="请输入访问者姓名关键字"></el-input>
          </td>
          <td>
            <el-tooltip class="item" effect="dark" content="重置" placement="top">
              <el-button icon="el-icon-refresh-right" circle @click="rest"></el-button>
            </el-tooltip>
          </td>
        </tr>
      </table>
    </div>
    <el-table :data="tableData.
    filter(data=>!search.name||data.name.toLowerCase().includes(search.name.toLowerCase())).
    filter(data=>!search.deptName||data.deptName.toLowerCase().includes(search.deptName.toLowerCase())).
    filter(data=>!search.mName||data.mName.toLowerCase().includes(search.mName.toLowerCase()))"
              border style="width: 100%;height: 512px;overflow-y: scroll">
      <el-table-column prop="name" label="被访问人" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="deptName" label="部门名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="visitDateStart" label="拜访开始时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="visitDateEnd" label="拜访结束时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="mName" label="访问者姓名" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" style="width: 160px;">
        <template slot-scope="scope" >
          <el-radio v-model="scope.row.status" :label="1" @change="statusSet(scope.row)">等待通过</el-radio>
          <el-radio v-model="scope.row.status" :label="2" @change="statusSet(scope.row)">已通过</el-radio>
          <el-radio v-model="scope.row.status" :label="3" @change="statusSet(scope.row)">已拒绝</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="isDel" label="是否删除" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <el-tooltip :content="'删除状态'" placement="top">
            <el-switch v-model="scope.row.isDel" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" @change="deleteInfo(scope.row)"></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getMiniList,updateNotes} from '@/api/vist/miniNotes'

export default {
  name: "miniVisitReservation",
  data() {
    return {
      tableData: [],
      search: {name:'',deptName:'',mName:''},
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //获取信息列表
    getList() {
      getMiniList().then(response => {
        this.tableData=response.data
      })
    },

    //状态设置
    statusSet(row){
      updateNotes(row).then(response=>{
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.getList()
      })
    },
    //删除操作
    deleteInfo(row){
      updateNotes(row).then(response=>{
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.getList()
      })
    },
    //重置方法
    rest(){
      this.search.name=''
      this.search.deptName=''
      this.search.mName=''
    }
  }
}
</script>

<style scoped>

</style>
