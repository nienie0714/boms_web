<template>
  <div class="flight">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
      <div class="toolbar">
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{tableData.data.length}}条</span>
        </div>
        <div class="right">
          <div class="toolbar">
            <toolbar :permissions="permissions" @openExport="openExport">
              <template v-slot:setlist>
                <el-popover placement="bottom" width="310" trigger="click" v-model="defaultRow">
                  <div class="opr-popover">
                    <el-main>
                      <div class="opr-popover-all">
                        <el-header>行李信息</el-header>
                        <el-main>
                          <ul>
                            <div v-for="(field, index) in tableData.column[1]" :key="field.key">
                              <li v-if="field.label" :class="(oprPopoverIndex == index) ? 'opr-popover-li-click' : ''">
                                <div class="opr-popover-li-left">{{ substrValue(field.label, 9) }}</div>
                                <div class="opr-popover-li-right">
                                  <div :class="field.hidden?'button-close':'button-show'" @click="handleEye(field, index, 'right')"></div>
                                  <div class="button-up" @click="handleUp(field, index, 'right')"></div>
                                  <div class="button-top" @click="handleTop(field, index, 'right')"></div>
                                </div>
                              </li>
                            </div>
                          </ul>
                        </el-main>
                      </div>
                    </el-main>
                    <el-footer>
                      <div class="footer-right">
                        <el-button type="info" plain @click="closeDefaultRow()">关闭</el-button>
                        <el-button type="primary" @click="saveDefaultRow()">保存</el-button>
                      </div>
                    </el-footer>
                  </div>
                  <div class="tool-button setlist" slot="reference">
                    <div class="icon"></div>
                    <div class="label">设置列</div>
                  </div>
                </el-popover>
              </template>
            </toolbar>
          </div>
        </div>
      </div>
      <tables :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.label=='操作'">
            <!-- <button type="info" @click="changeComp('flt', row)">航班详情</button>
            <button type="info" @click="changeComp('lug', row)">行李详情</button> -->
            <div class="table-opr detail" @click="changeComp('flt', row)"></div>
          </template>
          <template v-else-if="item.key == 'flightNoAlias'">
            <div @click="changeComp('flt', row)">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key == 'progressStatusCn'">
            <div v-if="row[item.key] == '起飞'" class="fly-class">{{row[item.key]}}</div>
            <div v-else-if="row[item.key] == null || row[item.key] == ''">-</div>
            <div v-else class="other-class">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key == 'abnormalStatusCn'">
            <div v-if="row[item.key] == null || row[item.key] == ''">-</div>
            <div v-else class="red-color">{{row[item.key]}}</div>
          </template>
          <template v-else-if="['lugCommonTotal', 'lugAdditionTotal', 'allNodeCancelSum', 'lugMarkingTotal'].includes(item.key)">
            <div v-if="row[item.key] == null || row[item.key] == 0">-</div>
            <div v-else>{{row[item.key]}}</div>
          </template>
          <template v-else>
            <div class="container cross col-pro">
              <div class="container">
                <div>{{formatNum(row, item)}}</div>
                <!-- <div class="label">{{Math.floor(formatPro(row, item) * 100) + '%'}}</div> -->
              </div>
              <div>
                <cs-progress :value="formatPro(row, item)" :color="proColor(row, item)"></cs-progress>
              </div>
            </div>
          </template>
        </template>
      </tables>
    </div>
    <flt :isComp="showComp.is" :row="showComp.row"></flt>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" :info="exportInfo" @handleSubmit="handleExport" @handleClose="handleExportClose"></confirm-tip>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import lugTableMixin from '@mixin/lugTableMixin'
