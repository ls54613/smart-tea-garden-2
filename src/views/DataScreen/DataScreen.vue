<template>
  <div id="data-view">
    <dv-full-screen-container>
      <top-header :dept-name="enterpriseInfo.deptName" ref="topHeader" />
      <div class="main-content">
        <digital-flop :enterpriseInfo="enterpriseInfo" ref="digitalFlop" />
        <div class="nav-content">
          <div class="content-left">
            <div class="left-top">
              <div class="top-left">
                <dv-border-box-8 class="hl" backgroundColor="rgba(6, 30, 93, 0.5)">
                  <staff-num />
                </dv-border-box-8>
                <dv-border-box-8 class="hl" backgroundColor="rgba(6, 30, 93, 0.5)">
                  <visitor-num />
                </dv-border-box-8>
              </div>
              <dv-border-box-8 backgroundColor="rgba(6, 30, 93, 0.5)" class="top-right">
                <broken-line />
              </dv-border-box-8>
            </div>

            <dv-border-box-8 class="bottomid" backgroundColor="#03297D" :dur="3">
              <id-record :meetingRecordData="meetingRecordList" ref="idRecord" />
            </dv-border-box-8>
          </div>
          <div class="content-right">
            <dv-border-box-8
              style="padding:5px;margin-bottom: 5px;"
              :dur="3"
              backgroundColor="#03297D"
            >
              <firm-info :firmInfoData="firmInfoData" />
            </dv-border-box-8>
            <dv-border-box-8
              style="padding:5px;  margin-top: 5px;"
              :dur="3"
              backgroundColor="#03297D"
            >
              <aisle-info :domainData="domainData" ref="domainRecord" />
            </dv-border-box-8>
          </div>
        </div>
      </div>
    </dv-full-screen-container>

    <audio
      autoplay="autoplay"
      id="cheerMusic"
      ref="music"
      preload="auto"
      src="http://cdnn.1334.top/262.wav"
      v-if="errorFlag"
    />
  </div>
</template>

<script>
import topHeader from './DataComponents/topHeader'
import digitalFlop from './DataComponents/digitalFlop'
import staffNum from './DataComponents/staffNum'
import brokenLine from './DataComponents/brokenLine'
import visitorNum from './DataComponents/visitorNum'
import firmInfo from './DataComponents/firmInfo'
import aisleInfo from './DataComponents/aisleInfo'
import idRecord from './DataComponents/idRecord'
import Cookies from 'js-cookie'
import { getData, getPolling } from '@/api/dataScreen'
import { getToken } from '@/utils/auth'
// import '../../utils/flexible'

