<template>
  <div>
    <my-dialog :visible="visible" :footer="false" :width="680" :position="'right'" class="flt-detail-dialog under-head-dialog" @handleClose="handleClose">
      <template v-slot:header>
        <tabs :tabsData="tabsData" :defaultKey="isComp" @tabItemClick="tabItemClick"></tabs>
      </template>
      <template v-if="row && selectKey=='flt'">
        <div class="block flt-block block-first container">
          <template v-if="row.inOutFlag == 'A'">
            <div class="info">
              <div class="first-row container">
                <div class="label">前站：</div>
                <div class="text">{{(row['prevStation'] || '-') + '-' + (row['prevStationCn'] || '-')}}</div>
              </div>
              <div class="second-row">{{formatHHMM(row['prevDepTimeA']||row['prevDepTimeE']||row['prevDepTimeS'])}}</div>
              <div v-if="!row['prevDepTimeA']&&(row['prevDepTimeE']||row['prevDepTimeS'])" class="time-block">
                <div v-if="row['prevDepTimeE']" class="time-e">预计</div>
                <div v-else-if="row['prevDepTimeS']" class="time-s">计划</div>
              </div>
              <div class="third-row">
                <div>
                  <div class="label">计划</div>
                  <div class="text">{{formatHHMM(row['prevDepTimeS'])}}</div>
                </div>
                <div>
                  <div class="label">预计</div>
                  <div class="text">{{formatHHMM(row['prevDepTimeE'])}}</div>
                </div>
                <div>
                  <div class="label">实际</div>
                  <div class="text">{{formatHHMM(row['prevDepTimeA'])}}</div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="info">
              <div class="first-row container">
                <div class="label">本站：</div>
                <div class="text">{{(row['startStation'] || '-') + '-' + (row['startStationCn'] || '-')}}</div>
              </div>
              <div class="second-row">{{formatHHMM(row['atd']||row['etd']||row['std'])}}</div>
              <div v-if="!row['atd']&&(row['etd']||row['std'])" class="time-block">
                <div v-if="row['etd']" class="time-e">预计</div>
                <div v-else-if="row['std']" class="time-s">计划</div>
              </div>
              <div class="third-row">
                <div>
                  <div class="label">计划</div>
                  <div class="text">{{formatHHMM(row['std'])}}</div>
                </div>
                <div>
                  <div class="label">预计</div>
                  <div class="text">{{formatHHMM(row['etd'])}}</div>
                </div>
                <div>
                  <div class="label">实际</div>
                  <div class="text">{{formatHHMM(row['atd'])}}</div>
                </div>
              </div>
            </div>
          </template>
          <div class="img"></div>
          <template v-if="row.inOutFlag == 'A'">
            <div class="info">
              <div class="first-row container">
                <div class="label">本站：</div>
                <div class="text">{{(row['terminalStation'] || '-') + '-' + (row['terminalStationCn'] || '-')}}</div>
              </div>
              <div class="second-row">{{formatHHMM(row['ata']||row['eta']||row['sta'])}}</div>
              <div v-if="!row['ata']&&(row['eta']||row['sta'])" class="time-block">
                <div v-if="row['eta']" class="time-e">预计</div>
                <div v-else-if="row['sta']" class="time-s">计划</div>
              </div>
              <div class="third-row">
                <div>
                  <div class="label">计划</div>
                  <div class="text">{{formatHHMM(row['sta'])}}</div>
                </div>
                <div>
                  <div class="label">预计</div>
                  <div class="text">{{formatHHMM(row['eta'])}}</div>
                </div>
                <div>
                  <div class="label">实际</div>
                  <div class="text">{{formatHHMM(row['ata'])}}</div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="info">
              <div class="first-row container">
                <div class="label">下站：</div>
                <div class="text">{{(row['nextStation'] || '-') + '-' + (row['nextStationCn'] || '-')}}</div>
              </div>
              <div class="second-row">{{formatHHMM(row['nextDepTimeA']||row['nextDepTimeE']||row['nextDepTimeS'])}}</div>
              <div v-if="!row['nextDepTimeA']&&(row['nextDepTimeE']||row['nextDepTimeS'])" class="time-block">
                <div v-if="row['nextDepTimeE']" class="time-e">预计</div>
                <div v-else-if="row['nextDepTimeS']" class="time-s">计划</div>
              </div>
              <div class="third-row">
                <div>
                  <div class="label">计划</div>
                  <div class="text">{{formatHHMM(row['nextDepTimeS'])}}</div>
                </div>
                <div>
                  <div class="label">预计</div>
                  <div class="text">{{formatHHMM(row['nextDepTimeE'])}}</div>
                </div>
                <div>
                  <div class="label">实际</div>
                  <div class="text">{{formatHHMM(row['nextDepTimeA'])}}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-for="(conf, idx) in rowConf" :key="idx" class="block flt-block">
          <div class="header">{{conf.label}}</div>
          <div class="body">
            <div v-for="(item, group) in conf.list" :key="group" class="row">
              <div v-for="(col, index) in item" :key="index" :class="'col col-' + (col&&col.colWidth>0?col.colWidth:item.length)">
                <div v-if="col" class="label">{{col.label}}</div>
                <div v-if="col && col.key=='lugTotal'"></div>
                <div v-if="col" :class="['text', col.class]" :style="`color: ${col.color};`"
                :title="(['lugTotalNoAddition', 'lugLoadTruckTotal', 'lugLoadAircraftTotal', 'lugUnloadAircraftTotal', 'lugUploadTotal'].includes(col.key))?formatTotal(row, col):showValue(row, col)"
                >{{(['lugTotalNoAddition', 'lugLoadTruckTotal', 'lugLoadAircraftTotal', 'lugUnloadAircraftTotal', 'lugUploadTotal'].includes(col.key))?formatTotal(row, col):showValue(row, col)}}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="row">
        <div class="block flt-lug-block">
          <div class="body-first">
            <div class="container">
              <div class="label">航班日期：{{formatDate(row['execDate'])}}</div>
              <div class="bold">{{row['flightNoAlias']}}</div>
              <div class="label">航线：{{formatDate(row['routeCn'])}}</div>
            </div>
            <div v-if="row&&row['nodes']" class="container">
              <div v-for="(item, index) in row['nodes']" :key="index" class="container node">
                <canvas :id="'node'+index" width="100" height="100"></canvas>
                <div class="font-pro">{{Math.floor(formatPro(item) * 100) + '%'}}</div>
                <div v-if="index < (row['nodes'].length - 1)" class="img"></div>
              </div>
            </div>
          </div>
          <div class="body-second">
            <tables :tableData="tableData" @handleDblClick="showLugDetail" :loading="tableData.loading">
              <template v-slot:slot-body="{index, row, item}">
                <div v-if="row[item.key] == 'Y'" :class="['mark', (item.key=='isCancel')?'pull_down':((item.key=='isAddition')?'added':'vip')]"></div>
              </template>
            </tables>
          </div>
        </div>
      </template>
    </my-dialog>
    <lug v-if="showComp.visible" :row="showComp.row"></lug>
  </div>
