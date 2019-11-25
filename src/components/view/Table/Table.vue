<template>
  <div class="table container cross" :style="`height: ${tableHeight}px;`">
    <div class="table-header">
      <div v-for="(column, colIndex) in columnHeaderData" :key="colIndex" :class="(colIndex==columnData.length-1)?'right-table':(colIndex==0?'left-table':'center-table')"
      :ref="(colIndex==columnData.length-1)?'rightTableH':(colIndex==0?'leftTableH':'centerTableH')"
      :style="(colIndex==columnData.length-1)?`width: ${rightWidth}px;`:(colIndex==0?`width: ${leftWidth}px;`:`width: calc(100% - ${leftWidth + rightWidth}px);`)">
      <!-- colIndex==1?`width: calc(100% - ${leftWidth + rightWidth}px);`:`width: ${colIndex==0?leftWidth:rightWidth}px;`">  // -->
        <table border="0" cellpadding="0" cellspacing="0" :style="((colIndex!=columnData.length-1)&&(colIndex>0))?`width: ${centerWidth}px`:''"><!-- colIndex==0?'left-table':(colIndex==1?'center-table':'right-table') -->
          <thead>
            <tr v-for="(col, cIndex) in column" :key="cIndex">
              
              <th v-for="(item, itemIndex) in col" :key="itemIndex" v-show="!item.hidden"
              :rowspan="item.rowspan" :colspan="item.colspan"
              :class="['row_height_'+(item.rowspan || 1), item.titleClass, item.class]"
              :style="`width:${item.width?(item.width+'px'):'auto'}; max-width:${item.width?(item.width+'px'):'auto'};`">
                <template v-if="tableData.type=='mult' && itemIndex == 0">
                  <div :class="(tableData.multSelection.length == tableData.data.length && tableData.data.length > 0)?'radio is-checked':'radio'" @click="selectAuto"></div>
                </template>
                
                <template>
                  <div v-if="item.headerTitle">
                    <el-popover
                      placement="bottom-start"
                      width="200"
                      trigger="hover"
                      :content="item.headerTitle">
                      <div slot="reference">
                        {{item.label}}
                      </div>
                    </el-popover>
                  </div>
                  <div v-else>
                    <div>
                        {{item.label}}
                      </div>
                  </div>
                </template>
                
              </th>
              
            </tr>
          </thead>
        </table>
        <!-- table占位 -->
        <table v-if="colIndex===1" border="0" cellpadding="0" cellspacing="0" :style="`width: calc(100% - ${centerWidth}px); left: ${centerWidth}px;`">
          <thead>
            <template v-if="!column || (column.length <= 0)">
              <tr>
                <th :rowspan="column.rowspan || 1" :class="['row_height_'+(column.rowspan || 1), column.titleClass, column.class]"></th>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(col, cIndex) in column" :key="cIndex">
                <th :rowspan="col[col.length - 1].rowspan || 1"
                :class="['row_height_'+(col[col.length - 1].rowspan || 1), (cIndex === 0) ? col[0].titleClass : '', 'th-col-title-block']"> </th>
              </tr>
            </template>
          </thead>
        </table>
      </div>
    </div>
    <div class="table-body">
      <div v-if="tableLoading" class="table-load">
        <div>
          <div class="icon-load">
            <div class="load-center"></div>
          </div>
        </div>
      </div>
      <div v-else-if="!tableData.data||tableData.data.length<=0" class="table-empty">
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
          <tbody><!-- (colIndex === columnData.length - 1 ? tableData.data : tableShowData) -->
          <!-- (require('lodash').findIndex(tableData.data, [tableData.key, row[tableData.key]]) -->
            <tr v-for="(row, index) in tableData.data" :key="row[tableData.key]" :class="[(index%2==0)?'single-row':'', isRowSelect(row,index)]"
            @dblclick="handleDblClick(row)" @click="selectRowTr(row, index)">
              <template v-for="(item, itemIndex) in col">
                <td v-if="!item.hasOwnProperty('rowspanMethod') || rowspanMethod(item.rowspanMethod, index, item)" :key="itemIndex" v-show="!item.hidden" :rowspan="item.hasOwnProperty('rowspanMethod') ? rowspanMethod(item.rowspanMethod, index, item) : 1"
                :title="item.title?(item.titleText || showValue(row, item)):false"
                :class="[item.colClass, item.class]"
                :style="'width:'+(item.width?(item.width- ((colIndex==columnData.length-1)&&(itemIndex==col.length-1)?17:0) +'px;'):'auto;')
                + 'max-width:'+(item.width?(item.width- ((colIndex==columnData.length-1)&&(itemIndex==col.length-1)?17:0) +'px;'):'auto;')
                +`color: ${item.color};`"
                @click="item.hasOwnProperty('clickMethod') && item.clickMethod(row)">
                  <template v-if="item.type=='opr'">
                    <div v-if="permissions.update" class="table-opr update" @click="openDetail('update', row)"></div>
                    <div v-if="permissions.remove" class="table-opr remove" @click="openRemove(row)"></div>
                    <div v-if="permissions.reset" class="table-opr reset" @click="openDetail('reset', row)"></div>
                    <div class="table-opr detail" @click="openDetail('detail', row)"></div>
                  </template>
                  <template v-else-if="item.type!='slot'">
                    <template v-if="item.type=='mult'">
                      <div :class="~index?'radio is-checked':'radio'" @click="selectRow(row)"></div>
                    </template>
                    <template v-else>{{showValue(row, item)}}</template>
                  </template>
                  <slot v-else name="slot-body" :index="index" :row="row" :item="item"></slot>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <!-- table占位 -->
        <table v-if="colIndex===1" border="0" cellpadding="0" cellspacing="0" :style="`width: calc(100% - ${centerWidth}px); left: ${centerWidth}px;`">
          <tbody><!-- tableShowData -->
            <tr v-for="(row, index) in tableData.data" :key="index" :class="[(index%2==0)?'single-row':'', isRowSelect(row,index)]">
              <td :style="`width: calc(100% - ${centerWidth}px); max-width: calc(100% - ${centerWidth}px);`"></td>
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
    pageData: {
      type: Object,
      default: ()=>{}
    },
    loading: {
      type: Boolean,
      default: false
    },
    trHeight: {
      type: Number,
      default: 52
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
      tableCompData: {
        index: 0,
        length: 0
      },
      tableHeight: 600,
      scrollData: {
        index: 1
      },
      tableLoading: false,
    }
  },
  mounted () {
    this.changeColumn(this.tableData.column)
    this.getTableWidth()
    this.tableCompData.index = 0;
    let table = document.getElementsByClassName('table')[0]
    this.$nextTick(() => {
      this.getShowTable()
      this.scrollTable();
      this.changeTableHeight(table)
      window.onresize = () => {
        return (() => {
          this.getShowTable()
          this.scrollTable();
          this.changeTableHeight(table)
        })()
      }
    })
  },
  methods: {
    rowspanMethod (method, index, item) {
      return method(index)
    },
    nextTable (rightBody) {
      if (this.scrollData.index < this.scrollLength) {
        this.scrollData.index += 1
        this.$emit('scrollLoad', this.scrollData.index)
        rightBody.scrollTop = 0
      }
    },
    prevTable (rightBody) {
      if (this.scrollData.index > 1) {
        this.scrollData.index -= 1
        this.$emit('scrollLoad', this.scrollData.index)
        rightBody.scrollTop = rightBody.scrollHeight
      }
    },
    getShowTable () {
      let titleDiv = document.getElementsByClassName('table-header')[0]
      if (titleDiv) {
        this.tableCompData.length = Math.ceil(parseInt((this.tableData.height - titleDiv.offsetHeight)) / this.trHeight) + 1
      }
    },
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
            if (!o.hidden) {
              this.rightWidth += o.width
            }
          })
        } else if (index == 0) {
          _.forEach(column, (o) => {
            if (!o.hidden) {
              this.leftWidth += o.width
            }
          })
        } else {
          _.forEach(column, (o) => {
            if (!o.hidden) {
              this.centerWidth += o.width
            }
          })
        }
      })
    },
    changeData () {
      if (this.tableData.data && this.tableData.data.length == 0) {
        let rightBody = this.$refs['rightTable'] ? this.$refs['rightTable'][0] : null
        if (rightBody) {
          rightBody.scrollTop = 0
        }
      }
    },
    scrollTable () {
      let leftBody = this.$refs['leftTable'] ? this.$refs['leftTable'][0] : null
      let centerBody = this.$refs['centerTable'] ? this.$refs['centerTable'][0] : null
      let rightBody = this.$refs['rightTable'] ? this.$refs['rightTable'][0] : null
      let that = this
      if (rightBody) {
        rightBody.onscroll = function () {
          let scrollTop =this.scrollTop
          // that.tableCompData.index = Math.floor(scrollTop / that.trHeight)
          // let top = scrollTop % that.trHeight
          if (leftBody) {
            leftBody.scrollTop = scrollTop
          }
          if (centerBody) {
            centerBody.scrollTop = scrollTop
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
      if (!this.tableLoading) {
        let scrollTop = event.wheelDeltaY
        let rightBody = this.$refs['rightTable'] ? this.$refs['rightTable'][0] : null
        if (rightBody) {
          if (this.tableData.pageLoad) {
            if (scrollTop < 0) {
              if ((rightBody.firstElementChild.offsetHeight - rightBody.offsetHeight) === rightBody.scrollTop) {
                this.nextTable(rightBody)
              } else {
                rightBody.scrollTop -= scrollTop
              }
            } else if (scrollTop > 0) {
              if (rightBody.scrollTop === 0) {
                this.prevTable(rightBody)
              } else {
                rightBody.scrollTop -= scrollTop
              }
            }
          } else {
            rightBody.scrollTop -= scrollTop
          }
        }
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
      } else if (this.tableData.type === 'multiple') {
          // 多选
          if (!this.tableData.multSelection) {
              this.tableData.multSelection = []
          }
          // 判断当前这行在不在
          const index = this.tableData.multSelection.indexOf(row);
          if (index === -1) {
              // 不在的话选中放入
              this.tableData.multSelection.push(row)
          } else {
              // 在的话取消选中
              this.tableData.multSelection = [
                  ...this.tableData.multSelection.slice(0, index),
                  ...this.tableData.multSelection.slice(index + 1),
              ]
          }
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
    },
      // 判断当前row是否是选中状态
    isRowSelect (row, index) {
        if (this.tableData.type === 'multiple') {
            // 多选
            if (!this.tableData.multSelection) {
                this.tableData.multSelection = []
            }
            let isSelect = false;
            this.tableData.multSelection.forEach(item => {
                if (item === row) {
                    isSelect = true;
                }
            })
            return isSelect ? 'select-index' : ''
        } else {
            return this.selectIndex === index ? 'select-index' : ''
        }
    },
    changeTableHeight(table) {
      if(!table) return;
        let h = window.innerHeight - table.getBoundingClientRect().top - 20;
        this.tableData.height = h;
        this.tableHeight = h;
    },
  },
  watch: {
    'tableData.column': {
      handler (column) {
        this.changeColumn(column)
        this.getTableWidth()
      },
      deep: true,
      immediate: true
    },
    loading(value) {
      this.tableLoading =value;
    },
    '$store.state.base.ifFullscreen'() {
      let table = document.getElementsByClassName('table')[0];
      this.changeTableHeight(table);
    }
  },
  computed: {
    tableShowData () {
      return this.tableData.data.slice(this.tableCompData.index, this.tableCompData.index + this.tableCompData.length)
    },
    scrollLength () {
      return Math.ceil(this.pageData.total / this.pageData.size)
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
    // right: 1px solid #E7EDF2;
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
.col-child-right {
  border: {
    right: 1px solid #E7EDF2;
    // margin-left: -1px;
    // margin-right: -1px;
  }
}
.col-child-left {
  border: {
    left: 1px solid #E7EDF2;
    // margin-left: -1px;
    // margin-right: -1px;
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
  &.marking {
    background-image: url(~@lug/mark_marking.png);
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
    th {
      font-weight: bold;
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
      // background-color: #f5f7f9;
      height: 50px;
      background-color: #fff;
      border-bottom: 1px solid $gray-border;
    }
  }
  tr.single-row {
    background-color: #fff;
    // border-bottom: 1px solid #eee;
  }
  tr.select-index {
    background-color: rgba($color: $blue-shadow, $alpha: .2);
    // border-bottom: 1px solid #eee;
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
    color: #718499;
  }
  td {
    // height: 48px;
    // line-height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #3d424d;
    font-size: 15px;
    // border-bottom: 1px solid $gray-border;
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
 // border-top: 1px solid $gray-border;
  .row_height_1 {
    max-height: 32px;
    height: 32px;
    line-height: 32px;
  }
  .th-col-title-block {
    box-sizing: content-box;
  }
  // .row_height_2 {
  //   max-height: 2 * $rowHeight - 21;
  //   height: 2 * $rowHeight - 21;
  //   line-height: 2 * $rowHeight - 21;
  // }
}.center-table {
  flex: 1;
  position: relative;
  thead>tr:first-child>th {
    border-left: none;
  }
}
.table-header .center-table>table:first-child>thead>tr:first-child>th:last-child {
  border-left: 1px solid $gray-border;
}
.center-table>table {
  position: absolute;
}
.left-table, .table-header .center-table, .table-header .right-table {
  overflow: hidden;
}
.table-body .center-table {
  overflow-y: hidden;
}
.table-body .right-table {
  overflow-x: hidden;
  >table {
    width: 100%;
  }
}
.left-table {
  position: relative;
  // border-right: 1px solid $gray-border;
  // z-index: 99;
  // box-shadow: 4px 0 30px rgba($color: $white-shadow, $alpha: .1);
  thead>tr:first-child>th {
    border-left: none;
  }
}
.right-table {
  position: relative;
  // margin-left: -1px;
  // border-left: 1px solid $gray-border;
  // z-index: ;
  // box-shadow: -4px 0 30px rgba($color: $white-shadow, $alpha: .1);
  td {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    >.table-opr {
      width: 24px;
      height: 24px;
      margin-top: 13px;
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
