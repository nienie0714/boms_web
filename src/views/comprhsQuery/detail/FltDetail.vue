<template>
  <div>
    <my-dialog :visible="visible" :footer="false" :position="'right'" class="flt-detail-dialog under-head-dialog" @handleClose="handleClose">
      <template v-slot:header>
        <tabs :tabsData="tabsData" :defaultKey="isComp" @tabItemClick="tabItemClick"></tabs>
      </template>
      <template v-if="row && selectKey=='flt'">
        <div class="block flt-block block-first container">
          <div class="info">
            <div class="first-row container">
              <div class="label">始发站：</div>
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
          <div class="img"></div>
          <div class="info">
            <div class="first-row container">
              <div class="label">目的站：</div>
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
              <div class="label" :title="row['route']">航线代码：{{row['route']}}</div>
            </div>
            <div v-if="row&&row['nodes']" class="container">
              <div v-for="(item, index) in row['nodes']" :key="index" class="container cross node">
                <div>{{item['nodeCn']}}</div>
                <div class="container">
                  <canvas :id="'node'+index" width="80" height="80"></canvas>
                  <div v-if="(item['nodeCn'] != '值机交运') && (Math.floor(formatPro(item) * 100) > 0)" class="font-pro">{{Math.floor(formatPro(item) * 100) + '%'}}</div>
                  <div v-if="index < (row['nodes'].length - 1)" class="img"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="body-second">
            <tables :tableData="tableData" @handleDblClick="showLugDetail" :loading="tableData.loading">
              <template v-slot:slot-body="{index, row, item}">
                <div v-if="item.key == 'markingNum'" :class="['mark', (row[item.key] > 0)?'marking':'']"><span v-if="row[item.key] <= 0">否</span></div>
                <template v-else-if="item.key=='luggeTypeCn'">
                  <div class="dot-font" v-if="row[item.key] == '普通'">
                    <div class="dot-color-normal"></div>
                    <span>{{row[item.key]}}</span>
                  </div>
                  <div class="dot-font" v-else-if="row[item.key] == '拉减'">
                    <div class="dot-color-cancel"></div>
                    <span>{{row[item.key]}}</span>
                  </div>
                  <div class="dot-font" v-else-if="row[item.key] == '追加'">
                    <div class="dot-color-add"></div>
                    <span>{{row[item.key]}}</span>
                  </div>
                  <div class="dot-font" v-else-if="row[item.key] == 'VIP'">
                    <div class="dot-color-vip"></div>
                    <span>{{row[item.key]}}</span>
                  </div>
                  <div v-else>-</div>
                </template>
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
  props: ['row', 'isComp', 'isHistory'],
  data () {
    return {
      emptyTime: '----/--/-- --:--:--',
      visible: false,
      title: '航班动态详细信息',
      selectKey: '',
      tabsData: [
        {
          key: 'lug',
          label: '航班保障信息'
        },
        {
          key: 'flt',
          label: '航班基本信息'
        }
      ],
      rowConf: [
        {
          label: '航班基础信息',
          list: [
            [
              {key: 'flightNoAlias', label: '航班号', class: 'bold'},
              {key: 'terminal', label: '航站楼编号'},
              {key: 'execDate', label: '执行日期', format: [0, 10]},
              {key: 'attr', label: '航班属性', enumKey: 'attr'},
              {key: 'taskCn', label: '任务'}
            ],
            [
              {key: 'aircraftNo', label: '飞机号'},
              {key: 'aircraftType', label: '机型'},
              {key: 'agencyCn', label: '代理'},
              {key: 'stand', label: '机位'},
              {key: 'chute', label: '滑槽号'}
            ],
            [
              {key: 'gate', label: '登机口', colWidth: 5},
              {key: 'abnormalStatusCn', label: '航班异常状态', colWidth: 5, color: '#f79f2d'}, // , class: 'bold'
              {key: 'route', label: '航线代码'} // routeCn
            ]
          ]
        }/* ,
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
        } */
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
        url: '/integrated/luggage/queryAllDetail',
        loading: false,
        queryParam: {
          dynamicFlightId: null
        },
        column: [
          // left
          [
            {key: 'lugNo',  label: '行李号', width: 200, class: 'bold', title: true},
            {key: 'progressStatusCn',  label: '保障状态', width: 170, color: '#3392ff'},
            {key: 'markingNum',  label: '是否标记', type: 'slot', width: 100},
            {key: 'luggeTypeCn', label: '行李类型', type: 'slot', width: 170}
            // {key: 'destCn',  label: '目的站', width: 90, title: true},
            // {key: 'originCn',  label: '始发站', width: 90, title: true},
            // {key: 'truck',  label: '容器', width: 80, title: true},
            // {key: 'isCancel',  label: '拉减', width: 35, enumKey: 'isYOrN', type: 'slot'},
            // {key: 'isAddition',  label: '追加', width: 35, enumKey: 'isYOrN', type: 'slot'},
            // {key: 'isVip',  label: 'VIP', width: 35, enumKey: 'isYOrN', type: 'slot'},
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
        let denominator = (obj['totalNum'] || 0) + (obj['totalAdditionNum'] || 0)
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
              ctx.arc(40, 40, 35, -0.5 * Math.PI, 1.5 * Math.PI)
              ctx.fillStyle="#EDF1F5"
              ctx.fill()

              ctx.beginPath()
              ctx.arc(40, 40, 39, -0.5 * Math.PI, (2 * value - 0.5) * Math.PI)
              ctx.strokeStyle = color
              ctx.lineWidth = 2
              ctx.stroke()

              // ctx.font = '15px normal'
              // ctx.textAlign = 'center'
              // ctx.fillStyle = '#899db2'
              // ctx.fillText(node['nodeCn'], 40, 32)

              let ctxNum = c.getContext('2d')
              ctxNum.font = '24px DINPRO-BOLD'
              ctxNum.textAlign = 'center'
              ctxNum.fillStyle = '#3d424c'
              ctxNum.fillText((node['nodeNum'] || 0) + (node['nodeAdditionNum'] || 0), 40, 48)
            })
          })
        }
        _.forEach(this.tableData.queryParam, (value, key) => {
          this.$set(this.tableData.queryParam, key, this.row[key])
        })
        if (this.isHistory) {
          this.tableData.queryParam.execRange = -2
        }
        queryAll(this.tableData.url, this.tableData.queryParam).then(res => {
          if (res.data.code == 0) {
            this.tableData.data = res.data.data
          }
        })
      } else {
        if (this.row.inOutFlag == 'D') {
          this.$set(this.rowConf[0].list[1], 4, {key: 'chute', label: '滑槽号'})
        } else {
          this.$set(this.rowConf[0].list[1], 4, {key: 'belt', label: '行李转盘'})
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
        } else {
          this.$msg.error({
            info: '获取详情失败 !',
            tip: res.data.msg
          })
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
          >div:not(:first-child):not(:last-child) {
            position: absolute;
            left: 43%;
          }
          >div:last-child {
            text-align: right;
            max-width: 43%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        >div:last-child:not(:first-child) {
          margin-top: 30px;
          
          >.node {
            >div:first-child {
              width: 80px;
              font-size: 16px;
              color: #3D424D;
              margin-bottom: 11px;
            }
            >div:last-child {
              >.img {
                margin: auto 8px auto 14px;
                width: 10px;
                height: 10px;
                background-image: url(~@icon/lug/icon_next_arrow.png);
              }
            }
          }
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
        .mark {
          $wh: 16px;
          width: $wh;
          height: $wh;
          display: flex;
          align-items: center;
          &.marking {
            background-image: url(~@lug/mark_marking.png);
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