</template>

<script>
import Tables from '@view/Table/Table'
import Tabs from '@view/Tabs/Tabs'
import Lug from './LugDetail'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  components: {
    Tables,
    Tabs,
    Lug
  },
  mixins: [utilMixin],
  props: ['row', 'isComp'],
  data () {
    return {
      emptyTime: '----/--/-- --:--:--',
      visible: false,
      title: '航班动态详细信息',
      selectKey: '',
      tabsData: [
        {
          key: 'flt',
          label: '航班详情'
        },
        {
          key: 'lug',
          label: '保障详情'
        }
      ],
      rowConf: [
        {
          label: '航班基础信息',
          list: [
            [
              {key: 'flightNoAlias', label: '航班号', class: 'bold'},
              {key: 'airlineCn', label: '航空公司'},
              {key: 'taskCn', label: '任务'},
              {key: 'aircraftType', label: '机型'},
              {key: 'execDate', label: '航班日期', format: [0, 10]}
            ],
            [
              {key: 'inOutFlag', label: '进出标识', enumKey: 'inOutFlag'},
              {key: 'attr', label: '属性', enumKey: 'attr'},
              {key: 'aircraftNo', label: '机号'},
              {key: 'terminal', label: '航站楼'},
              {key: 'vipFlag', label: 'VIP', enumKey: 'isYOrN'}
            ],
            [
              {key: 'alternateStationCn', label: '备降站', colWidth: 5},
              {key: 'routeCn', label: '航线'}
            ]
          ]
        },
        {
          label: '航班资源信息',
          list: [
            [
              {key: 'stand', label: '机位', class: 'bold'},
              {key: 'checkinRegion', label: '值机区域'},
              {key: 'chute', label: '行李滑槽', class: 'bold'},
              {key: 'gate', label: '登机口'},
              {key: 'checkinCounter', label: '值机柜台'}
            ]
          ]
        },
        {
          label: '航班状态信息',
          list: [
            [
              {key: 'progressStatusCn', label: '进展状态', colWidth: 5, class: 'bold'},
              {key: 'abnormalStatusCn', label: '异常状态', colWidth: 5, class: 'bold', color: '#f79f2d'},
              {key: 'abnormalReasonCn', label: '异常原因', colWidth: 5},
              {key: 'alternateReasonCn', label: '备降原因', colWidth: 3}
            ]
          ]
        },
        {
          label: '航班行李信息',
          list: [
            [
              {key: 'lugTotalNoAddition', label: '行李总数', class: 'bold'},
              {key: 'alreadyCancelTotal', label: '已拉减数'},
              {key: 'lugLoadTruckTotal', label: '已分拣数'},
              {key: 'lugLoadAircraftTotal', label: '已装机数'},
              {key: 'lugAdditionTotal', label: '追加总数'}
            ],
            [
              {key: 'lugVipTotal', label: 'VIP行李数'}
            ]
          ]
        }
      ],
      nodeConf: [
        {key: 'lugNo', label: '操作人'},
        {key: 'createtime', label: '操作时间'},
        {key: 'classifyCn', label: '标记类型'}
      ],
      picConf: ['photo1', 'photo2', 'photo3'],
      showImg: false,
      showComp: {
        visible: false,
        lugUrl: '/integrated/luggage/detail',
        row: null
      },
      tableData: {
        key: 'lugNo',
        value: null,
        url: '/integrated/luggage/queryAll',
        loading: false,
        queryParam: {
          dynamicFlightId: null
        },
        column: [
          // left
          [
            {key: 'lugNo',  label: '行李号', width: 110, class: 'bold', title: true},
            {key: 'inOutFlag', label: '行李类型', width: 70, enumKey: 'inOutFlag'},
            {key: 'destCn',  label: '目的站', width: 90, title: true},
            {key: 'originCn',  label: '始发站', width: 90, title: true},
            {key: 'progressStatusCn',  label: '进展状态', width: 70, color: '#3392ff'},
            {key: 'truck',  label: '容器', width: 80, title: true},
            {key: 'isCancel',  label: '拉减', width: 35, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isAddition',  label: '追加', width: 35, enumKey: 'isYOrN', type: 'slot'},
            {key: 'isVip',  label: 'VIP', width: 35, enumKey: 'isYOrN', type: 'slot'},
            {key: 'markingNum',  label: '标记次数', width: 65}
          ]
        ],
        data: []
      }
    }
  },
  mounted () {
    window.onresize = () => {
      this.$nextTick(() => {
        return (() => {
          this.changeWindowSize()
        })()
      })
    }
  },
  methods: {
    formatPro (obj) {
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
    changeData () {
      this.$nextTick(() => {
        this.changeWindowSize()
      })
      if (this.selectKey == 'lug') {
        if (!_.isEmpty(this.row['nodes'])) {
          this.$nextTick(() => {
            this.row['nodes'].forEach((node, index) => {
              let value = this.formatPro(node)
              let color = 'transparent'
              if (value == 1) {
                color = '#01b674'
              } else if (value >= 0.5) {
                color = '#3392ff'
              } else {
                color = '#f79f2d'
              }
              let c = document.getElementById('node' + index)
              let ctx = c.getContext('2d')

              ctx.beginPath()
              ctx.arc(50, 50, 45, -0.5 * Math.PI, 1.5 * Math.PI)
              ctx.fillStyle="#EDF1F5"
              ctx.fill()

              ctx.beginPath()
              ctx.arc(50, 50, 49, -0.5 * Math.PI, (2 * value - 0.5) * Math.PI)
              ctx.strokeStyle = color
              ctx.lineWidth = 2
              ctx.stroke()

              ctx.font = '15px normal'
              ctx.textAlign = 'center'
              ctx.fillStyle = '#899db2'
              ctx.fillText(node['nodeCn'], 50, 42)

              let ctxNum = c.getContext('2d')
              ctxNum.font = '24px DINPRO-BOLD'
              ctxNum.textAlign = 'center'
              ctxNum.fillStyle = '#3d424c'
              ctxNum.fillText((node['totalNum'] || 0) + (node['nodeAdditionNum'] || 0), 50, 74)
            })
          })
        }
        _.forEach(this.tableData.queryParam, (value, key) => {
          this.$set(this.tableData.queryParam, key, this.row[key])
        })
        queryAll(this.tableData.url, this.tableData.queryParam).then(res => {
          if (res.data.code == 0) {
            this.tableData.data = res.data.data
          }
        })
      } else {
        if (this.row.inOutFlag == 'D') {
          this.rowConf[1].list = [
            [
              {key: 'stand', label: '机位', class: 'bold'},
              {key: 'checkinRegion', label: '值机区域'},
              {key: 'chute', label: '行李滑槽', class: 'bold'},
              {key: 'gate', label: '登机口'},
              {key: 'checkinCounter', label: '值机柜台'}
            ]
          ]
          this.rowConf[3].list[0][2] = {key: 'lugLoadTruckTotal', label: '已分拣数'}
          this.rowConf[3].list[0][3] = {key: 'lugLoadAircraftTotal', label: '已装机数'}
        } else {
          this.rowConf[1].list = [
            [
              {key: 'stand', label: '机位', class: 'bold'},
              {key: 'belt', label: '行李转盘', class: 'bold'}
            ]
          ]
          this.rowConf[3].list[0][2] = {key: 'lugUnloadAircraftTotal', label: '已卸机数'}
          this.rowConf[3].list[0][3] = {key: 'lugUploadTotal', label: '已卸车数'}
        }
      }
      this.visible = true
    },
    handleClose () {
      this.visible = false
      this.$options.parent.row = {}
    },
    showLugDetail (row) {
      let idObj = {
        lugId: row['lugId']
      }
      queryAll(this.showComp.lugUrl, idObj).then(res => {
        if (res.data.code == 0) {
          this.showComp.row = res.data.data
          this.showComp.visible = true
        }
      })
    },
    changeWindowSize () {
      let dlgBody = document.getElementsByClassName('table-body')[1]
      if (dlgBody) {
        this.tableData.height = document.body.offsetHeight - document.getElementsByClassName('table-body')[1].getBoundingClientRect().top + 8
      }
    },
    formatStation ({row, item}, callback) {
      let inOutFlag = _.get(row, item.key)
      let value = ''
      switch (inOutFlag) {
        case 'A': value = row['terminalStationCn']
        break
        case 'D': value = row['startStationCn']
        break
      }
      callback(value)
    },
    tabItemClick (key) {
      this.$parent.changeComp(key, this.row)
    },
    formatHHMM (value) {
      if (value) {
        return value.substr(11, 5)
      } else {
        return '--:--'
      }
    },
    formatDate (value) {
      if (value) {
        return value.substr(0, 10)
      } else {
        return '----/--/--'
      }
    },
    formatTotal (row, col) {
      let str = ''
      let keys = [null, null]
      if (col.key == 'lugTotalNoAddition') {
        keys[0] = 'lugTotalNoAddition'
        keys[1] = 'lugAdditionTotal'
      } else if (col.key == 'lugLoadTruckTotal') {
        keys[0] = 'lugLoadTruckTotal'
        keys[1] = 'lugLoadTruckAdditionTotal'
      } else if (col.key == 'lugLoadAircraftTotal') {
        keys[0] = 'lugLoadAircraftTotal'
        keys[1] = 'lugLoadAricraftAdditionTotal'
      } else if (col.key == 'lugUnloadAircraftTotal') {
        keys[0] = 'lugUnloadAircraftTotal'
        keys[1] = 'lugUnloadAircraftAdditionTotal'
      } else if (col.key == 'lugUploadTotal') {
        keys[0] = 'lugUploadTotal'
        keys[1] = 'lugUploadAdditionTotal'
      }
      str += ((row[keys[0]] === null) || (row[keys[0]] === undefined)) ? '/' : row[keys[0]]
      str += (row[keys[1]] !== 0) ? ((row[keys[1]] == null) ? ' + /' : ` + ${row[keys[1]]}`) : ''
      return str
    }
  },
  watch: {
    isComp: {
      handler (value) {
        this.selectKey = value
      },
      immediate: true
    },
    row: {
      handler (data) {
        if (data && data.hasOwnProperty('dynamicFlightId')) {
          this.changeData()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.flt-detail-dialog {
  .dialog {
    >.header {
      height: 80px !important;
      .tabs {
        height: 38px;
        line-height: 24px;
      }
    }
    >.main {
      height: calc(100% - 80px) !important;
    }
  }
}
</style>

<style lang="scss" scoped>
$bodyHead: 32px;
.dialog {
  width: 30px;
  height: 50px;
}
.body {
  >.block {
    >.header {
      height: $bodyHead;
      line-height: $bodyHead;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      color: $gray-nd;
      background-color: #edf1f5;
    }
    >.body {
      .row {
        margin: 0 20px;
        padding: 20px 0;
        &:not(:last-child) {
          border-bottom: 1px solid $gray-rs;
        }
        >.col {
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 16px;
          >.text {
            margin-top: 12px;
            margin-left: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
          }
        }
      }
    }
    .label {
      color: $gray-rd;
      font-size: 16px;
      height: 16px;
      line-height: 16px;
    }
    .text {
      color: $gray-st;
      font-size: 16px;
      height: 16px;
      line-height: 16px;
    }
    &.flt-block {
      &.block-first {
        justify-content: center;
        align-items: center;
        padding: 20px 20px 30px 20px;
        >.info {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          &:first-child {
            margin-right: 40px;
          }
          &:last-child {
            margin-left: 40px;
          }
          >.first-row {
            height: 16px;
            line-height: 16px;
            display: flex;
            justify-content: center;
          }
          >.second-row {
            height: 36px;
            line-height: 36px;
            font-size: 36px;
            font-weight: bold;
            margin: 20px 20px;
            font-family: 'DINPRO-BOLD';
          }
          >.third-row {
            display: flex;
            >div {
              &:not(:first-child) {
                margin-left: 40px;
              }
              >div:last-child {
                margin-top: 12px;
              }
            }
          }
          >.time-block {
            $height: 20px;
            position: absolute;
            right: 10px;
            top: 28px;
            width: 36px;
            height: $height;
            font-size: 12px;
            font-weight: bold;
            color: #fff;
            border-radius: 6px;
            overflow: hidden;
            >div {
              height: 100%;
              width: 100%;
              line-height: $height;
            }
            .time-e {
              background-color: #33a6ff;
            }
            .time-s {
              background-color: #01b674;
            }
          }
        }
        >.img {
          width: 80px;
          height: 16px;
          margin-top: -36px;
          background-image: url(~@icon/icon_airline.png);
        }
      }
      >.body {
        padding-bottom: 10px;
      }
    }
    &.flt-lug-block {
      .body-first {
        padding: 0 20px 30px 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        >div:first-child {
          align-items: center;
          justify-content: space-between;
          >div:first-child {
            text-align: left;
          }
          >div:last-child {
            text-align: right;
          }
        }
        >div:last-child:not(:first-child) {
          margin-top: 30px;
        }
        .bold {
          font-size: 24px;
          font-family: 'DINPRO-BOLD';
        }
      }
      .body-second {
        overflow: hidden;
        >div {
          >.table-body {
            overflow-x: hidden;
          }
        }
      }
    }
  }
}
.text {
  margin-left: 5px;
  word-break: break-all;
}
</style>