import { queryAll, download } from '@/util/base'
import Flt from '../detail/FltDetail'
import CsProgress from '@view/CsProgress/CsProgress'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Toolbar,
    Tables,
    Flt,
    CsProgress,
    ConfirmTip
  },
  mixins: [tableMixin, lugTableMixin],
  props: ['selectKeyDay', 'selectKey'],
  data () {
    return {
      axiosChildArr: [],
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/dynamicFlight/queryAllStat', // /',pageQuery
      exportUrl: '/integrated/dynamicFlight/exportExcel',
      // 菜单对应按钮权限
      permissions: {
        insert: false,
        export: true,
        setlist: true
      },
      exportInfo: '是否确认导出0条数据？',
      showComp: {
        is: null,
        lugUrl: '/integrated/dynamicFlight/flightLugStat',
        fltUrl: '/integrated/dynamicFlight/detail',
        row: null
      },
      tabsDataDay: [
        {
          key: -1,
          label: '昨日'
        },
        {
          key: 0,
          label: '今日'
        },
        {
          key: 1,
          label: '明日'
        },
        {
          key: -2,
          label: '历史记录'
        }
      ],
      tabsData: [
        {
          key: 'D',
          label: '出港航班',
          // icon: 'icon_departure_20'
        },
        {
          key: 'A',
          label: '进港航班',
        }
      ],
      queryParam: [
        {
          key: 'flightNo',
          label: '航班号',
          type: 'input',
          width: 214,
          toUpper: true
        },
        // {
        //   key: 'guarantee',
        //   label: '保障状态',// todo
        //   type: 'select',
        //   width: 214,
        //   itemValue: 'standNo',
        //   itemLabel: 'standNo',
        //   url: '/base/aircraftStand/queryAll'
        // },
        {
          key: 'marking',
          label: '是否标记',
          type: 'tab',
          width: 214,
          enumKey: 'yOrNOrAll',
          itemValue: 'code',
          itemLabel: 'name',
          value: null
        },
        {
          key: 'abnormalStatus',
          label: '航班异常状态',// todo 航班异常状态
          type: 'select',
          width: 234,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryAbnormalStatus',
          // urlType: 'get'
        },
        {
          key: 'progressStatus',
          label: '航班状态',
          type: 'select',
          width: 214,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryFlightStatus',
          // urlType: 'get'
          param: {inOutFlag: "D"}
        },
        {
          key: 'terminal',
          label: '航站楼',
          type: 'select',
          width: 214,
          itemValue: 'terminalNo',
          itemLabel: 'name',
          url: '/base/terminal/queryAll'
          // urlType: 'get'
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'dynamicFlightId',
        column: [
          // left
          [
            // {type: 'mult', width: 50, rowspan: 2},
            {
              label: '航班信息',
              colspan: 11,
              titleClass: 'th-col-title',
              child: [
                {key: 'flightNoAlias',  label: '航班', width: 80, colClass: 'bold-underline', title: true, type: 'slot'},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10]}, 
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'std', label: '计划', width: 80, format: [11, 5]},
                {key: 'etd', label: '预计', width: 80, format: [11, 5]},
                {key: 'atd', label: '实际', width: 80, format: [11, 5]},
                {key: 'terminal',  label: '航站楼', width: 60},
                {key: 'stand',  label: '机位', width: 60},
                {key: 'progressStatusCn',  label: '航班状态', width: 70, title: true, type: 'slot'},
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true},
                {key: 'chute',  label: '行李滑槽', width: 70, title: true, class: 'col-child-title'}
              ]
            }
          ],
          // center
          [
            {
              label: '运行情况',
              colspan: 7,
              titleClass: 'th-col-title',
              child: [
                // todo 保障状态
                {key: 'lugTotal',  label: '总数', width: 60, format: this.formatTotalAdd},
                {key: 'checkinCount',  label: '值机数', width: 60},
                // todo 中转数
                // todo 异常报警行李数
                // todo 安检数
                // todo 自动分拣数
                // todo 人工分拣数
                // todo 起运时间
                {key: 'loadTruckCost', label: '分拣耗时', width: 60, class: 'col-child-title'},
                {key: 'N-LOAD-TRUCK', label: '已分拣/值机', width: 120, type: 'slot', class: 'col-child-title'},
                {key: 'loadAircraftCount',  label: '装机数', width: 60, class: 'col-child-title'},
                {key: 'loadAircraftCost', label: '装机耗时', width: 60, class: 'col-child-title'},
                {key: 'N-LOAD-AIRCRAFT', label: '已装机/值机', width: 120, type: 'slot', class: 'col-child-title'},
              ]
            },
            {
              label: '行李类型',
              colspan: 3,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, type: 'slot'},
                {key: 'lugAdditionTotal',  label: '追加', width: 60, type: 'slot'},
                {key: 'allNodeCancelSum',  label: '拉减', width: 60, type: 'slot'},
                // todo 挑找
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN'},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, type: 'slot'},
              ]
            }
          ],
          // right
          [
            {label: '操作', rowspan: 2, type: 'slot', width: 70},
            // {label: '操作2', rowspan: 2, type: 'button', width: 220}
          ]
        ],
        data: []
      }
    }
  },
  mounted () {
    this.timer = clearInterval(this.timer)
    this.getFlightStatus()
    this.queryDataRefresh()
    this.timer = setInterval(this.queryDataRefresh, 60000)
    this.$once('hook:beforeDestroy', () => {
      this.timer = clearInterval(this.timer)
    })
  },
  methods: {
    customQueryBefore () {
      this.$set(this.queryData, 'inOutFlag', this.selectKey)
      this.$set(this.queryData, 'execRange', this.selectKeyDay)
    },
    customAfterQuery () {
      if (this.selectKey == 'D') {
        this.$set(this.tableData.column, 0, [
            {
              label: '航班信息',
              colspan: 11,
              titleClass: 'th-col-title',
              child: [
                {key: 'flightNoAlias',  label: '航班', width: 80, colClass: 'bold-underline', title: true, type: 'slot'},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10]},
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'std', label: '计划', width: 80, format: [11, 5]},
                {key: 'etd', label: '预计', width: 80, format: [11, 5]},
                {key: 'atd', label: '实际', width: 80, format: [11, 5]},
                {key: 'terminal',  label: '航站楼', width: 60},
                {key: 'stand',  label: '机位', width: 60},
                {key: 'progressStatusCn',  label: '航班状态', width: 100, title: true, type: 'slot'},// 进展
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true, type: 'slot'},
                {key: 'chute',  label: '行李滑槽', width: 70, title: true, class: 'col-child-right'}
              ]
            }
          ])
        this.$set(this.tableData.column, 1, [
            {
              label: '运行情况',
              colspan: 7,
              titleClass: 'th-col-title',
              child: [
                // todo 保障状态
                {key: 'lugTotal',  label: '总数', width: 60, format: this.formatTotalAdd},
                {key: 'checkinCount',  label: '值机数', width: 60},
                // todo 中转数
                // todo 异常报警行李数
                // todo 安检数
                // todo 自动分拣数
                // todo 人工分拣数
                // todo 起运时间
                {key: 'loadTruckCost', label: '分拣耗时', width: 60},
                {key: 'N-LOAD-TRUCK', label: '已分拣/值机', width: 120, type: 'slot'},
                {key: 'loadAircraftCount',  label: '装机数', width: 60},
                {key: 'loadAircraftCost', label: '装机耗时', width: 60},
                {key: 'N-LOAD-AIRCRAFT', label: '已装机/值机', width: 120, type: 'slot', class: 'col-child-right'},
              ]
            },
            {
              label: '行李类型',
              colspan: 5,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, type: 'slot'},
                {key: 'lugAdditionTotal',  label: '追加', width: 60, type: 'slot'},
                {key: 'allNodeCancelSum',  label: '拉减', width: 60, type: 'slot'},
                // todo 挑找
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN'},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, type: 'slot'},
              ]
            }
          ])
      } else if (this.selectKey == 'A') {
        this.$set(this.tableData.column, 0, [
            {
              label: '航班信息',
              colspan: 11,
              titleClass: 'th-col-title',
              child: [
                {key: 'flightNoAlias',  label: '航班', width: 80, colClass: 'bold-underline', title: true, type: 'slot'},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10]},
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'sta', label: '计划', width: 80, format: [11, 5]},
                {key: 'eta', label: '预计', width: 80, format: [11, 5]},
                {key: 'ata', label: '实际', width: 80, format: [11, 5]},
                {key: 'terminal',  label: '航站楼', width: 60},
                {key: 'stand',  label: '机位', width: 60},
                {key: 'progressStatusCn',  label: '航班状态', width: 70, title: true, type: 'slot'},// 进展
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true, type: 'slot'},
                {key: 'chute',  label: '行李滑槽', width: 70, title: true}
              ]
            }
          ])
        this.$set(this.tableData.column, 1, [
            {
              label: '运行情况',
              colspan: 7,
              titleClass: 'th-col-title',
              child: [
                // todo 保障状态
                {key: 'lugTotal',  label: '总数', width: 60, format: this.formatTotalAdd},
                // todo 前站装机数
                // todo 中转行李数
                {key: 'unLoadAirNum',  label: '卸机数', width: 60},
                {key: 'unLoadAirCostTime',  label: '卸机耗时', width: 60},
                {key: 'N-UNLOAD-AIRCRAFT', label: '已卸机/总数', width: 120, type: 'slot'},
                {key: 'unLoadCarNum',  label: '卸车数', width: 60},
                {key: 'unLoadCarCostTime',  label: '卸车耗时', width: 60},
                {key: 'N-UPLOAD', label: '已卸车/总数', width: 120, type: 'slot'},
                // todo 提取核验数
              ]
            },
            {
              label: '行李类型',
              colspan: 4,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, type: 'slot'},
                {key: 'lugAdditionTotal',  label: '追加', width: 60, type: 'slot'},
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN'},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, type: 'slot'},
              ]
            }
          ])
      }
    },
    changeComp (comp, row) {
      this.axiosChildArr.forEach(ever => {
        this.removePending(ever)
      })
      this.axiosChildArr = []
      this.showComp.is = comp
      let idObj = {
        dynamicFlightId: row[this.tableData.key]
      }
      this.showComp.row = {}
      let url = this.showComp[comp + 'Url']
      this.axiosChildArr.push({
        url: url,
        method: 'put',
        params: idObj
      })
      queryAll(url, idObj).then(res => {
        if (res.data.code == 0) {
          let data
          if (comp == 'lug') {
            data = {
              nodes: res.data.data
            }
          } else {
            data = res.data.data
          }
          this.showComp.row = _.assign(row, data)
        }
      })
    },
    formatTotalAdd ({row, item}) {
      return row[item.key]
    },
    formatNum (row, item) {
      let obj = _.get(row, item.key)
      let value = '-/-'
      if (obj) {
        let denominator = (obj['totalNum'] || 0) + (obj['nodeAdditionNum'] || 0)
        let molecule = (obj['nodeNum'] || 0) + (obj['nodeAdditionNum'] || 0)
        // denominator = denominator == 0 ? '0' : denominator
        // molecule = molecule == 0 ? '0' : molecule
        value = (molecule || '-') + '/' + (denominator || '-')
      }
      return value
    },
    formatPro (row, item) {
      let obj = _.get(row, item.key)
      let value = 0
      if (obj) {
        let denominator = (obj['totalNum'] || 0) + (obj['nodeAdditionNum'] || 0)
        let molecule = (obj['nodeNum'] || 0) + (obj['nodeAdditionNum'] || 0)
        if (denominator) {
          value = Math.floor(molecule / denominator * 100) / 100
        }
      }
      return value
    },
    proColor (row, item) {
      let value = this.formatPro(row, item)
      if (value == 1) {
        return 'linear-gradient(to right, #60cb6c, #01b674)'
      } else if (value >= 0.5) {
        return 'linear-gradient(to right, #46a6f9, #578cfe)'
      } else {
        return 'linear-gradient(to right, #f8b53f, #f58c24)'
      }
    },
    getFlightStatus() {
      // 更新航班状态下拉框
      _.forEach(this.queryParam, (item) => {
        if (item.key == 'progressStatus') {
          item.param = {inOutFlag: this.selectKey}
          queryAll(item.url, item.param).then(res => {
            if (res.data.code == 0) {
              this.$set(item, 'options', res.data.data)
            } else {
              this.$msg.error({
                info: '获取' + item.label + '失败 !'
              })
            }
          })
        }
      })
    },
    customBeforExport() {
      this.exportInfo = `是否确认导出 ${this.tableData.data.length} 条数据？`
      return true
    },
    handleExport () {
      download(this.exportUrl, this.queryData).then(response => {
        this.downFile(response, '导出')
        this.$msg.success({
          info: '导出成功 !'
        })
        this.handleExportClose()
      })
    },
    customUpdateTableWidth () {},
    customOtherFields () {
      return 'otherFields'
    },
    // 保存显示/隐藏列 save保存事件
    saveDefaultRow () {
      this.saveDefaultRowReq('otherFields')
    },
  },
  watch: {
    selectKey: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.getFlightStatus()
          this.timer = clearInterval(this.timer)
          this.queryDataRefresh()
          this.timer = setInterval(this.queryDataRefresh, 60000)
        }
      }
    },
    selectKeyDay: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.getFlightStatus()
          this.timer = clearInterval(this.timer)
          this.queryDataRefresh()
          this.timer = setInterval(this.queryDataRefresh, 60000)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.flight {
  .query-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 4px 8px 0px rgba(104, 129, 153, 0.1);
    border-radius: 8px;
    .query-row {
      width: 100%;
    }
    .query-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // &:not(:last-child) {
        // margin-bottom: 14px;
      // }
      // &:last-child {
      //   margin-top: 14px;
      // }
      &.mt14 {
        margin-top: 14px;
      }
    }
  }
  .toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 87px;
    .tool-button {
      display: inline-flex;
      padding: 0 20px;
      font-size: 14px;
      cursor: pointer;
    }
    .setlist {
      display: flex;
      >.icon {
        background-image: url(~@icon/toolbar/icon_setlist.png);
        width: 20px;
        height: 20px;
      }
      >.label {
        margin-left: 6px;
        font-size: 14px;
        color: $gray-nd;
      }
      &:hover {
        opacity: .8;
      }
    }
  }
  >div>.table {
    .table-header {
      .row_height_2 {
        $rowHeight: 66px;
        max-height: $rowHeight !important;
        height: $rowHeight !important;
        line-height: $rowHeight !important;
      }
    }
    .table-body {
      .center-table {
        table {
          margin-left: -1px;
        }
      }
      .col-pro {
        height: 100%;
        >div {
          &:first-child {
            height: 50%;
            line-height: 100%;
            padding: 0 12px;
            justify-content: space-between;
            align-items: center;
            .label {
              color: $gray-nd;
            }
          }
          &:last-child {
            position: relative;
            height: 50%;
          }
        }
      }
    }
    td {
      height: 52px !important;
      .type {
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        text-align: left;
        color: $gray-nd;
      }
      .value {
        margin-top: 8px;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        text-align: left;
        color: $gray-st;
      }
    }
  }
}
/* 编辑表头内容列宽度 */
.opr-popover-all {
  width: 100%;
}
.el-main {
  height: 100%;
  padding: 0;
}
.el-header {
  padding: 0
}
.opr-popover {
  height: 400px;
}
.opr-popover>main>div {
  width: 100%;
  height: 100%;
  float: left;
  overflow: hidden;
}
.opr-popover>main header {
  height: 16px !important;
  line-height: 16px;
  margin: 20px 0 12px 20px;
  color: #7a939e;
}
.opr-popover>main main {
  height: calc(100% - 48px);
  color: #90A3B6;
}
.opr-popover>main {
  height: calc(100% - 66px);
  font-size: 16px;
}
.opr-popover>footer {
  height: 34px !important;
  width: calc(100% - 40px);
  margin: 12px 20px 20px 20px;
  padding: 0;
  color: #90A3B6;
  font-weight: bold;
}
.opr-popover>main ul {
  list-style: none;
  height: 100%;
  margin: 0 0 0 20px;
  padding: 0;
}
.opr-popover>main ul>div {
  margin-left: -10px;
}
.opr-popover>main li {
  width: calc(100% - 10px);
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  border-radius: 8px;
  padding-left: 10px;
}
.opr-popover>main li:hover {
  background-color: rgba(60, 166, 200, 0.3);
}
.opr-popover>main li.opr-popover-li-click {
  background-color: rgba(60, 166, 200, 0.2);
}
.opr-popover-li-left {
  float: left;
}
.opr-popover-li-right {
  float: right;
  margin-left: 10px;
  margin-right: 10px;
}
.opr-popover-li-right>div {
  float: left;
  height: 30px;
  width: 30px;
  margin: 4px 0 4px 0;
  border: 1px solid #447385;
  border-radius: 6px;
  cursor: pointer;
}
.opr-popover-li-right>div:not(:last-of-type) {
  margin: 4px 10px 4px 0;
}
.opr-popover-li-right>div:hover {
  opacity: 0.8;
}
.opr-popover>footer>.footer-left {
  float: left;
}
.opr-popover>footer>.footer-left>div {
  width: 100px;
}
.opr-popover>footer>.footer-right {
  float: right;
}
.opr-popover>footer>.footer-right>div {
  float: left;
  width: 70px;
}
.opr-popover>footer>.footer-right>div:not(:last-of-type) {
  margin-right: 10px;
}
</style>
<style>
.el-button {
  padding: 7px 15px;
  height: 30px;
  font-weight: bold;
  font-size: 14px;
  border-radius: 6px;
}
.button-show {
  background: url('~@img/setlist/icon_eye_white.png');
  background-color: rgba(56, 195, 245, 0.2);
  box-shadow: 0px 0px 6px rgba(60, 166, 200, 0.7) inset !important;
  border: 1px solid rgba(60, 166, 200, 0.7) !important;
}
.button-close {
  background: url('~@img/setlist/icon_eye_gray.png');
}
.button-up {
  background: url('~@img/setlist/icon_up_gray.png');
}
.button-up-2 {
  background: url('~@img/setlist/icon_up_gray_02.png');
}
.button-top {
  background: url('~@img/setlist/icon_top_gray.png');
}
</style>
