<template>
  <div class="app-container">
    <el-row>
      <!--部门数据-->
      <!--<el-col v-if="!isShow" :span="3" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>-->
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="身份证号" prop="idcardNum">
            <el-input
              v-model="queryParams.idcardNum"
              placeholder="请输入身份证号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="queryParams.mobile"
              placeholder="请输入手机号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--<el-form-item label="人像" prop="imgBase64">
            <el-input
              v-model="queryParams.imgBase64"
              placeholder="请输入人像"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>-->
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--<el-form-item label="Ic卡号" prop="icno">
            <el-input
              v-model="queryParams.icno"
              placeholder="请输入Ic卡号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>-->
          <el-form-item label="部门名称" prop="departmentId">
            <el-select
              v-model="queryParams.departmentId"
              placeholder="请选择部门名称"
              clearable
              size="small"
            >
              <el-option
                v-for="dictIndex in departmentIdOptions"
                :key="dictIndex.dictValue"
                :label="dictIndex.dictLabel"
                :value="dictIndex.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="通行区域" prop="domainId">
            <el-select v-model="queryParams.domainId" placeholder="请选择通行区域" clearable size="small">
              <!-- <el-option key="0" label="无" value="0" /> -->
              <el-option
                v-for="dict in areaList"
                :key="dict.domainId"
                :label="dict.domainName"
                :value="dict.domainId"
              />
            </el-select>
          </el-form-item>
          <!--<el-form-item label="人员类型" prop="pType">
            <el-select v-model="queryParams.pType" placeholder="请选择人员类型" clearable size="small">
              <el-option
                v-for="dict in pTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>-->
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
              v-hasPermi="['system:person:add']"
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
              v-hasPermi="['system:person:edit']"
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
              v-hasPermi="['system:person:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              v-hasPermi="['system:person:importData']"
              @click="handleImport"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="exportLoading"
              @click="handleExport"
              v-hasPermi="['system:person:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button size="mini" type="primary" @click="btnShowHidden">
              <span v-if="!isShow">隐藏</span>
              <span v-if="isShow">显示</span>结构
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="personList" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="true" />
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column
            label="身份证号"
            align="center"
            prop="idcardNum"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="手机号" align="center" prop="mobile" :show-overflow-tooltip="true" />
          <el-table-column label="人像" align="center" prop="imgBase64" width="150">
            <template slot-scope="scope">
              <el-avatar
                shape="square"
                :size="100"
                fit="fill"
                :src="handleOssUrl(scope.row.imgBase64)"
              ></el-avatar>
            </template>
          </el-table-column>
          <el-table-column
            label="人员类型"
            align="center"
            prop="identityType"
            :formatter="pTypeFormat"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="人员性别"
            align="center"
            prop="sex"
            :formatter="sexFormat"
            :show-overflow-tooltip="true"
          />
          <!--          <el-table-column label="Ic卡号" align="center" prop="icno" :show-overflow-tooltip="true"/>-->
          <el-table-column
            label="部门名称"
            align="center"
            prop="departmentId"
            :formatter="departmentIdFormat"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="通行区域"
            align="center"
            prop="domainId"
            :formatter="handleDomain"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="开始时间"
            align="center"
            prop="startTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center" prop="endTime" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-user"
                @click="handleBind(scope.row)"
              >绑定</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:person:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:person:remove']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改员工管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="人员性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择人员性别">
            <el-option
              v-for="dictItem in sexOptions"
              :key="dictItem.dictValue"
              :label="dictItem.dictLabel"
              :value="parseInt(dictItem.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcardNum">
          <el-input v-model="form.idcardNum" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="人像" prop="imgBase64">
          <el-upload
            action
            list-type="picture-card"
            :http-request="fileUpload"
            :multiple="false"
            accept=".jpg"
            :limit="1"
            :file-list="fileList"
            :before-upload="beforeUploadImg"
            :on-exceed="onExceed"
            :on-success="fileUploadSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img width="100%" :src="form.imgBase64" alt />
          </el-dialog>
        </el-form-item>
        <!--<el-form-item label="证件照" prop="licenseImage">
          <el-upload
            action=""
            list-type="picture-card"
            :http-request="licenseImageUpload"
            :multiple="false"
            accept=".jpg,.png"
            :limit="1"
            :file-list="licenseImageFileList"
            :on-exceed="onExceed"
            :on-success="licenseImageUploadSuccess"
            :on-preview="licenseImageHandlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog v-model="licenseImageDialogVisible">
            <img width="100%" :src="form.licenseImage" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            placeholder="请输入身份证上的地址"
            v-model="form.address">
          </el-input>
        </el-form-item>-->
        <!-- <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker size="small"
                          v-model="form.endTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>-->
        <!--<el-form-item label="ic卡号 " prop="icno">
          <el-input v-model="form.icno" placeholder="请输入ic卡号 "/>
        </el-form-item>-->
        <el-form-item label="部门名称" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择部门名称">
            <el-option
              v-for="index in departmentIdOptions"
              :key="index.dictValue"
              :label="index.dictLabel"
              :value="parseInt(index.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通行区域" prop="domainId">
          <div v-if="areaList.length === 0" style="border: 1px solid #D8DBE0;padding: 5px">
            <el-checkbox label="无区域" disabled size="medium"></el-checkbox>
          </div>
          <div v-else style="border: 1px solid #D8DBE0;padding: 5px">
            <el-checkbox
              v-for="(area,areaIndex) in areaList"
              :key="areaIndex"
              v-model="areaListValue"
              :label="area.domainName"
              size="medium"
            ></el-checkbox>
          </div>
        </el-form-item>
        <!--<el-form-item label="人员类型" prop="pType">
          <el-select v-model="form.pType" placeholder="请选择人员类型">
            <el-option
              v-for="dict in pTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  绑定二维码  -->
    <el-dialog :title="bindQrCodeTitle" :center="true" :visible.sync="bindQrCodeShow">
      <div class="bindQrCodeDiv">
        <div>二维码24小时后过期</div>

        <div>
          <img :src="bindQrCodeSrc" ref="qrCodeImg" id="qrCodeImg" alt />
        </div>

        <div class="copyQrCode">
          <el-button @click="downloadQrCodeImg" icon="el-icon-download" type="primary">下载二维码</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        v-loading="importLoading"
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport + '&zipPath=' + zipPath"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <div class="flex_lx" style="padding-top: 20px">
            <span style="font-size: 18px;line-height: 24px;padding-bottom: 10px">人脸图片压缩包:</span>
            <el-upload
              style="padding-top: 10px"
              action
              :file-list="zipFileList"
              :http-request="zipUpload"
              :multiple="false"
              :on-exceed="onExceed"
              accept=".zip"
              :limit="1"
              :on-success="zipUploadSuccess"
              :on-remove="handleRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
          <div slot="tip" class="el-upload__tip" style="color: red;font-size: 12px">
            只能上传zip压缩包,图片类型只能为
            <b>.jpg类型,</b>
            <b>压缩包内文件请以身份证号码命名,身份证号与excel表内填写的身份证号一致,建议在存放人脸图片的文件夹内直接全选压缩且不含中文。</b>
          </div>
          <div class="el-upload__tip" slot="tip" style="padding-top: 10px">
            <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          </div>

          <el-link
            type="primary"
            :underline="false"
            style="font-size:12px;vertical-align: baseline;"
            @click="importTemplate"
          >下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPortionPostList,
  getBuMenList,
  listPerson,
  getPerson,
  delPerson,
  addPerson,
  updatePerson,
  exportPerson,
  importTemplates,
  getPostList,
  getTxDemainList,
  generatePersonBindQrCode,
} from '@/api/system/person'
import { getToken } from '@/utils/auth'
import { treeselect } from '@/api/system/dept'
import { isExist } from '@/api/common/ossUtil'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { upload } from '@/utils/OSSUtil'

