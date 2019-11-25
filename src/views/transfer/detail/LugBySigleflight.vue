<template>
  <div class="flight">
    <div class="query-top">
      <div class="">
        <el-page-header @back="goBack" title="返回上一级">
        </el-page-header>
      </div>
    </div>
    <div class="table-cont container cross">
      <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{tableData.data.length}}条</span>
        </div>
      </div>
      <tables :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.label=='操作'">
            <div class="table-opr detail" @click="changeComp('lug', row)"></div>
          </template>
          <!-- 旅客姓名 -->
          <template v-else-if="item.key=='psgNameCh'">
            <div class="type" :title="row['nameEn']">{{row['nameEn']}}</div>
            <div class="value" :title="row['nameCh']">{{row['nameCh']}}</div>
          </template>
          <!-- 行李编号 -->
          <template v-else-if="item.key == 'lugNo'">
            <div @click="changeComp('lug', row)" :title="(row[item.key] || '-') + '→' + (row['newLugNo'] || '-')">{{row[item.key] || '-'}}→{{row['newLugNo'] || '-'}}</div>
          </template>
          <!-- 航班号 -->
          <template v-else-if="item.key == 'flightNo'">
            <div :title="(row['flightNoA'] || '-') + '→' + (row['flightNoD'] || '-')">{{row['flightNoA'] || '-'}}→{{row['flightNoD'] || '-'}}</div>
          </template>
          <!-- type == 'slot' -->
          <template v-else>
            <!-- 未接收/已接收、未分拣/已分拣、未装机/已装机-->
            <div v-if="['dealLugNum', 'loadLugNum', 'aircraftLugNum'].includes(item.key)" class="">
              <div class="">
                {{formatNum(row, item)}}
              </div>
            </div>
          </template>
        </template>
      </tables>
    </div>
    <TransferLugDetail :isComp="showComp.is" :row="showComp.row"></TransferLugDetail>
  </div>
</template>

<script>
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import lugTableMixin from '@mixin/lugTableMixin'
import { queryAll, download } from '@/util/base'
import { dateFormat } from '@/util/util'
import TransferLugDetail from './TransferLugDetail';
// import CsProgress from '@view/CsProgress/CsProgress'
import _ from 'lodash'

export default {
  components: {
    Tables,
    TransferLugDetail,
  },
  mixins: [tableMixin, lugTableMixin],
  data () {
    return {
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/transferLuggage/queryTransferDetailByFlight', // /',pageQuery
      // 菜单对应按钮权限
      permissions: {
        insert: false,
        export: true,
        setlist: true
      },
      showComp: {
        is: null,
        lugUrl: '/integrated/transferLuggage/detail',
        row: null
      },
      queryParam: [
        {
          key: 'dynamicFlightIdD',
          label: '出港航班ID',
          type: 'input',
          width: 214,
          toUpper: true,
          isHidden: true,
        },
        {
          key: 'flightDate',
          label: '航班日期',
          type: 'elDate',
          dateType: 'date',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          width: 214,
          isHidden: true,
        },
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'dynamicFlightIdD',
        column: [
          // left
          [
            {key: 'lugNo',  label: '进→出港行李编号', width: 220, type: 'slot',colClass: 'bold-underline'},
            {key: 'psgNameCh',  label: '旅客姓名', width: 130, type: 'slot'},
            {key: 'flightNo',  label: '进→出港航班号', width: 140, type: 'slot'},
            {key: 'originIataCn',  label: '始发站', width: 130, title: true},
            {key: 'execDateA', label: '进港航班日期', width: 100, format: [0, 10]},
            {key: 'destIataCn',  label: '目的站', width: 130, title: true},
            {key: 'execDateD', label: '出港航班日期', width: 130, format: [0, 10]},
            {key: 'timeA', label: '进港卸机时间', width: 130, format: [0, 16]},
            {key: 'timeD', label: '出港装机时间', width: 130, format: [0, 16]},
          ],
          // center
          [
            
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
  created() {
    this.queryParam.forEach(item=>{
      if (item.key == 'dynamicFlightIdD') {
        item.value = this.$route.query.dynamicFlightIdD;
      }
      if (item.key == 'flightDate') {
        item.value = this.$route.query.flightDate;
      }
    })
    // this.getDefaultRow('transferByf')
  },
  mounted () {
    this.queryDataRefresh()
  },
  destroyed () {
    clearInterval(this.onceTimer)
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
    customQueryBefore () {
      this.$set(this.queryData, 'dynamicFlightIdD', this.$route.query.dynamicFlightIdD)
      this.$set(this.queryData, 'flightDate', this.$route.query.flightDate)
    },
    changeComp (comp, row) {
      this.showComp.is = comp;
      if(!row['lugId']) {
        this.$msg.error({
          info: '该行李进港航班暂未到本站，请稍后查询！',
          tip: ''
        })
        return;
      }
      let idObj = {
        lugId: row['lugId'],
        newlugId: row['newlugId'],
        flightDate: row['execDateD'].slice(0,10),
      }
      let url = this.showComp[comp + 'Url'];
      this.showComp.row = {};

      queryAll(url, idObj).then(res => {
        if (res.data.code == 0) {
          let data
          data = res.data.data
          this.showComp.row = _.assign(row, data)
        }else {
            this.$msg.error({
              info: '获取详情失败 !',
              tip: res.data.msg
            })
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
        value = (obj[item.befkey] || '-') + '/' + (obj[item.aftkey] || '-')
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
      if(item.key == 'loadAircraftProcess') {
        // 装机进度进度条 若在装机结束时间已装机完成，则不预警，进度条颜色不改变；若在装机结束时间之前未装机完成，则进度条颜色改变，进行预警
        if(row.loadAircraftTimeEnd && this.formatterTimeOfHM(new Date()) >= this.formatterTimeOfHM(row.loadAircraftTimeEnd) && (row[item.befkey] > 0)) {
          return 'linear-gradient(to right, #f8b53f, #f58c24)'     
        } else {
          return 'linear-gradient(to right, #60cb6c, #01b674)'
        }
      } else if(item.key == 'truckProcess') {
        // 分拣进度
        if(row[item.befkey] === null) {
          // 灰色
          return ''
        } else if(row[item.befkey] === 0) {
          // 绿色
          return 'linear-gradient(to right, #60cb6c, #01b674)'
        } else {
          // 橙色
          return 'linear-gradient(to right, #f8b53f, #f58c24)'
        }
      }else {
        let value = this.formatPro(row, item)
        if (value == 1) {
          //绿色
          return 'linear-gradient(to right, #60cb6c, #01b674)'
        } else if (value >= 0.5) {
          // 蓝色
          return 'linear-gradient(to right, #46a6f9, #578cfe)'
        } else {
          // 橙色
          return 'linear-gradient(to right, #f8b53f, #f58c24)'
        }
      }
    },
    formatterTimeOfHM (time) {
      if (time) {
        var date = new Date(time)
        var hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        var minite = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        return `${hour}:${minite}`
      } else {
        return '—:—'
      }
    },
  },
  watch: {
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
      .el-date-editor--daterange.el-input__inner {
        width: 221px;
      }
      &.mt14 {
        margin-top: 14px;
      }
    }
  }
  .toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 160px;
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
          // margin-left: -1px;
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
