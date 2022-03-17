<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="采购日期" prop="purchaseDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.purchaseDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择采购日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关联茶企" prop="teaEnterpriseId">
        <el-select v-model="queryParams.teaEnterpriseId" filterable placeholder="请选择关联茶企">
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
          v-hasPermi="['system:teaEnterpriseProcurement:add']"
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
          v-hasPermi="['system:teaEnterpriseProcurement:edit']"
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
          v-hasPermi="['system:teaEnterpriseProcurement:remove']"
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
          v-hasPermi="['system:teaEnterpriseProcurement:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaEnterpriseProcurementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="采购情况id" align="center" prop="id" />
      <el-table-column label="采购日期" align="center" prop="purchaseDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.purchaseDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购物品" align="center" prop="purchaseGoods" />
      <el-table-column label="采购数量" align="center" prop="purchaseNumber" />
      <el-table-column label="关联茶企" align="center" prop="teaEnterpriseId" :formatter="enterpriseFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaEnterpriseProcurement:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaEnterpriseProcurement:remove']"
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

    <!-- 添加或修改近半年采购情况对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="采购日期" prop="purchaseDate">
          <el-date-picker clearable size="small"
            v-model="form.purchaseDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择采购日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采购物品" prop="purchaseGoods">
          <el-input v-model="form.purchaseGoods" placeholder="请输入采购物品" />
        </el-form-item>
        <el-form-item label="采购数量" prop="purchaseNumber">
          <el-input v-model="form.purchaseNumber" placeholder="请输入采购数量" />
        </el-form-item>
        <el-form-item label="关联茶企" prop="teaEnterpriseId">
          <el-select v-model="form.teaEnterpriseId" filterable placeholder="请选择关联茶企">
            <el-option
              v-for="item in enterpriseInfoList"
              :key="item.id"
              :label="item.enterpriseName"
              :value="item.id">
            </el-option>
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
import { listTeaEnterpriseProcurement, getTeaEnterpriseProcurement, delTeaEnterpriseProcurement, addTeaEnterpriseProcurement, updateTeaEnterpriseProcurement, exportTeaEnterpriseProcurement } from "@/api/system/teaEnterpriseProcurement";
import {listTeaEnterpriseInfoAll} from '@/api/system/teaEnterpriseInfo';
export default {
  name: "TeaEnterpriseProcurement",
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
      // 近半年采购情况表格数据
      teaEnterpriseProcurementList: [],
      enterpriseInfoList: [], //茶企列表
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        purchaseDate: null,
        purchaseGoods: null,
        purchaseNumber: null,
        teaEnterpriseId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    listTeaEnterpriseInfoAll().then(res => {
        this.enterpriseInfoList = res.data;
    })
  },
  methods: {
    /** 查询近半年采购情况列表 */
    getList() {
      this.loading = true;
      listTeaEnterpriseProcurement(this.queryParams).then(response => {
        this.teaEnterpriseProcurementList = response.rows;
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
        purchaseDate: null,
        purchaseGoods: null,
        purchaseNumber: null,
        teaEnterpriseId: null
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
      this.title = "添加近半年采购情况";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaEnterpriseProcurement(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改近半年采购情况";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaEnterpriseProcurement(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaEnterpriseProcurement(this.form).then(response => {
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
      this.$confirm('是否确认删除近半年采购情况编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaEnterpriseProcurement(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有近半年采购情况数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaEnterpriseProcurement(queryParams);
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
    }
  }
};
</script>
