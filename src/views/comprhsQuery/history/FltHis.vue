<template>
  <div class="flight-his">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
      <div class="toolbar">
        <button type="info" @click="cleanQueryData">重置</button>
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <!-- <div class="table-cont whole-table-cont container cross"> -->
        <tables :tableData="tableData" :loading="tableData.loading" ref="tables">
          <template v-slot:slot-body="{index, row, item}">
            <template v-if="item.label=='操作'">
              <div class="table-opr detail" @click="changeComp('flt', row)"></div>
            </template>
            <!-- 航班 -->
            <template v-else-if="item.key == 'flightNoAlias'">
              <div @click="changeComp('flt', row)">{{row[item.key]}}</div>
            </template>
            <!-- 航班状态 -->
            <template v-else-if="item.key == 'progressStatusCn'">
              <div v-if="row[item.key] == '起飞'" class="fly-class">{{row[item.key]}}</div>
              <div v-else-if="row[item.key] == null || row[item.key] == ''"></div>
              <div v-else class="other-class">{{row[item.key]}}</div>
            </template>
            <!-- 航班异常状态 -->
            <template v-else-if="item.key == 'abnormalStatusCn'">
              <div v-if="row[item.key] == null || row[item.key] == ''"></div>
              <div class="red-color">{{row[item.key]}}</div>
            </template>
            <!-- 行李类型 -->
            <template v-else-if="['lugCommonTotal', 'lugAdditionTotal', 'lugCancelTotal', 'lugVipTotal', 'lugMarkingTotal'].includes(item.key)">
              <!-- <div v-if="row[item.key] == null || row[item.key] == 0">-</div> -->
              <div v-if="item.key == 'lugAdditionTotal' && selectKey == 'D'" @click="changeComp('add', row)" :class="row['lugAdditionTotal']?'bold-underline':''">{{row[item.key]}}</div>
              <div v-else>{{row[item.key]}}</div>
            </template>
            <!-- 已交运 -->
            <template v-else-if="item.key == 'checkTotal'" >
              <div >{{formatCheck(row, item)}}</div>
            </template>
            <!-- 卸机数 -->
          <template v-else-if="item.key == 'unLoadAirNum'" >
            <!-- @click="changeComp('load', row)" :class="row[item.key]?'bold-underline':''" -->
            <div @click="changeComp('load', row)" :class="row[item.key]?'bold-underline':''">{{row[item.key]}}</div>
          </template>
            <!-- 卸车数 -->
            <template v-else-if="item.key == 'unLoadCarNum'" >
              <div >{{row[item.key]}}{{row['unLoadCarNumAdd']?'(+' + row['unLoadCarNumAdd'] + ')': ''}}</div>
            </template>
              <!-- 异常预警行李 -->
            <template v-else-if="item.key == 'warningNum'" >
              <div @click="changeComp('ablug', row)" :class="row[item.key]?'bold-underline':''">{{row[item.key]}}</div>
            </template>
            <template v-else>
              <!-- 运行情况：D 分拣进度（未分拣/应分拣）、装机进度（未装机/应装机）-->
              <div class="container cross col-pro" v-if="['truckProcess', 'loadAircraftProcess'].includes(item.key)">
                <div class="container">
                  <div v-if="item.key == 'truckProcess'" @click="changeComp('truck', row)" :class="row['truckNum'] || row['truckNumTotal']?'bold-underline':''">{{formatNumDb(row, item)}}</div>
                  <div v-else-if="item.key == 'loadAircraftProcess'" @click="changeComp('loadAircraft', row)" :class="row['loadAircraftNum'] || row['loadAircraftNumTotal']?'bold-underline':''">{{formatNumDb(row, item)}}</div>
                  <div v-else>{{formatNumDb(row, item)}}</div>
                </div>
                <div>
                  <cs-progress :value="formatProDb(row, item)" :color="proColorDb(row, item)"></cs-progress>
                </div>
              </div>
              <!-- 运行情况：A 卸机进度(卸机数/前站装机数)、卸机进度(卸车数/总数) -->
              <div class="container cross col-pro" v-if="['loadAirNumProcess', 'unLoadCarNumProcess'].includes(item.key)" >
                <div class="container">
                  <div>{{formatNum(row, item)}}</div>
                  <!-- <div class="label">{{Math.floor(formatPro(row, item) * 100) + '%'}}</div> -->
                </div>
                <div>
                  <cs-progress :value="formatPro(row, item)" :color="proColor(row, item)"></cs-progress>
                </div>
              </div>
            </template>
          </template>
        </tables>
      <!-- </div> -->
      <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <div class="toolbar subtoolbar">
            <toolbar :permissions="permissions" @openExport="openExport">
              <template v-slot:setlist>
                <el-popover placement="bottom" width="520" trigger="click" v-model="defaultRow" :style="{right: '0px', left: '1380px'}">
                  <div class="opr-popover">
                    <el-main>
                      <div class="opr-popover-left">
                        <el-header>运行情况</el-header>
                        <el-main>
                          <ul>
                            <div v-for="(field, index) in tableData.column[1][0].child" :key="field.key">
                              <li v-if="index > (leftAutoNum - 1)" :class="((oprPopoverDirect == 'left') && (oprPopoverIndex == index)) ? 'opr-popover-li-click' : ''">
                                <div class="opr-popover-li-left" :title="field.label">{{ substrValue(field.label, 4) }}</div>
                                <div class="opr-popover-li-right">
                                  <div :class="field.hidden?'button-close':'button-show'" @click="handleEye(field, index, 'left')"></div>
                                  <div class="button-up" @click="handleUp(field, index, 'left')"></div>
                                  <div class="button-top" @click="handleTop(field, index, 'left')"></div>
                                </div>
                              </li>
                            </div>
                          </ul>
                        </el-main>
                      </div>
                      <div class="opr-popover-right">
                        <el-header>行李类型</el-header>
                        <el-main>
                          <ul>
                            <div v-for="(field, index) in tableData.column[1][1].child" :key="field.key">
                              <li v-if="index < rightAutoNum" :class="((oprPopoverDirect == 'left') && (oprPopoverIndex == index)) ? 'opr-popover-li-click' : ''">
                                <div class="opr-popover-li-left">{{ substrValue(field.label, 5) }}</div>
                                <div class="opr-popover-li-right">
                                  <div :class="field.hidden?'button-close':'button-show'" @click="handleEye(field, index, 'right')"></div>
                                  <div class="button-up" @click="handleUp(field, index, 'right')"></div>
                                  <div class="button-top" @click="handleTop(field, index, 'right')"></div>
                                </div>
                              </li>
                            </div>
                          </ul>
                        </el-main>
                      </div>
                    </el-main>
                    <el-footer>
                      <div class="footer-left">
                        <el-button type="info" plain @click="getDefaultRow()">恢复默认值</el-button>
                      </div>
                      <div class="footer-right">
                        <el-button type="info" plain @click="closeDefaultRow()">关闭</el-button>
                        <el-button type="primary" @click="saveDefaultRow()">保存</el-button>
                      </div>
                    </el-footer>
                  </div>
                  <div class="tool-button setlist" slot="reference">
                    <div class="icon"></div>
                    <div class="label" style="font-weight:bolder">设置列</div>
                  </div>
                </el-popover>
              </template>
            </toolbar>
          </div>
        </div>
      </div>
    </div>
    <!-- 出港-异常预警行李 -->
    <Ablug v-if="showablug" :isComp="showComp.is" @closeablug="closeablug" :row="showComp.row" :isHistory="true"></Ablug>
    <!-- 分拣进度、装机进度详情-->
    <TruckLoadDetail v-if="showTruck" :isComp="showComp.is" @closeTruck="closeTruck" :row="showComp.row"></TruckLoadDetail>
    <flt :isComp="showComp.is" :row="showComp.row" :isHistory="true"></flt>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" :info="exportInfo" @handleSubmit="handleExport" @handleClose="handleExportClose"></confirm-tip>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Toolbar from '@view/Toolbar/Toolbar'
