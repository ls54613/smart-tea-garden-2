<template>
  <div id="idRecord">
    <div class="rtitle">
      <div>最近识别记录</div>
    </div>
    <div style="width:100%;height:100%;overflow: hidden;position:relative">
      <!-- <div class="rmain" :style="{ marginLeft: wix + 'rem' }">
        <div class="figure" v-for="item in meetingRecordData" :key="item.id">
          <img :src="handleOssUrl(item.imgBase64)" alt />
          <div>{{ item.name }}</div>
          <div class="time">{{ handleDate(item.recordTime) }}</div>
          <div class="firm" :title="handleJson(item.xs)">{{ handleJson(item.xs) }}</div>
        </div>
      </div>-->

      <div class="out-box">
        <div
          class="inner-box"
          :style="item.isTempExcept||item.healthCodeLevel>1?bgColor:''"
          v-for="item in meetingRecordlist"
          :key="item.id"
        >
          <img :src="handleOssUrl(item.imgBase64)" alt />
          <div class="text-box">
            <div class="line firstLine">
              <div>{{ item.name }}</div>
              <div>{{ credentialTypeFormatter(item.credentialType) }}</div>
              <div>{{handleXck(item.xck)}}</div>
            </div>
            <div class="line secondLine">
              <div
                :style="item.healthCodeLevel==1?codeStyleg:item.healthCodeLevel==2?codeStyley:item.healthCodeLevel==3?codeStyler:''"
              >{{ healthCodeLevelFormatter(item.healthCodeLevel) }}</div>
              <div :style="item.isTempExcept?temStyle:''">{{ item.temperature }}℃</div>
              <div>{{handleXgym(item.xgym)}}</div>
              <div>{{handleHsjc(item.hsjc)}}</div>
            </div>
            <div class="line thirdLine">
              <div class="firm" :title="handleJson(item.xs)">{{ handleJson(item.xs) }}</div>
              <div>{{ item.recordTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cards',
  props: ['meetingRecordData'],
  data() {
    return {
      cards: [
        {
          id: '1',
          url: require('../../../assets/ren1.jpg'),
          name: '张三',
          visitingType: '访客',
          journey: '暂无行程记录',
          code: '黄码',
          temperature: '36.1',
          vaccine: '已完成接种',
          nucleic: '核酸未检测',
          film: '盛开互动',
          time: '2022-01-24 19:45:35',
        },
        {
          id: '4',
          url: require('../../../assets/ren1.jpg'),
          name: '张三4',
          visitingType: '内部员工',
          journey: '暂无行程记录',
          code: '绿码',
          temperature: '36.2',
          vaccine: '已完成接种',
          nucleic: '核酸未检测',
          film: '盛开互动',
          time: '2022-01-24 19:45:35',
        },
        {
          id: '5',
          url: require('../../../assets/ren1.jpg'),
          name: '张三5',
          visitingType: '访客',
          journey: '暂无行程记录',
          code: '绿码',
          temperature: '36.5',
          vaccine: '已完成接种',
          nucleic: '核酸未检测',
          film: '盛开互动',
          time: '2022-01-24 19:45:35',
        },
        {
          id: '1',
          url: require('../../../assets/ren1.jpg'),
          name: '张三',
          visitingType: '访客',
          journey: '暂无行程记录',
          code: '绿码',
          temperature: '36.3',
          vaccine: '已完成接种',
          nucleic: '核酸未检测',
          film: '盛开互动',
          time: '2022-01-24 19:45:35',
        },
        {
          id: '2',
          url: require('../../../assets/ren1.jpg'),
          name: '张三2',
          visitingType: '访客',
          journey: '暂无行程记录',
          code: '红码',
          temperature: '36.4',
          vaccine: '已完成接种',
          nucleic: '核酸未检测',
          film: '盛开互动',
          time: '2022-01-24 19:45:35',
        },
        {
          id: '3',
          url: require('../../../assets/ren1.jpg'),
          name: '张三3',
          visitingType: '访客',
          journey: '暂无行程记录',
          code: '绿码',
          temperature: '36.1',
          vaccine: '已完成接种',
          nucleic: '核酸未检测',
          film: '盛开互动',
          time: '2022-01-24 19:45:35',
        },
      ],

      newMeetingRecordData: [],
      bgColor: { backgroundColor: '#9e1a3e' },
      temStyle: { color: 'red' },
      codeStyleg: { color: 'rgb(78, 230, 78)' },
      codeStyley: { color: 'yellow' },
      codeStyler: { color: 'rgb(226, 31, 31)' },
      currentDate: new Date(),
      wix: 0,
      time: null, //用来清除定时器
      j: 0,
    }
  },
  computed: {
    meetingRecordlist: function () {
      return this.meetingRecordData
    },
  },
  created() {
    //console.log(meetingRecordlist)
  },
  mounted() {
    // setTimeout(() => {
    //   let borders = document.querySelectorAll('.figure')
    //   for (let i = 0; i < borders.length; i++) {
    //     if (this.meetingRecordData[i].isTempExcept) {
    //       borders[i].style.border = 1 + 'px red solid'
    //     }
    //   }
    // }, 500)
  },
  methods: {
    createData() {},
    moveImg(flag) {},
    handleOssUrl(url) {
      return this.$ossPre + url
    },
    credentialTypeFormatter(type) {
      if (type == 0) {
        return '健康码'
      } else if (type == 2) {
        return '白名单'
      } else if (type == 5) {
        return '身份证'
      }
    },
    healthCodeLevelFormatter(code) {
      if (code == 1) {
        return '绿码'
      } else if (code == 2) {
        return '黄码'
      } else if (code == 3) {
        return '红码'
      }
    },
    /**************************************时间格式化处理************************************/
    dateFormat(fmt, date) {
      //author: meizz
      let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      }
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
      return fmt
    },
    handleDate(dateStr) {
      return this.dateFormat('hh:mm:ss', new Date(dateStr))
    },
    handleJson(jsonStr) {
      if (this.isJSON(jsonStr)) {
        return JSON.parse(jsonStr).domainName
      } else {
        return ''
      }
    },
    //处理行程卡
    handleXck(value){
      //行程卡结果 9 不播报 1 行程卡低风险 2 行程卡高风险 3 无行程记录 4 行程卡未查询
      if(!value){
        return '无行程记录';
      }
      if(value == 1){
        return '行程低风险';
      }else if(value == 2){
        return '行程高风险';
      }else if(value == 3){
        return '无行程记录';
      }else if(value == 4){
        return '行程未查询';
      }else if(value == 9){
        return '无行程记录';
      }
    },
    //新冠疫苗
    handleXgym(value){
      //新冠疫苗 9 不播放 1 未接种疫苗 2 疫苗接种未完成 3 疫苗接种已完成 -1 未查询到
      if(!value){
        return '未接种疫苗';
      }
      if(value == 1){
        return '未接种疫苗';
      }else if(value == 2){
        return '疫苗接种未完成';
      }else if(value == 3){
        return '疫苗已接种';
      }else if(value == -1){
        return '未接种疫苗';
      }
    },
    //核酸检测
    handleHsjc(value){
      //核酸检测 1未做核酸 2 核酸检测阴性 3 核酸检测阳性 4 已采样 9 不播放
      if(!value){
        return '核酸未检测';
      }
      if(value == 2){
        return '核酸检测阴性';
      }else if(value == 3){
        return '核酸检测阳性';
      }else if(value == 4){
        return '核酸已采样';
      }
      return '核酸未检测';
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
  },
  watch: {
    meetingRecordData: {
      deep: true,
      handler: function (newV, oldV) {
        console.log(newV)
      },
    },
    // meetingRecordData: function (newValue, oldValue) {
    //   let i = 0.86
    //   clearInterval(this.time)
    //   if (this.meetingRecordData.length > 10) {
    //     this.time = setInterval(() => {
    //       this.j += 0.01
    //       this.wix += -0.01
    //       if (this.j.toFixed(2) == i) {
    //         this.wix = 0
    //         this.j = 0
    //         this.meetingRecordData.shift()
    //         clearInterval(this.time)
    //       }
    //     })
    //   }
    // console.log(newValue)
    // if (newValue.length > 6) {
    //   for (let i = 0; i < 6; i++) {
    //     this.newMeetingRecordData.push(newValue[i])
    //   }
    //   console.log(this.newMeetingRecordData)
    // }
    // },
  },
}
</script>

<style lang="scss" scoped>
%firstLine-div {
  background-color: #1981f6;
  border-radius: 8px;
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
}
#idRecord {
  width: 100%;
  height: 100%;
  // flex: 1;
  // background: rgba(6, 30, 93, 0.5);
  display: flex;
  flex-direction: column;
  padding: 5px;
  .rtitle {
    // width: 100%;
    position: relative;
    font-size: 0.14rem;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    padding-bottom: 5px;
    border-bottom: 2px solid rgba($color: #fff, $alpha: 0.3);
  }
  // .rmain {
  //   position: absolute;
  //   // top: 1.22rem;
  //   // left: 50%;
  //   // transform: translate(-50%,-50%);
  //   height: auto;
  //   width: 9rem;
  //   margin: 0 auto;
  //   display: flex;
  //   padding: 10px;
  //   // flex-wrap: wrap;
  //   text-align: center;
  //   .figure {
  //     width: 0.8rem;
  //     height: 100%;
  //     display: flex;
  //     flex-direction: column;
  //     // height: auto;
  //     margin-right: 10px;
  //     margin-top: 0px;

  //     img {
  //       width: 0.78rem;
  //       height: 0.78rem;
  //       margin: 0 auto;
  //     }

  //     .time {
  //       font-size: 0.12rem;
  //     }

  //     .firm {
  //       font-size: 0.12rem;
  //       overflow: hidden;
  //       text-overflow: ellipsis;
  //       white-space: nowrap;
  //     }
  //   }
  // }
  //----------
  .out-box {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    // flex-direction: row-reverse;
    // justify-content: space-between;
    align-items: flex-end;
    left: 50%;
    transform: translate(-50%, 0);

    // margin: 2px;
    .inner-box {
      display: flex;
      width: 24.8%;
      height: 47%;
      padding: 5px;
      margin-left: 1.5px;
      margin-right: 1.5px;
      border-radius: 3px;
      background-color: #04246e;
      // background-color: aquamarine;
      img {
        // width: 0.78rem;
        width: 20%;
        height: 98%;
        border-radius: 50%;
      }
      .text-box {
        width: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .line {
          display: flex;
          justify-content: space-around;
        }
        .firstLine {
          div:nth-child(2) {
            @extend %firstLine-div;
          }
          div:nth-child(3) {
            @extend %firstLine-div;
          }
        }
        .secondLine {
        }
        .thirdLine {
        }
      }
    }
  }
}
</style>
