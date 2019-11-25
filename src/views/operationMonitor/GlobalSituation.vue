<!-- 综合运行监控首页 -->
<template>
  <div class="operation-monitor">
    <img class="back-home" :src="require('@img/icon/icon_back_home.png')" @click="$router.push('/home')" />

    <div class="app">
      <!-- 上方有底色的图片区域。显示已装机等信息 -->
      <div class="total-info-box">
        <div class="space-aside"></div>
        <!-- 顶部的数字 -->
        <div class="total-amount-box">
          <div class="total-amount">
            <div class="label">已装机总数</div>
            <div class="number-list">
              <div class="number">{{loadAcftTotalNum[0]}}</div>
              <div class="number">{{loadAcftTotalNum[1]}}</div>
              <div class="number">{{loadAcftTotalNum[2]}}</div>
              <div class="number">{{loadAcftTotalNum[3]}}</div>
              <div class="number">{{loadAcftTotalNum[4]}}</div>
            </div>
          </div>
        </div>
        <div class="space-inner"></div>
        <div class="total-amount-box">
          <div class="total-amount">
            <div class="label">已卸机总数</div>
            <div class="number-list">
              <div class="number">{{unloadAcftNum[0]}}</div>
              <div class="number">{{unloadAcftNum[1]}}</div>
              <div class="number">{{unloadAcftNum[2]}}</div>
              <div class="number">{{unloadAcftNum[3]}}</div>
              <div class="number">{{unloadAcftNum[4]}}</div>
            </div>
          </div>
        </div>
        <div class="space-inner"></div>
        <div class="total-amount-box">
          <div class="total-amount">
            <div class="label">已中转总数</div>
            <div class="number-list">
              <div class="number">{{tsfNum[0]}}</div>
              <div class="number">{{tsfNum[1]}}</div>
              <div class="number">{{tsfNum[2]}}</div>
              <div class="number">{{tsfNum[3]}}</div>
              <div class="number">{{tsfNum[4]}}</div>
            </div>
          </div>
        </div>
        <div class="space-inner"></div>
        <div class="total-amount-box">
          <div class="total-amount">
            <div class="label">异常报警总数</div>
            <div class="number-list">
              <div class="number warning">{{warningNum[0]}}</div>
              <div class="number warning">{{warningNum[1]}}</div>
              <div class="number warning">{{warningNum[2]}}</div>
              <div class="number warning">{{warningNum[3]}}</div>
              <div class="number warning">{{warningNum[4]}}</div>
            </div>
          </div>
        </div>
        <div class="space-aside"></div>
      </div>

      <div class="airport-info-box">
        <div class="space-aside"></div>
        <a class="airport-box" :href="mapT1">
          <AirportInfo :airport-type="'T1'" :resourceData="resourceDataT1" v-if="resourceDataT1.counter"/>
          <AirportInfo :airport-type="'T1'" :resourceData="resourceDefault" v-else/>
        </a>
        <div class="space-inner"></div>
        <a class="airport-box" :href="mapT2">
          <AirportInfo :airport-type="'T2'" :resourceData="resourceDataT2" v-if="resourceDataT2.counter"/>
          <AirportInfo :airport-type="'T2'" :resourceData="resourceDefault" v-else/>
        </a>
        <div class="space-inner"></div>
        <a class="airport-box" :href="mapT3">
          <AirportInfo :airport-type="'T3'" :resourceData="resourceDataT3" v-if="resourceDataT3.counter"/>
          <AirportInfo :airport-type="'T3'" :resourceData="resourceDefault" v-else/>
        </a>
        <div class="space-inner"></div>
        <a class="airport-box" :href="mapInterT3">
          <AirportInfo :airport-type="'T3 international'" :resourceData="resourceDataInterT3" v-if="resourceDataInterT3.counter"/>
          <AirportInfo :airport-type="'T3 international'" :resourceData="resourceDefault" v-else/>
        </a>
        <div class="space-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import AirportInfo from "./componentsAndMixmin/AirportInfo.vue"
import { queryAllGet } from '@/util/base'
import { setInterval, clearInterval } from 'timers'

