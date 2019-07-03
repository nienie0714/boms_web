<template>
  <div class="flight-his">
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
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <!-- <div class="toolbar">
            <button type="primary" :name="loading?'loading':''" @click="queryDataReq">查询</button>
          </div> -->
        </div>
      </div>
      <div class="table-cont container cross height523">
        <tables :tableData="tableData" :loading="tableData.loading">
          <template v-slot:slot-body="{index, row, item}">
            <template v-if="item.label=='操作'">
              <button type="info" @click="changeComp('flt', row)">航班详情</button>
              <button type="info" @click="changeComp('lug', row)">行李详情</button>
            </template>
            <template v-else>
              <div class="container cross col-pro">
                <div class="container">
                  <div>{{formatNum(row, item)}}</div>
                  <div class="label">{{Math.floor(formatPro(row, item) * 100) + '%'}}</div>
                </div>
                <div>
                  <cs-progress :value="formatPro(row, item)" :color="proColor(row, item)"></cs-progress>
                </div>
              </div>
            </template>
          </template>
        </tables>
      </div>
    </div>
    <flt :isComp="showComp.is" :row="showComp.row"></flt>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll } from '@/util/base'
import Inputs from '@view/Inputs/Inputs'
import CsProgress from '@view/CsProgress/CsProgress'
import Flt from '../detail/FltDetail'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Pagination,
    Flt,
    Tables,
    CsProgress
  },
  mixins: [tableMixin, formMixin],
  props: ['selectKeyDay', 'selectKey'],
  data () {
    return {
      // 请求路径
      queryUrl: '/integrated/dynamicFlight/pageQuery',
      queryParam: [
        {
          key: 'flightNo',
          label: '航班号',
          type: 'input',
          width: 278,
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
          url: '/base/flightStatus/queryAbnormalStatus'
        },
        {
          key: 'progressStatus',
          label: '航班状态',
          type: 'select',
          width: 214,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryFlightStatus'
        },
        {
          key: 'terminal',
          label: '航站楼',
          type: 'select',
          width: 214,
          itemValue: 'terminalNo',
          itemLabel: 'name',
          url: '/base/terminal/queryAll'
        },
        {
          key: 'execDate',
          key1: 'beginDate',
          key2: 'endDate',
          label: '航班日期',// 航班日期
          type: 'elDateRange',
          dateType: 'date',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          width: 390,
          class: 'mt14',
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
                {key: 'flightNoAlias',  label: '航班', width: 80, class: 'col-child-title'},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10], class: 'col-child-title'},
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'std', label: '计划', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'etd', label: '预计', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'atd', label: '实际', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'terminal',  label: '航站楼', width: 60, class: 'col-child-title'},
                {key: 'stand',  label: '机位', width: 60, class: 'col-child-title'},
                {key: 'progressStatusCn',  label: '航班状态', width: 70, title: true, class: 'col-child-title'},// 进展
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 80, title: true, class: 'col-child-title'},
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
                {key: 'lugTotal',  label: '总数', width: 60, class: 'col-child-title', format: this.formatTotalAdd},
                {key: 'checkinCount',  label: '值机数', width: 60, class: 'col-child-title'},
                // todo 中转数
                // todo 异常报警行李数
                // todo 安检数
                // todo 自动分拣数
                // todo 人工分拣数
                // todo 起运时间
                // todo 装机数
                {key: 'loadTruckCost', label: '分拣耗时', width: 50, class: 'col-child-title'},
                {key: 'N-LOAD-TRUCK', label: '已分拣/值机', width: 120, type: 'slot', class: 'col-child-title'},
                {key: 'loadAircraftCount',  label: '装机数', width: 60, class: 'col-child-title'},
                {key: 'loadAircraftCost', label: '装机耗时', width: 50, class: 'col-child-title'},
                {key: 'N-LOAD-AIRCRAFT', label: '已装机/值机', width: 120, type: 'slot', class: 'col-child-title'},
              ]
            },
            {
              label: '行李类型',
              colspan: 3,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, class: 'col-child-title'},
                {key: 'lugAdditionTotal',  label: '追加', width: 60, class: 'col-child-title'},
                {key: 'lugCancelTotal',  label: '拉减', width: 60, class: 'col-child-title'},
                // todo 挑找
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN', class: 'col-child-title'},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, class: 'col-child-title'},
              ]
            }
          ],
          // right
          [
            {label: '操作', rowspan: 2, type: 'slot', width: 220}
          ]
        ],
        data: []
      },
      axiosChildArr: [],
      showComp: {
        is: null,
        lugUrl: '/integrated/dynamicFlight/flightLugStat',
        fltUrl: '/integrated/dynamicFlight/detail',
        row: null
      },
    }
  },
  mounted () {
    this.queryDataReq()
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
                {key: 'flightNoAlias',  label: '航班', width: 80, class: 'col-child-title'},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10], class: 'col-child-title'},
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'std', label: '计划', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'etd', label: '预计', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'atd', label: '实际', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'terminal',  label: '航站楼', width: 60, class: 'col-child-title'},
                {key: 'stand',  label: '机位', width: 60, class: 'col-child-title'},
                {key: 'progressStatusCn',  label: '航班状态', width: 70, title: true, class: 'col-child-title'},// 进展
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 80, title: true, class: 'col-child-title'},
                {key: 'chute',  label: '行李滑槽', width: 70, title: true, class: 'col-child-title'}
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
                {key: 'lugTotal',  label: '总数', width: 60, class: 'col-child-title', format: this.formatTotalAdd},
                {key: 'checkinCount',  label: '值机数', width: 60, class: 'col-child-title'},
                // todo 中转数
                // todo 异常报警行李数
                // todo 安检数
                // todo 自动分拣数
                // todo 人工分拣数
                // todo 起运时间
                // todo 装机数
                {key: 'loadTruckCost', label: '分拣耗时', width: 50, class: 'col-child-title'},
                {key: 'N-LOAD-TRUCK', label: '已分拣/值机', width: 120, type: 'slot', class: 'col-child-title'},
                {key: 'loadAircraftCount',  label: '装机数', width: 60, class: 'col-child-title'},
                {key: 'loadAircraftCost', label: '装机耗时', width: 50, class: 'col-child-title'},
                {key: 'N-LOAD-AIRCRAFT', label: '已装机/值机', width: 120, type: 'slot', class: 'col-child-title'},
              ]
            },
            {
              label: '行李类型',
              colspan: 5,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, class: 'col-child-title'},
                {key: 'lugAdditionTotal',  label: '追加', width: 60, class: 'col-child-title'},
                {key: 'lugCancelTotal',  label: '拉减', width: 60, class: 'col-child-title'},
                // todo 挑找
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN', class: 'col-child-title'},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, class: 'col-child-title'},
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
                {key: 'flightNoAlias',  label: '航班', width: 80, class: 'col-child-title'},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10], class: 'col-child-title'},
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'sta', label: '计划', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'eta', label: '预计', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'ata', label: '实际', width: 80, format: [11, 5], class: 'col-child-title'},
                {key: 'terminal',  label: '航站楼', width: 60, class: 'col-child-title'},
                {key: 'stand',  label: '机位', width: 60, class: 'col-child-title'},
                {key: 'progressStatusCn',  label: '航班状态', width: 70, title: true, class: 'col-child-title'},// 进展
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 80, title: true, class: 'col-child-title'},
                {key: 'chute',  label: '行李滑槽', width: 70, title: true, class: 'col-child-title'}
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
                {key: 'lugTotal',  label: '总数', width: 60, class: 'col-child-title', format: this.formatTotalAdd},
                // todo 前站装机数
                // todo 中转行李数
                {key: 'unLoadAirNum',  label: '卸机数', width: 60, class: 'col-child-title'},
                {key: 'unLoadAirCostTime',  label: '卸机耗时', width: 60, class: 'col-child-title'},
                {key: 'N-UNLOAD-AIRCRAFT', label: '已卸机/总数', width: 120, type: 'slot', class: 'col-child-title'},
                {key: 'unLoadCarNum',  label: '卸机耗时', width: 60, class: 'col-child-title'},
                {key: 'unLoadCarCostTime',  label: '卸机耗时', width: 60, class: 'col-child-title'},
                {key: 'N-UPLOAD', label: '已卸车/总数', width: 120, type: 'slot', class: 'col-child-title'},
                // todo 提取核验数
              ]
            },
            {
              label: '行李类型',
              colspan: 4,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, class: 'col-child-title'},
                {key: 'lugAdditionTotal',  label: '追加', width: 60, class: 'col-child-title'},
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN', class: 'col-child-title'},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, class: 'col-child-title'},
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
    }
  },
  watch: {
    selectKey: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.queryDataReq()
        }
      }
    },
    selectKeyDay: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.queryDataReq()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.flight-his {
  .height523 {
    height: 523px;
  }
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
    .toolbar {
      // height: 100%;
      // flex: 1;
      // display: flex;
      // align-items: flex-start;
      // justify-content: center;
    }
  }
  .row_height_2 {
    $rowHeight: 65px;
    max-height: $rowHeight !important;
    height: $rowHeight !important;
    line-height: $rowHeight !important;
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
  >div>.table {
    .table-header {
      .row_height_2 {
        $rowHeight: 65px;
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
  }
}
</style>
