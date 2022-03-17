<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <!--<el-form-item label="资产类型" prop="assetsType">
        <el-select v-model="queryParams.assetsType" placeholder="请选择资产类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>-->
      <el-form-item label="关联茶农" prop="teaPeasantId">
        <el-select v-model="queryParams.teaPeasantId" @keyup.enter.native="handleQuery" placeholder="请选择关联茶农">
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
          v-hasPermi="['system:teaPeasantAsset:add']"
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
          v-hasPermi="['system:teaPeasantAsset:edit']"
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
          v-hasPermi="['system:teaPeasantAsset:remove']"
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
          v-hasPermi="['system:teaPeasantAsset:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaPeasantAssetList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资产状况id" align="center" prop="id" />
      <el-table-column label="资产类型" align="center" prop="assetsType" />
      <el-table-column label="资产内容" align="center" prop="content" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="关联茶农" align="center" prop="teaPeasantId" :formatter="peasantFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaPeasantAsset:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaPeasantAsset:remove']"
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

    <!-- 添加或修改茶农资产状况对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="资产类型" prop="assetsType">
          <el-input v-model="form.assetsType" placeholder="请输入资产类型" />
        </el-form-item>
        <el-form-item label="资产内容">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入资产内容"
            v-model="form.content">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
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
import { listTeaPeasantAsset, getTeaPeasantAsset, delTeaPeasantAsset, addTeaPeasantAsset, updateTeaPeasantAsset, exportTeaPeasantAsset } from "@/api/system/teaPeasantAsset";
import { findAllPeasant } from "@/api/system/teaPeasantInfo";
export default {
  name: "TeaPeasantAsset",
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
      // 茶农资产状况表格数据
      teaPeasantAssetList: [],
      teaPeasantList: [], //茶农列表
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assetsType: null,
        content: null,
        remarks: null,
        teaPeasantId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        teaPeasantId: [
          { required: true, message: "关联茶农id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    findAllPeasant().then(res => {
      this.teaPeasantList = res.data;
    });
    this.getList();
  },
  methods: {
    /** 查询茶农资产状况列表 */
    getList() {
      this.loading = true;
      listTeaPeasantAsset(this.queryParams).then(response => {
        this.teaPeasantAssetList = response.rows;
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
        assetsType: null,
        content: null,
        remarks: null,
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
      this.title = "添加茶农资产状况";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaPeasantAsset(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶农资产状况";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaPeasantAsset(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaPeasantAsset(this.form).then(response => {
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
      this.$confirm('是否确认删除茶农资产状况编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaPeasantAsset(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶农资产状况数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaPeasantAsset(queryParams);
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