export default {
  name: 'Datascreen',
  components: {
    topHeader,
    digitalFlop,
    staffNum,
    brokenLine,
    visitorNum,
    firmInfo,
    aisleInfo,
    idRecord,
  },
  data() {
    return {
      socket: null,
      enterpriseInfo: {},
      StaffNum: 0,
      meetingRecordList: [],
      domainData: [],
      firmInfoData: {},
      errorFlag: false,
      num: 0,
      lockReconnect: false,
      heartbeatInterval: {},
    }
  },
  mounted() {
    this.openSocket()
    //ws心跳
    setTimeout(() => {
      this.socket.send('ping')
    }, 10000)
    getData().then((res) => {
      this.enterpriseInfo = res.data.enterpriseInfo
      this.meetingRecordList = res.data.meetingRecordList
      this.domainData = res.data.domainRecordList
      this.firmInfoData = this.enterpriseInfo
      //this.$refs.domainRecord.domainData = res.data.domainRecordList;
    })
  },
  destroyed() {
    clearInterval(this.heartbeatInterval)
    this.openSocket = function () {
      console.log('销毁socket')
    }
  },
  created() {
    // 实现轮询
    this.heartbeatInterval = window.setInterval(() => {
      setTimeout(this.getNewMessage(), 0)
    }, 30000)
  },
  methods: {
    //开启socket
    openSocket() {
      let _that = this
      //if(!('WebSocket' in window)){}
      if (typeof WebSocket == 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        console.log('您的浏览器支持WebSocket')
        let socketUrl =
          process.env.VUE_APP_WEB_SOCKET_URL +
          this.$store.getters.deptId +
          '_' +
          new Date().getTime()
        console.log(socketUrl)
        if (this.socket != null) {
          this.socket.close()
          this.socket = null
        }
        this.socket = new WebSocket(socketUrl)
        //打开事件
        this.socket.onopen = function () {
          console.log('websocket已打开')
        }
        //获得消息事件
        this.socket.onmessage = function (msg) {
          console.log(msg.data)
          if (!_that.isJSON(msg.data)) {
            return
          }
          let msgData = JSON.parse(msg.data)
          if (msgData) {
            //新识别记录
            if (msgData.type === 'newRecord') {
              if (msgData.data.credentialType == 2) {
                //员工识别
                _that.enterpriseInfo.todayPerson++
                //_that.enterpriseInfo = _that.enterpriseInfo;
                //_that.firmInfoData.todayPerson++;

                //通道
                for (let i = 0; i < _that.domainData.length; i++) {
                  if (_that.domainData[i].deviceId == msgData.data.deviceId) {
                    _that.domainData[i].todayPersonCount++
                  }
                }
              } else if (
                msgData.data.credentialType == 0 ||
                msgData.data.credentialType == 5
              ) {
                //陌生人健康码识别
                _that.enterpriseInfo.todayStranger++
                //_that.firmInfoData.todayStranger++;

                //通道
                for (let i = 0; i < _that.domainData.length; i++) {
                  if (_that.domainData[i].deviceId == msgData.data.deviceId) {
                    _that.domainData[i].todayStrangerCount++
                  }
                }
              }
              if (_that.$refs.idRecord.meetingRecordData.length >= 8) {
                //替换
                let newArr = []
                for (let i = 0; i < 7; i++) {
                  newArr.splice(i, 1, _that.$refs.idRecord.meetingRecordData[i])
                }
                newArr.unshift(msgData.data)
                // _that.$refs.idRecord.meetingRecordData.splice(
                //   _that.$refs.idRecord.meetingRecordData.length - 1,
                //   1,
                //   msgData.data
                // )
                _that.$refs.idRecord.meetingRecordData = newArr
              } else {
                //添加
                _that.$refs.idRecord.meetingRecordData.unshift(msgData.data)
              }
              setTimeout(() => {
                if (msgData.data.isTempExcept) {
                  //体温异常
                  _that.enterpriseInfo.tempExceptionCount++
                  _that.errorFlag = true
                  _that.$refs.topHeader.option.text = '警告:有体温异常人员'
                  _that.$refs.topHeader.option.background =
                    'rgba(255,156,0,0.7)'
                  _that.$refs.topHeader.openFullScreen('cheerMusic')
                }
              }, 1)
              //健康码检测
              if (msgData.data.healthCodeLevel != 1) {
                _that.errorFlag = true
                if (msgData.data.healthCodeLevel == 2) {
                  //黄码
                  _that.$refs.topHeader.option.text = '警告:有黄码人员'
                  _that.$refs.topHeader.option.background =
                    'rgba(255,156,0,0.7)'
                  _that.$refs.topHeader.openFullScreen('cheerMusic')
                } else if (msgData.data.healthCodeLevel == 3) {
                  //红码
                  _that.$refs.topHeader.option.text = '警告:有红码人员'
                  _that.$refs.topHeader.option.background =
                    'rgba(255, 0, 0, 0.7)'
                  _that.$refs.topHeader.openFullScreen('cheerMusic')
                }
              }

              /*//模拟红码
                if (msgData.data.name == '唐晓航') {
                  /!*_that.errorFlag = true;
                  //_that.handlePlay('cheerMusic');
                  _that.$notify({
                    title: '警告:有红码人员',
                    message: '请前往处理',
                    type: 'error'
                  });*!/
                  _that.$refs.topHeader.option.text = '警告:有红码人员';
                  _that.$refs.topHeader.option.background = 'rgba(255, 0, 0, 0.7)';
                  _that.$refs.topHeader.openFullScreen('cheerMusic');
                } else if (msgData.data.name == '史美亿' || msgData.data.name == '史**') {
                  _that.$refs.topHeader.option.text = '警告:有黄码人员';
                  _that.$refs.topHeader.option.background = 'rgba(255,156,0,0.7)';
                  _that.$refs.topHeader.openFullScreen('cheerMusic');
                }*/

              setTimeout(function () {
                _that.errorFlag = false
              }, 3000)
            } else if (msgData.type === 'onLineDevice') {
              //设备上线
              _that.enterpriseInfo.deviceOnlineCount++
            } else if (msgData.type === 'offLineDevice') {
              //设备下线
              _that.enterpriseInfo.deviceOnlineCount--
            }
          }
        }
        //发现消息进入    开始处理前端触发逻辑
      }
      //关闭事件
      this.socket.onclose = function () {
        console.log('websocket已关闭')
        //重连
        _that.reconnect()
      }
      //发生了错误事件
      this.socket.onerror = function (e) {
        console.log('websocket发生了错误')
        //重连
        _that.reconnect()
      }
    },

    //是否为json
    isJSON(str) {
      if (typeof str == 'string') {
        try {
          let obj = JSON.parse(str)
          if (typeof obj == 'object' && obj) {
            return true
          } else {
            return false
          }
        } catch (e) {
          return false
        }
      }
      console.log('It is not a string!')
    },
    handlePlay(id) {
      document.getElementById(id).play()
    },
    // 轮询发送请求
    getNewMessage() {
      getPolling()
        .then((res) => {})
        .catch((err) => {})
      console.log('请求' + this.num++ + '次')
    },
    //重连websocket
    reconnect() {
      let _that = this
      if (this.lockReconnect) return
      this.lockReconnect = true
      //没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
        _that.openSocket()
        _that.lockReconnect = false
      }, 3000)
    },
  },
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

.boxE {
  padding: 5px;
}

#data-view {
  width: 100%;
  height: 100%;
  color: #fff;

  #dv-full-screen-container {
    background: url(../../assets/Dscreen.png) no-repeat top center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .nav-content {
    flex: 1;
    margin-top: 10px;
    margin-bottom: 30px;
    display: flex;
    box-sizing: border-box;

    .content-left {
      flex: 2;
      margin: 0 10px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      .left-top {
        flex: 2;
        // height: 68%;
        display: flex;
        // flex-direction: column;
        margin-bottom: 10px;

        box-sizing: border-box;

        .hl:first-child {
          margin-bottom: 5px;
        }

        .top-right {
          flex: 2;
          margin-left: 20px;
          padding-bottom: 20px;
          // flex-direction: column;
        }

        .top-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
      }
    }

    .bottomid {
      padding: 5px;
      flex: 1;
      height: 100%;
      width: 151.4%;
    }
  }

  .content-right {
    flex: 1;
    height: 64.54%;
    margin-left: 5px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
  }
}
</style>
