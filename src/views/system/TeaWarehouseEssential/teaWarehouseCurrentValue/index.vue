<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联茶仓" prop="teaWarehouseId">
        <el-select v-model="queryParams.teaWarehouseId" placeholder="请选择关联茶仓" clearable size="small">
          <el-option
            v-for="item in teaWarehouseList"
            :key="'teaWarehouse' + item.id"
            :label="item.warehouseName"
            :value="item.id"
          ></el-option>
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
          v-hasPermi="['system:teaWarehouseCurrentValue:add']"
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
          v-hasPermi="['system:teaWarehouseCurrentValue:edit']"
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
          v-hasPermi="['system:teaWarehouseCurrentValue:remove']"
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
          v-hasPermi="['system:teaWarehouseCurrentValue:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaWarehouseCurrentValueList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="品种" align="center" prop="varieties" :formatter="varietiesFormat" />
      <el-table-column label="当前库存量(吨)" align="center" prop="currentInventory" />
      <el-table-column label="货值(万元)" align="center" prop="goodsValue" />
      <el-table-column label="库存预警量" align="center" prop="inventoryWarningQuantity" />
      <el-table-column label="关联茶仓" align="center" prop="teaWarehouseId" :formatter="teaWarehouseFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaWarehouseCurrentValue:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaWarehouseCurrentValue:remove']"
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

    <!-- 添加或修改库存情况货值分布对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="品种" prop="varieties">
          <el-select style="width: 220px" v-model="form.varieties" placeholder="选择品种">
            <el-option
              v-for="item in varietiesOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存量(吨)" prop="currentInventory">
          <el-input style="width: 220px" v-model="form.currentInventory" placeholder="请输入当前库存量(吨)">
            <template slot="append">吨</template>
          </el-input>
        </el-form-item>
        <el-form-item label="货值(万元)" prop="goodsValue">
          <el-input style="width: 220px" v-model="form.goodsValue" placeholder="请输入货值(万元)">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存预警量" prop="inventoryWarningQuantity">
          <el-input style="width: 220px" v-model="form.inventoryWarningQuantity" placeholder="请输入库存预警量" />
        </el-form-item>
        <el-form-item label="关联茶仓" prop="teaWarehouseId">
          <el-select style="width: 220px" v-model="form.teaWarehouseId" placeholder="关联茶仓">
            <el-option
              v-for="item in teaWarehouseList"
              :key="item.id"
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
import { listTeaWarehouseCurrentValue, getTeaWarehouseCurrentValue, delTeaWarehouseCurrentValue, addTeaWarehouseCurrentValue, updateTeaWarehouseCurrentValue, exportTeaWarehouseCurrentValue } from "@/api/system/teaWarehouseCurrentValue";
import { findAllTeaWarehouse } from '@/api/system/TeaWarehouseEssential'
export default {
  name: "TeaWarehouseCurrentValue",
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
      // 库存情况货值分布表格数据
      teaWarehouseCurrentValueList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 品种字典
      varietiesOptions: [],
      teaWarehouseList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teaWarehouseId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        varieties: [
          { required: true, message: "品种不能为空", trigger: "blur" }
        ],
        teaWarehouseId: [
          { required: true, message: "关联茶企不能为空", trigger: "change" }
        ],
        currentInventory: [
          { required: true, message: "当前库存量不能为空", trigger: "change" }
        ],
        goodsValue: [
          { required: true, message: "货值不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    findAllTeaWarehouse().then(res => {
      this.teaWarehouseList = res.data;
    });
    this.getList();
    this.getDicts("sys_tea_type").then(response => {
      this.varietiesOptions = response.data;
      // console.log(this.varietiesOptions)
    });
  },
  methods: {
    /** 查询库存情况货值分布列表 */
    getList() {
      this.loading = true;
      listTeaWarehouseCurrentValue(this.queryParams).then(response => {
        this.teaWarehouseCurrentValueList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 品种字典翻译
    varietiesFormat(row, column) {
      return this.selectDictLabel(this.varietiesOptions, row.varieties);
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
        varieties: null,
        currentInventory: null,
        goodsValue: null,
        inventoryWarningQuantity: null,
        teaWarehouseId: null
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
      this.title = "添加库存情况货值分布";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaWarehouseCurrentValue(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存情况货值分布";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaWarehouseCurrentValue(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaWarehouseCurrentValue(this.form).then(response => {
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
      this.$confirm('是否确认删除库存情况货值分布编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaWarehouseCurrentValue(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有库存情况货值分布数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaWarehouseCurrentValue(queryParams);
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
