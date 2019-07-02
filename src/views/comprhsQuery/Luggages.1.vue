<template>
  <div class="luggages">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" :defaultKey="'0'" @tabItemClick="tabItemClickDay"></tabs>
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
import Lug from './detail/LugDetail'

export default {
  components: {
    QueryRow,
    Tabs,
    Tables,
    Lug
  },
  mixins: [tableMixin],
  data () {
    return {
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/luggage/queryAll',
      selectKey: 'D',
      showComp: {
        is: null,
        lugUrl: '/integrated/luggage/detail',
        row: null
      },
      selectKeyDay: 'today',
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
          key: '1',
          label: '明日'
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
      queryParam: [
        {
          key: 'flightNo',
          label: '航班号',
          type: 'input',
          width: 214,
          toUpper: true
        },
        {
          key: 'lugNo',
          label: '行李号',
          type: 'input',
          width: 214
        },
        {
          key: 'chute',
          label: '滑槽号',
          type: 'inputlist',
          width: 214,
          itemValue: 'resourceNo',
          itemLabel: 'terminalNo',
          url: '/base/terminalResource/queryAll',
          param: {
            resourceType: 'CHUTE'
          },
          toUpper: true
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'lugId',
        column: [
          // left
          [
            {type: 'mult', width: 50},
            {key: 'lugNo',  label: '行李号', width: 100, class: 'bold', title: true},
            {key: 'inOutFlag', label: '行李类型', width: 80, enumKey: 'inOutFlag'},
            {key: 'attr',  label: '目的站属性', width: 80, enumKey: 'attr'},
            {key: 'execDate',  label: '航班日期', width: 90, format: [0, 10]},
            {key: 'flightNo',  label: '航班号', width: 80, title: true}
          ],
          // center
          [
            {key: 'seatNo',  label: '座位号', width: 90, title: true},
            {key: 'boardNo',  label: '登机号', width: 60, title: true},
            // {key: 'idcardType',  label: '证件类型', width: 70},
            {key: 'idcardNo',  label: '证件类型/证件号', width: 135, type: 'slot', title: true},
            {key: 'originCn',  label: '始发站', width: 80, title: true},
            {key: 'destCn',  label: '目的站', width: 80, title: true},
            {key: 'transferCn',  label: '中转站', width: 80, title: true},
            // {key: 'contact',  label: '联系人', width: 80},
            {key: 'phone',  label: '联系人/联系方式', width: 110, type: 'slot', title: true},
            {key: 'terminal',  label: '交运航站楼', width: 85},
            {key: 'counter',  label: '交运柜台', width: 70},
            {key: 'chute',  label: '行李滑槽', width: 70, title: true},
            {key: 'truck',  label: '行李容器', width: 70, title: true},
            {key: 'cargopos',  label: '货舱位置', width: 70},
            {key: 'progressStatusCn',  label: '行李状态', width: 70, color: '#3392ff'},
            {key: 'isCancel',  label: '拉减', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isAddition',  label: '追加', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isLookfor',  label: '挑找', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isVip',  label: 'VIP', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'markingNum',  label: '标记次数', width: 70}
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
    this.selectKey = this.tabsData[0].key
    this.selectKeyDay = this.tabsDataDay[1].key
    this.queryDataReq()
  },
  methods: {
    tabItemClickDay (key) {
      this.selectKeyDay = key
    },
    tabItemClick (key) {
      if (((this.selectKey != key) && (this.selectKey == 'A')) || ((this.selectKey != key) && (key == 'A'))) {
        this.queryParam.pop()
        if (key == 'A') {
          this.queryParam.push({
            key: 'belt',
            label: '转盘号',
            type: 'inputlist',
            width: 120,
            itemValue: 'resourceNo',
            itemLabel: 'terminalNo',
            url: '/base/terminalResource/queryAll',
            param: {
              resourceType: 'BELT'
            },
            toUpper: true
          })
          this.$set(this.tableData.column, 1, [
            {key: 'seatNo',  label: '座位号', width: 90, title: true},
            {key: 'boardNo',  label: '登机号', width: 60, title: true},
            // {key: 'idcardType',  label: '证件类型', width: 70},
            {key: 'idcardNo',  label: '证件类型/证件号', width: 135, type: 'slot', title: true},
            {key: 'originCn',  label: '始发站', width: 80, title: true},
            {key: 'destCn',  label: '目的站', width: 80, title: true},
            {key: 'transferCn',  label: '中转站', width: 80, title: true},
            // {key: 'contact',  label: '联系人', width: 80},
            {key: 'phone',  label: '联系人/联系方式', width: 110, type: 'slot', title: true},
            {key: 'terminal',  label: '交运航站楼', width: 85},
            {key: 'belt',  label: '行李转盘', width: 70, title: true},
            {key: 'truck',  label: '行李容器', width: 70, title: true},
            {key: 'cargopos',  label: '货舱位置', width: 70},
            {key: 'progressStatusCn',  label: '行李状态', width: 70, color: '#3392ff'},
            {key: 'isCancel',  label: '拉减', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isAddition',  label: '追加', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isLookfor',  label: '挑找', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isVip',  label: 'VIP', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'markingNum',  label: '标记次数', width: 70}
          ])
        } else {
          this.queryParam.push({
            key: 'chute',
            label: '滑槽号',
            type: 'inputlist',
            width: 120,
            itemValue: 'resourceNo',
            itemLabel: 'terminalNo',
            url: '/base/terminalResource/queryAll',
            param: {
              resourceType: 'CHUTE'
            },
            toUpper: true
          })
          this.$set(this.tableData.column, 1, [
            {key: 'seatNo',  label: '座位号', width: 90, title: true},
            {key: 'boardNo',  label: '登机号', width: 60, title: true},
            // {key: 'idcardType',  label: '证件类型', width: 70},
            {key: 'idcardNo',  label: '证件类型/证件号', width: 135, type: 'slot', title: true},
            {key: 'originCn',  label: '始发站', width: 80, title: true},
            {key: 'destCn',  label: '目的站', width: 80, title: true},
            {key: 'transferCn',  label: '中转站', width: 80, title: true},
            // {key: 'contact',  label: '联系人', width: 80},
            {key: 'phone',  label: '联系人/联系方式', width: 110, type: 'slot', title: true},
            {key: 'terminal',  label: '交运航站楼', width: 85},
            {key: 'counter',  label: '交运柜台', width: 70},
            {key: 'chute',  label: '行李滑槽', width: 70, title: true},
            {key: 'truck',  label: '行李容器', width: 70, title: true},
            {key: 'cargopos',  label: '货舱位置', width: 70},
            {key: 'progressStatusCn',  label: '行李状态', width: 70, color: '#3392ff'},
            {key: 'isCancel',  label: '拉减', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isAddition',  label: '追加', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isLookfor',  label: '挑找', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isVip',  label: 'VIP', width: 70, enumKey: 'isYOrN', type: 'slot'},
            {key: 'markingNum',  label: '标记次数', width: 70}
          ])
        }
      }
      this.selectKey = key
      this.queryDataReq()
    },
    customQueryBefore () {
      this.$set(this.queryData, 'inOutFlag', this.selectKey)
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
  }
}
</script>

<style lang="scss">
.luggages {
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
