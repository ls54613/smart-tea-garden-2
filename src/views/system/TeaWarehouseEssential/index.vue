<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="关联企业单位" prop="enterpriseId">
        <el-select v-model="queryParams.enterpriseId" filterable placeholder="请选择关联企业单位">
          <el-option
            v-for="item in enterpriseInfoList"
            :key="item.id"
            :label="item.enterpriseName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:TeaWarehouseEssential:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:TeaWarehouseEssential:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:TeaWarehouseEssential:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
		  :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:TeaWarehouseEssential:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="TeaWarehouseEssentialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="茶仓id" align="center" prop="id" />
      <el-table-column label="茶仓名称" align="center" prop="warehouseName" />
      <el-table-column label="关联企业单位" align="center" prop="enterpriseId" :formatter="enterpriseFormatter" />
      <el-table-column label="茶仓面积" align="center" prop="measure" />
      <el-table-column label="茶仓容量" align="center" prop="capacity" />
      <el-table-column label="设施数量" align="center" prop="facilitiesNumber" />
      <el-table-column label="利用率" align="center" prop="utilization" />
      <el-table-column label="负责人" align="center" prop="personCharge" />
      <el-table-column label="现存量" align="center" prop="quantity" />
      <el-table-column label="出库总量" align="center" prop="outboundVolume" />
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:TeaWarehouseEssential:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:TeaWarehouseEssential:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-menu"
            @click="handleTeaWarehouseDetails(scope.row)"
            v-hasPermi="['system:teaWarehouseDetails:list']"
          >仓位详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改茶仓基本情况对话框 -->
    <el-dialog :center="true" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="茶仓名称" prop="warehouseName">
          <el-input style="width: 220px;" v-model="form.warehouseName" placeholder="请输入茶仓名称" />
        </el-form-item>
        <el-form-item label="关联企业单位" prop="enterpriseId">
          <el-select style="width: 220px;" v-model="form.enterpriseId" filterable placeholder="请选择关联企业单位">
            <el-option
              v-for="item in enterpriseInfoList"
              :key="item.id"
              :label="item.enterpriseName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="茶仓面积" prop="measure">
          <el-input style="width: 220px;" v-model="form.measure" placeholder="请输入茶仓面积" />
        </el-form-item>
        <el-form-item label="茶仓容量" prop="capacity">
          <el-input style="width: 220px;" v-model="form.capacity" placeholder="请输入茶仓容量" />
        </el-form-item>
        <el-form-item label="设施数量" prop="facilitiesNumber">
          <el-input style="width: 220px;" v-model="form.facilitiesNumber" placeholder="请输入设施数量" />
        </el-form-item>
        <el-form-item label="利用率" prop="utilization">
          <el-input style="width: 220px;" v-model="form.utilization" placeholder="请输入利用率" />
        </el-form-item>
        <el-form-item label="负责人" prop="personCharge">
          <el-input style="width: 220px;" v-model="form.personCharge" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="现存量" prop="quantity">
          <el-input style="width: 220px;" v-model="form.quantity" placeholder="请输入现存量" />
        </el-form-item>
        <el-form-item label="出库总量" prop="outboundVolume">
          <el-input style="width: 220px;" v-model="form.outboundVolume" placeholder="请输入出库总量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTeaWarehouseEssential, getTeaWarehouseEssential, delTeaWarehouseEssential, addTeaWarehouseEssential, updateTeaWarehouseEssential, exportTeaWarehouseEssential } from "@/api/system/TeaWarehouseEssential";
import {listTeaEnterpriseInfoAll} from '@/api/system/teaEnterpriseInfo';
export default {
  name: "TeaWarehouseEssential",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 茶仓基本情况表格数据
      TeaWarehouseEssentialList: [],
      enterpriseInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        enterpriseId: [
          { required: true, message: "关联企业单位不能为空", trigger: "change" }
        ],
        warehouseName: [
          { required: true, message: "名称不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    listTeaEnterpriseInfoAll().then(res => {
      this.enterpriseInfoList = res.data;
    });
  },
  methods: {
    /** 查询茶仓基本情况列表 */
    getList() {
      this.loading = true;
      listTeaWarehouseEssential(this.queryParams).then(response => {
        this.TeaWarehouseEssentialList = response.rows;
        // console.log(this.TeaWarehouseEssentialList)
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        warehouseName: '',
        enterpriseId: null,
        measure: null,
        capacity: null,
        facilitiesNumber: null,
        utilization: null,
        personCharge: null,
        quantity: null,
        outboundVolume: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加茶仓基本情况";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaWarehouseEssential(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶仓基本情况";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaWarehouseEssential(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaWarehouseEssential(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除茶仓基本情况编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaWarehouseEssential(ids);
        }).then((res) => {
        console.log(res)
          this.msgSuccess("删除成功");
          this.getList();
        }).catch((e) => {
        console.log(e)
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶仓基本情况数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaWarehouseEssential(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    //所属企业格式化
    enterpriseFormatter(row, column,value){
      let enterpriseName = '';
      this.enterpriseInfoList.forEach(enterpriseInfo => {
        if(value == enterpriseInfo.id){
          enterpriseName = enterpriseInfo.enterpriseName;
          return;
        }
      });
      return enterpriseName;
    },
    //查看仓位详细
    handleTeaWarehouseDetails(row){
      this.$router.push({
        path: 'teaWarehouseDetails',
        query: {
          id: row.id
        }
      });
    }
  }
};
</script>
