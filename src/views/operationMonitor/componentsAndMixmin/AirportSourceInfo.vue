<!-- 航站楼详情的浮窗：右边的【资源】浮窗 -->
<template>
  <div class="source-info">
    <div class="open">
      <div class="title">资源</div>
      <img class="close-btn" :src="require('@icon/icon_close.png')" @click="closeBtn"/>

      <!-- 下方的柜台、滑槽、转盘、机位信息 -->
      <div class="device-info">
        <div class="device-row">
          <div class="device-icon-box">
            <div class="device-icon counter"></div>
            <div class="device-name">柜台</div>
          </div>

          <div class="device-split-line"></div>

          <div class="device-state using">
            <div class="state-icon"></div>
            <div class="state-label">在用</div>
            <div class="state-number">{{counter.usedNumber}}</div>
          </div>

          <div class="device-state not-used">
            <div class="state-icon"></div>
            <div class="state-label">未用</div>
            <div class="state-number">{{counter.freeNumber}}</div>
          </div>

          <div class="device-state not-allowed">
            <div class="state-icon"></div>
            <div class="state-label">不可用</div>
            <div class="state-number">{{counter.unavailNum}}</div>
          </div>

          <!-- 百分比比例条，总和最多不超过 99%（因为三个条间距加起来是 1%），个人意见是 98.75%，确保不超出 -->
          <div class="device-percent">
            <div class="percent-using" :style="{width: counterUsedPercent}"></div>
            <div class="percent-not-used" :style="{width: counterFreePercent}"></div>
            <div class="percent-not-allowed" :style="{width: counterUnavailPercent}"></div>
          </div>
        </div>
        <div class="device-row">
          <div class="device-icon-box">
            <div class="device-icon conveyor-belt"></div>
            <div class="device-name">滑槽</div>
          </div>

          <div class="device-split-line"></div>

          <div class="device-state using">
            <div class="state-icon"></div>
            <div class="state-label">在用</div>
            <div class="state-number">{{chute.usedNumber}}</div>
          </div>

          <div class="device-state not-used">
            <div class="state-icon"></div>
            <div class="state-label">未用</div>
            <div class="state-number">{{chute.freeNumber}}</div>
          </div>

          <div class="device-state not-allowed">
            <div class="state-icon"></div>
            <div class="state-label">不可用</div>
            <div class="state-number">{{chute.unavailNum}}</div>
          </div>

          <!-- 百分比比例条，总和最多不超过 99%（因为三个条间距加起来是 1%），个人意见是 98.75%，确保不超出 -->
          <div class="device-percent">
            <div class="percent-using" :style="{width: chuteUsedPercent}"></div>
            <div class="percent-not-used" :style="{width: chuteFreePercent}"></div>
            <div class="percent-not-allowed" :style="{width: chuteUnavailPercent}"></div>
          </div>
        </div>
        <div class="device-row">
          <div class="device-icon-box">
            <div class="device-icon turntable"></div>
            <div class="device-name">转盘</div>
          </div>

          <div class="device-split-line"></div>

          <div class="device-state using">
            <div class="state-icon"></div>
            <div class="state-label">在用</div>
            <div class="state-number">{{belt.usedNumber}}</div>
          </div>

          <div class="device-state not-used">
            <div class="state-icon"></div>
            <div class="state-label">未用</div>
            <div class="state-number">{{belt.freeNumber}}</div>
          </div>

          <div class="device-state not-allowed">
            <div class="state-icon"></div>
            <div class="state-label">不可用</div>
            <div class="state-number">{{ belt.unavailNum }}</div>
          </div>

          <!-- 百分比比例条，总和最多不超过 99%（因为三个条间距加起来是 1%），个人意见是 98.75%，确保不超出 -->
          <div class="device-percent">
            <div class="percent-using" :style="{width: beltUsedPercent}"></div>
            <div class="percent-not-used" :style="{width: beltFreePercent}"></div>
            <div class="percent-not-allowed" :style="{width: beltUnavailPercent}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryAllGet } from '@/util/base'
import { setInterval, clearInterval } from 'timers'

