<template>
  <my-dialog :visible="visible" :position="'right'" :title="title" :footer="false" class="lug-detail-dialog under-head-dialog" @handleClose="handleClose">
    <template v-slot:header>
      <!-- <div class="return container" @click="handleClose"> -->
        <!-- <div class="return-button"></div> -->
        <!-- <div>返回</div> -->
      <!-- </div> -->
      <div class="title">{{title}}</div>
    </template>
    <template>
      <div class="body-first">
        <div class="first-row">
          <div v-for="(item, tindex) in topConf" :key="tindex" class="first-row-item">
            <div v-for="(col,index) in item" :key="index">
              <div v-if="col.key =='luggage.execTimeA'">{{showValue(row, {key: 'eta'})}} / {{showValue(row, {key: 'sta'})}} / {{showValue(row, {key: 'ata'})}}</div>
              <div v-else-if="col.key =='luggage.execTimeD'">{{showValue(row, {key: 'etd'})}} / {{showValue(row, {key: 'std'})}} / {{showValue(row, {key: 'atd'})}}</div>
              <div v-else>{{showValue(row, col)}}</div>
            </div>
          </div>
          <div class="center-icon">
          </div>
        </div>
        <div v-for="(item, group) in rowConf" :key="group" class="row">
          <div v-for="(col, index) in item" :key="index" :class="'col col-' + (col&&col.colWidth>0?col.colWidth:item.length)">
            <div v-if="col" class="label">{{col.label}}</div>
            <!-- <div v-if="col" :class="['text', col && col.class]" :title="showValue(row, col)">{{showValue(row, col)}}</div> -->
            <div v-if="col && col.key == 'luggage.nameCh' && showValue(row, col) && showValue(row, {key: 'luggage.nameEn'})" :class="['text', col && col.class]" :title="showValue(row, col) + '/'+ showValue(row, {key: 'luggage.nameEn'})">{{showValue(row, col)}}/{{showValue(row, {key: 'luggage.nameEn'})}}</div>
            <div v-else-if="col && col.key == 'luggage.nameCh'" :class="['text', col && col.class]" :title="showValue(row, col)?showValue(row, col): (showValue(row, {key: 'luggage.nameEn'}))">{{showValue(row, col)?showValue(row, col): showValue(row, {key: 'luggage.nameEn'})}}</div>
            <div v-else-if="col && col.key == 'luggage.nowProgressStatus'" :class="['text', col && col.class]" :title="showValue(row, col)" style="overflow: visible; color: #3392ff;">{{showValue(row, {key: 'luggage.lugProgressStatusDCn'})?showValue(row, {key: 'luggage.lugProgressStatusDCn'}):showValue(row, {key: 'luggage.lugProgressStatusACn'})}}
              <div style="font-size: 12px; color: #899DB2;">容器号：{{showValue(row, {key: 'luggage.truckD'})?showValue(row, {key: 'luggage.truckD'}):showValue(row, {key: 'luggage.truckA'})}}</div>
            </div>
            <div v-else-if="col && col.key == 'luggage.lugType'">
              <div v-if="showValue(row, {key: 'luggage.isCancel'}) == 'Y'" :class="['text','pull_down_long']">拉减</div>
              <div v-if="showValue(row, {key: 'luggage.isAddition'}) == 'Y'" :class="['text','added_long']">追加</div>
              <div v-if="showValue(row, {key: 'luggage.isVip'}) == 'Y'" :class="['text','vip_long']">VIP</div>
              <!-- <div v-if="showValue(row, {key: 'luggage.isLookfor'}) == 'Y'" :class="'find_long'"></div> -->
              <!-- <div v-if="require('lodash').get(row, 'luggage.markingNum')>0" :class="'mark_long'"></div> -->
              <div v-if="showValue(row, {key: 'luggage.isCancel'}) !== 'Y'
              && showValue(row, {key: 'luggage.isAddition'}) !== 'Y'
              && showValue(row, {key: 'luggage.isVip'}) !== 'Y'" :class="['text','normal']">普通</div>
            </div>
            <div v-else :class="['text', col && col.class]" :title="showValue(row, col)">{{showValue(row, col)}}</div>
          </div>
        </div>
        <!-- todo照片附件 待定没有字段 -->
      </div>
      <div v-if="row&&row.hasOwnProperty('nodes')&&row.nodes" class="body-second">
        <div v-for="(node, index) in row.nodes" :key="index" class="row">
          <div class="left">
            <div class="time">
              <div>(预) {{(node.timeE || emptyTime).substr(5, 11)}}</div>
              <div v-if="node.timeA">{{(node.timeA || emptyTime).substr(5, 11)}}</div>
            </div>
            <div class="node">
              <div v-if="node.lstLugMarkingVO && node.lstLugMarkingVO.length > 0" class="mark-star"></div>
              <div v-else :class="'circle' + (node.timeA?' active':'')"></div>
            </div>
          </div>
          <div class="right">
            <div :class="'label' + (node.timeA?' active':'')">{{node.nodeCn}}</div>
            <div class="row-block">
              <div class="row" style="flex-wrap: wrap;">
                <template v-if="~require('lodash').has(nodeCont, node.nodeNo)">
                  <div v-for="(col, nIdx) in nodeCont[node.nodeNo]" :key="nIdx" :class="['col col-' + (col&&col.colWidth>0?col.colWidth:item.length)]"><!--  + (col&&col.colWidth>0?col.colWidth:nodeConf.length), col.class -->
                    <div class="text">{{col.label}}</div>
                    <!-- <div v-if="['luggage.chute', 'luggage.truck'].includes(col.key)" class="text" :style="`color: ${col.color}`" :title="showValue(row, col)">{{showValue(row, col)}}</div> -->
                    <div class="text" :style="`color: ${col.color}`" :title="showValue(node, col)">{{showValue(node, col)}}</div>
                  </div>
                </template>
                <template v-else>
                  <div v-for="(col, nIdx) in nodeConf" :key="nIdx" :class="['col col-']">
                    <div class="text">{{col.label}}</div>
                    <div class="text" :style="`color: ${col.color}`" :title="showValue(node, col)">{{showValue(node, col)}}</div>
                  </div>
                </template>
              </div>
              <div v-if="node[picConf[0]]" class="pic-list">
                <div v-for="(pic, pIdx) in picConf" :key="pIdx">
                  <template v-if="node[pic]">
                    <img :src="dfs + node[pic]" @click="clickShowImg((dfs + node[pic]), pIdx, [node[picConf[0]],node[picConf[1]],node[picConf[2]]])"/>
                  </template>
                </div>
              </div>
            </div>
            <!-- <div v-if="showImg" class="show-img" @click="showImg = false">
              <img :src="showImgPath"/>
            </div> -->
            <template v-if="node.hasOwnProperty('lstLugMarkingVO')&&node.lstLugMarkingVO&&node.lstLugMarkingVO.length>0">
              <div v-for="(mark, mIndex) in node.lstLugMarkingVO" :key="mIndex" class="row-block">
                <div class="mark-type">
                  <div>标记类型：</div>
                  <div class="bold" style="color: #f79f2d;">{{mark.classifyCn}}</div>
                </div>
                <div class="row">
                  <div v-for="(col, nIdx) in markConf" :key="nIdx" :class="['col col-']"><!--  + (col&&col.colWidth>0?col.colWidth:nodeConf.length), col.class -->
                    <div class="text">{{col.label}}</div>
                    <div class="text" :style="`color: ${col.color}`" :title="showValue(mark, col)">{{showValue(mark, col)}}</div>
                  </div>
                </div>
                <div v-if="mark.markingCont" class="row">
                  <div :class="['col col-1']"><!--  + (col&&col.colWidth>0?col.colWidth:nodeConf.length), col.class -->
                    <div class="text">标记内容：</div>
                    <div class="text" :title="mark.markingCont">{{mark.markingCont}}</div>
                  </div>
                </div>
                <div v-if="mark[picConf[0]]" class="pic-list">
                  <div v-for="(pic, pIdx) in picConf" :key="pIdx">
                    <template v-if="mark[pic]">
                      <img :src="dfs + mark[pic]" @click="clickShowImg((dfs + mark[pic]), pIdx, [mark[picConf[0]],mark[picConf[1]],mark[picConf[2]]])"/>
                    </template>
                  </div>
                </div>
              </div>
            </template>
            
            <!-- 图片预览 -->
            <image-viewer v-if="showImg" :img-index="previewSrcIndex" :on-close="closeViewer" :url-list="previewSrcList"/>
          </div>
        </div>
        <!-- 中断原因 -->
        <div v-if="row&&row.hasOwnProperty('luggage')&&row.luggage.status == 4" class="body-third">
          <div v-for="col in reasonConf" :key="col.label" class="row">
            <div class="label">{{col.label}}</div>
            <div class="text" >{{showValue(row.luggage, col)}}</div>
          </div>
        </div>



      </div>
      
    </template>
  </my-dialog>
