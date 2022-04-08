<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <!--<el-form-item label="关联茶园" prop="teaGardenId">
        <el-input
          v-model="queryParams.teaGardenId"
          placeholder="请输入关联茶园"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="茶种类" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择茶种类" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['system:teaGardenTeaType:add']"
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
          v-hasPermi="['system:teaGardenTeaType:edit']"
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
          v-hasPermi="['system:teaGardenTeaType:remove']"
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
          v-hasPermi="['system:teaGardenTeaType:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaGardenTeaTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="关联茶园" align="center" prop="teaGardenId" :formatter="teaGardenFormatter" />
      <el-table-column label="茶种类" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="占比(%)" align="center" prop="proportion" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaGardenTeaType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaGardenTeaType:remove']"
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

    <!-- 添加或修改茶园种植种类占比对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联茶园" prop="teaGardenId">
<!--          <el-form :model="form.teaGardenId">-->
<!--            <el-form-item v-for="item in teaGardenList" :key="'teaGarden_' + item.teaGardenId">-->
<!--              <el-input :value="item.name" disabled></el-input>-->
<!--            </el-form-item>-->
<!--          </el-form>-->

          <el-select disabled v-model="form.teaGardenId" placeholder="请选择关联茶园">
            <el-option
              v-for="item in teaGardenList"
              :key="'teaGarden_' + item.teaGardenId"
              :label="item.name"
              :value="item.teaGardenId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="茶种类" prop="type">
          <el-select v-model="form.type" placeholder="请选择茶种类">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="占比(%)" prop="proportion">
          <el-input v-model="form.proportion" type="number" style="width: 216px" placeholder="请输入占比(%)" />
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
import { listTeaGardenTeaType, getTeaGardenTeaType, delTeaGardenTeaType, addTeaGardenTeaType, updateTeaGardenTeaType, exportTeaGardenTeaType } from "@/api/system/teaGardenTeaType";
import { listAll } from "@/api/system/garden";
export default {
  name: "TeaGardenTeaType",
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
      // 茶园种植种类占比表格数据
      teaGardenTeaTypeList: [],
      teaGardenList: [], //茶园列表
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 茶种类字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teaGardenId: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        teaGardenId: [
          { required: true, message: "关联茶园不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "茶种类不能为空", trigger: "change" }
        ],
        proportion: [
          { required: true, message: "占比(%)不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    let id = this.$route.query.id;
    if(id){
      this.queryParams.teaGardenId = id;
      this.form.teaGardenId = id;
      this.getList();
      listAll().then(res => {
        this.teaGardenList = res.data;
      });
      this.getDicts("sys_tea_type").then(response => {
        this.typeOptions = response.data;
      });
    }
  },
  methods: {
    /** 查询茶园种植种类占比列表 */
    getList() {
      this.loading = true;
      listTeaGardenTeaType(this.queryParams).then(response => {
        this.teaGardenTeaTypeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 茶种类字典翻译
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
      console.log(this.form)
      this.form = {
        id: null,
        teaGardenId: null,
        type: null,
        proportion: null
      };
      this.resetForm("form");
      let id = this.$route.query.id;
      if(id){
        this.queryParams.teaGardenId = parseInt(id);
        this.form.teaGardenId = parseInt(id);
      }
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
      // console.log(this.teaGardenList)
      this.open = true;
      this.title = "添加茶园种植种类占比";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaGardenTeaType(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶园种植种类占比";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaGardenTeaType(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaGardenTeaType(this.form).then(response => {
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
      this.$confirm('是否确认删除茶园种植种类占比编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaGardenTeaType(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶园种植种类占比数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaGardenTeaType(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    //关联茶园格式化
    teaGardenFormatter(row,col,value){
      let teaGardenName = '';
      if(value){
        this.teaGardenList.forEach(item => {
          if(item.teaGardenId == value){
            teaGardenName = item.name;
            return;
          }
        })
      }
      return teaGardenName;
    }
  }
};
</script>
