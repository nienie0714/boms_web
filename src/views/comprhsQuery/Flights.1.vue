<template>
  <div class="flight">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" :defaultKey="'today'" @tabItemClick="tabItemClickDay"></tabs>
      <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
    </div>
    <FltNow :selectedDay="selectKeyDay" :selected="selectKey"></FltNow>
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
import FltNow from './history/FltNow'
import CsProgress from '@view/CsProgress/CsProgress'
import _ from 'lodash'

export default {
  components: {
    // QueryRow,
    Tabs,
    // Tables,
    Flt,
    // CsProgress
    FltNow
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
      ]
    }
  },
  mounted () {
    this.selectKey = this.tabsData[0].key
    this.selectKeyDay = this.tabsDataDay[1].key
  },
  methods: {
    tabItemClickDay (key) {
      this.selectKeyDay = key
      this.queryDataReq(1)
    },
    tabItemClick (key) {
      this.selectKey = key
      this.queryDataReq(1)
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