export default {
  name: "AirportSourceInfo",
  props: {
    terminalType: {
      type: String,
      default: 'T1'
    },
    terminalAttr: {
      type: String,
      default: "D"
    }
  },
  data() {
    return {
      counter: {
        usedNumber: 0,
        freeNumber: 0,
        unavailNum: 0
      },
      chute: {
        usedNumber: 0,
        freeNumber: 0,
        unavailNum: 0
      },
      belt: {
        usedNumber: 0,
        freeNumber: 0,
        unavailNum: 0
      },
      sourceInterval: null,
      counterUsedPercent: '0%',
      counterFreePercent: '0%',
      counterUnavailPercent: '0%',
      chuteUsedPercent: '0%',
      chuteFreePercent: '0%',
      chuteUnavailPercent: '0%',
      beltUsedPercent: '0%',
      beltFreePercent: '0%',
      beltUnavailPercent: '0%'
    }
  },
  computed: {

  },
  created() {
    this.queryResourceDatas()

    if (this.sourceInterval) {
      clearInterval(this.sourceInterval)
    } else {
      this.sourceInterval = setInterval(() => {
      this.queryResourceDatas()
    },300000)
    }
  },
  destroyed () {
    if (this.sourceInterval) {
      clearInterval(this.sourceInterval)
    }
  },
  methods: {
    closeBtn () {
      this.$emit('closeSourceTip',true)
    },
    queryResourceDatas() {
      queryAllGet('runMonitor/mainQuery').then(response => {
        if (response.data.code == 0) {
          let responseData = response.data.data
          for (var r = 0; r < responseData.length; r++) {
            let currentTerminal = this.terminalAttr == 'I' ? 'T3国际' : this.terminalType
            if (responseData[r].terminal == currentTerminal) {
              this.counter.usedNumber = responseData[r].counter.usedNum
              this.counter.freeNumber = responseData[r].counter.freeNum
              this.counter.unavailNum = responseData[r].counter.unavailNum

              let counterSum = this.counter.usedNumber + this.counter.freeNumber + this.counter.unavailNum
              this.counterUsedPercent = this.counter.usedNumber / counterSum * 98 + '%'
              this.counterFreePercent = this.counter.freeNumber / counterSum * 98 + '%'
              this.counterUnavailPercent = this.counter.unavailNum / counterSum * 98 + '%'

              this.chute.usedNumber = responseData[r].chute.usedNum
              this.chute.freeNumber = responseData[r].chute.freeNum
              this.chute.unavailNum = responseData[r].chute.unavailNum

              let chuteSum = this.chute.usedNumber + this.chute.freeNumber + this.chute.unavailNum
              this.chuteUsedPercent = this.chute.usedNumber / chuteSum * 98 + '%'
              this.chuteFreePercent = this.chute.freeNumber / chuteSum * 98 + '%'
              this.chuteUnavailPercent = this.chute.unavailNum / chuteSum * 98 + '%'

              this.belt.usedNumber = responseData[r].belt.usedNum
              this.belt.freeNumber = responseData[r].belt.freeNum
              this.belt.unavailNum = responseData[r].belt.unavailNum

              let beltSum = this.belt.usedNumber + this.belt.freeNumber + this.belt.unavailNum
              this.beltUsedPercent = this.belt.usedNumber / beltSum * 98 + '%'
              this.beltFreePercent = this.belt.freeNumber / beltSum * 98 + '%'
              this.beltUnavailPercent = this.belt.unavailNum / beltSum * 98 + '%'
              return
            }
          }
        } else {
          //无数据的情况
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !',
          tip: err
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$using: rgba(36, 202, 211, 1);
$not-used: rgba(247, 193, 48, 1);
$not-allowed: rgba(255, 95, 121, 1);

.source-info {
  box-shadow:0px 0px 160px 0px rgba(0, 0, 0, 0.8);
  z-index: 99;
  position: fixed;
  top: 555px;
  right: 10px;
  width: 300px;
  height: 410px;
  border-radius: 8px;
  background-image: url(~@img/gis/map_rightwin_bg_bottom.png);
  background-size: auto 100%;
  background-repeat: repeat-x;

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

  .device-info {
    position: absolute;
    top: 60px;
    bottom: 0;
    // base 宽度是 400 - 42*2 = 316px
    left: 16px;
    right: 16px;

    .device-row {
      position: relative;
      height: 112px;
      width: 100%;

      .device-icon-box {
        position: absolute;
        top: 0;
        left: 7px;
        width: 32px;
        height: 54px;

        .device-icon {
          position: absolute;
          top: 0;
          width: 32px;
          height: 32px;
          background-size: 100% 100%;
        }

        .device-name {
          position: absolute;
          top: 40px;
          width: 100%;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 16px;
          height: 16px;
        }

        .counter {
          background-image: url(~@img/icon/icon_counter.png);
        }

        .conveyor-belt {
          background-image: url(~@img/icon/icon_conveyor_belt.png);
        }

        .turntable {
          background-image: url(~@img/icon/icon_turntable.png);
        }

        .plane-place {
          background-image: url(~@img/icon/icon_plane_place.png);
        }
      }

      .device-split-line {
        position: absolute;
        width: 1px;
        top: 3px;
        left: 19%;
        height: 57px;
        border: 1px solid #ffffff;
        opacity: 0.1;
      }

      .device-state {
        position: absolute;
        height: 54px;
        width: 71px;

        .state-icon {
          position: absolute;
          top: 9px;
          width: 13px;
          height: 6px;
          border-radius: 3px;
        }

        .state-label {
          position: absolute;
          left: 16px;
          top: 5px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #fff;
          line-height: 14px;
          height: 14px;
          opacity: 0.6;
        }

        .state-number {
          position: absolute;
          top: 36px;
          height: 17px;
          line-height: 17px;
          width: 100%;
          font-size: 24px;
          font-family: 'DINPRO-BOLD';
          // font-weight: bold;
          color: rgba(255, 254, 254, 1);
          -webkit-text-stroke: 1px #04243A;
          text-stroke: 1px #04243A;
          text-align: left;
        }
      }

      .device-state.using {
        left: 69px;

        .state-icon {
          background: $using;
        }
      }

      .device-state.not-used {
        left: 140px;

        .state-icon {
          background: $not-used;
        }
      }

      .device-state.not-allowed {
        left: 204px;

        .state-icon {
          background: $not-allowed;
        }
      }

      .device-percent {
        position: absolute;
        width: 100%;
        top: 68px;
        height: 6px;
        border-radius: 3px;
        overflow: hidden;
        vertical-align: top;

        .percent-bar {
          display: inline-block;
          float: left;
          height: 100%;
          min-width: 1px;
          white-space: nowrap;
        }

        .percent-using {
          @extend .percent-bar;
          background: $using;
          margin-right: 0.5%;
        }

        .percent-not-used {
          @extend .percent-bar;
          background: $not-used;
          margin-right: 0.5%;
        }

        .percent-not-allowed {
          @extend .percent-bar;
          background: $not-allowed;
          border-radius: 0px 3px 3px 0px
        }
      }
    }
  }
}
</style>
