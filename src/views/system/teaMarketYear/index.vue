<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="年份" prop="year">
        <el-input
          v-model="queryParams.year"
          placeholder="请输入年份
年份"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:teaMarketYear:add']"
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
          v-hasPermi="['system:teaMarketYear:edit']"
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
          v-hasPermi="['system:teaMarketYear:remove']"
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
          v-hasPermi="['system:teaMarketYear:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaMarketYearList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="茶市id" align="center" prop="id" />
      <el-table-column label="年份" align="center" prop="year" />
      <el-table-column label="中国茶叶内销总量(万吨)" align="center" prop="teaTotalSales" />
      <el-table-column label="中国茶叶线上占比(%)" align="center" prop="teaOnlineProportion" />
      <el-table-column label="中国茶叶线下占比(%)" align="center" prop="teaOfflineProportion" />
      <el-table-column label="中国茶叶人均消费量(千克)" align="center" prop="teaCapitaConsumption" />
      <el-table-column label="常宁茶叶内销总量(万吨)" align="center" prop="teaChangningTotalSales" />
      <el-table-column label="常宁茶叶产量(吨)" align="center" prop="teaChangningYield" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaMarketYear:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaMarketYear:remove']"
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

    <!-- 添加或修改茶市基本情况表对话框 -->
    <el-dialog :title="title" :center="true" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="年份"  prop="year" >
          <el-input v-model="form.year"  placeholder="请输入年份年份" />
        </el-form-item>
        <el-form-item label="中国茶叶内销总量(万吨)" prop="teaTotalSales">
          <el-input v-model="form.teaTotalSales"  placeholder="请输入中国茶叶内销总量" />
        </el-form-item>
        <el-form-item label="中国茶叶线上占比(%)" prop="teaOnlineProportion">
          <el-input v-model="form.teaOnlineProportion"  placeholder="请输入中国茶叶线上占比" />
        </el-form-item>
        <el-form-item label="中国茶叶线下占比(%)" prop="teaOfflineProportion">
          <el-input v-model="form.teaOfflineProportion"  placeholder="请输入中国茶叶线下占比" />
        </el-form-item>
        <el-form-item label="中国茶叶人均消费量(千克)" prop="teaCapitaConsumption">
          <el-input v-model="form.teaCapitaConsumption"  placeholder="请输入中国茶叶人均消费量" />
        </el-form-item>
        <el-form-item label="常宁茶叶内销总量(万吨)" prop="teaChangningTotalSales">
          <el-input v-model="form.teaChangningTotalSales"  placeholder="请输入常宁茶叶内销总量" />
        </el-form-item>
        <el-form-item label="常宁茶叶产量(吨)" prop="teaChangningYield">
          <el-input v-model="form.teaChangningYield"  placeholder="请输入常宁茶叶产量" />
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
import { listTeaMarketYear, getTeaMarketYear, delTeaMarketYear, addTeaMarketYear, updateTeaMarketYear, exportTeaMarketYear } from "@/api/system/teaMarketYear";

export default {
  name: "TeaMarketYear",
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
      // 茶市基本情况表表格数据
      teaMarketYearList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        year: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        year: [
          { required: true, message: "年份年份不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询茶市基本情况表列表 */
    getList() {
      this.loading = true;
      listTeaMarketYear(this.queryParams).then(response => {
        this.teaMarketYearList = response.rows;
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
        year: null,
        teaTotalSales: null,
        teaOnlineProportion: null,
        teaOfflineProportion: null,
        teaCapitaConsumption: null,
        teaChangningTotalSales: null,
        teaChangningYield: null
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
      this.title = "添加茶市基本情况表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaMarketYear(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶市基本情况表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaMarketYear(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaMarketYear(this.form).then(response => {
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
      this.$confirm('是否确认删除茶市基本情况表编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaMarketYear(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶市基本情况表数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaMarketYear(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
