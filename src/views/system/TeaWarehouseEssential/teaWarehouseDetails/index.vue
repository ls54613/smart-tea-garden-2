<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
          v-hasPermi="['system:teaWarehouseDetails:add']"
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
          v-hasPermi="['system:teaWarehouseDetails:edit']"
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
          v-hasPermi="['system:teaWarehouseDetails:remove']"
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
          v-hasPermi="['system:teaWarehouseDetails:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaWarehouseDetailsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="占地面积" align="center" prop="areaCovered" />
      <el-table-column label="库存总量" align="center" prop="totalInventory" />
      <el-table-column label="出库总量" align="center" prop="totalOutbound" />
      <el-table-column label="关联茶仓" align="center" prop="teaWarehouseId" :formatter="teaWarehouseFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaWarehouseDetails:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaWarehouseDetails:remove']"
          >删除</el-button>
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

    <!-- 添加或修改仓位详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="占地面积" prop="areaCovered">
          <el-input v-model="form.areaCovered" placeholder="请输入占地面积" />
        </el-form-item>
        <el-form-item label="库存总量" prop="totalInventory">
          <el-input v-model="form.totalInventory" placeholder="请输入库存总量" />
        </el-form-item>
        <el-form-item label="出库总量" prop="totalOutbound">
          <el-input v-model="form.totalOutbound" placeholder="请输入出库总量" />
        </el-form-item>
        <el-form-item label="关联茶仓" prop="teaWarehouseId">
          <el-select disabled v-model="form.teaWarehouseId" placeholder="请选择关联茶仓">
            <el-option
              v-for="item in teaWarehouseList"
              :key="'teaWarehouse_' + item.id"
              :label="item.warehouseName"
              :value="item.id"
            ></el-option>
          </el-select>
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
import { listTeaWarehouseDetails, getTeaWarehouseDetails, delTeaWarehouseDetails, addTeaWarehouseDetails, updateTeaWarehouseDetails, exportTeaWarehouseDetails } from "@/api/system/teaWarehouseDetails";
import { findAllTeaWarehouse } from '@/api/system/TeaWarehouseEssential'
export default {
  name: "TeaWarehouseDetails",
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
      // 仓位详情表格数据
      teaWarehouseDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      teaWarehouseList: [],
      teaWarehouseId: null,
      // 表单校验
      rules: {
        teaWarehouseId: [
          { required: true, message: "关联茶仓基本信息id不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    let teaWarehouseId = this.$route.query.id;
    if(teaWarehouseId){
      this.teaWarehouseId = teaWarehouseId;
      this.queryParams.teaWarehouseId = teaWarehouseId;
      this.form.teaWarehouseId = teaWarehouseId;
      findAllTeaWarehouse().then(res => {
        this.teaWarehouseList = res.data;
      });
      this.getList();
    }
  },
  methods: {
    /** 查询仓位详情列表 */
    getList() {
      this.loading = true;
      listTeaWarehouseDetails(this.queryParams).then(response => {
        this.teaWarehouseDetailsList = response.rows;
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
        areaCovered: null,
        totalInventory: null,
        totalOutbound: null,
        teaWarehouseId: parseInt(this.teaWarehouseId)
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
      this.title = "添加仓位详情";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaWarehouseDetails(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改仓位详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaWarehouseDetails(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaWarehouseDetails(this.form).then(response => {
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
      this.$confirm('是否确认删除仓位详情编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaWarehouseDetails(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有仓位详情数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaWarehouseDetails(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    //茶仓格式化
    teaWarehouseFormatter(row,column,value){
      let teaWarehouseName = '';
      if(value){
        this.teaWarehouseList.forEach(teaWarehouse => {
          if(teaWarehouse.id == value){
            teaWarehouseName = teaWarehouse.warehouseName;
            return;
          }
        });
      }

      return teaWarehouseName;
    }
  }
};
</script>
