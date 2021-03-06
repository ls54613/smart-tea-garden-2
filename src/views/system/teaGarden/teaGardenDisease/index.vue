<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联茶园" prop="teaGardenId">
        <el-select style="width: 230px" v-model="queryParams.teaGardenId" placeholder="请选择关联茶园">
          <el-option
            v-for="item in teaGardenList"
            :key="item.teaGardenId"
            :label="item.name"
            :value="item.teaGardenId"
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
          v-hasPermi="['system:teaGardenDisease:add']"
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
          v-hasPermi="['system:teaGardenDisease:edit']"
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
          v-hasPermi="['system:teaGardenDisease:remove']"
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
          v-hasPermi="['system:teaGardenDisease:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaGardenDiseaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="病虫害类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="病虫害分析值" align="center" prop="value" />
      <el-table-column label="关联茶园" align="center" prop="teaGardenId" :formatter="teaGardenFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaGardenDisease:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaGardenDisease:remove']"
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

    <!-- 添加或修改病虫害分析对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="病虫害类型" prop="type">
          <el-select style="width: 230px" v-model="form.type" placeholder="请选择病虫害类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="病虫害分析值(%)" prop="value">
          <el-input style="width: 230px" v-model="form.value" placeholder="请输入病虫害分析值">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="关联茶园" prop="teaGardenId">
          <el-select style="width: 230px" v-model="form.teaGardenId" placeholder="请选择关联茶园">
            <el-option
              v-for="item in teaGardenList"
              :key="item.teaGardenId"
              :label="item.name"
              :value="item.teaGardenId"
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
import { listTeaGardenDisease, getTeaGardenDisease, delTeaGardenDisease, addTeaGardenDisease, updateTeaGardenDisease, exportTeaGardenDisease } from "@/api/system/teaGardenDisease";
import {listAll} from '@/api/system/garden';
export default {
  name: "TeaGardenDisease",
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
      // 病虫害分析表格数据
      teaGardenDiseaseList: [],
      teaGardenList: [], //茶园列表
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 病虫害类型字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teaGardenId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "病虫害类型不能为空", trigger: "change" }
        ],
        value: [
          { required: true, message: "病虫害分析值不能为空", trigger: "blur" }
        ],
        teaGardenId: [
          { required: true, message: "关联茶园不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    listAll().then(res => {
      this.teaGardenList = res.data;
    });
    this.getList();
    this.getDicts("tea_disease").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 查询病虫害分析列表 */
    getList() {
      this.loading = true;
      listTeaGardenDisease(this.queryParams).then(response => {
        this.teaGardenDiseaseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 病虫害类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
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
        type: null,
        value: null,
        teaGardenId: null
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
      this.title = "添加病虫害分析";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaGardenDisease(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改病虫害分析";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaGardenDisease(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaGardenDisease(this.form).then(response => {
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
      this.$confirm('是否确认删除病虫害分析编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaGardenDisease(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有病虫害分析数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaGardenDisease(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    //关联茶园格式化
    teaGardenFormatter(row,column,value){
      let teaGardenName = '';
      if(value){
        this.teaGardenList.forEach(teaGarden => {
          if(teaGarden.teaGardenId == value){
            teaGardenName = teaGarden.name;
            return;
          }
        });
      }

      return teaGardenName;
    }
  }
};
</script>