export default {
  name: 'User',
  components: { Treeselect },
  data() {
    return {
      //是否显示树结构
      isShow: false,
      // 员工管理表格数据
      personList: [],
      // 部门名称字典
      departmentIdOptions: [],
      // 人员类型 1正式 2临时 3访客字典
      pTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        idcardNum: null,
        mobile: null,
        name: null,
        startTime: null,
        endTime: null,
        icno: null,
        departmentId: null,
        domainId: null,
        pType: null,
      },

      //区域列表数组
      areaListValue: [],
      areaListId: [],
      areaList: [],
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      //通行区域字典

      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      dialogVisible: false,
      licenseImageDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label',
      },

      //父级赋给子类的类型
      parentPType: [],
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/person/importData',
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '用户名称长度必须介于 2 和 20 之间',
            trigger: 'blur',
          },
          {
            pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
            message: '只能输入汉字、字母',
            trigger: 'blur',
          },
        ],
        sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        idcardNum: [
          { required: true, message: '身份证不能为空', trigger: 'blur' },
          {
            pattern:
              /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份证',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { pattern: /^1[12345789]\d{9}$/, message: '请输入正确的手机号码' },
        ],
        imgBase64: [
          {
            required: true,
            message: '人像不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        licenseImage: [
          {
            required: true,
            message: '证件照不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        address: [
          {
            required: true,
            message: '地址不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' },
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' },
        ],
        icno: [{ required: true, message: 'icno不能为空', trigger: 'blur' }],
        departmentId: [
          { required: true, message: '部门不能为空', trigger: 'blur' },
        ],
        domainId: [
          { required: false, message: '通行区域不能为空', trigger: 'blur' },
        ],
        pType: [
          { required: true, message: '人员类型不能为空', trigger: 'blur' },
        ],
      },
      fileList: [], //上传图片列表
      licenseImageFileList: [], //上传证件照列表
      bindQrCodeShow: false, //绑定二维码弹窗
      bindQrCodeSrc: '', //绑定二维码链接
      currentRow: {}, //当前选中的行
      bindQrCodeTitle: '', //绑定二维码弹窗标题
      zipPath: '',
      zipFileList: [],
      importLoading: false,
    }
  },

  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    //请求人员类型
    getPostList().then((res) => {
      for (let row of res.rows) {
        let pTypeOptionss = {
          dictValue: null,
          dictLabel: null,
        }
        pTypeOptionss.dictValue = row.postId
        pTypeOptionss.dictLabel = row.postName
        if (this.pTypeOptions.indexOf(pTypeOptionss) == -1) {
          this.pTypeOptions.push(pTypeOptionss)
        }
      }
      this.getList()
    })

    this.getTreeselect()

    //请求区域信息
    getTxDemainList().then((res) => {
      this.areaList = res.rows
    })
    this.getDicts('sys_user_sex').then((response) => {
      this.sexOptions = response.data
    })
    //请求部门类型
    getBuMenList().then((res) => {
      this.departmentIdOptions = []
      for (let row of res.data) {
        let department = {
          dictValue: null,
          dictLabel: null,
        }
        department.dictValue = row.deptId
        department.dictLabel = row.deptName
        this.departmentIdOptions.push(department)
      }
    })
  },
  methods: {
    /** 查询人员管理列表 */
    getList() {
      this.loading = true
      listPerson(this.queryParams).then((response) => {
        let arr = []
        response.rows.forEach((item) => {
          if (arr.indexOf(item.pType) === -1) {
            arr.push(item.pType)
          }
        })
        if (this.pTypeOptions.length !== 0) {
          this.pTypeOptions.forEach((value1) => {
            arr.forEach((value2, index) => {
              if (value1.dictValue == value2) {
                arr.splice(index, 1)
              }
            })
          })
        }
        if (arr.length !== 0) {
          getPortionPostList(arr.join(',')).then((res) => {
            for (let row of res.rows) {
              let pTypeOptionss = {
                dictValue: null,
                dictLabel: null,
              }
              pTypeOptionss.dictValue = row.postId
              pTypeOptionss.dictLabel = row.postName
              if (this.pTypeOptions.indexOf(pTypeOptionss) == -1) {
                this.pTypeOptions.push(pTypeOptionss)
              }
            }
          })
        }
        this.personList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 部门名称字典翻译
    departmentIdFormat(row, column) {
      return this.selectDictLabel(this.departmentIdOptions, row.departmentId)
    },
    // 人员类型字典翻译
    pTypeFormat(row, column) {
      //return this.selectDictLabel(this.pTypeOptions, row.pType);
      return row.identityType == 1 ? '员工' : '访客'
    },
    // 人员性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex)
    },

    handleOssUrl(url) {
      if (!url) {
        return
      }
      if (url.indexOf('http') !== -1) {
        return url
      } else {
        return this.$ossPre + url
      }
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.departmentId = data.id
      this.getList()
    },

    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return changeUserStatus(row.userId, row.status)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.status = row.status === '0' ? '1' : '0'
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        staffid: null,
        idcardNum: null,
        mobile: null,
        imgBase64: null,
        name: null,
        startTime: null,
        endTime: null,
        icno: null,
        departmentId: null,
        domainId: null,
        pType: null,
        sex: null,
        licenseImage: null,
        address: null,
      }
      this.resetForm('form')
      this.fileList = []
      this.licenseImageFileList = []
      this.zipFileList = []
      this.zipPath = ''
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.dateRange = [];
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.staffid)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleResetPwd':
          this.handleResetPwd(row)
          break
        case 'handleAuthRole':
          this.handleAuthRole(row)
          break
        default:
          break
      }
    },
    /** 绑定按钮操作 */
    handleBind(row) {
      this.bindQrCodeSrc = ''
      let personId = row.staffid
      this.currentRow = row
      this.bindQrCodeTitle = '绑定二维码---' + row.name
      if (personId) {
        this.bindQrCodeShow = true
        //获取二维码
        generatePersonBindQrCode(personId).then((res) => {
          this.bindQrCodeSrc = res.data
        })
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加人员管理'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const staffid = row.staffid || this.ids
      this.areaListValue = []
      getPerson(staffid).then((response) => {
        this.form = response.data
        let split = response.data.domainId.split(',')
        this.areaList.forEach((value) => {
          if (split.indexOf(value.domainId.toString()) != -1) {
            this.areaListValue.push(value.domainName)
          }
        })
        this.open = true
        this.title = '修改人员管理'
        this.fileList.push({
          url: this.$ossPre + response.data.imgBase64,
        })
        this.licenseImageFileList.push({
          url: this.$ossPre + response.data.licenseImage,
        })
        this.file = response.data.imgBase64
      })
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      const userId = row.userId
      this.$router.push('/system/user-auth/role/' + userId)
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        //遍历areaList数组，通过areaListValue中查询areaList的domainName是否相同，有则将domainId push到areaListId中
        this.areaList.forEach((value) => {
          if (this.areaListValue.indexOf(value.domainName) !== -1) {
            this.areaListId.push(value.domainId)
          }
        })

        //若数组为零，则没有选择区域，并默认赋值为0
        if (this.areaListId.length === 0) {
          this.form.domainId = '0'
        } else {
          //将数组转为字符串
          this.areaListId.sort(function (a, b) {
            return a - b
          })
          this.form.domainId = this.areaListId.join(',')
        }
        this.areaListId = []
        setTimeout(() => {
          this.areaListValue = []
        }, 1500)

        if (valid) {
          if (this.form.staffid != null) {
            updatePerson(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPerson(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let _that = this
      let staffids = null
      if (row) {
        staffids = row.staffid
      } else {
        staffids = _that.ids
      }
      this.$confirm(
        '是否确认删除人员管理编号为"' + staffids + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          delPerson(staffids)
            .then((res) => {
              _that.getList()
              _that.msgSuccess('删除成功')
            })
            .catch((e) => {
              _that.getList()
              _that.msgError('删除失败:' + e)
            })
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有人员管理数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.exportLoading = true
          return exportPerson(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
          this.exportLoading = false
        })
        .catch(() => {})
    },

    /*
     *
     * 用户的 非人员管理
     *
     * */
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplates().then((response) => {
        this.download(response.msg)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.importLoading = false
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    handleFileError() {
      this.importLoading = false
    },
    // 提交上传文件
    submitFileForm() {
      this.importLoading = true
      this.$refs.upload.submit()
    },
    //显示隐藏树结构
    btnShowHidden() {
      this.isShow = !this.isShow
    },

    /*
     *
     * 文件上传
     * */
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    //文件超出上限
    onExceed(file, fileList) {
      this.$message.error('文件超出上限咯')
    },
    handlePictureCardPreview(file) {
      this.form.imgBase64 = file.url
      this.dialogVisible = true
    },
    licenseImageHandlePictureCardPreview(file) {
      this.form.licenseImage = file.url
      this.licenseImageDialogVisible = true
    },

    fileUploadSuccess(response) {
      this.form.imgBase64 = response.name
      //this.uploadCoverDisabled = true;
    },
    //添加人员图片上传前
    beforeUploadImg(file) {
      if (file.size / 1024 > 500) {
        this.msgError('图片不能超过500kb')
        return false
      }
    },
    //证件照上传成功
    licenseImageUploadSuccess(response) {
      this.form.licenseImage = response.name
    },
    //zip上次成功
    zipUploadSuccess(response) {
      this.zipPath = response.name
    },
    //文件上传
    fileUpload(e) {
      let srcFileName = e.file.name
      let lastModified = e.file.lastModified
      this.compressImage(e).then((res) => {
        let fileName =
          'face_image/' +
          this.$md5(lastModified + '' + e.file.size + '' + srcFileName)
        if (e.file.type === 'image/png') {
          fileName += '.png'
        } else {
          fileName += '.jpg'
        }
        upload(e, fileName, this)
          .then((res) => {
            e.onSuccess(res)
          })
          .catch((err) => {
            e.onError()
          })
      })
    },
    //证件照上传
    licenseImageUpload(e) {
      let srcFileName = e.file.name
      let lastModified = e.file.lastModified
      this.compressImage(e).then((res) => {
        let fileName =
          'license_image/' +
          this.$md5(lastModified + '' + e.file.size + '' + srcFileName)
        if (e.file.type === 'image/png') {
          fileName += '.png'
        } else {
          fileName += '.jpg'
        }
        upload(e, fileName, this)
          .then((res) => {
            e.onSuccess(res)
          })
          .catch((err) => {
            console.log(err)
            e.onError()
          })
      })
    },
    //文件上传
    zipUpload(e) {
      let srcFileName = e.file.name
      let lastModified = e.file.lastModified
      let fileName =
        'person_zip/' +
        this.$md5(lastModified + '' + e.file.size + '' + srcFileName) +
        '.zip'
      //判断是否存在
      let ossInfo = {
        objectName: fileName,
      }
      isExist(ossInfo)
        .then((res) => {
          if (res.data === true) {
            //存在
            e.onSuccess({
              name: fileName,
            })
          } else {
            upload(e, fileName, this)
              .then((res) => {
                e.onSuccess(res)
              })
              .catch((err) => {
                e.onError()
              })
          }
        })
        .catch((err) => {
          e.onError()
        })
    },
    //压缩图片(修改分辨率)
    async compressImage(elementUIFile) {
      let type = elementUIFile.file.type
      return await new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsDataURL(elementUIFile.file)
        reader.onload = function (event) {
          let img = document.createElement('img')
          img.src = event.target.result
          img.onload = function (event) {
            let canvas = document.createElement('canvas')
            canvas.setAttribute('width', '480')
            canvas.setAttribute('height', '640')
            let context = canvas.getContext('2d')
            context.drawImage(img, 0, 0, 480, 640)
            canvas.toBlob(function (blob) {
              elementUIFile.file = blob
              resolve(blob)
            }, type)
          }
        }
      })
    },
    //复制二维码
    downloadQrCodeImg(e) {
      if (this.bindQrCodeSrc) {
        let a = document.createElement('a')

        a.href = this.bindQrCodeSrc

        a.setAttribute('download', this.currentRow.name)

        a.click()
      }
    },
    handleDomain(domain) {
      let domainResult = []
      domain.domainId.split(',').forEach((domainId) => {
        let current = this.areaList.find((area) => {
          return area.domainId == domainId
        })
        if (current) {
          domainResult.push(current.domainName)
        }
      })
      return domainResult.toString()
    },
  },
}
</script>

<style scoped>
.flex_lx {
  display: flex;
  align-content: flex-start;
  justify-content: space-evenly;
  align-items: baseline;
}
::v-deep .el-avatar img {
  width: 100%;
}

.bindQrCodeDiv {
  text-align: center;
}

.copyQrCode {
  padding-top: 5vh;
}
</style>
