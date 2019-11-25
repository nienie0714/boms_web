<template>
  <!-- 下方的具体的机场信息，hover 状态下会上浮 -->
  <div class="airport-info">
    <div class="airport-image-box">
      <div :class="_getAirportTypeBG(airportType)"></div>
      <div class="airport-name">{{_getAirportTypeText(airportType)}}</div>
      <div class="right-arrow"></div>
      <div class="airport-amount-box">
        <div class="airport-amount">
          <div class="label">已装机</div>
          <div class="number">{{resourceData.loadAcftNum}}</div>
        </div>
        <div class="airport-amount">
          <div class="label">已卸机</div>
          <div class="number">{{resourceData.unloadAcftNum}}</div>
        </div>
        <div class="airport-amount">
          <div class="label">已中转</div>
          <div class="number">{{resourceData.tsfDNum}}</div>
        </div>
        <div class="airport-amount">
          <div class="label">报警数</div>
          <div class="number warning">{{resourceData.warningNum}}</div>
        </div>
      </div>
    </div>
    <!-- 中间区域，包括前站装机数、卸机数、卸车数等 -->
    <div class="airport-info-middle">
      <div class="info-middle-base info-left">
        <div class="step-icons">
          <div class="step-icon-top"></div>
          <div class="step-line-top-middle"></div>
          <div class="step-icon-middle"></div>
          <div class="step-line-middle-bottom"></div>
          <div class="step-icon-bottom"></div>
        </div>

        <div class="step-info">
          <div class="step-info-top">已交运</div>
          <div class="step-info-number-top">{{resourceData.checkinNum}}</div>
          <div class="step-info-middle">未分拣 / 应分拣</div>
          <div class="step-info-number-middle">
            <span>{{resourceData.nosortingNum}}</span>
            <span class="step-info-number-split">/</span>
            <span class="step-info-number-max">{{resourceData.sortingTotalNum}}</span>
          </div>
          <div class="step-info-bottom">未装机 / 应装机</div>
          <div class="step-info-number-bottom">
            <span>{{resourceData.noloadAcftNum}}</span>
            <span class="step-info-number-split">/</span>
            <span class="step-info-number-max">{{resourceData.loadAcftTotalNum}}</span>
          </div>
        </div>

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
          <div class="step-info-top">前站装机数</div>
          <div class="step-info-number-top">{{resourceData.prevLoadAcftNum}}</div>
          <div class="step-info-middle">卸机数</div>
          <div class="step-info-number-middle">{{resourceData.unloadAcftNum}}</div>
          <div class="step-info-bottom">卸车数</div>
          <div class="step-info-number-bottom">{{resourceData.unloadTruckNum}}</div>
        </div>
      </div>
    </div>

    <div class="split-line"></div>

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
          <div class="state-number">{{resourceData.counter.usedNum}}</div>
        </div>

        <div class="device-state not-used">
          <div class="state-icon"></div>
          <div class="state-label">未用</div>
          <div class="state-number">{{resourceData.counter.freeNum}}</div>
        </div>

        <div class="device-state not-allowed">
          <div class="state-icon"></div>
          <div class="state-label">不可用</div>
          <div class="state-number">{{resourceData.counter.unavailNum}}</div>
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
          <div class="state-number">{{resourceData.chute.usedNum}}</div>
        </div>

        <div class="device-state not-used">
          <div class="state-icon"></div>
          <div class="state-label">未用</div>
          <div class="state-number">{{resourceData.chute.freeNum}}</div>
        </div>

        <div class="device-state not-allowed">
          <div class="state-icon"></div>
          <div class="state-label">不可用</div>
          <div class="state-number">{{resourceData.chute.unavailNum}}</div>
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
          <div class="state-number">{{resourceData.belt.usedNum}}</div>
        </div>

        <div class="device-state not-used">
          <div class="state-icon"></div>
          <div class="state-label">未用</div>
          <div class="state-number">{{resourceData.belt.freeNum}}</div>
        </div>

        <div class="device-state not-allowed">
          <div class="state-icon"></div>
          <div class="state-label">不可用</div>
          <div class="state-number">{{ resourceData.belt.unavailNum }}</div>
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
</template>

