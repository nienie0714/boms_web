<template>
  <div class="table container cross" :style="`height: ${tableData.height}px;`">
    <div class="table-header">
      <div v-for="(column, colIndex) in columnHeaderData" :key="colIndex" :class="(colIndex==columnData.length-1)?'right-table':(colIndex==0?'left-table':'center-table')"
      :ref="(colIndex==columnData.length-1)?'rightTableH':(colIndex==0?'leftTableH':'centerTableH')"
      :style="(colIndex==columnData.length-1)?`width: ${rightWidth}px;`:(colIndex==0?`width: ${leftWidth}px;`:`width: calc(100% - ${leftWidth + rightWidth}px);`)">
      <!-- colIndex==1?`width: calc(100% - ${leftWidth + rightWidth}px);`:`width: ${colIndex==0?leftWidth:rightWidth}px;`"> -->
        <table border="0" cellpadding="0" cellspacing="0" :style="((colIndex!=columnData.length-1)&&(colIndex>0))?`width: ${centerWidth}px`:''"><!-- colIndex==0?'left-table':(colIndex==1?'center-table':'right-table') -->
          <thead>
            <tr v-for="(col, cIndex) in column" :key="cIndex">
              <th v-for="(item, itemIndex) in col" :key="itemIndex" v-show="!item.hidden"
              :rowspan="item.rowspan" :colspan="item.colspan"
              :class="['row_height_'+(item.rowspan?item.rowspan:1), item.titleClass, item.class]"
              :style="`width:${item.width?(item.width+'px'):'auto'}; max-width:${item.width?(item.width+'px'):'auto'};`">
                <template v-if="tableData.type=='mult' && itemIndex == 0">
                  <div :class="(tableData.multSelection.length == tableData.data.length && tableData.data.length > 0)?'radio is-checked':'radio'" @click="selectAuto"></div>
                </template>
                <!-- <template v-else-if="tableData.type=='button'">
                  <el-button type="primary" plain>主要按钮</el-button>
                </template> -->
                <template>{{item.label}}</template>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <div class="table-body">
      <div v-if="loading" class="table-load">
        <div>
          <div class="icon-load">
            <div class="load-center"></div>
          </div>
        </div>
      </div>
      <div v-else-if="!spliceData.data||spliceData.data.length<=0" class="table-empty">
        <div>
          <div class="empty">
            <div class="empty-text">无可显示的结果</div>
          </div>
        </div>
      </div>
      <div v-for="(col, colIndex) in columnData" :key="colIndex" :class="(colIndex==columnData.length-1)?'right-table':(colIndex==0?'left-table':'center-table')"
      :ref="(colIndex==columnData.length-1)?'rightTable':(colIndex==0?'leftTable':'centerTable')"
      :style="(colIndex==columnData.length-1)?`width: ${rightWidth}px;`:(colIndex==0?`width: ${leftWidth}px;`:`width: calc(100% - ${leftWidth + rightWidth}px);`)" @mousewheel="scrollEvent">
      <!-- colIndex==1?`width: calc(100% - ${leftWidth}px - ${rightWidth + 17}px);`:`width: ${colIndex==0?(leftWidth):rightWidth+17}px` -->
      <!-- (colIndex==columnData.length-1)?(rightWidth+17+'px'):(colIndex==0?(leftWidth+'px'):`width: calc(100% - ${leftWidth}px - ${rightWidth + 17}px);`) -->
        <table border="0" cellpadding="0" cellspacing="0" :style="((colIndex!=columnData.length-1)&&(colIndex>0))?`width: ${centerWidth}px`:''"><!-- (colIndex!=columnData.length-1)&&(colIndex>0)?`width: ${centerWidth}px`:'' -->
          <tbody>
            <tr v-for="(row, index) in spliceData.data" :key="row[tableData.key]" :class="[(index%2==0)?'single-row':'', selectIndex==index?'select-index':'']"
            @dblclick="handleDblClick(row)" @click="selectRowTr(row, index)">
              <td v-for="(item, itemIndex) in col" :key="itemIndex" v-show="!item.hidden"
              :title="item.title?(item.titleText?item.titleText:showValue(row, item)):false" :class="item.class"
              :style="'width:'+(item.width?(item.width- ((colIndex==columnData.length-1)&&(itemIndex==col.length-1)?17:0) +'px;'):'auto;')
              + 'max-width:'+(item.width?(item.width- ((colIndex==columnData.length-1)&&(itemIndex==col.length-1)?17:0) +'px;'):'auto;')
              +`color: ${item.color};`">
                <template v-if="item.type=='opr'">
                  <div v-if="permissions.update" class="table-opr update" @click="openDetail('update', row)"></div>
                  <div v-if="permissions.remove" class="table-opr remove" @click="openRemove(row)"></div>
                  <div v-if="permissions.reset" class="table-opr reset" @click="openDetail('reset', row)"></div>
                  <div v-if="permissions.detail" class="table-opr detail" @click="openDetail('detail', row)"></div>
                </template>
                <template v-else-if="item.type!='slot'">
                  <template v-if="item.type=='mult'">
                    <div :class="~require('lodash').findIndex(tableData.multSelection, [tableData.key, row[tableData.key]])?'radio is-checked':'radio'" @click="selectRow(row)"></div>
                  </template>
                  <template v-else>{{showValue(row, item)}}</template>
                </template>
                <slot v-else name="slot-body" :index="index" :row="row" :item="item"></slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { flattenDeepChild, flattenDeepSort } from '@/util/util.js'
