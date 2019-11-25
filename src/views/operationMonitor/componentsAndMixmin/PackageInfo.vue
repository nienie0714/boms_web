<!-- 航站楼详情的浮窗：右边的【已装机数】浮窗 -->
<template>
    <div class="package-info" v-if="isTransfer && isOutFlag">
        <div class="package-info-open">
            <div class="title">{{ titleName }}</div>
            <img class="close-btn" :src="require('@icon/icon_close.png')" @click="closeBtn"/>
            <div class="number-list">
                <div class="number">{{ totalNumber[0] }}</div>
                <div class="number">{{ totalNumber[1] }}</div>
                <div class="number">{{ totalNumber[2] }}</div>
                <div class="number">{{ totalNumber[3] }}</div>
                <div class="number">{{ totalNumber[4] }}</div>
            </div>
            <div class="split-line-top"></div>
            <div class="airport-info-middle">
                <div class="info-middle-base info-left">
                    <div class="top-text">离港分拣</div>
                    <div class="bottom-text">机坪装机</div>
                </div>
                <div class="info-middle-base info-right">
                    <div class="step-icons">
                        <div class="step-icon-top"></div>
                        <div class="step-line-top-middle" style="height: 124px;"></div>
                        <div class="step-icon-bottom"></div>
                    </div>
                    <div class="step-info">
                        <div class="step-info-top">
                            {{ secondText }}
                        </div>
                        <div class="step-info-number-top">
                            <span>{{ secondCountA }}</span>
                            <span class="step-info-number-split">{{ secondCountB }}</span>
                            <span class="step-info-number-max">{{ secondCountC }}</span>
                        </div>
                        <div class="step-info-bottom">
                            {{ thirdText }}
                        </div>
                        <div class="step-info-number-bottom">
                            <span>{{ thirdCountA }}</span>
                            <span class="step-info-number-split">{{ thirdCountB }}</span>
                            <span class="step-info-number-max">{{ thirdCountC }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="split-line-bottom"></div>
            <!-- 异常报警总数、中转数 -->
            <div class="package-bottom">
                <div class="bottom-item-left">
                    <div class="label">异常报警总数</div>
                    <div class="number warning">{{ warningCount}}</div>
                </div>
                <div class="bottom-split"></div>
                <div class="bottom-item-right">
                    <div class="label">中转数</div>
                    <div class="number">{{ transferCount }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="package-info" v-else>
        <div class="package-info-open">
            <div class="title">{{ titleName }}</div>
            <img class="close-btn" :src="require('@icon/icon_close.png')" @click="closeBtn"/>
            <div class="number-list">
                <div class="number">{{ totalNumber[0] }}</div>
                <div class="number">{{ totalNumber[1] }}</div>
                <div class="number">{{ totalNumber[2] }}</div>
                <div class="number">{{ totalNumber[3] }}</div>
                <div class="number">{{ totalNumber[4] }}</div>
            </div>
            <div class="split-line-top"></div>
            <div class="airport-info-middle">
                <div class="info-middle-base info-left">
                    <div class="top-text">{{ firstNode }}</div>
                    <div class="middle-text">{{ secondNode }}</div>
                    <div class="bottom-text">{{ thirdNode }}</div>
                </div>
                <div class="info-middle-base info-right">
                    <div class="step-icons">
                        <div class="step-icon-top"></div>
                        <div class="step-line-top-middle"></div>
                        <div class="step-icon-middle"></div>
                        <div class="step-line-middle-bottom"></div>
                        <div class="step-icon-bottom"></div>
                    </div>
                    <div class="step-info">
                        <div class="step-info-top">
                            {{ firstText }}
                        </div>
                        <div class="step-info-number-top">
                            {{ firstCount }}
                        </div>
                        <div class="step-info-middle">
                            {{ secondText }}
                        </div>
                        <div class="step-info-number-middle">
                            <span>{{ secondCountA }}</span>
                            <span class="step-info-number-split">{{ secondCountB }}</span>
                            <span class="step-info-number-max">{{ secondCountC }}</span>
                        </div>
                        <div class="step-info-bottom">
                            {{ thirdText }}
                        </div>
                        <div class="step-info-number-bottom">
                            <span>{{ thirdCountA }}</span>
                            <span class="step-info-number-split">{{ thirdCountB }}</span>
                            <span class="step-info-number-max">{{ thirdCountC }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="split-line-bottom"></div>
            <!-- 异常报警总数、中转数 -->
            <div class="package-bottom">
                <div class="bottom-item-left">
                    <div class="label">异常报警总数</div>
                    <div class="number warning">{{ warningCount}}</div>
                </div>
                <div class="bottom-split"></div>
                <div class="bottom-item-right">
                    <div class="label">已中转</div>
                    <div class="number">{{ transferCount }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { postData } from '@/util/base'
import { setInterval, clearInterval } from 'timers'

export default {
  name: "PackageInfo",
  props: {
    terminalType: {
      type: String,
      default: 'T1'
    },
    isOutFlag: {
      type: Boolean,
      default: true
    },
    terminalAttr: {
      type: String,
      default: "D"
    },
    isTransfer: {
      type: Boolean,
      default: true
    },
    currentFlight: {
      // type: String,
      default: ""
    }
  },
  data () {
    return {
      titleName: "已装机数",
      totalNumber: "00000",
      firstNode: "值机交运",//前站装机
      secondNode: "离港分拣",//卸机
      thirdNode: "机坪装机",//卸车
      firstText: "已交运",
      secondText: "未分拣 / 应分拣",
      thirdText: "未装机 / 应装机",
      firstCount: 0,
      secondCountA: 0,
      secondCountB: "/",
      secondCountC: 0,
      thirdCountA: 0,
      thirdCountB: "/",
      thirdCountC: 0,
      warningCount: 0,
      transferCount: 0,
      terminalDatas: {},
      packageInterval: null, //所有航班的定时器
      singlePackageInterval: null, //单个航班的定时器
      terminalUrl: 'runMonitor/mainQueryForTerminal',
      sourceParam: {
        terminal: this.terminalType,   //航站楼（T1、T2或T3），不能为空
        attr: this.terminalAttr,   //属性（D-国内，I-国际），不能为空
        isTransfer: "N",   //是否只看中转行李（Y-是；N-否），不能为空
        inOutFlag: "D"
      },
      singleFlightUrl: 'runMonitor/mainQueryForSingle',
      singleSourceParam: {
        dynamicFlightId: "",
        isTransfer: "N",
        inOutFlag: "D"
      }
    }
  },
  created () {
    this.queryResourceDatas()
    this.setPackageTimer()
  },
  destroyed() {
    if(this.packageInterval) {
      clearInterval(this.packageInterval)
    }
    if (this.singlePackageInterval) {
      clearInterval(this.singlePackageInterval)
    }
  },
  methods: {
    setPackageTimer () { //所有航班定时器
      if (this.packageInterval) {
        clearInterval(this.packageInterval)
      }
      this.packageInterval = setInterval(() => {
        this.queryResourceDatas()
      },60000)
    },
    //单个航班定时器
    setSinglePackageTimer () { 
      if (this.singlePackageInterval) {
        clearInterval(this.singlePackageInterval)
      }
      this.singlePackageInterval = setInterval(() => {
        this.querySingleResourceDatas()
      },60000)
    },
    closeBtn () {
      this.$emit('closePackageTip',true)
    },
    queryResourceDatas () {
      let paramObj = JSON.stringify(this.sourceParam)
      postData(this.terminalUrl, paramObj).then(response => {
        if (response.data.code == 0) {
          let responseData = response.data.data
          this.formatData(responseData)
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
    querySingleResourceDatas () {
      let paramObj = JSON.stringify(this.singleSourceParam)
      postData(this.singleFlightUrl, paramObj).then(response => {
        if (response.data.code == 0) {
          let responseData = response.data.data
          this.formatData(responseData)
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
    formatData (responseData) {
      this.terminalDatas = responseData
      if (this.isOutFlag) { //出港
        this.titleName = "已装机数",
        this.totalNumber = this.terminalDatas.loadAcftTotalNum - this.terminalDatas.noloadAcftNum + ''
        let length = this.totalNumber.length
         switch (length) {
           case 0: this.totalNumber = "00000"
           break
           case 1: this.totalNumber = "0000" + this.totalNumber
           break
           case 2: this.totalNumber = "000" + this.totalNumber
           break
           case 3: this.totalNumber = "00" + this.totalNumber
           break
           case 4: this.totalNumber = "0" + this.totalNumber
           break
         }
         this.firstNode = "值机交运"//前站装机
         this.secondNode = "离港分拣"//卸机
         this.thirdNode = "机坪装机"//卸车
         this.firstText = "已交运"
         this.secondText = "未分拣 / 应分拣"
         this.thirdText = "未装机 / 应装机"
         this.firstCount = this.terminalDatas.checkinNum
         this.secondCountA = this.terminalDatas.nosortingNum
         this.secondCountB = "/"
         this.secondCountC = this.terminalDatas.sortingTotalNum
         this.thirdCountA = this.terminalDatas.noloadAcftNum
         this.thirdCountB = "/"
         this.thirdCountC = this.terminalDatas.loadAcftTotalNum
         this.warningCount = this.terminalDatas.warningNum
         this.transferCount = this.terminalDatas.tsfDNum
        } else { //进港
          this.titleName = "已卸机数",
          this.totalNumber = this.terminalDatas.unloadAcftNum + ''
          let length = this.totalNumber.length
          switch (length) {
            case 0: this.totalNumber = "00000"
            break
            case 1: this.totalNumber = "0000" + this.totalNumber
            break
            case 2: this.totalNumber = "000" + this.totalNumber
            break
            case 3: this.totalNumber = "00" + this.totalNumber
            break
            case 4: this.totalNumber = "0" + this.totalNumber
            break
           }
           this.firstNode = "前站装机"//前站装机
           this.secondNode = "进港卸机"//卸机
           this.thirdNode = "到达卸车"//卸车
           this.firstText = "前站装机数"
           this.secondText = "卸机数"
           this.thirdText = "卸车数"
           this.firstCount = this.terminalDatas.prevLoadAcftNum
           this.secondCountA = this.terminalDatas.unloadAcftNum
           this.secondCountB = ""
           this.secondCountC = ""
           this.thirdCountA = this.terminalDatas.unloadTruckNum
           this.thirdCountB = ""
           this.thirdCountC = ""
           this.warningCount = 0
           this.transferCount = this.terminalDatas.tsfANum
      }
    }
  },
  watch: {
    //监听进出港状态，更新数据
    isOutFlag: {
      handler(value) {
        this.sourceParam.inOutFlag = value ? "D" : "A"
        if (this.sourceParam.inOutFlag == "A") {
          this.sourceParam.isTransfer = "N"
        } else {
          this.sourceParam.isTransfer = this.isTransfer ? 'Y' : 'N'
        }
        this.queryResourceDatas()
      }
    },
    //监听是否中转状态，更新数据
    isTransfer: {
      handler(value) {
        this.sourceParam.isTransfer = value ? 'Y' : 'N'
        this.queryResourceDatas()
      }
    },
    //获取当前航班的数据，及更新绑定的定时器
    currentFlight: {
      handler(value) {
        if (value == "") {
          this.queryResourceDatas()
          //清除单个航班的定时器，重新注册所有航班的定时器
          if (this.singlePackageInterval) {
            clearInterval(this.singlePackageInterval)
          }
          this.setPackageTimer()
          return
        } else {
          this.singleSourceParam.dynamicFlightId = value
          this.singleSourceParam.isTransfer = this.sourceParam.isTransfer
          this.singleSourceParam.inOutFlag = this.sourceParam.inOutFlag

          this.querySingleResourceDatas()

          //清除所有航班的定时器，重新注册单个航班的定时器
          if (this.packageInterval) {
            clearInterval(this.packageInterval)
          }
          this.setSinglePackageTimer()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .warning {
        color: #FF5F79 !important;
        -webkit-text-stroke: 1px #04243A !important;
        text-stroke: 1px #04243A !important;
    }

    .package-info {
        box-shadow:0px 0px 160px 0px rgba(0, 0, 0, 0.8);
        z-index: 99;
        position: fixed;
        top: 90px;
        right: 10px;
        width: 300px;
        height: 456px;
        border-radius: 8px;
        background-image: url(~@img/gis/map_rightwin_bg_top.png);
        background-repeat: repeat-x;
        background-size: auto 100%;

        .package-info-open {
            position: relative;
            height: 100%;
            width: 100%;
        }

        .title {
            position: absolute;
            top: 16px;
            left: 17px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 16px;
        }

        .close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 14px;
            height: 14px;
            cursor: pointer;
        }

        .number-list {
            position: absolute;
            top: 52px;
            left: 14px;
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

        .split-line {
            position: absolute;
            left: 17px;
            width: 268px;
            height: 1px;
            background: rgba(255, 255, 255, 1);
            opacity: 0.1;
        }

        .split-line-top {
            @extend .split-line;
            top: 119px;
        }

        .split-line-bottom {
            @extend .split-line;
            top: 358px;
        }

        .airport-info-middle {
            position: absolute;
            left: 0;
            top: 144px;
            width: 100%;
            height: 192px;

            .info-middle-base {
                position: absolute;
                height: 100%;

                .step-icons {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 12px;
                    height: 100%;

                    .step-icon {
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        background-image: url(~@img/icon/icon_circle.png);
                        background-size: 100% 100%;
                    }

                    .step-icon-top {
                        @extend .step-icon;
                        top: 0;
                    }

                    .step-icon-middle {
                        @extend .step-icon;
                        top: 76px;
                    }

                    .step-icon-bottom {
                        @extend .step-icon;
                        top: 149px;
                    }

                    .step-line {
                        position: absolute;
                        width: 0px;
                        left: 50%;
                        transform: translateX(-50%);
                        height: 52px;
                        border: 1px solid rgb(163, 182, 204);
                        opacity: 0.4;
                        border-style: dashed;
                    }

                    .step-line-top-middle {
                        @extend .step-line;
                        top: 17px;
                    }

                    .step-line-middle-bottom {
                        @extend .step-line;
                        top: 93px;
                    }
                }

                .step-info {
                    position: absolute;
                    left: 24px;
                    right: 0;
                    top: 0;
                    height: 100%;

                    .step-info-label {
                        position: absolute;
                        left: 0;
                        width: 100%;
                        height: 12px;
                        line-height: 12px;
                        font-size: 14px;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: rgba(255, 255, 255, 0.6);
                        line-height: 16px;
                        text-align: left;
                    }

                    .step-info-top {
                        @extend .step-info-label;
                        top: -1px;
                    }

                    .step-info-middle {
                        @extend .step-info-label;
                        top: 74px;
                    }

                    .step-info-bottom {
                        @extend .step-info-label;
                        top: 147px;
                    }

                    .step-info-number {
                        position: absolute;
                        left: 0;
                        width: 100%;
                        height: 24px;
                        line-height: 24px;
                        font-size: 24px;
                        font-family: 'DINPRO-BOLD';
                        // font-weight: bold;
                        color: #fff;
                        -webkit-text-stroke: 1px #04243A;
                        text-stroke: 1px #04243A;
                        text-align: left;

                        .step-info-number-split {
                            -webkit-text-stroke: 1px #04243A;
                            text-stroke: 1px #04243A;
                            margin-left: 8px;
                            margin-right: 6px;
                            font-family: 'DINPRO-BOLD';
                        }

                        .step-info-number-max {
                            font-size: 18px;
                            font-family: 'DINPRO-BOLD'
                        }
                    }

                    .step-info-number-top {
                        @extend .step-info-number;
                        top: 24px;

                        span {
                          font-family: 'DINPRO-BOLD'
                        }
                    }

                    .step-info-number-middle {
                        @extend .step-info-number;
                        top: 99px;

                        span {
                          font-family: 'DINPRO-BOLD'
                        }
                    }

                    .step-info-number-bottom {
                        @extend .step-info-number;
                        top: 172px;

                        span {
                          font-family: 'DINPRO-BOLD'
                        }
                    }
                }
            }

            .info-left {
                left: 0;
                width: 93px;

                .text-base {
                    position: absolute;
                    left: 16px;
                    height: 16px;
                    line-height: 16px;
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    line-height: 16px;
                }

                .top-text {
                    @extend .text-base;
                    top: -1px;
                }

                .middle-text {
                    @extend .text-base;
                    top: 74px;
                }

                .bottom-text {
                    @extend .text-base;
                    top: 148px;
                }
            }

            .info-right {
                left: 93px;
                right: 0;
            }
        }

        .package-bottom {
            position: absolute;
            top: 379px;
            left: 0;
            width: 100%;
            height: 54px;

            .bottom-item {
                position: absolute;
                top: 0;
                height: 100%;
                width: 130px;

                .label {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 14px;
                    line-height: 14px;
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.6);
                    text-align: left;
                }

                .number {
                    position: absolute;
                    top: 32px;
                    left: 0;
                    width: 100%;
                    font-size: 28px;
                    font-family: 'DINPRO-BOLD';
                    // font-weight: bold;
                    color: #fff;
                    -webkit-text-stroke: 1px #04243A;
                    text-stroke: 1px #04243A;
                    text-align: left;
                    height: 22px;
                    line-height: 22px;
                }
            }

            .bottom-item-left {
                @extend .bottom-item;
                left: 17px;
            }

            .bottom-item-right {
                @extend .bottom-item;
                left: 177px;
            }

            .bottom-split {
                position: absolute;
                width: 1px;
                height: 57px;
                background: rgba(255, 255, 255, 1);
                opacity: 0.1;
                top: 0;
                left: 151px;
            }
        }
    }

</style>
