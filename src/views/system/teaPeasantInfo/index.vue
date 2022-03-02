<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属企业" prop="enterpriseId">
        <el-input
          v-model="queryParams.enterpriseId"
          placeholder="请输入所属企业"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="茶农姓名" prop="personName">
        <el-input
          v-model="queryParams.personName"
          placeholder="请输入茶农姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="茶农性别1=男 2=女" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择茶农性别1=男 2=女" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="茶农年龄" prop="age">
        <el-input
          v-model="queryParams.age"
          placeholder="请输入茶农年龄"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="茶农民族" prop="nation">
        <el-input
          v-model="queryParams.nation"
          placeholder="请输入茶农民族"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="政治面貌" prop="politicsStatus">
        <el-select v-model="queryParams.politicsStatus" placeholder="请选择政治面貌" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入联系方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="茶农技能" prop="skill">
        <el-input
          v-model="queryParams.skill"
          placeholder="请输入茶农技能"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="茶农职业" prop="job">
        <el-input
          v-model="queryParams.job"
          placeholder="请输入茶农职业"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="信誉等级1=极差2=中等3=良好4=优秀5=极好" prop="creditLevel">
        <el-input
          v-model="queryParams.creditLevel"
          placeholder="请输入信誉等级1=极差2=中等3=良好4=优秀5=极好"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学历1=小学2=初中3=高中4=大专5=本科6=研究生" prop="education">
        <el-input
          v-model="queryParams.education"
          placeholder="请输入学历1=小学2=初中3=高中4=大专5=本科6=研究生"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="照片" prop="pic">
        <el-input
          v-model="queryParams.pic"
          placeholder="请输入照片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家庭住址" prop="homeAddress">
        <el-input
          v-model="queryParams.homeAddress"
          placeholder="请输入家庭住址"
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
          v-hasPermi="['system:teaPeasantInfo:add']"
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
          v-hasPermi="['system:teaPeasantInfo:edit']"
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
          v-hasPermi="['system:teaPeasantInfo:remove']"
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
          v-hasPermi="['system:teaPeasantInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaPeasantInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="所属企业" align="center" prop="enterpriseId" />
      <el-table-column label="茶农姓名" align="center" prop="personName" />
      <el-table-column label="茶农性别1=男 2=女" align="center" prop="sex" />
      <el-table-column label="茶农年龄" align="center" prop="age" />
      <el-table-column label="茶农民族" align="center" prop="nation" />
      <el-table-column label="政治面貌" align="center" prop="politicsStatus" />
      <el-table-column label="联系方式" align="center" prop="mobile" />
      <el-table-column label="茶农技能" align="center" prop="skill" />
      <el-table-column label="茶农职业" align="center" prop="job" />
      <el-table-column label="信誉等级1=极差2=中等3=良好4=优秀5=极好" align="center" prop="creditLevel" />
      <el-table-column label="学历1=小学2=初中3=高中4=大专5=本科6=研究生" align="center" prop="education" />
      <el-table-column label="照片" align="center" prop="pic" />
      <el-table-column label="家庭住址" align="center" prop="homeAddress" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaPeasantInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaPeasantInfo:remove']"
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

    <!-- 添加或修改茶农基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属企业" prop="enterpriseId">
          <el-input v-model="form.enterpriseId" placeholder="请输入所属企业" />
        </el-form-item>
        <el-form-item label="茶农姓名" prop="personName">
          <el-input v-model="form.personName" placeholder="请输入茶农姓名" />
        </el-form-item>
        <el-form-item label="茶农性别1=男 2=女" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择茶农性别1=男 2=女">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="茶农年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入茶农年龄" />
        </el-form-item>
        <el-form-item label="茶农民族" prop="nation">
          <el-input v-model="form.nation" placeholder="请输入茶农民族" />
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-radio-group v-model="form.politicsStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="茶农技能" prop="skill">
          <el-input v-model="form.skill" placeholder="请输入茶农技能" />
        </el-form-item>
        <el-form-item label="茶农职业" prop="job">
          <el-input v-model="form.job" placeholder="请输入茶农职业" />
        </el-form-item>
        <el-form-item label="信誉等级1=极差2=中等3=良好4=优秀5=极好" prop="creditLevel">
          <el-input v-model="form.creditLevel" placeholder="请输入信誉等级1=极差2=中等3=良好4=优秀5=极好" />
        </el-form-item>
        <el-form-item label="学历1=小学2=初中3=高中4=大专5=本科6=研究生" prop="education">
          <el-input v-model="form.education" placeholder="请输入学历1=小学2=初中3=高中4=大专5=本科6=研究生" />
        </el-form-item>
        <el-form-item label="照片" prop="pic">
          <el-input v-model="form.pic" placeholder="请输入照片" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="homeAddress">
          <el-input v-model="form.homeAddress" placeholder="请输入家庭住址" />
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
import { listTeaPeasantInfo, getTeaPeasantInfo, delTeaPeasantInfo, addTeaPeasantInfo, updateTeaPeasantInfo, exportTeaPeasantInfo } from "@/api/system/teaPeasantInfo";

export default {
  name: "TeaPeasantInfo",
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
      // 茶农基本信息表格数据
      teaPeasantInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseId: null,
        personName: null,
        sex: null,
        age: null,
        nation: null,
        politicsStatus: null,
        mobile: null,
        skill: null,
        job: null,
        creditLevel: null,
        education: null,
        pic: null,
        homeAddress: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        enterpriseId: [
          { required: true, message: "所属企业不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询茶农基本信息列表 */
    getList() {
      this.loading = true;
      listTeaPeasantInfo(this.queryParams).then(response => {
        this.teaPeasantInfoList = response.rows;
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
        enterpriseId: null,
        personName: null,
        sex: null,
        age: null,
        nation: null,
        politicsStatus: "0",
        mobile: null,
        skill: null,
        job: null,
        creditLevel: null,
        education: null,
        pic: null,
        homeAddress: null
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
      this.title = "添加茶农基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaPeasantInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶农基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaPeasantInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaPeasantInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除茶农基本信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaPeasantInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶农基本信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaPeasantInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
