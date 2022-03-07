<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属企业" prop="enterpriseId">
        <!--<el-input
          v-model="queryParams.enterpriseId"
          placeholder="请输入所属企业"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />-->
        <el-select @keyup.enter.native="handleQuery" v-model="queryParams.enterpriseId" filterable placeholder="请选择所属企业">
          <el-option
            v-for="item in enterpriseInfoList"
            :key="item.id"
            :label="item.enterpriseName"
            :value="item.id">
          </el-option>
        </el-select>
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
      <el-table-column label="照片" align="center" prop="pic">
        <template slot-scope="scope">
          <el-avatar
            shape="square"
            :size="100"
            fit="fill"
            :src="handleOssUrl(scope.row.pic)"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="所属企业" align="center" prop="enterpriseId" :formatter="enterpriseFormatter" />
      <el-table-column label="茶农姓名" align="center" prop="personName" />
      <el-table-column label="茶农性别" align="center" prop="sex" :formatter="sexFormatter" />
      <el-table-column label="茶农年龄" align="center" prop="age" />
      <el-table-column label="茶农民族" align="center" prop="nation" />
      <el-table-column label="政治面貌" align="center" prop="politicsStatus" :formatter="politicsStatusFormatter" />
      <el-table-column label="联系方式" align="center" prop="mobile" />
      <el-table-column label="茶农技能" align="center" prop="skill" />
      <el-table-column label="茶农职业" align="center" prop="job" />
      <el-table-column label="信誉等级" align="center" prop="creditLevel" :formatter="creditLevelFormatter" />
      <el-table-column label="学历" align="center" prop="education" :formatter="educationFormatter" />
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
    <el-dialog :center="true" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属企业" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" filterable placeholder="请选择">
            <el-option
              v-for="item in enterpriseInfoList"
              :key="item.id"
              :label="item.enterpriseName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="茶农姓名" prop="personName">
          <el-input style="width: 220px" v-model="form.personName" placeholder="请输入茶农姓名" />
        </el-form-item>
        <el-form-item label="茶农性别" prop="sex">
          <el-select style="width: 220px" v-model.number="form.sex" placeholder="请选择茶农性别">
            <el-option
              v-for="dictIndex in sexOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="Number.parseInt(dictIndex.dictValue)" />
          </el-select>
        </el-form-item>
        <el-form-item label="茶农年龄" prop="age">
          <el-input-number style="width: 220px" v-model="form.age" :min="1" :max="100" label="请输入茶农年龄"></el-input-number>
        </el-form-item>
        <el-form-item label="茶农民族" prop="nation">
          <el-input style="width: 220px" v-model="form.nation" placeholder="请输入茶农民族" />
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-select style="width: 220px" v-model="form.politicsStatus" placeholder="请选择政治面貌">
            <el-option
              v-for="dictIndex in politicsStatusOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="dictIndex.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input style="width: 220px" v-model="form.mobile" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="茶农技能" prop="skill">
          <el-input style="width: 220px" v-model="form.skill" placeholder="请输入茶农技能" />
        </el-form-item>
        <el-form-item label="茶农职业" prop="job">
          <el-input style="width: 220px" v-model="form.job" placeholder="请输入茶农职业" />
        </el-form-item>
        <el-form-item label="信誉等级" prop="creditLevel">
          <el-select style="width: 220px" v-model="form.creditLevel" placeholder="请选择信誉等级">
            <el-option
              v-for="dictIndex in creditLevelOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="Number.parseInt(dictIndex.dictValue)" />
          </el-select>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-select style="width: 220px" v-model="form.education" placeholder="请选择学历">
            <el-option
              v-for="dictIndex in educationOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="Number.parseInt(dictIndex.dictValue)" />
          </el-select>
        </el-form-item>
        <el-form-item label="家庭住址" prop="homeAddress">
          <el-input style="width: 220px" v-model="form.homeAddress" placeholder="请输入家庭住址" />
        </el-form-item>
        <el-form-item label="照片" prop="pic">
<!--          <el-input style="width: 220px" v-model="form.pic" placeholder="请输入照片" />-->
          <el-upload
            action
            list-type="picture-card"
            :http-request="picUpload"
            :multiple="false"
            accept=".jpg,.png"
            :limit="1"
            :file-list="picList"
            :on-exceed="onExceed"
            :on-success="picUploadSuccess"
            :on-preview="handlePictureCardPreview"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img width="100%" :src="form.imgBase64" alt />
          </el-dialog>
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
import { listTeaEnterpriseInfoAll } from "@/api/system/teaEnterpriseInfo";
import { upload } from '@/utils/OSSUtil'

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
      sexOptions: [], //性别选项
      politicsStatusOptions: [], //政治面貌选项
      creditLevelOptions: [], //信誉等级选项
      educationOptions: [], //学历选项
      enterpriseInfoList: [], //企业列表
      picList: [], //照片列表
      dialogVisible: false,
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
    this.getDicts('sys_user_sex').then((response) => {
      this.sexOptions = response.data;
    });
    this.getDicts('sys_politics_status').then((response) => {
      this.politicsStatusOptions = response.data;
    });
    this.getDicts('tea_peasant_credit_level').then((response) => {
      this.creditLevelOptions = response.data;
    });
    this.getDicts('sys_education').then((response) => {
      this.educationOptions = response.data;
    });
    listTeaEnterpriseInfoAll().then(res => {
      this.enterpriseInfoList = res.data;
    });
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
        politicsStatus: null,
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
      const id = row.id || this.ids;
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
    },
    //照片上传
    picUpload(e) {
      let srcFileName = e.file.name
      let lastModified = e.file.lastModified;
      let fileNameArr = e.file.name.split('.');
      let suffix = fileNameArr[fileNameArr.length - 1];
      if(!suffix){
        suffix = 'jpg';
      }
      let fileName =
        'intelligent_agriculture/tea_peasant_pic/' +
        this.$md5(lastModified + '' + e.file.size + '' + srcFileName) +
        '.' + suffix;
      upload(e, fileName, this)
        .then((res) => {
          e.onSuccess(res)
        })
        .catch((err) => {
          e.onError()
        })
    },
    //文件超出上限
    onExceed(file, fileList) {
      this.$message.error('文件超出上限咯')
    },
    picUploadSuccess(response) {
      this.form.pic = response.name
    },
    handlePictureCardPreview(file){
      this.form.pic = file.url
      this.dialogVisible = true
    },
    //处理oss资源
    handleOssUrl(url){
      if (!url) {
        return
      }
      if (url.indexOf('http') !== -1) {
        return url
      } else {
        return this.$ossPre + url
      }
    },
    //性别格式化
    sexFormatter(row, column,value){
      return this.selectDictLabel(this.sexOptions, value)
    },
    //政治面貌格式化
    politicsStatusFormatter(row, column,value){
      return this.selectDictLabel(this.politicsStatusOptions, value);
    },
    //信誉等级格式化
    creditLevelFormatter(row, column,value){
      return this.selectDictLabel(this.creditLevelOptions, value);
    },
    //学历格式化
    educationFormatter(row, column,value){
      return this.selectDictLabel(this.educationOptions, value);
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
<style lang="scss" scoped>
  ::v-deep .el-avatar img {
    width: 100%;
  }
</style>
