<template>
  <div class="luggages">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" defaultKey="0" @tabItemClick="tabItemClickDay"></tabs>
      <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
    </div>
    <FltHis v-if="selectKeyDay == -1" :selectKeyDay="selectKeyDay" :selectKey="selectKey"></FltHis>
    <FltNow v-else :selectKeyDay="selectKeyDay" :selectKey="selectKey"></FltNow>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Tabs from '@view/Tabs/Tabs'
import { queryAll } from '@/util/base'
import FltNow from './history/FltNow'
import FltHis from './history/FltHis'
import _ from 'lodash'

export default {
  components: {
    Tabs,
    FltNow,
    FltHis
  },
  data () {
    return {
      axiosChildArr: [],
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/dynamicFlight/queryAllStat', // /',pageQuery
      selectKey: 'D',
      selectKeyDay: 0,
      tabsDataDay: [
        {
          key: -1,
          label: '更早'
        },
        {
          key: 0,
          label: '今日'
        },
        {
          key: 1,
          label: '明日'
        },
      ],
      tabsData: [
        {
          key: 'D',
          label: '出港航班',
        },
        {
          key: 'A',
          label: '进港航班',
        }
      ]
    }
  },
  created () {
    this.selectKey = this.tabsData[0].key
    this.selectKeyDay = this.tabsDataDay[1].key
  },
  methods: {
    tabItemClickDay (key) {
      this.selectKeyDay = key
    },
    tabItemClick (key) {
      this.selectKey = key
    }
  }
}
</script>

<style lang="scss">
.luggages {
  position: relative;
  .query-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
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
