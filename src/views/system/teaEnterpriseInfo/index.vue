<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input
          v-model="queryParams.enterpriseName"
          placeholder="请输入企业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属区域" prop="region">
        <el-select v-model="queryParams.region" filterable placeholder="请选择所属区域">
          <el-option
            v-for="dictIndex in regionOptions"
            :key="dictIndex.dictValue"
            :label="dictIndex.dictLabel"
            :value="dictIndex.dictValue" />
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
          v-hasPermi="['system:teaEnterpriseInfo:add']"
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
          v-hasPermi="['system:teaEnterpriseInfo:edit']"
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
          v-hasPermi="['system:teaEnterpriseInfo:remove']"
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
          v-hasPermi="['system:teaEnterpriseInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaEnterpriseInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="企业名称" align="center" prop="enterpriseName" />
      <el-table-column label="主体类型" align="center" prop="type" :formatter="zhutiTypeFormatter" />
      <el-table-column label="企业性质" align="center" prop="nature" />
      <el-table-column label="成立时间" align="center" prop="setUpDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.setUpDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="法人代表" align="center" prop="legalPerson" />
      <el-table-column label="法人身份证" align="center" prop="legalPersonIdCard" />
      <el-table-column label="企业经营状态" align="center" prop="operationStatus" :formatter="operationStatusFormatter" />
      <el-table-column label="注册资本" align="center" prop="regCapital" />
      <el-table-column label="企业地址" align="center" prop="address" />
