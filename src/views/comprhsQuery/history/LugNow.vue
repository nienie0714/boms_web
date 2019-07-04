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
            <!-- <button type="info" @click="changeComp('lug', row)">行李详情</button> -->
            <div class="table-opr detail" @click="changeComp('lug', row)"></div>
          </template>
          <template v-else-if="item.key == 'lugNo'">
            <div @click="changeComp('lug', row)">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key=='psgNameCh'">
            <div class="type">{{row['nameEn']}}</div>
            <div class="value">{{row['nameCh']}}</div>
          </template>
          <template v-else-if="item.key=='flightStatusCn'">
            <div v-if="row[item.key] == '起飞'" class="fly-class">{{row[item.key]}}</div>
            <div v-else-if="row[item.key] == null || row[item.key] == ''">-</div>
            <div v-else class="other-class">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key == 'abnormalStatusCn'">
            <div v-if="row[item.key] == null || row[item.key] == ''">-</div>
            <div v-else class="red-color">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key=='marking'">
            <div v-if="row[item.key] == '是'" class="marking-flex"><img src="@lug/mark_marking.png"/></div>
            <div v-else>-</div>
          </template>
          <template v-else-if="item.key=='luggeType'">
            <div class="dot-font" v-if="row[item.key] == '普通'">
              <div class="dot-color-1"></div>
              <span>{{row[item.key]}}</span>
            </div>
            <div class="dot-font" v-else-if="row[item.key] == '拉减'">
              <div class="dot-color-2"></div>
              <span>{{row[item.key]}}</span>
            </div>
            <div class="dot-font" v-else-if="row[item.key] == '追加'">
              <div class="dot-color-3"></div>
              <span>{{row[item.key]}}</span>
            </div>
            <div class="dot-font" v-else-if="row[item.key] == 'VIP'">
              <div class="dot-color-4"></div>
              <span>{{row[item.key]}}</span>
            </div>
            <div v-else>-</div>
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
          key: 'flightStatus',
          label: '航班状态',
          type: 'select',
          width: 214,
          width: 214,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryFlightStatus'
        },
        {
          key: 'luggeType',
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
          key: 'luggeNo',
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
          key: 'counter',
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
          key: 'flightStatus',
          label: '航班状态',// todo 航班状态
          type: 'select',
          width: 214,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryFlightStatus'
        },
        {
          key: 'luggeNo',
          label: '行李编号',
          type: 'input',
          width: 214
        },
        {
          key: 'luggeType',
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
          key: 'checkinTime',
          key1: 'beginCheckin',
          key2: 'endCheckin',
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
            {key: 'lugNo',  label: '行李编号', width: 120, colClass: 'bold-underline', title: true, type: 'slot'},
            // todo 保障状态
            // todo 旅客姓名
            {key: 'psgNameCh',  label: '旅客姓名', width: 130, type: 'slot'},
            {key: 'flightNo',  label: '航班号', width: 120, title: true},
          ],
          // center
          [
            {key: 'seatNo',  label: '旅客座位号', width: 100, title: true},
            {key: 'execDate',  label: '航班日期', width: 100, format: [0, 10]},
            // todo 航线
            {key: 'routerCn',  label: '航线', width: 120, title: true},
            // todo 值机时间
            {key: 'checkDate',  label: '值机时间', width: 120, title: true, format: [0, 16]},
            // todo 航班状态
            {key: 'flightStatusCn',  label: '航班状态', width: 100, title: true, type:'slot'},
            // todo 航班异常状态
            {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true, type:'slot'},
            // todo 机位
            {key: 'stand',  label: '机位', width: 110, title: true},
            {key: 'luggeType', label: '行李类型', width: 90, enumKey: 'inOutFlag', type:'slot'},
            // todo 是否标记
            {key: 'marking',  label: '是否标记', width: 90, enumKey: 'isYOrN', type: 'slot'},
            {key: 'counter',  label: '值机柜台号', width: 90},
            {key: 'chute',  label: '行李滑槽号', width: 90, title: true},
            // todo 安检状态
            {key: 'secure',  label: '安检状态', width: 100, title: true},
            // todo 人工分拣时间
            {key: 'truckDate',  label: '人工分拣时间', width: 120, title: true, format: [0, 16]},
            // todo 装机时间
            {key: 'airDate',  label: '装机时间', width: 120, title: true, format: [0, 16]}
          ],
          // right
          [
            {label: '操作', type: 'slot', width: 70},
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
    this.queryDataReqInterval()
    this.$once('hook:beforeDestroy', () => {            
      clearInterval(this.timer);
      this.timer = null;
    })
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
          {key: 'seatNo',  label: '旅客座位号', width: 100, title: true},
          {key: 'execDate',  label: '航班日期', width: 100, format: [0, 10]},
          // todo 航线
          {key: 'routerCn',  label: '航线', width: 120, title: true},
          // todo 航班状态
          {key: 'flightStatusCn',  label: '航班状态', width: 110, title: true, type:'slot'},
          // todo 航班异常状态
          {key: 'abnormalStatusCn',  label: '航班异常状态', width: 110, title: true, type:'slot'},
          // todo 机位
          {key: 'stand',  label: '机位', width: 110, title: true},
          {key: 'luggeType', label: '行李类型', width: 100, enumKey: 'inOutFlag', type:'slot'},
          // todo 是否标记
          {key: 'marking',  label: '是否标记', width: 100, enumKey: 'isYOrN'},
          {key: 'belt',  label: '行李转盘号', width: 110, title: true},
          // todo 卸机时间
          {key: 'checkDate',  label: '卸机时间', width: 120, title: true, format: [0, 16]},
          // todo 上转盘时间
          {key: 'upLoadDate',  label: '上转盘时间', width: 120, title: true, format: [0, 16]}
        ])
      } else {
        this.$set(this, 'queryParam', [])
        this.$set(this, 'queryParam', this.queryParamD)
        this.$set(this.tableData.column, 1, [
          {key: 'seatNo',  label: '旅客座位号', width: 100, title: true},
          {key: 'execDate',  label: '航班日期', width: 100, format: [0, 10]},
          // todo 航线
          {key: 'routerCn',  label: '航线', width: 120, title: true},
          // todo 值机时间
          {key: 'checkDate',  label: '值机时间', width: 120, title: true, format: [0, 16]},
          // todo 航班状态
          {key: 'flightStatusCn',  label: '航班状态', width: 100, title: true, type:'slot'},
          // todo 航班异常状态
          {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true, type:'slot'},
          // todo 机位
          {key: 'stand',  label: '机位', width: 110, title: true},
          {key: 'luggeType', label: '行李类型', width: 90, enumKey: 'inOutFlag', type:'slot'},
          // todo 是否标记
          {key: 'marking',  label: '是否标记', width: 90, enumKey: 'isYOrN'},
          {key: 'counter',  label: '值机柜台号', width: 90},
          {key: 'chute',  label: '行李滑槽号', width: 90, title: true},
          // todo 安检状态
          {key: 'secure',  label: '安检状态', width: 100, title: true},
          // todo 人工分拣时间
          {key: 'truckDate',  label: '人工分拣时间', width: 120, title: true, format: [0, 16]},
          // todo 装机时间
          {key: 'airDate',  label: '装机时间', width: 120, title: true, format: [0, 16]}
        ])
      }
      this.queryDataReqInterval()
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
          this.queryDataReqInterval()
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
