<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <!-- <el-badge :value="12" class="badgeitem">
        <el-button
          icon="el-icon-message-solid"
          type="danger"
          class="right-menu-badge"
          circle
          @click="badge=true"
        ></el-button>
      </el-badge>-->
      <template v-if="device!=='mobile'">
        <!--<div class="right-menu-item hover-effect" @click="messageOpen = true">
          <i class="el-icon-bell">
            <el-badge v-if="unreadNoticeCount && unreadNoticeCount > 0" :max="99" :value="unreadNoticeCount" class="badgeItem">

            </el-badge>
          </i>
        </div>-->


        <search id="header-search" class="right-menu-item" />

        <!--<el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>-->

        <!--<el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip>-->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--异常消息对话框-->
    <el-dialog title="提示" :visible.sync="badge" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="badge = false">取 消</el-button>
        <el-button type="primary" @click="badge = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer
      title="消息中心"
      :visible.sync="messageOpen"
      direction="rtl"
      size="30%">
      <el-tabs type="border-card" style="height: 100%" @tab-click="tabClick">
        <el-tab-pane label="未读" style="padding-bottom: 10px">
          <el-empty description="暂无消息" v-if="!unreadNoticeCount || unreadNoticeCount < 1"></el-empty>
          <div style="color: #1890ff;text-align: end;padding-bottom: 5px" v-if="unreadNoticeCount && unreadNoticeCount > 0">全部标记为已读</div>
            <el-card class="box-card" v-for="(item,index) in noticeListFilter(0)" :key="item.id" style="margin-top: 5px;margin-bottom: 5px;">
              <div slot="header" class="clearfix">
                <span>{{item.name}}</span>
                <el-button style="float: right; padding: 3px 0" type="text">标记为已读</el-button>
              </div>
              <div class="text item">
                {{item.message}}
              </div>
            </el-card>

        </el-tab-pane>
        <el-tab-pane label="已读">
          <el-empty description="暂无消息" v-if="!readNoticeCount || readNoticeCount < 1"></el-empty>

          <el-card class="box-card" v-for="(item,index) in noticeListFilter(1)" :key="item.id" style="margin-top: 5px;margin-bottom: 5px;">
            <div slot="header" class="clearfix">
              <span>{{item.name}}</span>
<!--              <el-button style="float: right; padding: 3px 0" type="text">标记为已读</el-button>-->
            </div>
            <div class="text item">
              {{item.message}}
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="全部">
          <el-empty description="暂无消息" v-if="!noticeList || noticeList.length < 1"></el-empty>

          <el-card class="box-card" v-for="(item,index) in noticeListFilter()" :key="item.id" style="margin-top: 5px;margin-bottom: 5px;">
            <div slot="header" class="clearfix">
              <span>{{item.name}}</span>
              <!--              <el-button style="float: right; padding: 3px 0" type="text">标记为已读</el-button>-->
            </div>
            <div class="text item">
              {{item.message}}
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val,
        })
      },
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      },
    },
  },
  data() {
    return {
      badge: false,
      messageOpen: false,
      noticeList: [],
      unreadNoticeCount: 0,
      readNoticeCount: 0
    }
  },
  created() {
    this.noticeList = [
      {name: '导入人员失败',id: 1,message: '导入人员 小明 失败,原因:区域大门的设备不在线',type: 0},
      {name: '导入人员失败',id: 2,message: '导入人员 小明 失败,原因:区域大门的设备不在线',type: 0},
      {name: '导入人员失败',id: 3,message: '导入人员 小明 失败,原因:区域大门的设备不在线',type: 0},
      {name: '导入人员失败',id: 4,message: '导入人员 小明 失败,原因:区域大门的设备不在线',type: 0},
      {name: '导入人员失败',id: 5,message: '导入人员 小明 失败,原因:区域大门的设备不在线',type: 0},
      {name: '导入人员失败',id: 6,message: '导入人员 小明 失败,原因:区域大门的设备不在线',type: 1}
    ];
    this.unreadNoticeCount = this.noticeList.filter(notice => notice.type == 0).length;
    this.readNoticeCount = this.noticeList.filter(notice => notice.type == 1).length;
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index'
          })
        })
        .catch(() => {})
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    tabClick(e){
      console.log(e)
    },
    noticeListFilter(type){
      if(type == 0){
        //未读
        return this.noticeList.filter(notice => notice.type == 0);
      }else if(type == 1){
        //已读
        return this.noticeList.filter(notice => notice.type == 1);
      }else {
        //全部
        return this.noticeList;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    ::v-deep .badgeItem sup{
      margin-bottom: 20px;
      margin-left: -35px;
    }

    ::v-deep .badgeitem {
      // position: absolute;
      margin-bottom: 10px;
      // right: 40px;
      .is-fixed {
        right: 50px;
      }
    }
    .right-menu-badge {
      display: inline-block;
      padding: 0 8px;
      margin-bottom: 10px;
      height: 65%;
      line-height: 30px;
      font-size: 15px;
      color: rgb(255, 255, 255);
      vertical-align: text-bottom;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
