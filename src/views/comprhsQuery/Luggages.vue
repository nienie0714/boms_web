<template>
  <div class="luggages">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" defaultKey="0" @tabItemClick="tabItemClickDay" :style="selectKey == 'E' ? 'visibility:hidden':''"></tabs>
      <tabs :tabsData="tabsData" @tabItemClick="tabItemClick"></tabs>
    </div>
    <LugHis v-if="selectKeyDay == -1 && selectKey != 'E'" :selectKeyDay="selectKeyDay" :selectKey="selectKey"></LugHis>
    <TransitLug v-else-if="selectKey == 'E'" :selectKeyDay="selectKeyDay" :selectKey="selectKey"></TransitLug>
    <LugNow v-else :selectKeyDay="selectKeyDay" :selectKey="selectKey"></LugNow>
    
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Tabs from '@view/Tabs/Tabs'
import { queryAll } from '@/util/base'
import LugNow from './history/LugNow'
import LugHis from './history/LugHis'
import TransitLug from '../transfer/TransitLug'

export default {
  components: {
    Tabs,
    LugNow,
    LugHis,
    TransitLug
  },
  data () {
    return {
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/luggage/queryAll',
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
        {
          key: 'E',
          label: '中转行李'
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
      .type {
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        text-align: center;
        color: $gray-nd;
      }
      .value {
        margin-top: 8px;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        color: $gray-st;
      }
    }
  }
}
</style>