<script>
// 数据类型和航班名对照表
const AIRPORT_TYPE_INFO = new Map();
AIRPORT_TYPE_INFO.set('T1', {
  text: 'T1',
  bg: 'airport-image-box-bg-t1'
});
AIRPORT_TYPE_INFO.set('T2', {
  text: 'T2',
  bg: 'airport-image-box-bg-t2'
});
AIRPORT_TYPE_INFO.set('T3', {
  text: 'T3',
  bg: 'airport-image-box-bg-t3'
});
AIRPORT_TYPE_INFO.set('T3 international', {
  text: 'T3 国际',
  bg: 'airport-image-box-bg-t3-international'
});

export default {
  props: {
    airportType: String,
    resourceData: { //每个航站楼的统计数据
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  name: "AirportInfo",
  computed: { //按照总数为98%来处理值机柜台、滑槽、柜台的在用、未用、不可用比例宽度
    //值机柜台
    counterUsedPercent: function () {
      let sumCount = this.resourceData.counter.usedNum + this.resourceData.counter.freeNum + this.resourceData.counter.unavailNum
      return  (this.resourceData.counter.usedNum / sumCount * 98) + '%'
    },
    counterFreePercent: function () {
      let sumCount = this.resourceData.counter.usedNum + this.resourceData.counter.freeNum + this.resourceData.counter.unavailNum
      return  (this.resourceData.counter.freeNum / sumCount * 98) + '%'
    },
    counterUnavailPercent:function () {
      let sumCount = this.resourceData.counter.usedNum + this.resourceData.counter.freeNum + this.resourceData.counter.unavailNum
      let percentUsed = parseFloat(this.counterUsedPercent)
      let percentFree = parseFloat(this.counterFreePercent)
      return 98 - percentUsed - percentFree + '%'
    },
    // 滑槽
    chuteUsedPercent: function () {
      let sumCount = this.resourceData.chute.usedNum + this.resourceData.chute.freeNum + this.resourceData.chute.unavailNum
      return  (this.resourceData.chute.usedNum / sumCount * 98) + '%'
    },
    chuteFreePercent: function () {
      let sumCount = this.resourceData.chute.usedNum + this.resourceData.chute.freeNum + this.resourceData.chute.unavailNum
      return  (this.resourceData.chute.freeNum / sumCount * 98) + '%'
    },
    chuteUnavailPercent:function () {
      let sumCount = this.resourceData.chute.usedNum + this.resourceData.chute.freeNum + this.resourceData.chute.unavailNum
      let percentUsed = parseFloat(this.chuteUsedPercent)
      let percentFree = parseFloat(this.chuteFreePercent)
      return 98 - percentUsed - percentFree + '%'
    },
    // 柜台
    beltUsedPercent: function () {
      let sumCount = this.resourceData.belt.usedNum + this.resourceData.belt.freeNum + this.resourceData.belt.unavailNum
      return  (this.resourceData.belt.usedNum / sumCount * 98) + '%'
    },
    beltFreePercent: function () {
      let sumCount = this.resourceData.belt.usedNum + this.resourceData.belt.freeNum + this.resourceData.belt.unavailNum
      return  (this.resourceData.belt.freeNum / sumCount * 98) + '%'
    },
    beltUnavailPercent:function () {
      let sumCount = this.resourceData.belt.usedNum + this.resourceData.belt.freeNum + this.resourceData.belt.unavailNum
      let percentUsed = parseFloat(this.beltUsedPercent)
      let percentFree = parseFloat(this.beltFreePercent)
      return 98 - percentUsed - percentFree + '%'
    }
  },
  methods: {
    // 获取文字信息
    _getAirportTypeText(type) {
      // 类型
      return AIRPORT_TYPE_INFO.get(type).text
    },
    // 获取背景图片
    _getAirportTypeBG(type) {
      // 类型
      return AIRPORT_TYPE_INFO.get(type).bg
    }
  }
}
</script>

<style lang="scss" scoped>
$using: rgba(36, 202, 211, 1);
$not-used: rgba(247, 193, 48, 1);
$not-allowed: rgba(255, 95, 121, 1);

.number.warning {
  color: #ff5f79 !important;
  -webkit-text-stroke: 1px #04243A !important;
  text-stroke: 1px #04243A !important;
}

.airport-info {
  background: rgba(255, 255, 255, 0.6);
  box-shadow:0px 0px 100px 0px rgba(0, 0, 0, 0.3);
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  transition: top 0.25s;
  cursor: pointer;
  background-image: url(~@img/bg/map_block_bg_default.png);
  background-repeat: repeat-x;
}

.airport-info:hover {
  top: -14px;
  background-image: url(~@img/bg/map_block_bg_hover.png);
}

.airport-image-box {
  position: absolute;
  top: 24px;
  width: 89.25%;
  height: 180px;
  left: 50%;
  transform: translateX(-50%);
  background-image: url(~@img/bg/map_window_bg.png);
  background-size: 100% 100%;
  border-radius: 10px;

  .airport-name {
    position: absolute;
    left: 7.8%;
    top: 21px;
    height: 32px;
    line-height: 32px;
    font-size: 32px;
    font-family: 'DINPRO-BOLD';
    // font-weight: bold;
    color: #fff;
    -webkit-text-stroke: 1px #04243A;
    text-stroke: 1px #04243A;
  }

  .airport-amount-box {
    position: absolute;
    top: 107px;
    width: 100%;
    height: 48px;

    .airport-amount {
      position: relative;
      display: inline-block;
      width: 25%;
      height: 100%;
      float: left;

      .label {
        position: absolute;
        top: 0;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
        line-height: 16px;
        width: 100%;
      }

      .number {
        position: absolute;
        top: 28px;
        width: 100%;
        height: 20px;
        line-height: 20px;
        vertical-align: bottom;
        font-size: 28px;
        font-family: 'DINPRO-BOLD';
        // font-weight: bold;
        color: rgba(255, 255, 255, 1);
        -webkit-text-stroke: 1px #04243A;
        text-stroke: 1px #04243A;
      }
    }
  }

  .airport-image-box-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .airport-image-box-bg-t1 {
    @extend .airport-image-box-bg;
    background-size: 100% 100%;
    background-image: url(~@img/icon/logo/map_model_t1.png);
  }

  .airport-image-box-bg-t2 {
    @extend .airport-image-box-bg;
    background-size: 100% 100%;
    background-image: url(~@img/icon/logo/map_model_t2.png);
  }

  .airport-image-box-bg-t3 {
    @extend .airport-image-box-bg;
    background-size: 100% 100%;
    background-image: url(~@img/icon/logo/map_model_t3.png);
  }

  .airport-image-box-bg-t3-international {
    @extend .airport-image-box-bg;
    background-size: 100% 100%;
    background-image: url(~@img/icon/logo/map_model_t3_intern.png);
  }

  .right-arrow {
    position: absolute;
    top: 21px;
    right: 4.2%;
    width: 20px;
    height: 20px;
    background-image: url(~@img/icon/icon_right_arrow.png);
    background-size: 100% 100%;
  }
}

.airport-info-middle {
  position: absolute;
  left: 0;
  top: 234px;
  width: 100%;
  height: 192px;

  .info-middle-base {
    position: absolute;
    height: 100%;
    width: 47.75%;

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
          font-family: 'DINPRO-BOLD';
          // font-weight: bold;
        }
      }

      .step-info-number-top {
        @extend .step-info-number;
        top: 24px;
      }

      .step-info-number-middle {
        @extend .step-info-number;
        top: 99px;

        span {
          font-family: 'DINPRO-BOLD';
        }
      }

      .step-info-number-bottom {
        @extend .step-info-number;
        top: 172px;

        span {
          font-family: 'DINPRO-BOLD';
        }
      }
    }
  }

  .info-left {
    left: 10.75%;
  }

  .info-right {
    left: 58.5%;
  }
}

.split-line {
  position: absolute;
  top: 469px;
  left: 10.75%;
  right: 10.75%;
  height: 1px;
  background: rgba(255, 255, 255, 1);
  opacity: 0.1;
}

.device-info {
  position: absolute;
  top: 495px;
  bottom: 0;
  // base 宽度是 400 - 42*2 = 316px
  left: 10.5%;
  right: 10.5%;

  .device-row {
    position: relative;
    height: 104px;
    width: 100%;

    .device-icon-box {
      position: absolute;
      left: 1.75%;
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
      left: 21%;
      height: 57px;
      border: 1px solid #ffffff;
      opacity: 0.1;
    }

    .device-state {
      position: absolute;
      height: 54px;
      width: 21%;

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
      left: 32.75%;

      .state-icon {
        background: $using;
      }
    }

    .device-state.not-used {
      left: 53.75%;

      .state-icon {
        background: $not-used;
      }
    }

    .device-state.not-allowed {
      left: 74.75%;

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
</style>