import Pagination from '@view/Pagination/Pagination'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import flightTableMixin from '@mixin/flightTableMixin'
import { queryAll, download } from '@/util/base'
import { dateFormat } from '@/util/util'
import Inputs from '@view/Inputs/Inputs'
import CsProgress from '@view/CsProgress/CsProgress'
import Flt from '../detail/FltDetail'
import Ablug from '../detail/abnormalLug';
import TruckLoadDetail from '../detail/TruckLoadDetail';
import ConfirmTip from '@/views/home/common/ConfirmTip'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Toolbar,
    Pagination,
    Flt,
    Ablug,
    TruckLoadDetail,
    Tables,
    CsProgress,
    ConfirmTip
  },
  mixins: [tableMixin, formMixin, flightTableMixin],
  props: ['selectKeyDay', 'selectKey'],
  data () {
    return {
      // 请求路径
      queryUrl: '/integrated/dynamicFlight/pageQuery',
      exportUrl: '/integrated/dynamicFlight/exportExcel',
      permissions: {
        insert: false,
        export: true,
        setlist: true
      },
      exportInfo: '是否确认导出0条数据？',
      queryParam: [
        {
          key: 'flightNo',
          label: '航班号',
          type: 'input',
          width: 214,
          toUpper: true,
          class: 'mb14'
        },
        // {
        //   key: 'guarantee',
        //   label: '保障状态',// todo
        //   type: 'select',
        //   width: 214,
        //   itemValue: 'standNo',
        //   itemLabel: 'standNo',
        //   url: '/base/aircraftStand/queryAll'
        // },
        {
          key: 'marking',
          label: '是否标记',
          type: 'tab',
          width: 214,
          enumKey: 'yOrNOrAll',
          itemValue: 'code',
          itemLabel: 'name',
          value: null,
          class: 'mb14'
        },
        {
          key: 'execDate',
          label: '航班日期',// 航班日期
          type: 'elDate',
          dateType: 'date',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          defaultValue: dateFormat(new Date().getTime() - 1000 * 3600 * 24, 'yyyy-MM-dd'),
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > (Date.now()-24*3600*1000)
            }
          },
          clearable: false,
          width: 214,
          class: 'mb14'
        },
        {
          key: 'abnormalStatus',
          label: '航班异常状态',// todo 航班异常状态
          type: 'select',
          width: 234,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryAbnormalStatus',
          class: 'mb14'
        },
        {
          key: 'progressStatus',
          label: '航班状态',
          type: 'select',
          width: 214,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryFlightStatus',
          class: 'mb14'
        },
        {
          key: 'terminal',
          label: '航站楼',
          type: 'select',
          width: 214,
          itemValue: 'terminalNo',
          itemLabel: 'name',
          url: '/base/terminal/queryAll',
          class: 'mb14'
        }
      ],
      // 获取默认隐藏/显示列路径
      queryDefaultRowUrl: '/sys/sysUserCustom/querySysUserCustom',
      // 保存默认隐藏/显示列路径
      saveDefaultRowUrl: '/sys/sysUserCustom/updateSysUserCustom',
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'dynamicFlightId',
        column: [
          // left
          [
            // {type: 'mult', width: 50, rowspan: 2},
            {
              label: '航班信息',
              colspan: 12,
              titleClass: 'th-col-title',
              child: [
                {key: 'flightNoAlias',  label: '航班', width: 80, colClass: 'bold-underline', title: true, type: 'slot'},
                {key: 'shareFlights',  label: '共享航班', width: 80, title: true},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10]},
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'std', label: '计划', width: 80, format: [11, 5]},
                {key: 'etd', label: '预计', width: 80, format: [11, 5]},
                {key: 'atd', label: '实际', width: 80, format: [11, 5]},
                {key: 'terminal',  label: '航站楼', width: 60},
                {key: 'stand',  label: '机位', width: 60},
                {key: 'progressStatusCn',  label: '航班状态', width: 100, title: true, type: 'slot'},
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true},
                {key: 'belt',  label: '行李转盘', width: 70, title: true, class: 'col-child-right'}
              ]
            }
          ],
          // center
          [
            {
              label: '运行情况',
              colspan: 10,
              titleClass: 'th-col-title',
              child: [
                {key: 'loadAircraftTotalCount',  label: '总装机数', width: 80, format: this.formatTotalAdd, hidden: false},
                // 已交运
                {key: 'checkTotal', label: '已交运', width: 60, hidden: false},
                // todo 安检数 待确认
                {key: 'securityNum', label: '安检数', width: 60, hidden: false},
                // 分拣耗时
                {key: 'loadTruckCost', label: '分拣耗时', width: 80, hidden: false},
                // 分拣进度（已分拣/应分拣）
                {key: 'truckProcess', befkey: 'truckNum', aftkey: 'truckNumTotal',label: '已分拣/总数', width: 120, type: 'slot', hidden: false},
                // 起运时间
                {key: 'transportTimeStart', label: '起运时间', width: 80, format: [11, 5],hidden: false},
                // 装机耗时
                {key: 'loadAircraftCost', label: '装机耗时', width: 80, hidden: false},
                // 装机进度（已装机/应装机）
                {key: 'loadAircraftProcess', befkey: 'loadAircraftNum', aftkey: 'loadAircraftNumTotal', label: '已装机/总数', width: 120, type: 'slot', hidden: false},
                // 中转数
                {key: 'transferNumD',  label: '中转数', width: 60, hidden: false},
                // 异常预警行李
                {key: 'warningNum',  label: '异常预警行李', width: 100, type: 'slot', hidden: false},
              ]
            },
            {
              label: '行李类型',
              colspan: 4,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, type: 'slot', hidden: false},
                // {key: 'lugAdditionTotal',  label: '追加', width: 60, type: 'slot', hidden: false},
                {key: 'lugCancelTotal',  label: '拉减', width: 60, type: 'slot', hidden: false},
                // todo 挑找
                {key: 'lugVipTotal',  label: 'VIP', width: 60, enumKey: 'isYOrN', type: 'slot', hidden: false},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, type: 'slot', hidden: false},
              ]
            }
          ],
          // right
          [
            {label: '操作', rowspan: 2, type: 'slot', width: 70},
          ]
        ],
        data: []
      },
      showComp: {
        is: null,
        lugUrl: '/integrated/dynamicFlight/flightLugStat',
        fltUrl: '/integrated/dynamicFlight/detail',
        ablugUrl: '/integrated/dynamicFlight/queryFlightWaringNum',
        loadUrl: '/integrated/dynamicFlight/queryFlightNodeLug',
        addUrl: '/integrated/dynamicFlight/queryFlightAdditionNum',
        row: null
      },
      showablug: false,
      showTruck: false,
    }
  },
  mounted () {
    this.queryParam.forEach(item => {
      if (item.key == 'execDate') {
        let today = new Date(new Date().getTime() - 1000 * 3600 * 24)
        let dateStr = `${today.getFullYear()}-${this.addZero(today.getMonth() + 1)}-${this.addZero(today.getDate())}`
        item.value = dateStr;
        this.$set(this.queryData, item.key, item.value)
      }
    })
    this.getFlightStatus()
    this.queryDataReq()
    this.tabItemClick()
  },
  created() {
    this.getDefaultRow()
  },
  methods: {
    customQueryBefore () {
      this.$set(this.queryData, 'inOutFlag', this.selectKey)
    },
    tabItemClick () {
      if (this.selectKey == 'D') {
        this.$set(this.tableData.column, 0, [
            {
              label: '航班信息',
              colspan: 12,
              titleClass: 'th-col-title',
              child: [
                {key: 'flightNoAlias',  label: '航班', width: 80, colClass: 'bold-underline', title: true, type: 'slot'},
                {key: 'shareFlights',  label: '共享航班', width: 80, title: true},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10]},
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'std', label: '计划', width: 80, format: [11, 5]},
                {key: 'etd', label: '预计', width: 80, format: [11, 5]},
                {key: 'atd', label: '实际', width: 80, format: [11, 5]},
                {key: 'terminal',  label: '航站楼', width: 60},
                {key: 'stand',  label: '机位', width: 60},
                {key: 'progressStatusCn',  label: '航班状态', width: 100, title: true, type: 'slot'},// 进展
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true, type: 'slot'},
                {key: 'chute',  label: '行李滑槽', width: 70, title: true, class: 'col-child-right'}
              ]
            }
          ])
        this.$set(this.tableData.column, 1, [
            {
              label: '运行情况',
              colspan: 10,
              titleClass: 'th-col-title',
              child: [
                {key: 'loadAircraftTotalCount', label: '总装机数', width: 80, hidden: false, headerTitle: '值机数+追加数-拉减数；（实际拉减数：值机拉减+追加拉减）。'},
                // 已交运
                {key: 'checkTotal', label: '已交运', width: 60, hidden: false, headerTitle: '值机-拉减数；（值机拉减数，包含所有节点的拉减，不包含追加的拉减数）。'},
                // todo 安检数 待确认
                {key: 'securityNum', label: '安检数', width: 60, hidden: false},
                // 分拣耗时
                {key: 'loadTruckCost', label: '分拣耗时', width: 80, hidden: false},
                // 分拣进度（已分拣/应分拣）
                {key: 'truckProcess', befkey: 'truckNum', aftkey: 'truckNumTotal',label: '已分拣/总数', width: 120, type: 'slot', hidden: false, headerTitle: '已分拣：显示在离港分拣环节，已执行分拣的行李数量；总数：值机-值机拉减（柜台+分拣）+离港分拣环节已追加（追加-追加拉减）。进度条显示：显示分拣进度，并显示已分拣/总数数量。'},
                // 起运时间
                {key: 'transportTimeStart', label: '起运时间', width: 80, format: [11, 5], hidden: false},
                // 装机耗时
                {key: 'loadAircraftCost', label: '装机耗时', width: 80, hidden: false},
                // 装机进度（已装机/应装机）
                {key: 'loadAircraftProcess', befkey: 'loadAircraftNum', aftkey: 'loadAircraftNumTotal', label: '已装机/总数', width: 120, type: 'slot', hidden: false, headerTitle: '已装机：显示在卸车装机环节，已执行装机操作的行李数量；总数：值机+离港分拣环节已追加+卸车装机环节已追加-值机拉减（柜台+分拣+装机）。进度条显示：显示装机进度，并显示已装机/总数数量。'},
                // 中转数
                {key: 'transferNumD',  label: '中转数', width: 60, hidden: false, headerTitle: '出港航班上的中转行李数'},
                // 异常预警行李
                {key: 'warningNum',  label: '异常预警行李', type: 'slot',width: 100, hidden: false, headerTitle: '显示该架航班上所有异常预警行李信息；已装机的行李，都为正常状态行李。'},
              ]
            },
            {
              label: '行李类型',
              colspan: 5,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, type: 'slot', hidden: false},
                {key: 'lugAdditionTotal',  label: '追加', width: 60, type: 'slot', hidden: false, headerTitle: '追加数-追加拉减数；即实际追加行李数量。'},
                {key: 'lugCancelTotal',  label: '拉减', width: 60, type: 'slot', hidden: false, headerTitle: '值机拉减+追加拉减'},
                {key: 'lugVipTotal',  label: 'VIP', width: 60, enumKey: 'isYOrN', type: 'slot', hidden: false},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, type: 'slot', hidden: false, headerTitle: '被标记的行李数量'},
              ]
            }
          ])
      } else if (this.selectKey == 'A') {
        this.$set(this.tableData.column, 0, [
            {
              label: '航班信息',
              colspan: 12,
              titleClass: 'th-col-title',
              child: [
                {key: 'flightNoAlias',  label: '航班', width: 80, colClass: 'bold-underline', title: true, type: 'slot'},
                {key: 'shareFlights',  label: '共享航班', width: 80, title: true},
                {key: 'execDate', label: '航班日期', width: 90, format: [0, 10]},
                {key: 'routeCn',  label: '航线', width: 120, title: true},
                {key: 'sta', label: '计划', width: 80, format: [11, 5]},
                {key: 'eta', label: '预计', width: 80, format: [11, 5]},
                {key: 'ata', label: '实际', width: 80, format: [11, 5]},
                {key: 'terminal',  label: '航站楼', width: 60},
                {key: 'stand',  label: '机位', width: 60},
                {key: 'progressStatusCn',  label: '航班状态', width: 100, title: true, type: 'slot'},// 进展
                {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true, type: 'slot'},
                {key: 'belt',  label: '行李转盘', width: 70, title: true, class: 'col-child-right'}
              ]
            }
          ])
        this.$set(this.tableData.column, 1, [
            {
              label: '运行情况',
              colspan: 10,
              titleClass: 'th-col-title',
              child: [
                {key: 'unLoadAirTotal',  label: '总数', width: 60, format: this.formatTotalAdd, hidden: false, headerTitle: '卸机数+追加数量'},
                // 前站装机数
                {key: 'beforeLoadAirNum',  label: '前站装机数', width: 100, hidden: false},
                // 中转数
                {key: 'transferNumA',  label: '中转数', width: 100, hidden: false},
                {key: 'unLoadAirNum',  label: '卸机数', width: 60, hidden: false, type: 'slot'},
                {key: 'unLoadAirCostTime',  label: '卸机耗时', width: 60, hidden: false},
                // 卸机进度(卸机数/前站装机数)
                {key: 'loadAirNumProcess', label: '卸机数/前站装机数', befkey: 'unLoadAirNum', aftkey: 'beforeLoadAirNum',width: 120, type: 'slot', hidden: false},
                // 卸车数 （括号里面加：卸车数追加：  unLoadCarNumAdd）
                {key: 'unLoadCarNum',  label: '卸车数', width: 60, hidden: false, type: 'slot'},
                {key: 'unLoadCarCostTime',  label: '卸车耗时', width: 60, hidden: false},
                // 卸车进度(卸车数/总数)
                {key: 'unLoadCarNumProcess', label: '卸车数/总数', befkey: 'unLoadCarNum', aftkey: 'unLoadAirTotal', width: 120, type: 'slot', hidden: false, headerTitle: '总数=卸机数+追加数量'},

                // 提取核验数（括号里面加：提取核验数追加： extractCheckNumAdd）
                {key: 'extractCheckNum',  label: '提取核验数', width: 100, hidden: false},
              ]
            },
            {
              label: '行李类型',
              colspan: 3,
              titleClass: 'th-col-title',
              child: [
                {key: 'lugCommonTotal',  label: '普通', width: 60, type: 'slot', hidden: false},
                // {key: 'lugAdditionTotal',  label: '追加', width: 60, type: 'slot', hidden: false},
                {key: 'lugVipTotal',  label: 'VIP', width: 60, enumKey: 'isYOrN', type: 'slot', hidden: false},
                {key: 'lugMarkingTotal',  label: '标记', width: 60, type: 'slot', hidden: false},
              ]
            }
          ])
      }
    },
    changeComp (comp, row, flag) {
      this.showComp.is = comp
      let idObj = {
        dynamicFlightId: row[this.tableData.key],
        execDate: row['execDate'].substr(0,10)
      }
      this.showComp.row = {};
      let url = this.showComp[comp + 'Url'];
      if(this.showComp.is == 'ablug' && row.warningNum) {
        this.showablug = true;
        this.showComp.row = row;
      } else if(this.showComp.is == 'load' && row.unLoadAirNum) {
        this.showablug = true;
        this.showComp.row = row;
      } else if(this.showComp.is == 'add' && row.lugAdditionTotal) {
        this.showablug = true;
        this.showComp.row = row;
      }else if(this.showComp.is == 'truck' && (row.truckNum || row.truckNumTotal)) {
        this.showTruck = true;
        this.showComp.row = row;
      } else if(this.showComp.is == 'loadAircraft' && (row.loadAircraftNum || row.loadAircraftNumTotal)) {
        this.showTruck = true;
        this.showComp.row = row;
      } else {
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
            //flag：true 解决航班详情界面：切换到航班保障信息的时候，传的参数row为null问题
            if(flag) {
              this.showComp.row = _.assign(row, data)
            } else {
              this.showComp.row = data
            }
          }
        })
      }
    },
    closeablug() {
      this.showablug = false;
      this.showComp.is = '';
    },
    closeTruck() {
      this.showTruck = false;
      this.showComp.is = '';
    },
    // 已交运=已交运checkTotal-中转数transferNumD
    formatCheck(row, item) {
      if(row[item.key] && row['transferNumD']) {
        return row[item.key] - row['transferNumD']
      } else {
        return row[item.key]
      }
    },
    formatTotalAdd ({row, item}) {
      return row[item.key]
    },
    formatNum (row, item) {
      let value = '-/-'
      let denominator = row[item.aftkey] || 0;
      let molecule = row[item.befkey] || 0;
      // denominator = denominator == 0 ? '0' : denominator
      // molecule = molecule == 0 ? '0' : molecule
      value = (molecule || '-') + '/' + (denominator || '-')
      return value
    },
    formatPro (row, item) {
      let value = 0
      let denominator = row[item.aftkey] || 0;
      let molecule = row[item.befkey] || 0;
      if (denominator) {
        value = Math.floor(molecule / denominator * 100) / 100
      }
      return value
    },
    proColor(row, item) {
      let value = this.formatPro(row, item);
      return 'linear-gradient(to right, #60cb6c, #01b674)'
    },
    //进度为分拣进度/装机进度
    formatNumDb(row, item) {
      let value = '-/-';
      let denominator = row[item.aftkey]? row[item.aftkey]: '-';
      let molecule = (row[item.befkey] === 0 || row[item.befkey]) ? row[item.befkey]:'-';
      value = molecule  + '/' + denominator
      return value
    },
    formatProDb (row, item) {
      let value = 0;
      let denominator = row[item.aftkey] || 0;
      let molecule = row[item.aftkey] || 0;
      if (denominator) {
          value = Math.floor(molecule / denominator * 100) / 100
      }
      return value
    },
    proColorDb (row, item) {
      if(item.key == 'loadAircraftProcess') {
        // 装机进度进度条 若在装机结束时间已装机完成，则不预警，进度条颜色不改变；若在装机结束时间之前未装机完成，则进度条颜色改变，进行预警
        if(row.loadAircraftTimeEnd && this.formatterTimeOfHM(new Date()) >= this.formatterTimeOfHM(row.loadAircraftTimeEnd) && (row[item.befkey] > 0)) {
          return 'linear-gradient(to right, #f8b53f, #f58c24)'     
        } else {
          return 'linear-gradient(to right, #60cb6c, #01b674)'
        }
      } else if(item.key == 'truckProcess') {
        // 分拣进度
        if(row.loadTruckTimeEnd && (this.formatterTimeOfHM(new Date()) >= this.formatterTimeOfHM(row.loadTruckTimeEnd)) && (row[item.befkey] > 0)) {
          //橙色
          return 'linear-gradient(to right, #f8b53f, #f58c24)'     
        } else {
          // 绿色
          return 'linear-gradient(to right, #60cb6c, #01b674)'
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
    getFlightStatus() {
      // 更新航班状态下拉框
      _.forEach(this.queryParam, (item) => {
        if (item.key == 'progressStatus') {
          item.param = {inOutFlag: this.selectKey}
          queryAll(item.url, item.param).then(res => {
            if (res.data.code == 0) {
              this.$set(item, 'options', res.data.data)
            } else {
              this.$msg.error({
                info: '获取' + item.label + '失败 !'
              })
            }
          })
        }
      })
    },
    customBeforExport() {
      this.exportInfo = `是否确认导出 ${this.pageData.total} 条数据？`
      return true
    },
    handleExport () {
      download(this.exportUrl, this.queryData).then(response => {
        this.downFile(response, '航班查询' + dateFormat(new Date(), 'yyyyMMddhhmmss'));
        this.$msg.success({
          info: '导出成功 !'
        })
        this.handleExportClose()
      })
    },
    // 保存显示/隐藏列 save保存事件
    saveDefaultRow () {
      this.saveDefaultRowReq()
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
  },
  watch: {
    selectKey: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.getFlightStatus()
          this.tabItemClick()
          this.queryDataReq()
          this.getDefaultRow()
        }
      }
    },
    selectKeyDay: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.getFlightStatus()
          this.queryDataReq()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.flight-his {
  .query-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px 0!important;
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
      &.mb14 {
        margin-bottom: 14px;
      }
    }
    .toolbar {
      min-width: 160px!important;
      &.subtoolbar {
        min-width: 120px!important;
      }
    }
  }
  .row_height_2 {
    $rowHeight: 65px;
    max-height: $rowHeight !important;
    height: $rowHeight !important;
    line-height: $rowHeight !important;
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
  >div>.table {
    .table-header {
      .left-table {
        border-right: 1px solid $gray-border;
      }
      .right-table {
        border-left: 1px solid $gray-border;
        margin-left: -1px;
      }
    } 
    .table-header {
      .row_height_2 {
        $rowHeight: 66px;
        max-height: $rowHeight !important;
        height: $rowHeight !important;
        line-height: $rowHeight !important;
      }
    }
    .center-table {
      table {
        margin-left: -1px;
      }
    }
    .right-table {
      margin-left: -1px;
    }
    .table-body { 
      .right-table {
        tr {
          border-left: 1px solid $gray-border;
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
  .table .table-body .col-pro{
      height: 49px!important;
  }
}
.flight-his{
    height: calc(100%);
  display: flex;
  flex-direction: column
}
</style>
