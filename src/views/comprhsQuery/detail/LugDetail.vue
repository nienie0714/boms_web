<template>
  <my-dialog :visible="visible" :position="'right'" :title="title" :footer="false" class="lug-detail-dialog under-head-dialog" @handleClose="handleClose">
    <template>
      <div class="body-first">
        <div class="first-row">
          <div class="top">
            <div>
              <div class="bold">{{showValue(row, {key: 'luggage.lugNo'})}}</div>
              <div class="type-block">{{showValue(row, {key: 'luggage.progressStatusCn'})}}</div>
            </div>
            <div>
              <div :class="'pull_down_' + (showValue(row, {key: 'luggage.isCancel'}) == 'Y' ? 'long' : 'gray')"></div>
              <div :class="'added_' + (showValue(row, {key: 'luggage.isAddition'}) == 'Y' ? 'long' : 'gray')"></div>
              <div :class="'find_' + (showValue(row, {key: 'luggage.isLookfor'}) == 'Y' ? 'long' : 'gray')"></div>
              <div :class="'vip_' + (showValue(row, {key: 'luggage.isVip'}) == 'Y' ? 'long' : 'gray')"></div>
            </div>
          </div>
          <div class="font-gray">RFID：{{showValue(row, {key: 'luggage.rfidNo'})}}</div>
        </div>
        <div v-for="(item, group) in rowConf" :key="group" class="row">
          <div v-for="(col, index) in item" :key="index" :class="'col col-' + (col&&col.colWidth>0?col.colWidth:item.length)">
            <div v-if="col" class="label">{{col.label}}</div>
            <div v-if="col" :class="['text', col && col.class]" :title="showValue(row, col)">{{showValue(row, col)}}</div>
          </div>
        </div>
      </div>
      <div v-if="row&&row.hasOwnProperty('nodes')" class="body-second">
        <div v-for="(node, index) in row.nodes" :key="index" class="row">
          <div class="left">
            <div class="time">
              <div>(预) {{(node.timeE || emptyTime).substr(5, 11)}}</div>
              <div v-if="node.timeA">{{(node.timeA || emptyTime).substr(5, 11)}}</div>
            </div>
            <div class="node">
              <div :class="'circle' + (node.timeA?' active':'')"></div>
              <div v-if="node.lstLugMarkingVO&&node.lstLugMarkingVO.length>0&&node.lstLugMarkingVO[0].classifyCn"
                :class="node.lstLugMarkingVO[0].classifyCn?'star':''"></div>
            </div>
          </div>
          <div class="right">
            <div :class="'label' + (node.timeA?' active':'')">{{node.nodeCn}}</div>
            <div class="row-block">
              <div v-if="node.lstLugMarkingVO&&node.lstLugMarkingVO.length>0" class="row">
                <div v-for="(col, nIdx) in nodeConf" :key="nIdx" :class="['col col-' + (col&&col.colWidth>0?col.colWidth:nodeConf.length), col.class]">
                  <div class="text">{{col.label}}</div>
                  <div class="text" :style="`color: ${col.color}`">{{showValue(node, col)}}</div>
                </div>
              </div>
              <div v-if="node.lstLugMarkingVO&&node.lstLugMarkingVO.length>0" class="pic-list">
                <div v-for="(pic, pIdx) in picConf" :key="pIdx">
                  <template v-if="node.lstLugMarkingVO[0][pic]">
                    <img :src="dfs + node.lstLugMarkingVO[0][pic]" @click="clickShowImg(dfs + node.lstLugMarkingVO[0][pic])"/>
                  </template>
                </div>
              </div>
              <div v-if="showImg" class="show-img" @click="showImg = false">
                <img :src="showImgPath"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </my-dialog>
</template>

<script>
import utilMixin from '@mixin/utilMixin'
import _ from 'lodash'

