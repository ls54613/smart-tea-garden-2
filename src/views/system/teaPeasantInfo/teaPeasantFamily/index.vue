<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="成员姓名" prop="familyName">
        <el-input
          v-model="queryParams.familyName"
          placeholder="请输入成员姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="性别" prop="familySex">
        <el-select v-model="queryParams.familySex" placeholder="请选择性别" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系" prop="relationship">
        <el-input
          v-model="queryParams.relationship"
          placeholder="请输入关系"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="关联茶农" prop="teaPeasantId">
        <el-select v-model="queryParams.teaPeasantId" placeholder="请输入关联茶农">
          <el-option
            v-for="item in teaPeasantList"
            :key="item.id"
            :label="item.personName"
            :value="item.id">
            <!--<span style="float: left">{{ item.personName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px;height: 80px">
              <el-avatar shape="square" :size="100" fit="fill" :src="handleOssUrl(item.pic)"></el-avatar>
            </span>-->
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
          v-hasPermi="['system:teaPeasantFamily:add']"
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
          v-hasPermi="['system:teaPeasantFamily:edit']"
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
          v-hasPermi="['system:teaPeasantFamily:remove']"
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
          v-hasPermi="['system:teaPeasantFamily:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teaPeasantFamilyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="家庭成员ID" align="center" prop="id" />
      <el-table-column label="成员姓名" align="center" prop="familyName" />
      <el-table-column label="性别" align="center" prop="familySex" :formatter="sexFormatter" />
      <el-table-column label="关系" align="center" prop="relationship" />
      <el-table-column label="证件类型 " align="center" prop="cardType" :formatter="idCardTypeFormatter" />
      <el-table-column label="证件号" align="center" prop="idCard" />
      <el-table-column label="关联茶农id" align="center" prop="teaPeasantId" :formatter="peasantFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:teaPeasantFamily:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:teaPeasantFamily:remove']"
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

    <!-- 添加或修改茶农家庭成员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item  label="成员姓名" prop="familyName">
          <el-input style="width: 220px" v-model="form.familyName" placeholder="请输入成员姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="familySex">
          <el-select style="width: 220px" v-model.number="form.familySex" placeholder="请选择茶农性别">
            <el-option
              v-for="dictIndex in sexOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="Number.parseInt(dictIndex.dictValue)" />
          </el-select>
        </el-form-item>
        <el-form-item label="关系" prop="relationship">
          <el-input style="width: 220px" v-model="form.relationship" placeholder="请输入关系" />
        </el-form-item>
        <el-form-item label="证件类型" prop="cardType">
          <el-select v-model="form.cardType" placeholder="请选择证件类型">
            <el-option
              v-for="dictIndex in idCardTypeOptions"
              :key="dictIndex.dictValue"
              :label="dictIndex.dictLabel"
              :value="Number.parseInt(dictIndex.dictValue)" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="idCard">
          <el-input style="width: 220px" v-model="form.idCard" placeholder="请输入证件号" />
        </el-form-item>
        <el-form-item label="关联茶农id" prop="teaPeasantId">
          <el-select v-model="form.teaPeasantId" placeholder="请输入关联茶农">
            <el-option
              v-for="item in teaPeasantList"
              :key="item.id"
              :label="item.personName"
              :value="item.id">
              <!--<span style="float: left">{{ item.personName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;height: 80px">
                <el-avatar shape="square" :size="100" fit="fill" :src="handleOssUrl(item.pic)"></el-avatar>
              </span>-->
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
import { listTeaPeasantFamily, getTeaPeasantFamily, delTeaPeasantFamily, addTeaPeasantFamily, updateTeaPeasantFamily, exportTeaPeasantFamily } from "@/api/system/teaPeasantFamily";
import { findAllPeasant } from "@/api/system/teaPeasantInfo";
export default {
  name: "TeaPeasantFamily",
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
      // 茶农家庭成员表格数据
      teaPeasantFamilyList: [],
      sexOptions: [], //性别选项
      idCardTypeOptions: [], //证件类型
      teaPeasantList: [], //茶农列表
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        familyName: null,
        familySex: null,
        relationship: null,
        cardType: null,
        idCard: null,
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
    this.getDicts('sys_user_sex').then((response) => {
      this.sexOptions = response.data;
    });
    this.getDicts('sys_id_card_type').then((response) => {
      this.idCardTypeOptions = response.data;
    });
    findAllPeasant().then(res => {
      this.teaPeasantList = res.data;
    });
    this.getList();
  },
  methods: {
    /** 查询茶农家庭成员列表 */
    getList() {
      this.loading = true;
      listTeaPeasantFamily(this.queryParams).then(response => {
        //this.teaPeasantFamilyList.idCard=response.rows;
        // console.log(response.rows)
        this.teaPeasantFamilyList = response.rows;
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
        familyName: null,
        familySex: null,
        relationship: null,
        cardType: null,
        idCard: null,
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
      this.title = "添加茶农家庭成员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeaPeasantFamily(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改茶农家庭成员";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeaPeasantFamily(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeaPeasantFamily(this.form).then(response => {
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
      this.$confirm('是否确认删除茶农家庭成员编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeaPeasantFamily(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有茶农家庭成员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportTeaPeasantFamily(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
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
    //证件类型格式化
    idCardTypeFormatter(row, column,value){
      return this.selectDictLabel(this.idCardTypeOptions, value)
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
<style lang="scss" scoped>
  ::v-deep .el-avatar img {
    width: 100%;
  }
</style>
