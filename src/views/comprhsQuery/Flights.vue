<template>
  <div class="flight">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" :defaultKey="'today'" @tabItemClick="tabItemClickDay"></tabs>
      <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
    </div>
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
      <div class="toolbar">
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
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
    <flt :isComp="showComp.is" :row="showComp.row"></flt>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Tabs from '@view/Tabs/Tabs'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import { queryAll } from '@/util/base'
import Flt from './detail/FltDetail'
import CsProgress from '@view/CsProgress/CsProgress'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Tabs,
    Tables,
    Flt,
    CsProgress
  },
  mixins: [tableMixin],
  data () {
    return {
      axiosChildArr: [],
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/dynamicFlight/queryAllStat', // /',pageQuery
      selectKey: 'D',
      selectKeyDay: 'today',
      showComp: {
        is: null,
        lugUrl: '/integrated/dynamicFlight/flightLugStat',
        fltUrl: '/integrated/dynamicFlight/detail',
        row: null
      },
      tabsDataDay: [
        {
          key: 'yestoday',
          label: '昨日'
        },
        {
          key: 'today',
          label: '今日'
        },
        {
          key: 'tomorrow',
          label: '明日'
        },
        {
          key: 'history',
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
          width: 278,
          toUpper: true
        },
        {
          key: 'guarantee',
          label: '保障状态',// todo
          type: 'inputlist',
          width: 214,
          itemValue: 'standNo',
          itemLabel: 'standNo',
          url: '/base/aircraftStand/queryAll'
        },
        {
          key: 'terminal',
          label: '航站楼',// todo 航站楼
          type: 'inputlist',
          width: 214,
          itemValue: 'standNo',
          itemLabel: 'standNo',
          url: '/base/aircraftStand/queryAll'
        },
        {
          key: 'marking',
          label: '是否标记',// todo 是否标记
          type: 'tab',
          width: 214,
          enumKey: 'yOrNOrAll',
          itemValue: 'code',
          itemLabel: 'name',
          value: null
        },
        {
          key: 'flightStatus',
          label: '航班状态',// todo 航班状态
          type: 'inputlist',
          width: 214,
          itemValue: 'standNo',
          itemLabel: 'standNo',
          url: '/base/aircraftStand/queryAll'
        },
        {
          key: 'abnormalStatus',
          label: '航班异常状态',// todo 航班异常状态
          type: 'inputlist',
          width: 234,
          itemValue: 'standNo',
          itemLabel: 'standNo',
          url: '/base/aircraftStand/queryAll'
        },
        {
          key: 'execDate',
          key1: 'beginDate',
          key2: 'endDate',
          label: '航班日期',// 航班日期
          isHidden: true,
          type: 'datepickers',
          class: 'mt14',
          width: 278
        },
        // {
        //   key: 'terminalStation',
        //   label: '目的站',
        //   type: 'inputlist',
        //   width: 214,
        //   itemValue: 'airportIata',
        //   itemLabel: 'briefC',
        //   url: '/base/airport/queryAll',
        //   toUpper: true
        // },
        // {
        //   key: 'stand',
        //   label: '机位',
        //   type: 'inputlist',
        //   width: 214,
        //   itemValue: 'standNo',
        //   itemLabel: 'standNo',
        //   url: '/base/aircraftStand/queryAll'
        // }
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
            // {key: 'flightNoAlias',  label: '航班号', rowspan: 2, width: 80, class: 'bold'},
            // {key: 'execDate', label: '航班日期', rowspan: 2, width: 90, format: [0, 10]},
            // {key: 'attr',  label: '属性', rowspan: 2, width: 60, enumKey: 'attr'},
            // {key: 'aircraftType',  label: '机型', rowspan: 2, width: 60},
            // {key: 'aircraftNo',  label: '机号', rowspan: 2, width: 60}
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
                {key: 'abnormalStatusCn',  label: '异常状态', width: 70, title: true, class: 'col-child-title'},
                {key: 'progressStatusCn',  label: '航班状态', width: 70, title: true, class: 'col-child-title'},// 进展
                {key: 'stand',  label: '机位', width: 60, class: 'col-child-title'},
                {key: 'chute',  label: '滑槽', width: 60, title: true, class: 'col-child-title'}
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
                // todo 值机数
                // todo 安检数
                // todo 自动分拣数
                // todo 人工分拣数
                // todo 装机数
                // todo 中转数
                // todo 异常报警行李数
                // todo 分拣耗时 N-LOAD-TRUCK.lastLugTime - N-LOAD-TRUCK.firstLugTime
                {key: 'N-LOAD-TRUCK.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
                {key: 'N-LOAD-TRUCK.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'},
                // todo 分拣进度
                {key: 'N-LOAD-TRUCK', label: '已分拣/值机', width: 120, type: 'slot', class: 'col-child-title'},
                // todo 起运时间
                // todo 装机耗时 N-LOAD-AIRCRAFT.lastLugTime - N-LOAD-AIRCRAFT.firstLugTime
                {key: 'N-LOAD-AIRCRAFT.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
                {key: 'N-LOAD-AIRCRAFT.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'},
                // todo 装载进度
                {key: 'N-LOAD-AIRCRAFT', label: '已装机/值机', width: 120, type: 'slot', class: 'col-child-title'},
              ]
            },
            {
              label: '行李类型',
              colspan: 2,
              titleClass: 'th-col-title',
              child: [
                // 普通
                // 追加数量
                // 拉减数
                {key: 'lugCancelTotal',  label: '拉减数', width: 60, class: 'col-child-title'},
                // 挑找
                // VIP
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN', class: 'col-child-title'},
                // 标记
              ]
            },
            // {key: 'checkinCounter',  label: '值机柜台', rowspan: 2, width: 80, title: true},
            // {key: 'gate',  label: '登机口', rowspan: 2, width: 60},
          ],
          // right
          [
            {label: '操作', rowspan: 2, type: 'slot', width: 220}
          ]
        ],
        data: []
      }
    }
  },
  mounted () {
    this.selectKey = this.tabsData[0].key
    this.selectKeyDay = this.tabsDataDay[1].key
    this.queryDataReq()
  },
  methods: {
    tabItemClickDay (key) {
      this.selectKeyDay = key
      if (key == 'history') {
        this.$set(this.queryParam[6], 'isHidden', false)
      } else {
        this.$set(this.queryParam[6], 'isHidden', true)
      }
      this.queryDataReq(1)
    },
    tabItemClick (key) {
      this.selectKey = key
      this.queryDataReq(1)
    },
    customQueryBefore () {
      this.$set(this.queryData, 'inOutFlag', this.selectKey)
      this.$set(this.queryData, 'queryFlag', this.selectKeyDay)
    },
    customAfterQuery () {
      if (this.selectKey == 'D') {
        this.$set(this.tableData.column, 1, [
            {
              label: '运行情况',
              colspan: 7,
              titleClass: 'th-col-title',
              child: [
                // todo 保障状态
                {key: 'lugTotal',  label: '总数', width: 60, class: 'col-child-title', format: this.formatTotalAdd},
                // todo 值机数
                // todo 安检数
                // todo 自动分拣数
                // todo 人工分拣数
                // todo 装机数
                // todo 中转数
                // todo 异常报警行李数
                // todo 分拣耗时 N-LOAD-TRUCK.lastLugTime - N-LOAD-TRUCK.firstLugTime
                {key: 'N-LOAD-TRUCK.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
                {key: 'N-LOAD-TRUCK.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'},
                // todo 分拣进度
                {key: 'N-LOAD-TRUCK', label: '已分拣/值机', width: 120, type: 'slot', class: 'col-child-title'},
                // todo 起运时间
                // todo 装机耗时 N-LOAD-AIRCRAFT.lastLugTime - N-LOAD-AIRCRAFT.firstLugTime
                {key: 'N-LOAD-AIRCRAFT.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
                {key: 'N-LOAD-AIRCRAFT.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'},
                // todo 装载进度
                {key: 'N-LOAD-AIRCRAFT', label: '已装机/值机', width: 120, type: 'slot', class: 'col-child-title'},
              ]
            },
            {
              label: '行李类型',
              colspan: 2,
              titleClass: 'th-col-title',
              child: [
                // 普通
                // 追加数量
                // 拉减数
                {key: 'lugCancelTotal',  label: '拉减数', width: 60, class: 'col-child-title'},
                // 挑找
                // VIP
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN', class: 'col-child-title'},
                // 标记
              ]
            }
          ])
      } else if (this.selectKey == 'A') {
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
                // todo 卸机数
                // todo 卸机耗时 N-UNLOAD-AIRCRAFT.lastLugTime - N-UNLOAD-AIRCRAFT.firstLugTime
                {key: 'N-UNLOAD-AIRCRAFT.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
                {key: 'N-UNLOAD-AIRCRAFT.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'},
                // todo 卸机进度
                {key: 'N-UNLOAD-AIRCRAFT', label: '已卸机/总数', width: 120, type: 'slot', class: 'col-child-title'},
                // todo 卸车数
                // todo 卸车耗时 N-UPLOAD.lastLugTime - N-UPLOAD.firstLugTime
                {key: 'N-UPLOAD.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
                {key: 'N-UPLOAD.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'},
                // todo 卸车进度
                {key: 'N-UPLOAD', label: '已卸车/总数', width: 120, type: 'slot', class: 'col-child-title'},
                // todo 提取核验数
              ]
            },
            {
              label: '行李类型',
              colspan: 1,
              titleClass: 'th-col-title',
              child: [
                // 普通
                // 追加数量
                // VIP
                {key: 'vipFlag',  label: 'VIP', width: 60, enumKey: 'isYOrN', class: 'col-child-title'},
                // 标记
              ]
            }
            // {key: 'belt',  label: '转盘', rowspan: 2, width: 80, title: true},
          ])
      }
    },
    customAfterQuery1 () {
      if (this.selectKey == 'D') {
        this.$set(this.tableData.column, 1, [
          {key: 'routeCn',  label: '航线', rowspan: 2, width: 120, title: true},
          {
            label: '起飞时间',
            colspan: 3,
            titleClass: 'th-col-title',
            child: [
              {key: 'std', label: '计划', width: 80, format: [11, 5], class: 'col-child-title'},
              {key: 'etd', label: '预计', width: 80, format: [11, 5], class: 'col-child-title'},
              {key: 'atd', label: '实际', width: 80, format: [11, 5], class: 'col-child-title'}
            ]
          },
          {key: 'progressStatusCn',  label: '进展状态', rowspan: 2, width: 70, title: true},
          {key: 'abnormalStatusCn',  label: '异常状态', rowspan: 2, width: 70, title: true},
          {key: 'terminal',  label: '航站楼', rowspan: 2, width: 60},
          {key: 'stand',  label: '机位', rowspan: 2, width: 60},
          {key: 'checkinCounter',  label: '值机柜台', rowspan: 2, width: 80, title: true},
          {key: 'gate',  label: '登机口', rowspan: 2, width: 60},
          {key: 'chute',  label: '滑槽', rowspan: 2, width: 60, title: true},
          {key: 'vipFlag',  label: 'VIP', rowspan: 2, width: 60, enumKey: 'isYOrN'},
          {key: 'lugTotal',  label: '总数', rowspan: 2, width: 60, format: this.formatTotalAdd},
          {key: 'lugCancelTotal',  label: '拉减', rowspan: 2, width: 60},
          {
            label: '分拣',
            colspan: 3,
            titleClass: 'th-col-title',
            child: [
              {key: 'N-LOAD-TRUCK', label: '已分拣/值机', width: 120, type: 'slot', class: 'col-child-title'},
              {key: 'N-LOAD-TRUCK.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
              {key: 'N-LOAD-TRUCK.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'}
            ]
          },
          {
            label: '装机',
            colspan: 3,
            titleClass: 'th-col-title',
            child: [
              {key: 'N-LOAD-AIRCRAFT', label: '已装机/值机', width: 120, type: 'slot', class: 'col-child-title'},
              {key: 'N-LOAD-AIRCRAFT.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
              {key: 'N-LOAD-AIRCRAFT.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'}
            ]
          }
        ])
      } else if (this.selectKey == 'A') {
        this.$set(this.tableData.column, 1, [
          {key: 'routeCn',  label: '航线', rowspan: 2, width: 120, title: true},
          {
            label: '到达时间',
            colspan: 3,
            titleClass: 'th-col-title',
            child: [
              {key: 'sta', label: '计划', width: 80, format: [11, 5], class: 'col-child-title'},
              {key: 'eta', label: '预计', width: 80, format: [11, 5], class: 'col-child-title'},
              {key: 'ata', label: '实际', width: 80, format: [11, 5], class: 'col-child-title'}
            ]
          },
          {key: 'progressStatusCn',  label: '进展状态', rowspan: 2, width: 70, title: true},
          {key: 'abnormalStatusCn',  label: '异常状态', rowspan: 2, width: 70, title: true},
          {key: 'terminal',  label: '航站楼', rowspan: 2, width: 60},
          {key: 'stand',  label: '机位', rowspan: 2, width: 60},
          {key: 'belt',  label: '转盘', rowspan: 2, width: 80, title: true},
          {key: 'vipFlag',  label: 'VIP', rowspan: 2, width: 60, enumKey: 'isYOrN'},
          {key: 'lugTotal',  label: '总数', rowspan: 2, width: 60, format: this.formatTotalAdd},
          {key: 'lugCancelTotal',  label: '拉减', rowspan: 2, width: 60},
          {
            label: '卸机',
            colspan: 3,
            titleClass: 'th-col-title',
            child: [
              {key: 'N-UNLOAD-AIRCRAFT', label: '已卸机/总数', width: 120, type: 'slot', class: 'col-child-title'},
              {key: 'N-UNLOAD-AIRCRAFT.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
              {key: 'N-UNLOAD-AIRCRAFT.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'}
            ]
          },
          {
            label: '卸车',
            colspan: 3,
            titleClass: 'th-col-title',
            child: [
              {key: 'N-UPLOAD', label: '已卸车/总数', width: 120, type: 'slot', class: 'col-child-title'},
              {key: 'N-UPLOAD.firstLugTime', label: '首件', width: 50, format: [11, 5], class: 'col-child-title'},
              {key: 'N-UPLOAD.lastLugTime', label: '末件', width: 50, format: [11, 5], class: 'col-child-title'}
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
    .toolbar {
      // height: 100%;
      // flex: 1;
      // display: flex;
      // align-items: flex-start;
      // justify-content: center;
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
  }
}
</style>