</template>

<script>
import utilMixin from '@mixin/utilMixin'
import ImageViewer from '@view/imageViewer/ImageViewer'
import _ from 'lodash'

export default {
  components: {
    ImageViewer
  },
  mixins: [utilMixin],
  props: ['row','showDetail'],
  data () {
    return {
      dfs: '',
      emptyTime: '----/--/-- --:--:--',
      visible: false,
      title: '中转行李详细信息',
      topConf: [
        [
          {key: 'luggage.flightNoA', label: '进港航班号'},
          {key: 'luggage.originIataCn', label: '始发站'},
          {key: 'luggage.execDateA', label: '进港航班日期', format: [0, 10]},  
          {key: 'luggage.execTimeA', label: '进港航班预计/计划/实际到达时间', format: [11, 5]},  
        ],
        [
          {key: 'luggage.flightNoD', label: '出港航班号'},
          {key: 'luggage.destIataCn', label: '目的站'},
          {key: 'luggage.execDateD', label: '出港航班日期', format: [0, 10]},  
          {key: 'luggage.execTimeD', label: '出港航班预计/计划/实际起飞时间', format: [11, 5]},  
        ]
      ],
      rowConf: [
        [
          {key: 'luggage.lugNo', label: '进港行李号', class: 'bold'},
          {key: 'luggage.standA', label: '进港机位', class: 'bold'},
          {key: 'luggage.newLugNo', label: '出港行李号', class: 'bold'},
          {key: 'luggage.standD', label: '出港机位', class: 'bold'},
        ],
        [
          {key: 'luggage.nameCh', label: '旅客姓名'},
          {key: 'luggage.phone', label: '联系方式'},
          {key: 'luggage.idcardNo', label: '证件号码'},
          {key: 'luggage.seatNo', label: '旅客座位号'},
          // {key: 'luggage.truckD', label: '容器号'},
        ],
        [
          {key: 'luggage.orderNo', label: '预约中转订单号'},
          {key: 'luggage.appointTime', label: '预约中转时间', format: [5, 14]},
          {key: 'luggage.nowProgressStatus', label: '当前进度'},
          {key: 'luggage.lugType', label: '行李类型'},
        ],
        /* [
          {key: 'luggage.progressStatusCn', label: '行李状态'},
          {key: 'luggage.isCancel', label: '是否拉减', enumKey: 'isYOrN'},
          {key: 'luggage.isAddition', label: '是否追加', enumKey: 'isYOrN'},
          {key: 'luggage.isLookfor', label: '是否挑找', enumKey: 'isYOrN'},
          {key: 'luggage.isVip', label: '是否VIP', enumKey: 'isYOrN'}
        ], */
      ],
      nodeConf: [
        {key: 'createName', label: '操作人：', colWidth: 3},
        {key: 'postName', label: '岗位：', colWidth: 3},
        // {key: 'remark', label: '备注：', colWidth: 3}
      ],
      nodeCont: {
        'N-UNLOAD-AIRCRAFT': [  //进港卸机/卸机装车
          {key: 'empName', label: '操作人：', colWidth: 3},
          {key: 'postName', label: '岗位：', colWidth: 3}
        ],
        'N-TRANSPORT-S-A': [  // 进港运输开始
        ],
        'N-TRANSPORT-E-A': [  // 进港运输结束
        ],
        'N-UPLOAD': [  //卸车上转盘/到达卸车
          {key: 'empName', label: '操作人：', colWidth: 3},
          {key: 'postName', label: '岗位：', colWidth: 3}
        ],
        'N-TRANSFER': [       // 中转执行
          // transferTime 改为    transferSendName改为empName
          // {key: 'transferTime', label: '中转时间：', format: [5, 11], colWidth: 2},
          {key: 'empName', label: '中转发起人：', colWidth: 2},
          // {key: 'truckReceiveTime', label: '离港接收时间：', format: [5, 11], colWidth: 2},
          // {key: 'transferReceiveName', label: '离港接收人：', colWidth: 2},
        ],
        'N-LOAD-TRUCK': [     // 分拣装车/离港分拣
          {key: 'empName', label: '操作人：', colWidth: 3},
          {key: 'postName', label: '岗位：', colWidth: 3},
          {key: 'truck', label: '容器号：', colWidth: 3}
        ],
        'N-TRANSPORT-S-D': [  // 出港运输开始
        ],
        'N-TRANSPORT-E-D': [  // 出港运输结束
        ],
        'N-LOAD-AIRCRAFT': [   // 卸车装机
          {key: 'empName', label: '操作人：', colWidth: 3},
          {key: 'postName', label: '岗位：', colWidth: 3}
        ],
        'N-CANCLE': [   // 拉下
          {key: 'empName', label: '操作人：', colWidth: 3},
          {key: 'postName', label: '岗位：', colWidth: 3}
        ],
      },
      markConf: [
        {key: 'createName', label: '操作人：', colWidth: 3},
        {key: 'post', label: '岗位：', colWidth: 3},
        {key: 'createtime', label: '标记时间：', format: [5, 11], colWidth: 3}
      ],
      reasonConf: [
        {key: 'remark', label: '中断原因：', colWidth: 2},
        {key: 'handler', label: '操作人：', colWidth: 2},
        {key: 'handleTime', label: '操作时间：', format: [5, 14], colWidth: 2}
      ],
      picConf: ['photo1', 'photo2', 'photo3'],
      showImg: false,
      showImgPath: '',
      previewSrcIndex: 0,
      previewSrcList: [],
    }
  },
  mounted () {
    this.dfs = this.$store.getters.getConfigValue('dfs')
  },
  methods: {
    clickShowImg (path, index, list) {
      this.previewSrcList = [];
      this.showImgPath = path
      list.forEach(item=>{
        if(item) {
          this.previewSrcList.push(this.dfs + item)
        }
      })
      this.previewSrcIndex = index;
      this.showImg = true
    },
    closeViewer() {
      this.showImg = false
    },
    changeData () {
      this.visible = true
    },
    handleClose () {
      this.visible = false
      this.$options.parent.row = {}
      this.$options.parent.showDetail = false;
    }
  },
  watch: {
    row: {
      handler (data) {
        if (data) {
          // this.changeData()
        }
      },
      immediate: true
    },
    showDetail(val) {
      if(val) {
        this.changeData()
      }
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
    display: flex;
    flex-direction: column;
  }
}
</style>


<style lang="scss" scoped>
$bodyTop: 250px;
$bodyHead: 50px;
$rowHeight: 80px;
$ndRowOut: 20px;
$ndRowIn: 8px;
$circleWH: 10px;
$markstarWH: 16px;
$timeWidth: 40px;
$transWidth: 0;
.dialog {
  width: 30px;
  height: 50px;
}
.return {
  $wh: 16px;
  margin: auto 0;
  position: absolute;
  left: 20px;
  font-size: $wh;
  line-height: $bodyHead;
  font-weight: bold;
  color: #3D424D;
  cursor: pointer;

  >.return-button {
    margin-top: ($bodyHead - $wh - 2) / 2;
    margin-right: 6px;
    width: $wh;
    height: $wh;
    background-image: url(~@icon/lug/icon_return_button.png);
  }
}
.row {
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  >.col {
    text-align: left;
    display: flex;
    align-items: center;
    font-size: 16px;
    min-height: 20px;
  }
  >.col- {
    &:not(:last-child) {
      margin-right: 10px;
    }
    >.text {
      max-width: 100px;
    }
  }
}
.body-first {
  margin: 0 20px;
  padding: 20px 20px 8px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba($color: $white-shadow, $alpha: .3);
  background: url(~@img/bg/bg_transfer_img.png) top left no-repeat;
  background-size: 100%;
  .first-row {
    display: flex;
    justify-content: space-between;
    position: relative;
    .center-icon {
      position: absolute;
      left: 50%;
      top: 44px;
      transform: translateY(-50%);
      width: 26px;
      height: 26px;
      border-radius: 100%;
      background: url(~@icon/lug/icon_flight.png) center center no-repeat;
    }
    .first-row-item {
      width: 48%;
      >div:first-child {
        font-size: 29px;
        font-weight: bold;
        line-height: 35px;
        color: #3D424D;
        font-family: 'DINPRO-BOLD';
      }
      >div:nth-child(2) {
        font-size: 16px;
        font-weight: bold;
        line-height: 20px;
        color: #3D424D;
      }
      >div:last-child {
        font-size: 16px;
        line-height: 30px;
        color: #3D424D;
      }

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
        white-space: nowrap;
        word-break: break-all;
        width: 100%;
        &.normal {
          color: #3392ff;
          // color: $gray-rd;
        }
        &.pull_down_long {
          color: #3392ff;
          // color: $gray-rd;
        }
        &.added_long {
          color: #3392ff;
          // color: $gray-rd;
        }
        &.vip_long {
          color: #3392ff;
          // color: $gray-rd;
        }
      }
      
    }
    .pull_down_gray {
      background-image: url(~@icon/lug/icon_pull_down_gray.png);
    }
    .added_gray {
      background-image: url(~@icon/lug/icon_added_gray.png);
    }
    .find_long {
      background-image: url(~@icon/lug/icon_find_long.png);
      // box-shadow: 0 0 10px rgba($color: $yellow-shadow, $alpha: .5);
    }
    .find_gray {
      background-image: url(~@icon/lug/icon_find_gray.png);
    }
    .vip_gray {
      background-image: url(~@icon/lug/icon_vip_gray.png);
    }
    .mark_long {
      background-image: url(~@icon/lug/icon_mark_long.png);
      // box-shadow: 0 0 10px rgba($color: $green-shadow, $alpha: .5);
    }
  }
}
.body-second {
  margin-top: 30px;
  margin-bottom: 20px;
  height: calc(100% - 260px);
  overflow-x: hidden;
  >.row {
    // min-height: $rowHeight;
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
    $leftW: 160px;
    >.left {
      width: $leftW;
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
        .mark-star {
          margin-left: 0;
          margin-right: ($circleWH - $markstarWH) / 2;
          margin-top: ($circleWH - $markstarWH) / 2;
          width: $markstarWH;
          height: $markstarWH;
          background-image: url(~@lug/mark_marking.png);
        }
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
      width: calc(100% - #{$leftW});
      padding: $padTop  $ndRowOut 0 $ndRowIn;
      text-align: left;
      >.label {
        $height: 16px;
        color: $gray-nd;
        font-weight: bold;
        height: $height;
        line-height: $height;
        font-size: $height;
        margin-bottom: 8px;
        &.active {
          color: $gray-st;
          font-size: $height;
        }
      }
      >.row-block {
        $height: 16px;
        $size: 15px;
        // margin-top: 8px;
        padding-top: 8px;
        padding-bottom: 6px;
        $left: 2 * $ndRowIn + $circleWH;
        margin-left: 4-$left;
        padding-left: $left;
        // height: calc(100% - 12px);
        >.mark-type {
          display: flex;
          font-size: 16px;
          color: $gray-st;
        }
        .text {
          color: $gray-nd;
          font-size: $size;
          height: $size;
          line-height: $size;
          &:first-child {
            white-space: nowrap;
          }
          &:last-child {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: inherit;
          }
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
.body-third {
  text-align: left;
  margin: 20px 20px 0;
  padding: 20px 0;
  border-top: 1px solid #dae3eb;
  .row {
    display: flex;
  }
  .label {
    width: auto;
    color: #a3b6cc;
    font-size: 14px;
    height: 14px;
    line-height: 14px;
  }
  .text {
    color: #3d424c;
    font-size: 16px;
    height: 16px;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
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