import utilMixin from '@mixin/utilMixin'
import _ from 'lodash'

export default {
  mixins: [utilMixin],
  props: {
    tableData: {},
    loading: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: Object,
      default: ()=>{}
    }
  },
  data () {
    return {
      selectIndex: null,
      columnData: [],
      columnHeaderData: [],
      leftWidth: 0,
      centerWidth: 0,
      rightWidth: 0,
      spliceData: {
        length: 30,
        index: 0,
        data: []
      }
    }
  },
  mounted () {
    this.spliceData.index = 0 + this.spliceData.length
    this.changeColumn(this.tableData.column)
    this.getTableWidth()
    this.$nextTick(() => {
      this.scrollTable()
    })
  },
  methods: {
    changeColumn (column) {
      this.columnData = []
      this.columnHeaderData = []
      _.forEach(column, (col) => {
        this.columnData.push(flattenDeepChild(col, 'child'))
        this.columnHeaderData.push(flattenDeepSort(col, 'child', 0))
      })
    },
    getTableWidth () {
      this.leftWidth = 0
      this.centerWidth = 0
      this.rightWidth = 0
      _.forEach(this.columnData, (column, index) => {
        if (index==this.columnData.length-1) {
          _.forEach(column, (o) => {
            this.rightWidth += o.width
          })
        } else if (index == 0) {
          _.forEach(column, (o) => {
            this.leftWidth += o.width
          })
        } else {
          _.forEach(column, (o) => {
            this.centerWidth += o.width
          })
        }
      })
    },
    changeData () {
      this.spliceData.data = this.tableData.data.slice(0, this.spliceData.index)
      if (this.tableData.data && this.tableData.data.length == 0) {
        let rightBody = this.$refs['rightTable'] ? this.$refs['rightTable'][0] : null
        if (rightBody) {
          rightBody.scrollTop = 0
        }
        this.spliceData.index = 0 + this.spliceData.length
      }
    },
    scrollTable () {
      let leftBody = this.$refs['leftTable'] ? this.$refs['leftTable'][0] : null
      let centerBody = this.$refs['centerTable'] ? this.$refs['centerTable'][0] : null
      let rightBody = this.$refs['rightTable'] ? this.$refs['rightTable'][0] : null
      let _this = this
      if (rightBody) {
        rightBody.onscroll = function () {
          if (((this.scrollTop + this.clientHeight) / this.scrollHeight >= 0.96) && (_this.spliceData.data.length < _this.tableData.data.length)) {
            _this.spliceData.index += _this.spliceData.length
            _this.spliceData.data = _this.tableData.data.slice(0, _this.spliceData.index)
          }
          let rightTop = this.scrollTop
          if (leftBody) {
            leftBody.scrollTop = rightTop
          }
          if (centerBody) {
            centerBody.scrollTop = rightTop
          }
        }
      }
      if (centerBody) {
        let centerTableH = this.$refs['centerTableH'] ? this.$refs['centerTableH'][0] : null
        centerBody.onscroll = function () {
          let rightLeft = this.scrollLeft
          if (centerTableH) {
            centerTableH.scrollLeft = rightLeft
          }
        }
      }
    },
    scrollEvent (event) {
      let scrollTop = event.wheelDeltaY
      let rightBody = this.$refs['rightTable'] ? this.$refs['rightTable'][0] : null
      if (rightBody) {
        rightBody.scrollTop -= scrollTop
      }
    },
    selectAuto () {
      if (this.tableData.multSelection.length == this.tableData.data.length) {
        this.tableData.multSelection = []
      } else {
        this.tableData.multSelection = _.cloneDeep(this.tableData.data)
      }
    },
    selectRow (row) {
      let index = _.findIndex(this.tableData.multSelection, [this.tableData.key, row[this.tableData.key]])
      if (~index) {
        this.tableData.multSelection.splice(index, 1)
      } else {
        this.tableData.multSelection.push(row)
      }
    },
    selectRowTr (row, index) {
      this.selectIndex = index
      if (this.tableData.type == 'single') {
        this.tableData.multSelection = []
        this.tableData.multSelection.push(row)
      }
    },
    handleDblClick (row) {
      this.$emit('handleDblClick', row)
    },
    openDetail (type, row) {
      this.$emit('openDetail', {type, row})
    },
    openRemove (row) {
      this.$emit('openRemove', row)
    }
  },
  watch: {
    'tableData.column': {
      handler (column) {
        this.changeColumn(column)
        this.getTableWidth()
      },
      deep: true
    },
    'tableData.data': {
      handler (data) {
        this.changeData()
      }
    }
  }
}
</script>

