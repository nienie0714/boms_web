<template>
  <my-dialog :visible="visible" :position="'right'" :title="title" :footer="false" class="lug-detail-dialog under-head-dialog" @handleClose="handleClose">
    <template v-slot:header>
      <div class="return container" @click="handleClose">
        <div class="return-button"></div>
        <div>返回</div>
      </div>
      <div class="title">{{title}}</div>
    </template>
    <template>
      <div class="body-first">
        <div class="first-row">
          <div class="top">
            <div>
              <div class="bold">{{showValue(row, {key: 'luggage.lugNo'})}}</div>
              <div class="type-block">{{showValue(row, {key: 'luggage.progressStatusCn'})}}</div>
            </div>
            <div>
              <!-- <div :class="'added_' + (showValue(row, {key: 'luggage.isAddition'}) == 'Y' ? 'long' : 'gray')"></div> -->
              <div v-if="showValue(row, {key: 'luggage.isCancelCn'}) == 'Y'" :class="'pull_down_long'"></div>
              <div v-if="showValue(row, {key: 'luggage.isAddition'}) == 'Y'" :class="'added_long'"></div>
              <div v-if="showValue(row, {key: 'luggage.isVip'}) == 'Y'" :class="'vip_long'"></div>
              <div v-if="showValue(row, {key: 'luggage.isLookfor'}) == 'Y'" :class="'find_long'"></div>
              <div v-if="require('lodash').get(row, 'luggage.markingNum')>0" :class="'mark_long'"></div>
              <div v-if="showValue(row, {key: 'luggage.isCancelCn'}) !== 'Y'
              && showValue(row, {key: 'luggage.isAddition'}) !== 'Y'
              && showValue(row, {key: 'luggage.isVip'}) !== 'Y'
              && showValue(row, {key: 'luggage.isLookfor'}) !== 'Y'
              && (require('lodash').get(row, 'luggage.markingNum')<=0)" :class="'normal'"></div>
            </div>
          </div>
          <div class="font-gray">RFID：{{showValue(row, {key: 'luggage.rfidNo'})}}</div>
        </div>
        <div v-for="(item, group) in rowConf" :key="group" class="row">
          <div v-for="(col, index) in item" :key="index" :class="'col col-' + (col&&col.colWidth>0?col.colWidth:item.length)">
            <div v-if="col" class="label">{{col.label}}</div>
            <!-- <div v-if="col" :class="['text', col && col.class]" :title="showValue(row, col)">{{showValue(row, col)}}</div> -->
            <div v-if="col && col.key == 'luggage.nameCh'" :class="['text', col && col.class]" :title="showValue(row, col)?showValue(row, col): showValue(row, {key: 'luggage.nameEn'})">{{showValue(row, col)?showValue(row, col): showValue(row, {key: 'luggage.nameEn'})}}</div>
            <div v-if="col && col.key != 'luggage.nameCh'" :class="['text', col && col.class]" :title="showValue(row, col)">{{showValue(row, col)}}</div>
          </div>
        </div>
      </div>
      <div v-if="row&&row.hasOwnProperty('nodes')" class="body-second">
        <div v-for="(node, index) in row.nodes" :key="index" class="row">
          <div class="left">
            <div class="time">
              <div v-show="node.nodeNo != 'N-CHECKIN' && node.nodeNo != 'N-CANCLE'">(预) {{(node.timeE || emptyTime).substr(5, 11)}}</div>
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
              <div class="row">
                <template v-if="~require('lodash').has(nodeCont, node.nodeNo)">
                  <div v-for="(col, nIdx) in nodeCont[node.nodeNo]" :key="nIdx" :class="['col col-']"><!--  + (col&&col.colWidth>0?col.colWidth:nodeConf.length), col.class -->
                    <div class="text">{{col.label}}</div>
                    <div v-if="['luggage.chute', 'luggage.truck'].includes(col.key)" class="text" :style="`color: ${col.color}`" :title="showValue(row, col)">{{showValue(row, col)}}</div>
                    <div v-else class="text" :style="`color: ${col.color}`" :title="showValue(node, col)">{{showValue(node, col)}}</div>
                  </div>
                </template>
                <template v-else>
                  <div v-for="(col, nIdx) in nodeConf" :key="nIdx" :class="['col col-']"><!--  + (col&&col.colWidth>0?col.colWidth:nodeConf.length), col.class -->
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

            <!-- 值机交运图片展示 -->
            <template v-if="node.nodeNo=='N-CHECKIN'&&node.hasOwnProperty('lstLugMarkingVO')&&node.lstLugMarkingVO&&node.lstLugMarkingVO.length>0">
              <div v-for="(mark, mIndex) in node.lstLugMarkingVO" :key="mIndex" class="row-block">
                <div v-if="mark[picConf[0]]" class="pic-list">
                  <div v-for="(pic, pIdx) in picConf" :key="pIdx">
                    <template v-if="mark[pic]">
                      <img :src="dfs + mark[pic]" @click="clickShowImg((dfs + mark[pic]), pIdx, [mark[picConf[0]],mark[picConf[1]],mark[picConf[2]]])"/>
                    </template>
                  </div>
                </div>
              </div>
            </template>


            <!-- 标记类型 -->
            <template v-if="(node.nodeNo != 'N-CHECKIN')&&node.hasOwnProperty('lstLugMarkingVO')&&node.lstLugMarkingVO&&node.lstLugMarkingVO.length>0">
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

            <!-- 追加类型 -->
            <template v-if="node.hasOwnProperty('lstLugAdditionVO')&&node.lstLugAdditionVO&&node.lstLugAdditionVO.length>0">
              <div v-for="mark in node.lstLugAdditionVO" :key="mark.lugAdditionId" class="row-block">
                <div class="mark-type">
                  <div>追加类型：</div>
                  <div class="bold" style="color: #f79f2d;">{{mark.classifyCn}}</div>
                </div>
                <div class="row">
                  <div v-for="(col, nIdx) in markConf" :key="nIdx" :class="['col col-']">
                    <div class="text">{{col.label}}</div>
                    <div class="text" :style="`color: ${col.color}`" :title="showValue(mark, col)">{{showValue(mark, col)}}</div>
                  </div>
                </div>
                <div v-if="mark[picConf[0]]" class="pic-list">
                  <div v-for="(pic, pIdx) in picConf" :key="pIdx">
                    <template v-if="mark[pic]">
                      <img :src="dfs + mark[pic]" @click="clickShowImg((dfs + mark[pic]), pIdx ,[mark[picConf[0]],mark[picConf[1]],mark[picConf[2]]])"/>
                    </template>
                  </div>
                </div>
              </div>
            </template>

            <!-- 安全检查 -->
            <template v-if="node.nodeNo=='N-VERIFY-AUTO'&&node.hasOwnProperty('lstUnpackRecordVO')&&node.lstUnpackRecordVO&&node.lstUnpackRecordVO.length>0">
              <div class="row-block">
                <el-table
                  class="opera-table table"
                  :data="tableData.data"
                  style="width: 100%;"
                  highlight-current-row>
                  <template v-for="(item, index) in tableData.column" >
                    <el-table-column
            					:key="index"
            					:align="item.align || 'center'"
            					:prop="item.key"
            					:label="item.label"
            					:width="item.width"
            					:min-width="item.minWidth">
                      <template slot-scope="scope" >
                          <span :title="scope.row[item.key]">{{scope.row[item.key]}}</span>
                      </template>
            				</el-table-column>
            			</template> 
                </el-table>
              </div>
            </template>

            <!-- 图片预览 -->
            <image-viewer v-if="showImg" :img-index="previewSrcIndex" :on-close="closeViewer" :url-list="previewSrcList"/>

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
    ImageViewer,
  },
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
          {key: 'luggage.flightNo', label: '航班号', class: 'bold',colWidth: 5},
          {key: 'luggage.execDate', label: '航班日期', format: [0, 10],colWidth: 5},
          // {key: 'luggage.counterNo', label: '值机柜台',colWidth: 5},
          {key: 'luggage.chute', label: '行李滑槽',colWidth: 5},
          {key: 'luggage.stand', label: '机位',colWidth: 5},
          {key: 'luggage.truck', label: '容器号', colWidth: 5},
        ],
        [
          {key: 'luggage.nameCh', label: '旅客姓名', colWidth: 5},
          {key: 'luggage.idcardType', label: '证件类型', colWidth: 5},
          {key: 'luggage.idcardNo', label: '证件号码', colWidth: 2},
          
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
        {key: 'createName', label: '操作人：', colWidth: 3},
        {key: 'post', label: '岗位：', colWidth: 3},
        // {key: 'remark', label: '备注：', colWidth: 3}
      ],
      nodeCont: {
        'N-CHECKIN': [ // 值机交运
          {key: 'reserved1', label: '值机柜台：', colWidth: 3},
          // {key: 'post', label: '岗位：', colWidth: 3},
          // {key: 'remark', label: '备注：', colWidth: 3},
        ],
        'N-VERIFY-AUTO': [ // 安全检查
          {key: 'createName', label: '开包人：', colWidth: 3},
          {key: 'reserved1', label: '开包物品数：', colWidth: 3},
          {key: 'createtime', label: '检查时间：', colWidth: 3, format: [5, 11]}
        ],
        'N-LOAD-TRUCK': [ // 离港分拣
          {key: 'createName', label: '操作人：', colWidth: 3},
          {key: 'post', label: '岗位：', colWidth: 3},
          {key: 'reserved1', label: '滑槽号：', colWidth: 3}
        ],
        // 'N-TRANSPORT': [ // 行李运输
        //   {key: 'createName', label: '操作人：', colWidth: 4},
        //   {key: 'post', label: '岗位：', colWidth: 4},
        //   {key: 'luggage.truck', label: '容器号：', colWidth: 2}
        // ],
        'N-LOAD-AIRCRAFT': [ // 卸车装机
          {key: 'createName', label: '操作人：', colWidth: 3},
          {key: 'post', label: '岗位：', colWidth: 3}
        ],
        'N-UNLOAD-AIRCRAFT': [ // 进港卸机/卸机装车
          {key: 'createName', label: '操作人：', colWidth: 3},
          {key: 'post', label: '岗位：', colWidth: 3},
          // {key: 'remark', label: '备注：', colWidth: 3}
        ],
        'N-TRANSPORT': [ // 行李运输
          {key: 'createName', label: '操作人：', colWidth: 3},
          {key: 'post', label: '岗位：', colWidth: 3}
        ],
        'N-UPLOAD': [ // 到达卸车
          {key: 'createName', label: '操作人：', colWidth: 3},
          {key: 'post', label: '岗位：', colWidth: 3}
        ],
        'N-SELF-CHECK': [ // 自提核验
          {key: 'createName', label: '操作人：', colWidth: 3},
          {key: 'post', label: '岗位：', colWidth: 3}
        ],
        'N-CANCLE': [ // 拉下
          {key: 'createName', label: '操作人：', colWidth: 3},
          {key: 'post', label: '岗位：', colWidth: 3}
        ],
      },
      markConf: [
        {key: 'createName', label: '操作人：', colWidth: 3},
        {key: 'post', label: '岗位：', colWidth: 3},
        {key: 'createtime', label: '标记时间：', format: [5, 11], colWidth: 3}
      ],
      picConf: ['photo1', 'photo2', 'photo3'],
      showImg: false,
      showImgPath: '',
      previewSrcIndex: 0,
      previewSrcList: [],
      tableData: {
        column: [
          {key: 'artType',  label: '物品类型', minWidth: 140, title: true},
          {key: 'artQuantity', label: '物品数量', minWidth: 100, title: true},
          {key: 'artUnit', label: '单位', minWidth: 60,},
          {key: 'artDisposition',  label: '处置方式', minWidth: 100,title: true,},
        ],
        data: []
      }
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
      if (this.row.luggage.inOutFlag == 'D') {
        this.rowConf.splice(0, 1, [
          {key: 'luggage.flightNo', label: '航班号', class: 'bold',colWidth: 5},
          {key: 'luggage.execDate', label: '航班日期', format: [0, 10],colWidth: 5},
          // {key: 'luggage.counterNo', label: '值机柜台',colWidth: 5},
          {key: 'luggage.chuteNo', label: '行李滑槽',colWidth: 5},
          {key: 'luggage.stand', label: '机位',colWidth: 5},
          {key: 'luggage.truck', label: '容器号', colWidth: 5},
        ])
      } else if (this.row.luggage.inOutFlag == 'A') {
        this.rowConf.splice(0, 1, [
          {key: 'luggage.flightNo', label: '航班号', class: 'bold', colWidth: 5},
          {key: 'luggage.execDate', label: '航班日期', format: [0, 10], colWidth: 5},
          {key: 'luggage.belt', label: '行李转盘', colWidth: 5},
          {key: 'luggage.stand', label: '机位', colWidth: 5},
          {key: 'luggage.truck', label: '容器号', colWidth: 5},
        ])
      }
      this.row.nodes.forEach(item=>{
        if(item.nodeNo == 'N-VERIFY-AUTO') {
          this.tableData.data = item.lstUnpackRecordVO;
        }
      })
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
    height: 100%;
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
  }
  >.col- {
    &:not(:last-child) {
      margin-right: 10px;
    }
    >.text {
      max-width: 85px;
    }
  }
}
.body-first {
  margin: 0 20px;
  padding: 20px 20px 8px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba($color: $white-shadow, $alpha: .3);
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
          box-sizing: content-box;
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
          // box-shadow: 0 0 10px rgba($color: $red-shadow, $alpha: .5);
        }
        .pull_down_gray {
          background-image: url(~@icon/lug/icon_pull_down_gray.png);
        }
        .added_long {
          background-image: url(~@icon/lug/icon_added_long.png);
          // box-shadow: 0 0 10px rgba($color: $blue-shadow, $alpha: .5);
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
        .vip_long {
          background-image: url(~@icon/lug/icon_vip_long.png);
          // box-shadow: 0 0 10px rgba($color: $green-shadow, $alpha: .5);
        }
        .vip_gray {
          background-image: url(~@icon/lug/icon_vip_gray.png);
        }
        .mark_long {
          background-image: url(~@icon/lug/icon_mark_long.png);
          // box-shadow: 0 0 10px rgba($color: $green-shadow, $alpha: .5);
        }
        .normal {
          background-image: url(~@icon/lug/icon_mark_gray.png);
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
        white-space: nowrap;
        word-break: break-all;
        width: 100%;
      }
    }
  }
}
.body-second {
  margin-top: 30px;
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
/deep/.el-table {
  border-radius: 8px;
  border: 1px solid rgba(223,233,240,1);
  .cell {
      white-space: nowrap;
  }
  thead {
      border-top: 1px solid $gray-border;
  }
  th{
      padding: 4px 0;
      background-color: rgba($color: $gray-border, $alpha: .2);
      border-bottom: 1px solid $gray-border!important;
      font-size: 14px;
      font-weight: bold;
      color: #718499;
  }
  tbody tr {
      height: 36px;
      border-top: 1px solid $gray-border!important;
      border-bottom: 1px solid $gray-border!important;
  }
  
  td {
      padding: 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #3d424d;
      font-size: 14px;
      
  }
  .el-table__fixed-right {
      // box-shadow: -4px 0 30px rgba($color: $white-shadow, $alpha: .1);
      z-index: 0;
  }
  .el-table__fixed-right-patch {
      top: 0;
      background-color: rgba($color: $gray-border, $alpha: .2);
      border-top: 1px solid $gray-border!important;
      border-bottom: 1px solid $gray-border!important;
  }

  .el-table__body tr.hover-row.current-row>td,
  .el-table__body tr.hover-row.el-table__row--striped.current-row>td,
  .el-table__body tr.hover-row.el-table__row--striped>td,
  .el-table__body tr.hover-row>td {
      background: transparent;
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