export default {
  components: {
    AirportInfo
  },
  data() {
    return {
      // 四个航站楼的跳转路径
      mapT1: '',
      mapT2: '',
      mapT3: '',
      mapInterT3: '',
      mainQueryUrl: 'runMonitor/mainQuery',//首页统计接口
      resourceDefault: { // 航站楼统计数据默认值
        "prevLoadAcftNum":0, // 前站装机数
        "unloadAcftNum":0, // 卸机数
        "unloadTruckNum":0, // 卸车数
        "tsfANum":0, // 进港中转数
        "tsfDNum":0, // 出港中转数
        "warningNum":0, // 行李告警数
        "checkinNum":0, // 已交运数
        "nosortingNum":0, // 未分拣
        "sortingTotalNum":0, // 应分拣
        "loadAcftNum":0, // 装机数
        "noloadAcftNum":0, // 未装机数
        "loadAcftTotalNum":0, //应装机数
        "counter":{"resourceType":"COUNTER","usedNum":0,"freeNum":0,"unavailNum":0}, //值机柜台在用，未用，不可用
        "chute":{"resourceType":"CHUTE","usedNum":0,"freeNum":0,"unavailNum":0}, //滑槽在用，未用，不可用
        "belt":{"resourceType":"BELT","usedNum":0,"freeNum":0,"unavailNum":0} // 转盘在用，未用，不可用
      },
      // 四个航站楼从后台请求的数据变量，数据格式和默认数据格式一致
      resourceDataT1: {},
      resourceDataT2: {},
      resourceDataT3: {},
      resourceDataInterT3: {},
      //顶端四个总统计数（已装机数，已卸机数，中转行李总数（出港之和），异常告警总数）
      loadAcftTotalNum: "00000",
      unloadAcftNum: "00000",
      tsfNum: "00000",
      warningNum: "00000",
      resourceInterval: null
    }
  },
  created() {
    this.mapT1 = window.location.origin + '/#/mapT1'
    this.mapT2 = window.location.origin + '/#/mapT2'
    this.mapT3 = window.location.origin + '/#/mapT3'
    this.mapInterT3 = window.location.origin + '/#/mapInterT3'
    this.queryResourceDatas() // 获取统计接口数据

    if (this.resourceInterval) {
      clearInterval(this.resourceInterval)
    } else {
      this.resourceInterval = setInterval(() => { // 每隔60s刷新所有统计数据
      this.queryResourceDatas()
    },60000)
    }
  },
  destroyed () {
    if(this.resourceInterval) {
      clearInterval(this.resourceInterval)
    }
  },
  methods: {
    queryResourceDatas() { // 获取统计接口数据
      queryAllGet(this.mainQueryUrl).then(response => {
        if (response.data.code == 0) {
          let responseData = response.data.data
          this.loadAcftTotalNum = 0
          this.unloadAcftNum = 0
          this.tsfNum = 0
          this.warningNum = 0
          for (var r = 0; r < responseData.length; r++) {
            // 四个航站楼总数求和（已装机数，已卸机数，中转行李总数（出港之和），异常告警总数）
            let singleLoadAcftNum = responseData[r].loadAcftTotalNum - responseData[r].noloadAcftNum
            this.loadAcftTotalNum += singleLoadAcftNum
            this.unloadAcftNum += responseData[r].unloadAcftNum
            this.tsfNum += responseData[r].tsfDNum
            this.warningNum += responseData[r].warningNum
            // 获取每个航站楼的统计数据
            if (responseData[r].terminal == "T1") {
              this.resourceDataT1 = responseData[r]
            }
            if (responseData[r].terminal == "T2") {
              this.resourceDataT2 = responseData[r]
            }
            if (responseData[r].terminal == "T3") {
              this.resourceDataT3 = responseData[r]
            }
            if (responseData[r].terminal == "T3国际") {
              this.resourceDataInterT3 = responseData[r]
            }
          }

          this.loadAcftTotalNum = this.getCount(this.loadAcftTotalNum)
          this.unloadAcftNum = this.getCount(this.unloadAcftNum)
          this.tsfNum = this.getCount(this.tsfNum)
          this.warningNum = this.getCount(this.warningNum)
        } else {
          //无数据的情况
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !',
          tip: err
        })
      })
    },
    getCount(param) { // 处理首页四个总数，按照默认五位字符串去处理，数字不足五位时，往前拼0
      let totalNumber = param + ''
      let length = totalNumber.length
      switch (length) {
        case 0: totalNumber = "00000"
          break
        case 1: totalNumber = "0000" + totalNumber
          break
        case 2: totalNumber = "000" + totalNumber
          break
        case 3: totalNumber = "00" + totalNumber
          break
        case 4: totalNumber = "0" + totalNumber
          break
      }
      return totalNumber
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-monitor {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url(~@img/gis/bg_dark_blue.jpg);
  background-size: 100% 100%;

  .back-home {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    cursor: pointer;
    z-index: 10;
  }

  .app {
    position: absolute;
    width: 100%;
    min-width: 1980px;
    height: 1014px;
    top: 50%;
    transform: translateY(-50%);

    .total-info-box {
      position: absolute;
      top: 40px;
      display: flex;
      height: 46px;
      width: 100%;

      .total-amount-box {
        position: relative;
        display: inline-block;
        width: 400px;
        height: 46px;
        flex-grow: 10;

        .total-amount {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;

          .label {
            position: absolute;
            left: 0;
            top: 0;
            width: 130px;
            height: 46px;
            line-height: 46px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 900;
            color: #fff;
          }

          .number-list {
            position: absolute;
            top: 0;
            left: 130px;
            width: 270px;
            height: 46px;
            line-height: 46px;
            display: flex;
            justify-content: space-between;

            .number {
              display: inline-block;
              width: 45px;
              height: 46px;
              border-radius: 12px;
              background: rgba(255, 255, 255, 0.1);
              line-height: 46px;
              font-size: 32px;
              font-family: 'DINPRO-BOLD';
              // font-weight: 900;
              color: #fff;
              -webkit-text-stroke: 1px #04243A;
              text-stroke: 1px #04243A;
            }
          }
        }
      }
    }

    .airport-info-box {
      position: absolute;
      top: 120px;
      display: flex;
      height: 932px;
      width: 100%;
    }
  }

  .space-aside {
    position: relative;
    display: inline-block;
    width: 88px;
    height: 100%;
    flex-grow: 2;
  }

  .space-inner {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 100%;
    flex-grow: 1;
  }

  .number.warning {
    color: #ff5f79 !important;
    -webkit-text-stroke: 1px #04243A !important;
    text-stroke: 1px #04243A !important;
  }

  .airport-box {
    position: relative;
    display: inline-block;
    width: 400px;
    height: 95%;
    flex-grow: 10;
  }
}
</style>
