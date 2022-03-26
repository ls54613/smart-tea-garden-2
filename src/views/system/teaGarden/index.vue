<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联茶企" prop="teaEnterpriseId">
        <el-select @keyup.enter.native="handleQuery" v-model="queryParams.teaEnterpriseId" filterable placeholder="请选择关联茶企">
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
          v-hasPermi="['system:garden:add']"
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
          v-hasPermi="['system:garden:edit']"
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
          v-hasPermi="['system:garden:remove']"
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
          v-hasPermi="['system:garden:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gardenList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="茶园id" align="center" prop="teaGardenId" />
      <el-table-column label="关联茶企" align="center" prop="teaEnterpriseId" :formatter="enterpriseFormatter" />
      <el-table-column label="茶园名称" align="center" prop="name" />
      <el-table-column label="茶园面积" align="center" prop="teaArea" />
      <el-table-column label="茶树品种" align="center" prop="teaTreeVarietyName" />
      <el-table-column label="从业人数" align="center" prop="employNum" />
      <el-table-column label="设施数量" align="center" prop="facilitiesNum" />
      <el-table-column label="年均产量" align="center" prop="averageYield" />
      <el-table-column label="预计总产量" align="center" prop="totalProduction" />
      <el-table-column label="茶园类型" align="center" prop="teaTypeName" />
      <el-table-column label="负责人" align="center" prop="head" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleType(scope.row)"
            v-hasPermi="['system:garden:edit']"
          >种植品种</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:garden:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:garden:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :center="true" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="关联茶企" prop="teaEnterpriseId">
          <el-select v-model="form.teaEnterpriseId" filterable placeholder="请选择关联茶企">
            <el-option
              v-for="item in enterpriseInfoList"
              :key="item.id"
              :label="item.enterpriseName"
              :value="parseInt(item.id)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="茶园名称" prop="name">
          <el-input style="width: 220px" v-model="form.name" placeholder="请输入茶园名称" />
        </el-form-item>
        <el-form-item label="茶园面积" prop="teaArea">
          <el-input style="width: 220px" v-model="form.teaArea" placeholder="请输入茶园面积" />
        </el-form-item>
        <el-form-item label="茶树品种" prop="teaTreeVariety">
          <el-select style="width: 220px" v-model="form.teaTreeVariety" placeholder="请选择茶树品种">
            <el-option
              v-for="dictIndex in operationStatusVariety"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="parseInt(dictIndex.dictValue)"
             />
          </el-select>
        </el-form-item>
        <el-form-item label="从业人数" prop="employNum">
          <el-input style="width: 220px" v-model="form.employNum" placeholder="请输入从业人数" />
        </el-form-item>
        <el-form-item label="设施数量" prop="facilitiesNum">
          <el-input style="width: 220px" v-model="form.facilitiesNum" placeholder="请输入设施数量" />
        </el-form-item>
        <el-form-item label="年均产量" prop="averageYield">
          <el-input style="width: 220px" v-model="form.averageYield" placeholder="请输入年均产量" />
        </el-form-item>
        <el-form-item label="预计总产量" prop="totalProduction"      >
          <el-input style="width: 220px" v-model="form.totalProduction" placeholder="请输入预计总产量" />
        </el-form-item>
        <el-form-item label="茶园类型" prop="teaType">
          <el-select style="width: 220px" v-model="form.teaType" placeholder="请选择茶园类型">
            <el-option
              v-for="dictIndex in operationStatusEnterprise"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="parseInt(dictIndex.dictValue)"
             />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="head">
          <el-input style="width: 220px" v-model="form.head" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-select style="width: 240px" v-model="form.region" placeholder="请选择所属区域">
            <el-option
              v-for="dictIndex in regionOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="parseInt(dictIndex.dictValue)" />
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
import { listGarden, getGarden, delGarden, addGarden, updateGarden, exportGarden, listTeaGarden } from "@/api/system/garden";
import {listTeaEnterpriseInfoAll} from '@/api/system/teaEnterpriseInfo';
export default {
  name: "Garden",
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
      // 茶园基本信息表格数据
      gardenList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        teaArea: null,
        teaTreeVariety: null,
        employNum: null,
        facilitiesNum: null,
        averageYield: null,
        totalProduction: null,
        teaType: null,
        head: null,
        teaEnterpriseId: null
      },
      // 表单参数
      form: {},
      operationStatusVariety: [],//茶树品种状态字典
      operationStatusEnterprise: [],//茶园类型数据字典
      regionOptions: [], //区域选项
      enterpriseInfoList: [], //茶企列表
      // 表单校验
      rules: {
        teaEnterpriseId: [
          { required: true, message: "关联茶园不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "茶园名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getDicts('sys_tea_type').then((response) => {
      this.operationStatusVariety = response.data;
    });
    this.getDicts('sys_enterprise_type').then((response) => {
      this.operationStatusEnterprise = response.data;
    });
    this.getDicts('sys_region').then((response) => {
      this.regionOptions = response.data;
    });
    listTeaEnterpriseInfoAll().then(res => {
      this.enterpriseInfoList = res.data;
    });
    this.getList();

  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listTeaGarden(this.queryParams).then(response => {
        this.gardenList = response.rows;
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
        teaGardenId: null,
        name: null,
        teaArea: null,
        teaTreeVariety: null,
        employNum: null,
        facilitiesNum: null,
        averageYield: null,
        totalProduction: null,
        teaType: null,
        head: null,
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
      this.ids = selection.map(item => item.teaGardenId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加茶园基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const teaGardenId = row.teaGardenId || this.ids
      getGarden(teaGardenId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶园基本信息";
      });
    },
    //跳转到种植品种
    handleType(row){
      this.$router.push({
        path: 'teaGardenTeaType',
        query: {
          id: row.teaGardenId
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.teaGardenId != null) {
            updateGarden(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGarden(this.form).then(response => {
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
      const teaGardenIds = row.teaGardenId || this.ids;
      this.$confirm('是否确认删除茶园基本信息编号为"' + teaGardenIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGarden(teaGardenIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶园基本信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportGarden(queryParams);
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