export default {
  mixins: [utilMixin],
  props: ['row'],
  data () {
    return {
      dfs: '',
      emptyTime: '----/--/-- --:--:--',
      visible: false,
      title: '行李详细信息',
      rowConf: [
        [
          {key: 'luggage.flightNo', label: '航班号', class: 'bold'},
          {key: 'luggage.execDate', label: '航班日期', format: [0, 10]},
          {key: 'luggage.originCn', label: '始发站'},
          {key: 'luggage.destCn', label: '目的站'},
          {key: 'luggage.transferCn', label: '中转站'}
        ],
        [
          {key: 'luggage.counter', label: '值机柜台'},
          {key: 'luggage.chute', label: '行李滑槽'},
          {key: 'luggage.gate', label: '登机口'},
          {key: 'luggage.stand', label: '机位'},
          {key: 'luggage.truck', label: '行李容器'}
        ],
        [
          {key: 'luggage.markingNum', label: '标记次数', colWidth: 5},
          {key: 'luggage.nameCh', label: '旅客姓名', colWidth: 5},
          {key: 'luggage.idcardType', label: '证件类型', colWidth: 5},
          {key: 'luggage.idcardNo', label: '证件号码', colWidth: 3}
        ]
        /* [
          {key: 'luggage.progressStatusCn', label: '行李状态'},
          {key: 'luggage.isCancel', label: '是否拉减', enumKey: 'isYOrN'},
          {key: 'luggage.isAddition', label: '是否追加', enumKey: 'isYOrN'},
          {key: 'luggage.isLookfor', label: '是否挑找', enumKey: 'isYOrN'},
          {key: 'luggage.isVip', label: '是否VIP', enumKey: 'isYOrN'}
        ], */
      ],
      nodeConf: [
        {key: 'lstLugMarkingVO[0].createName', label: '操作人：', colWidth: 3},
        {key: 'lstLugMarkingVO[0].createtime', label: '操作时间：', format: [5, 11], colWidth: 2},
        {key: 'lstLugMarkingVO[0].classifyCn', label: '标记类型：', colWidth: 3, class: 'bold', color: '#f79f2d'}
      ],
      picConf: ['photo1', 'photo2', 'photo3'],
      showImg: false,
      showImgPath: ''
    }
  },
  mounted () {
    this.dfs = this.$store.getters.getConfigValue('dfs')
  },
  methods: {
    clickShowImg (path) {
      this.showImgPath = path
      this.showImg = true
    },
    changeData () {
      if (this.row.luggage.inOutFlag == 'D') {
        this.rowConf.splice(1, 1, [
          {key: 'luggage.counter', label: '值机柜台'},
          {key: 'luggage.chute', label: '行李滑槽'},
          {key: 'luggage.gate', label: '登机口'},
          {key: 'luggage.stand', label: '机位'},
          {key: 'luggage.truck', label: '行李容器'}
        ])
        // this.$set(this.rowConf, 1, )
      } else if (this.row.luggage.inOutFlag == 'A') {
        this.rowConf.splice(1, 1, [
          {key: 'luggage.belt', label: '行李转盘', colWidth: 5},
          {key: 'luggage.stand', label: '机位', colWidth: 5},
          {key: 'luggage.truck', label: '行李容器', colWidth: 5}
        ])
        // this.$set(this.rowConf, 1, [
        // ])
      }
      this.visible = true
    },
    handleClose () {
      this.visible = false
      if (!this.$options.parent.hasOwnProperty('title')) {
        this.$options.parent.row = {}
      }
    }
  },
  watch: {
    row: {
      handler (data) {
        if (data) {
          this.changeData()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.lug-detail-dialog > .dialog {
  >.header {
    height: 30px !important;
    line-height: 50px;
    align-items: self-end;
  }
  > .main > .body {
    padding: 20px 0 0 0;
    overflow: hidden;
  }
}
</style>


<style lang="scss" scoped>
$bodyTop: 250px;
$bodyHead: 50px;
$rowHeight: 80px;
$ndRowOut: 20px;
$ndRowIn: 8px;
$circleWH: 6px;
$timeWidth: 40px;
$transWidth: 0;
.dialog {
  width: 30px;
  height: 50px;
}
.row {
  >.col {
    text-align: left;
    display: flex;
    align-items: center;
    font-size: 16px;
  }
}
.body-first {
  margin: 0 20px;
  padding: 20px 20px 8px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 50px rgba($color: $white-shadow, $alpha: .3);
  .first-row {
    text-align: left;
    margin-bottom: 20px;
    .top {
      display: flex;
      justify-content: space-between;
      >div {
        display: flex;
      }
      >div:first-child {
        .bold {
          $size: 24px;
          font-size: $size;
          height: $size;
          line-height: $size;
          font-family: 'DINPRO-BOLD';
        }
        .type-block {
          $height: 14px;
          padding: 6px 8px;
          margin-left: 12px;
          color: $blue;
          font-size: $height;
          height: $height;
          line-height: $height;
          font-weight: bold;
          background-color: rgba($color: $blue-shadow, $alpha: .2);
          border-radius: 6px;
        }
      }
      >div:last-child {
        >div {
          width: 52px;
          height: 24px;
          border-radius: 12px;
          &:not(:last-child) {
            margin-right: 10px;
          }
        }
        .pull_down_long {
          background-image: url(~@icon/lug/icon_pull_down_long.png);
          box-shadow: 0 0 10px rgba($color: $red-shadow, $alpha: .5);
        }
        .pull_down_gray {
          background-image: url(~@icon/lug/icon_pull_down_gray.png);
        }
        .added_long {
          background-image: url(~@icon/lug/icon_added_long.png);
          box-shadow: 0 0 10px rgba($color: $blue-shadow, $alpha: .5);
        }
        .added_gray {
          background-image: url(~@icon/lug/icon_added_gray.png);
        }
        .find_long {
          background-image: url(~@icon/lug/icon_find_long.png);
          box-shadow: 0 0 10px rgba($color: $yellow-shadow, $alpha: .5);
        }
        .find_gray {
          background-image: url(~@icon/lug/icon_find_gray.png);
        }
        .vip_long {
          background-image: url(~@icon/lug/icon_vip_long.png);
          box-shadow: 0 0 10px rgba($color: $green-shadow, $alpha: .5);
        }
        .vip_gray {
          background-image: url(~@icon/lug/icon_vip_gray.png);
        }
      }
    }
    .font-gray {
      $size: 14px;
      height: $size;
      line-height: $size;
      font-size: $size;
      color: $gray-nd;
      margin-top: 8px;
    }
  }
  .row {
    padding: 12px 0;
    &:not(:last-child) {
      border-bottom: 1px solid $gray-rs;
    }
    >.col {
      padding: 0;
      text-align: left;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .label {
        $size: 14px;
        color: $gray-rd;
        font-size: $size;
        height: $size;
        line-height: $size;
      }
      .text {
        $size: 16px;
        margin-top: 12px;
        margin-left: 0;
        color: $gray-st;
        font-size: $size;
        height: $size;
        line-height: $size;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
      }
    }
  }
}
.body-second {
  margin-top: 30px;
  height: calc(100% - 330px);
  overflow-x: hidden;
  >.row {
    min-height: $rowHeight;
    &:first-child {
      margin-top: 24px;
    }
    &:not(:last-child) {
      >.right {
        >.row-block {
          border-left: 2px solid $gray-rd;
        }
      }
    }
    $padTop: 10px;
    >.left {
      width: 25rem;
      padding: 0 $ndRowIn 0 $ndRowOut;
      display: flex;
      justify-content: flex-end;
      .time {
        margin-right: 2 * $ndRowIn;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        $height: 36px;
        height: $height;
        >div:first-child {
          $size: 14px;
          font-size: $size;
          height: $size;
          line-height: $size;
          color: $gray-nd;
        }
        >div:last-child:not(:first-child) {
          $size: 16px;
          font-size: $size;
          height: $size;
          line-height: $size;
          color: $gray-st;
        }
      }
      .node {
        padding-top: $padTop;
        display: flex;
        flex-direction: column;
        position: relative;
        .circle {
          width: $circleWH;
          height: $circleWH;
          border-radius: 50%;
          background-color: transparent;
          border: 2px solid rgba($color: $gray-rd, $alpha: 1);
          &.active {
            border: 2px solid rgba($color: $blue, $alpha: 1);
          }
        }
        .star {
          $left: -$circleWH + 1px;
          position: absolute;
          $wh: 20px;
          width: $wh;
          height: $wh;
          left: $left;
          top: $padTop + $left;
          background-image: url(~@lug/mark_star.png);
        }
      }
    }
    >.col {
      padding: 0 5px 0 12px;
    }
    >.right {
      width: 75rem;
      padding: ($padTop - $circleWH)  $ndRowOut 0 $ndRowIn;
      text-align: left;
      >.label {
        $height: 16px;
        color: $gray-nd;
        height: $height;
        line-height: $height;
        font-size: $height;
        &.active {
          color: $gray-st;
          font-size: $height;
          font-weight: bold;
        }
      }
      >.row-block {
        $height: 16px;
        $size: 15px;
        margin-top: 4px;
        padding-top: 8px;
        padding-bottom: 6px;
        $left: 2 * $ndRowIn + $circleWH;
        margin-left: -$left;
        padding-left: $left;
        height: calc(100% - #{$height} - 12px);
        .text {
          color: $gray-nd;
          font-size: $size;
          height: $size;
          line-height: $size;
        }
        .pic-list {
          margin: 16px 0 0 0;
          display: flex;
          >div {
            height: 100%;
            &:not(:last-child) {
              margin-right: 20px;
            }
            >img {
              max-height: 150px;
              border-radius: 8px;
              overflow: hidden;
              width: auto;
              height: auto;
              max-width: 100%;
              cursor: zoom-in;
            }
          }
        }
      }
    }
  }
}
.label {
  width: calc(40%);
  white-space:nowrap;
}
.text {
  word-break: break-all;
}
</style>