<style lang="scss">
.th-col-title {
  $height: 18px;
  font-size: 14px !important;
  color: $gray-st !important;
  height: $height !important;
  max-height: $height !important;
  line-height: $height !important;
  font-weight: bold !important;
  padding: 7px 0;
  border: {
    left: 1px solid #E7EDF2;
    right: 1px solid #E7EDF2;
  }
}
th.col-child-title {
  $height: 12px;
  max-height: $height !important;
}
.col-child-title {
  border: {
    left: 1px solid #E7EDF2;
    right: 1px solid #E7EDF2;
    margin-left: -1px;
    margin-right: -1px;
  }
}
.mark {
  width: 30px;
  height: 30px;
  margin: auto;
  &.pull_down {
    background-image: url(~@lug/mark_pull_down.png);
  }
  &.added {
    background-image: url(~@lug/mark_added.png);
  }
  &.find {
    background-image: url(~@lug/mark_find.png);
  }
  &.vip {
    background-image: url(~@lug/mark_vip.png);
  }
}
</style>

<style lang="scss" scoped>
$rowHeight: 40px;
.table {
  height: 100%;
  background-color: #FAFBFC;
  // box-shadow: 4px -4px 12px #E5EAEF;
  overflow: hidden;
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  .table-header {
    tr {
      background-color: #fafbfc;
    }
  }
  .table-body {
    position: relative;
    table {
      table-layout: fixed;
    }
    .table-load, .table-empty {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      >div {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        .icon-load, .empty {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          display: inline-block;
        }
      }
    }
    .table-load {
      background-color: rgba($color: $white-shadow, $alpha: .1);
      z-index: 5;
      .icon-load {
        $wh: 56px;
        width: $wh;
        height: $wh;
        background-image: url(~@img/load/bg_loading.png);
        box-shadow: 0 10px 30px rgba($color: $black-shadow, $alpha: .3);
        border-radius: 50%;
        // background-image: linear-gradient(to right, $blue, #fff);
        .load-center {
          $whc: 30px;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          width: $whc;
          height: $whc;
          background-image: url(~@img/load/icon_loading.png);
          animation-fill-mode: both;
          animation: rotate 1.5s 0s linear infinite;
        }
      }
    }
    .table-empty {
      background-image: rgba($color: $white-shadow, $alpha: .1);
      @keyframes rotate {
        0% {
          transform: rotate(0deg) scale(1);
        }
        50% {
          transform: rotate(180deg) scale(1);
        }
        100% {
          transform: rotate(360deg) scale(1);
        }
      }
      .empty {
        $wh: 160px;
        width: $wh;
        height: $wh + 40px;
        background-image: url(~@img/load/theme_no_result.png);
        background-repeat: no-repeat;
        .empty-text {
          $height: 16px;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          height: $height;
          line-height: $height;
          font-size: $height;
          color: $gray-nd;
          text-align: center;
        }
      }
    }
    tr {
      background-color: #f5f7f9;
    }
  }
  tr.single-row {
    background-color: #fff;
  }
  tr.select-index {
    background-color: rgba($color: $blue-shadow, $alpha: .2);
  }
  th, td {
    word-break: keep-all;
    box-sizing: border-box;
  }
  th {
    background-color: rgba($color: $gray-border, $alpha: .2);
    border-bottom: 1px solid $gray-border;
    font-weight: normal;
    font-size: 14px;
    color: #90A3B6;
  }
  td {
    height: 48px;
    line-height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #3d424d;
    font-size: 14px;
    /* display: inline-block; */
  }
}
.table-header, .table-body {
  display: flex;
  overflow: hidden;
}
.table-body {
  flex: 1;
  table {
    padding-bottom: 17px;
  }
}
.table-header {
  @include heightMix ($rowHeight);
  border-top: 1px solid $gray-border;
  .row_height_1 {
    max-height: 32px;
    height: 32px;
    line-height: 32px;
  }
  // .row_height_2 {
  //   max-height: 2 * $rowHeight - 21;
  //   height: 2 * $rowHeight - 21;
  //   line-height: 2 * $rowHeight - 21;
  // }
}
.center-table {
  flex: 1;
}
.left-table, .table-header .center-table, .table-header .right-table {
  overflow: hidden;
}
.table-body .center-table {
  overflow-y: hidden;
}
.table-body .right-table {
  overflow-x: hidden;
}
.left-table {
  position: relative;
  // z-index: 99;
  box-shadow: 4px 0 30px rgba($color: $white-shadow, $alpha: .1);
}
.right-table {
  position: relative;
  // z-index: ;
  box-shadow: -4px 0 30px rgba($color: $white-shadow, $alpha: .1);

  td {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    >.table-opr {
      width: 24px;
      height: 24px;
      cursor: pointer;

      &:not(:last-child) {
        margin-right: 16px;
      }

      &.detail {
        background-image: url(~@icon/table/icon_detail.png);

        &:hover {
          background-image: url(~@icon/table/icon_detail_hover.png);
        }
      }

      &.remove {
        background-image: url(~@icon/table/icon_delete.png);

        &:hover {
          background-image: url(~@icon/table/icon_delete_hover.png);
        }
      }

      &.reset {
        background-image: url(~@icon/table/icon_reset.png);

        &:hover {
          background-image: url(~@icon/table/icon_reset_hover.png);
        }
      }

      &.update {
        background-image: url(~@icon/table/icon_update.png);

        &:hover {
          background-image: url(~@icon/table/icon_update_hover.png);
        }
      }
    }
  }
}
</style>
