<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="年度" prop="year">
        <el-date-picker clearable size="small"
          v-model="queryParams.year"
          type="year"
           value-format="yyyy"
          placeholder="选择年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关联茶农" prop="teaPeasantId">
        <el-select v-model="queryParams.teaPeasantId" placeholder="请选择与茶农基本信息关联id" clearable size="small">
          <el-option
            v-for="item in teaPeasantList"
            :key="item.id"
            :label="item.personName"
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
          v-hasPermi="['system:teaPeasantYieldSales:add']"
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
          v-hasPermi="['system:teaPeasantYieldSales:edit']"
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
          v-hasPermi="['system:teaPeasantYieldSales:remove']"
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
          v-hasPermi="['system:teaPeasantYieldSales:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaPeasantYieldSalesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="年度" align="center" prop="year" width="180">
      </el-table-column>
      <el-table-column label="产量(斤)" align="center" prop="yieldValueNumber" />
      <el-table-column label="产值(万元)" align="center" prop="yieldValueMoney" />
      <el-table-column label="销量(斤)" align="center" prop="salesVolumeNumber" />
      <el-table-column label="销售额(万元)" align="center" prop="salesVolumeMoney" />
      <el-table-column label="关联茶农" align="center" prop="teaPeasantId" :formatter="peasantFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaPeasantYieldSales:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaPeasantYieldSales:remove']"
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

    <!-- 添加或修改茶农历年产量产值、销量销售额对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="年度" prop="year">
          <el-date-picker clearable size="small"
            v-model="form.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产量(斤)" prop="yieldValueNumber">
          <el-input style="width: 220px" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" v-model="form.yieldValueNumber" placeholder="请输入产量(斤)">
            <template slot="append">斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="产值(万元)" prop="yieldValueMoney">
          <el-input style="width: 220px" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" v-model="form.yieldValueMoney" placeholder="产值(万元)">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量(斤)" prop="salesVolumeNumber">
          <el-input style="width: 220px" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" v-model="form.salesVolumeNumber" placeholder="请输入销量(斤)">
            <template slot="append">斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售额(万元)" prop="salesVolumeMoney">
          <el-input style="width: 220px" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" v-model="form.salesVolumeMoney" placeholder="请输入销售额(万元)">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="关联茶农" prop="teaPeasantId">
          <el-select v-model="form.teaPeasantId" placeholder="请选择关联茶农">
            <el-option
              v-for="item in teaPeasantList"
              :key="item.id"
              :label="item.personName"
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
import { listTeaPeasantYieldSales, getTeaPeasantYieldSales, delTeaPeasantYieldSales, addTeaPeasantYieldSales, updateTeaPeasantYieldSales, exportTeaPeasantYieldSales } from "@/api/system/teaPeasantYieldSales";
import { findAllPeasant } from "@/api/system/teaPeasantInfo";
export default {
  name: "TeaPeasantYieldSales",
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
      // 茶农历年产量产值、销量销售额表格数据
      teaPeasantYieldSalesList: [],
      teaPeasantList: [], //茶农列表
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        year: null,
        yieldValueNumber: null,
        yieldValueMoney: null,
        salesVolumeNumber: null,
        salesVolumeMoney: null,
        teaPeasantId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        year: [
          { required: true, message: "年度不能为空", trigger: "blur" }
        ],
        teaPeasantId: [
          { required: true, message: "与茶农基本信息关联id不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    findAllPeasant().then(res => {
      this.teaPeasantList = res.data;
    });
  },
  methods: {
    /** 查询茶农历年产量产值、销量销售额列表 */
    getList() {
      this.loading = true;
      listTeaPeasantYieldSales(this.queryParams).then(response => {
        this.teaPeasantYieldSalesList = response.rows;
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
        yieldValueNumber: null,
        yieldValueMoney: null,
        salesVolumeNumber: null,
        salesVolumeMoney: null,
        teaPeasantId: null
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
      this.title = "添加茶农历年产量产值、销量销售额";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaPeasantYieldSales(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶农历年产量产值、销量销售额";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaPeasantYieldSales(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaPeasantYieldSales(this.form).then(response => {
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
      this.$confirm('是否确认删除茶农历年产量产值、销量销售额编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaPeasantYieldSales(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶农历年产量产值、销量销售额数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaPeasantYieldSales(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    //茶农格式化
    peasantFormatter(row, column,value){
      if(!value){
        return;
      }
      let result = '';
      this.teaPeasantList.forEach(teaPeasant => {
        if(teaPeasant.id == value){
          result = teaPeasant.personName;
          return;
        }
      });
      return result;
    },
  }
};
</script>