<!--      <el-table-column label="企业简介" align="center" prop="about" />-->
      <el-table-column label="种植面积(亩)" align="center" prop="cultivatedArea" />
      <el-table-column label="从业人员数量" align="center" prop="workPersonNum" />
      <el-table-column label="所属区域" align="center" prop="region" />
      <!--<el-table-column label="年销量(斤)" align="center" prop="yearSales" />
      <el-table-column label="年产量(斤)" align="center" prop="yearOutput" />-->
      <el-table-column label="茶种类" align="center" prop="teaType" :formatter="teaTypeFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaEnterpriseInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaEnterpriseInfo:remove']"
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

    <!-- 添加或修改茶企基本信息对话框 -->
    <el-dialog :center="true" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input style="width: 240px" v-model="form.enterpriseName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="主体类型" prop="type">
          <el-select style="width: 240px" v-model="form.type" placeholder="请选择主体类型">
            <el-option
              v-for="dictIndex in zhutiTypeOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="dictIndex.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业性质" prop="nature">
          <el-input style="width: 240px" v-model="form.nature" placeholder="请输入企业性质" />
        </el-form-item>
        <el-form-item label="成立时间" prop="setUpDate">
          <el-date-picker style="width: 240px" clearable size="small"
            v-model="form.setUpDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择成立时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="法人代表" prop="legalPerson">
          <el-input style="width: 240px" v-model="form.legalPerson" placeholder="请输入法人代表" />
        </el-form-item>
        <el-form-item label="法人身份证" prop="legalPersonIdCard">
          <el-input style="width: 240px" v-model="form.legalPersonIdCard" placeholder="请输入法人身份证" />
        </el-form-item>
        <el-form-item label="企业经营状态">
          <el-select style="width: 240px" v-model.number="form.operationStatus" placeholder="请选择主体类型">
            <el-option
              v-for="dictIndex in operationStatusOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="parseInt(dictIndex.dictValue)" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册资本" prop="regCapital">
          <el-input style="width: 240px" v-model="form.regCapital" placeholder="请输入注册资本" />
        </el-form-item>
        <el-form-item label="企业地址" prop="address">
          <el-input style="width: 240px" v-model="form.address" placeholder="请输入企业地址" />
        </el-form-item>
        <!--<el-form-item label="企业简介" prop="about">
          <el-input v-model="form.about" placeholder="请输入企业简介" />
        </el-form-item>-->
        <el-form-item label="种植面积(亩)" prop="cultivatedArea">
          <el-input style="width: 240px" v-model="form.cultivatedArea" placeholder="请输入种植面积(亩)" >
            <template slot="append">亩</template>
          </el-input>
        </el-form-item>
        <el-form-item label="从业人员数量" prop="workPersonNum">
          <el-input style="width: 240px" v-model="form.workPersonNum" placeholder="请输入从业人员数量" />
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-select style="width: 240px" v-model="form.region" placeholder="请选择所属区域">
            <el-option
              v-for="dictIndex in regionOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="dictIndex.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="茶种类" prop="teaType">
          <el-select
            style="width: 240px"
            v-model="form.teaType"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择茶种类">
            <el-option
              v-for="item in teaTypeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number.parseInt(item.dictValue)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <treeselect
            style="width: 240px"
            v-model="form.deptId"
            :multiple="false"
            placeholder="请选择部门"
            :options="deptOptions"
          />
        </el-form-item>
        <!--<el-form-item label="年产量(斤)" prop="yearOutput">
          <el-input v-model="form.yearOutput" placeholder="请输入年产量" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTeaEnterpriseInfo, getTeaEnterpriseInfo, delTeaEnterpriseInfo, addTeaEnterpriseInfo, updateTeaEnterpriseInfo, exportTeaEnterpriseInfo } from "@/api/system/teaEnterpriseInfo";
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { treeselect } from '@/api/system/dept'
export default {
  name: "TeaEnterpriseInfo",
  components: { Treeselect },
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
      // 茶企基本信息表格数据
      teaEnterpriseInfoList: [],
      regionOptions: [], //区域选项
      zhutiTypeOptions: [], //主体类型
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseName: null,
        type: null,
        nature: null,
        setUpDate: null,
        legalPerson: null,
        legalPersonIdCard: null,
        operationStatus: null,
        regCapital: null,
        address: null,
        about: null,
        cultivatedArea: null,
        workPersonNum: null,
        yearSales: null,
        yearOutput: null,
        region: null
      },
      // 表单参数
      form: {},
      operationStatusOptions: [], //茶企经营状态字典
      teaTypeOptions: [], //茶种类选项
      deptOptions: [],
      // 表单校验
      rules: {
        region: [
          { required: true, message: "所属区域不能为空", trigger: "change" }
        ],
        deptId: [
          { required: true, message: "所属部门不能为空", trigger: "change" }
        ]
      }
    };
  },

  created() {
    this.getDicts('tea_enterprise_operation_status').then((response) => {
      this.operationStatusOptions = response.data;
    });
    this.getDicts('sys_tea_type').then((response) => {
      this.teaTypeOptions = response.data;
    });
    this.getDicts('sys_region').then((response) => {
      this.regionOptions = response.data;
    });
    this.getDicts('sys_zhuti_type').then((response) => {
      this.zhutiTypeOptions = response.data;
    });
    treeselect().then((res) => {
      this.deptOptions = res.data
    });
    this.getList();

  },
  methods: {
    /** 查询茶企基本信息列表 */
    getList() {
      this.loading = true;
      listTeaEnterpriseInfo(this.queryParams).then(response => {
        this.teaEnterpriseInfoList = response.rows;
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
        enterpriseName: null,
        type: null,
        nature: null,
        setUpDate: null,
        legalPerson: null,
        legalPersonIdCard: null,
        operationStatus: null,
        regCapital: null,
        address: null,
        cultivatedArea: null,
        workPersonNum: null,
        region: null,
        teaType: [],
        deptId: null
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
      this.title = "添加茶企基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaEnterpriseInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶企基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaEnterpriseInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaEnterpriseInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除茶企基本信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaEnterpriseInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶企基本信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaEnterpriseInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    //茶类型格式化
    teaTypeFormatter(row,column,value){
      if(!value){
        return '';
      }
      let result = '';
      value.forEach(v => {
        this.teaTypeOptions.forEach(teaType => {
          if(teaType.dictValue == v){
            if(!result){
              result += teaType.dictLabel;
            }else {
              result += ',' + teaType.dictLabel;
            }
          }
        });
      });
      return result;
    },
    //主体类型格式化
    zhutiTypeFormatter(row,column,value){
      return this.selectDictLabel(this.zhutiTypeOptions, value);
    },
    //经营状态格式化
    operationStatusFormatter(row,column,value){
      return this.selectDictLabel(this.operationStatusOptions, value);
    }
  }
};
</script>
