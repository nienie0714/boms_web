<template>
  <div class="luggages">
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
            <button type="info" @click="changeComp('lug', row)">行李详情</button>
          </template>
          <template v-else-if="item.key=='idcardNo'">
            <div class="type">{{row['idcardType']}}</div>
            <div class="value">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key=='phone'">
            <div class="type">{{row['contact']}}</div>
            <div class="value">{{row[item.key]}}</div>
          </template>
          <template v-else>
            <div v-if="row[item.key] == 'Y'" :class="['mark', (item.key=='isCancel')?'pull_down':((item.key=='isAddition')?'added':(item.key=='isLookfor'?'find':'vip'))]"></div>
          </template>
        </template>
      </tables>
    </div>
    <component :is="showComp.is" :row="showComp.row"></component>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Tabs from '@view/Tabs/Tabs'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import { queryAll } from '@/util/base'
import Lug from '../detail/LugDetail'

export default {
  components: {
    QueryRow,
    Tabs,
    Tables,
    Lug
  },
  mixins: [tableMixin],
  props: ['selectKeyDay', 'selectKey'],
  data () {
    return {
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/luggage/queryAll',
      showComp: {
        is: null,
        lugUrl: '/integrated/luggage/detail',
        row: null
      },
      tabsDataDay: [
        {
          key: '-1',
          label: '昨日'
        },
        {
          key: '0',
          label: '今日'
        },
        {
          key: '-2',
          label: '历史记录'
        }
      ],
      tabsData: [
        {
          key: 'D',
          label: '出港行李'
        },
        {
          key: 'A',
          label: '进港行李'
        },
        // {
        //   key: 'E',
        //   label: '中转行李'
        // }
      ],
      queryParamD: [
        {
          key: 'flightNo',
          label: '航班号',
          type: 'input',
          width: 214,
          toUpper: true
        },
        {
          key: 'progressStatus',
          label: '航班状态',
          type: 'select',
          width: 214,
          width: 214,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryFlightStatus'
        },
        {
          key: 'lugType',
          label: '行李类型',// todo 行李类型
          type: 'select',
          width: 214,
          enumKey: 'lugType',
          itemValue: 'code',
          itemLabel: 'name',
          // url: '/base/aircraftStand/queryAll'
        },
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
        // todo 保障状态
        {
          key: 'lugNo',
          label: '行李编号',
          type: 'input',
          width: 214
        },
        {
          key: 'chute',
          label: '行李滑槽号',// todo 行李滑槽号改为文本框
          type: 'input',
          width: 214,
        },
        {
          key: 'checkinCounter',
          label: '值机柜台号',// todo 值机柜台号
          type: 'input',
          width: 214,
          toUpper: true,
          class: 'mt14'
        },
        {
          key: 'checkinTime',
          key1: 'beginCheckin',
          key2: 'endCheckin',
          label: '值机时间',// todo 值机时间
          type: 'elDateRange',
          dateType: 'date',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          width: 390,
          class: 'mt14',
          isHidden: false
        }
      ],
      queryParamA: [
        {
          key: 'flightNo',
          label: '航班号',
          type: 'input',
          width: 214,
          toUpper: true
        },
        {
          key: 'progressStatus',
          label: '航班状态',// todo 航班状态
          type: 'select',
          width: 214,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryFlightStatus'
        },
        {
          key: 'lugNo',
          label: '行李编号',
          type: 'input',
          width: 214
        },
        {
          key: 'lugType',
          label: '行李类型',// todo 行李类型
          type: 'select',
          width: 214,
          enumKey: 'lugType',
          itemValue: 'code',
          itemLabel: 'name',
          // url: '/base/aircraftStand/queryAll'
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
        // todo 保障状态
        {
          key: 'belt',
          label: '行李转盘号',
          type: 'input',
          width: 214
        },
        {
          key: 'unloadTime',
          key1: 'beginUnload',
          key2: 'endUnload',
          label: '卸机时间',// todo 卸机时间
          type: 'elDateRange',
          dateType: 'date',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          width: 390,
          class: 'mt14'
        },
        {
          key: 'slot',
          label: 'slot',// 占位
          type: 'input',
          width: 222,
          isHidden: true
        }
      ],
      queryParam: [],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'lugId',
        column: [
          // left
          [
            {key: 'lugNo',  label: '行李编号', width: 100, class: 'bold', title: true},
            // todo 保障状态
            // todo 旅客姓名
            {key: 'passenger',  label: '旅客姓名', width: 110, type: 'slot', title: true},
            {key: 'flightNo',  label: '航班号', width: 80, title: true},
          ],
          // center
          [
            {key: 'seatNo',  label: '旅客座位号', width: 90, title: true},
            {key: 'execDate',  label: '航班日期', width: 90, format: [0, 10]},
            // todo 航线
            // todo 值机时间
            // todo 航班状态
            // todo 航班异常状态
            // todo 机位
            {key: 'inOutFlag', label: '行李类型', width: 90, enumKey: 'inOutFlag'},
            // todo 是否标记
            {key: 'marking',  label: '是否标记', width: 90, enumKey: 'isYOrN'},
            {key: 'counter',  label: '值机柜台号', width: 90},
            {key: 'chute',  label: '行李滑槽号', width: 90, title: true},
            // todo 安检状态
            // todo 人工分拣时间
            // todo 装机时间
          ],
          // right
          [
            {label: '操作', type: 'slot', width: 120}
          ]
        ],
        data: []
      }
    }
  },
  mounted () {
    if (this.selectKey == 'A') {
      this.$set(this, 'queryParam', [])
      this.$set(this, 'queryParam', this.queryParamA)
    } else {
      this.$set(this, 'queryParam', [])
      this.$set(this, 'queryParam', this.queryParamD)
    }
    this.queryDataReq()
    // this.queryDataReqInterval()
    // this.$once('hook:beforeDestroy', () => {            
    //   clearInterval(this.timer);
    //   this.timer = null;
    // })
  },
  methods: {
    tabItemClickDay (key) {
      this.selectKeyDay = key
    },
    tabItemClick (key) {
      if (key == 'A') {
        this.$set(this, 'queryParam', [])
        this.$set(this, 'queryParam', this.queryParamA)
        this.queryParam = this.queryParamA
        this.$set(this.tableData.column, 1, [
          {key: 'seatNo',  label: '座位号', width: 90, title: true},
          {key: 'execDate',  label: '航班日期', width: 90, format: [0, 10]},
          // todo 航线
          // todo 航班状态
          // todo 航班异常状态
          // todo 机位
          {key: 'inOutFlag', label: '行李类型', width: 90, enumKey: 'inOutFlag'},
          // todo 是否标记
          {key: 'marking',  label: '是否标记', width: 90, enumKey: 'isYOrN'},
          {key: 'belt',  label: '行李转盘号', width: 70, title: true},
          // todo 卸机时间
          // todo 上转盘时间
        ])
      } else {
        this.$set(this, 'queryParam', [])
        this.$set(this, 'queryParam', this.queryParamD)
        this.$set(this.tableData.column, 1, [
          {key: 'seatNo',  label: '旅客座位号', width: 90, title: true},
          {key: 'execDate',  label: '航班日期', width: 90, format: [0, 10]},
          // todo 航线
          // todo 值机时间
          // todo 航班状态
          // todo 航班异常状态
          // todo 机位
          {key: 'inOutFlag', label: '行李类型', width: 90, enumKey: 'inOutFlag'},
          // todo 是否标记
          {key: 'marking',  label: '是否标记', width: 90, enumKey: 'isYOrN'},
          {key: 'counter',  label: '值机柜台号', width: 90},
          {key: 'chute',  label: '行李滑槽号', width: 90, title: true},
          // todo 安检状态
          // todo 人工分拣时间
          // todo 装机时间
        ])
      }
      this.queryDataReq()
      // this.queryDataReqInterval()
    },
    customQueryBefore () {
      this.$set(this.queryData, 'inOutFlag', this.selectKey)
      this.$set(this.queryData, 'execRange', this.selectKeyDay)
    },
    changeComp (comp, row) {
      this.showComp.is = comp
      if (comp == 'lug') {
        let idObj = {
          lugId: row['lugId']
        }
        queryAll(this.showComp.lugUrl, idObj).then(res => {
          if (res.data.code == 0) {
            this.showComp.row = res.data.data
          }
        })
      }
    }
  },
  watch: {
    selectKey: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.tabItemClick(value)
        }
      }
    },
    selectKeyDay: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.queryDataReq()
          // this.queryDataReqInterval()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.luggages {
  .query-top {
    .query-item {
      &.mt14 {
        margin-top: 14px;
      }
    }
  }
  >div>.table {
    .table-header {
      $rowHeight: 32px;
      .row_height_1 {
        max-height: $rowHeight !important;
        height: $rowHeight !important;
        line-height: $rowHeight !important;
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
</style>
