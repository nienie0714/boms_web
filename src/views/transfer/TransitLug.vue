<template>
  <div class="flight lugHis">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
      <div class="toolbar">
        <button type="info" @click="cleanQueryData">重置</button>
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <!-- <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <toolbar :permissions="permissions" @openExport="openExport">
            <template v-slot:setlist>
              <el-popover placement="bottom" width="310" trigger="click" v-model="defaultRow">
                <div class="opr-popover">
                  <el-main>
                      <el-main>
                        <ul>
                          <div v-for="(field, index) in tableData.column[1]" :key="field.key">
                            <li v-if="field.label" :class="(oprPopoverIndex == index) ? 'opr-popover-li-click' : ''">
                              <div class="opr-popover-li-left" :title="field.label">{{ substrValue(field.label, 6) }}</div>
                              <div class="opr-popover-li-right">
                                <div :class="field.hidden?'button-close':'button-show'" @click="handleEye(field, index)"></div>
                                <div class="button-up" @click="handleUp(field, index)"></div>
                                <div class="button-top" @click="handleTop(field, index)"></div>
                              </div>
                            </li>
                          </div>
                        </ul>
                      </el-main>
                  </el-main>
                  <el-footer>
                    <div class="footer-left">
                      <el-button type="info" plain @click="getDefaultRow('transfer')">恢复默认值</el-button>
                    </div>
                    <div class="footer-right">
                      <el-button type="info" plain @click="closeDefaultRow()">关闭</el-button>
                      <el-button type="primary" @click="saveDefaultRow('transfer')">保存</el-button>
                    </div>
                  </el-footer>
                </div>
                <div class="tool-button setlist" slot="reference">
                  <div class="icon"></div>
                  <div class="label">设置列</div>
                </div>
              </el-popover>
            </template>
          </toolbar>
        </div>
      </div> -->
      <tables :tableData="tableData" :loading="tableData.loading" ref="tables">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.label=='操作'">
            <div class="table-opr detail" @click="changeComp('lug', row)"></div>
          </template>
          <!-- 中转执行状态 -->
          <template v-else-if="item.key=='orderStatus'">
            <div >{{row['orderStatus'] == '1'?'待中转':(row['orderStatus'] == '2'?'中断': (row['orderStatus'] == '3'?'已中转' : ''))}}</div>
          </template>
          <!-- 订单编号显示为旅客姓名 -->
          <template v-else-if="item.key=='orderNo'">
            <div class="type" :title="row['nameEn']">{{row['nameEn']}}</div>
            <div class="value" :title="row['nameCh']">{{row['nameCh']}}</div>
          </template>
          <!-- 旅客姓名 -->
          <!-- <template v-else-if="item.key=='psgNameCh'">
            <div class="type" :title="row['nameEn']">{{row['nameEn']}}</div>
            <div class="value" :title="row['nameCh']">{{row['nameCh']}}</div>
          </template> -->
          <!-- 行李编号 -->
          <template v-else-if="item.key == 'lugNo'">
            <div >
              <span @click="changeComp('lug', row)" :title="(row[item.key]) + '→' + (row['newLugNo'])">{{row[item.key]}}→{{row['newLugNo']}}</span></div>
          </template>
          <!-- 航班号 -->
          <template v-else-if="item.key == 'flightNo'">
            <div :title="(row['flightNoA']) + '→' + (row['flightNoD'])">{{row['flightNoA']}}→{{row['flightNoD']}}</div>
          </template>
          <template v-else-if="item.key=='execDateA'">
            <div class="value" >{{showValue(row, {key: 'eta'})}} / {{showValue(row, {key: 'sta'})}} / {{showValue(row, {key: 'ata'})}}</div>
          </template>
          <template v-else-if="item.key=='execDateD'">
            <div class="value" >{{showValue(row, {key: 'etd'})}} / {{showValue(row, {key: 'std'})}} / {{showValue(row, {key: 'atd'})}}</div>
          </template>
          <template v-else-if="item.key == 'index'">
            <div>{{ index + (pageData.num - 1) * pageData.size + 1}}</div>
          </template>
          <!-- 进港航班状态 只要有值就显示蓝色-->
          <template v-else-if="item.key=='progressStatusACn'">
            <div v-if="row[item.key] == null || row[item.key] == ''"></div>
            <div v-else class="other-class">{{row[item.key]}}</div>
          </template>
          <!-- 出港航班状态 起飞 DEP是灰色，其他都是蓝色-->
          <template v-else-if="item.key=='progressStatusDCn'">
            <div v-if="row['progressStatusD'] == 'DEP'" class="fly-class">{{row[item.key]}}</div>
            <div v-else-if="row[item.key] == null || row[item.key] == ''"></div>
            <div v-else class="other-class">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key=='abnormalStatusACn' || item.key=='abnormalStatusDCn'">
            <div v-if="row[item.key] == null || row[item.key] == ''"></div>
            <div v-else class="red-color">{{row[item.key]}}</div>
          </template>
          <!-- type == 'slot' -->
          <template v-else>
            <!-- 未接收/已接收、未分拣/已分拣、未装机/已装机-->
            <div class="container cross col-pro" v-if="['truckProcess', 'loadAircraftProcess'].includes(item.key)">
              <div class="container">
                <div>{{formatNumDb(row, item)}}</div>
              </div>
              <div>
                <cs-progress :value="formatProDb(row, item)" :color="proColor(row, item)"></cs-progress>
              </div>
            </div>
            <div v-else class="container cross col-pro">
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
  <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <toolbar :permissions="permissions" @openExport="openExport">
            <template v-slot:setlist>
              <el-popover placement="bottom" width="310" trigger="click" v-model="defaultRow">
                <div class="opr-popover">
                  <el-main>
                      <el-main>
                        <ul>
                          <div v-for="(field, index) in tableData.column[1]" :key="field.key">
                            <li v-if="field.label" :class="(oprPopoverIndex == index) ? 'opr-popover-li-click' : ''">
                              <div class="opr-popover-li-left" :title="field.label">{{ substrValue(field.label, 6) }}</div>
                              <div class="opr-popover-li-right">
                                <div :class="field.hidden?'button-close':'button-show'" @click="handleEye(field, index)"></div>
                                <div class="button-up" @click="handleUp(field, index)"></div>
                                <div class="button-top" @click="handleTop(field, index)"></div>
                              </div>
                            </li>
                          </div>
                        </ul>
                      </el-main>
                  </el-main>
                  <el-footer>
                    <div class="footer-left">
                      <el-button type="info" plain @click="getDefaultRow('transfer')">恢复默认值</el-button>
                    </div>
                    <div class="footer-right">
                      <el-button type="info" plain @click="closeDefaultRow()">关闭</el-button>
                      <el-button type="primary" @click="saveDefaultRow('transfer')">保存</el-button>
                    </div>
                  </el-footer>
                </div>
                <div class="tool-button setlist" slot="reference">
                  <div class="icon"></div>
                  <div class="label">设置列</div>
                </div>
              </el-popover>
            </template>
          </toolbar>
        </div>
      </div>
    </div>
    <TransferLugDetail :isComp="showComp.is" :row="showComp.row" :showDetail="showDetail"></TransferLugDetail>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" :info="exportInfo" @handleSubmit="handleExport" @handleClose="handleExportClose" @customBeforExport="customBeforExport"></confirm-tip> 
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import lugTableMixin from '@mixin/lugTableMixin'
import utilMixin from '@mixin/utilMixin'
import { queryAll, download } from '@/util/base'
import { dateFormat } from '@/util/util'
import TransferLugDetail from './detail/TransferLugDetail';
import CsProgress from '@view/CsProgress/CsProgress'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Pagination,
    Toolbar,
    Tables,
    TransferLugDetail,
    CsProgress,
    ConfirmTip
  },
  mixins: [tableMixin, lugTableMixin, utilMixin],
  props: ['selectKeyDay', 'selectKey'],
  data () {
    return {
      // 请求路径
      queryUrl: '/integrated/transferLuggage/queryTransferLuggage', // /',pageQuery
      exportUrl: '/integrated/transferLuggage/exportExcel',
      // 菜单对应按钮权限
      permissions: {
        insert: false,
        export: true,
        setlist: true
      },
      pageData: {
        num: 1,
        size: 10,
        total: 0
      },
      exportInfo: '是否确认导出0条数据？',
      showComp: {
        is: null,
        lugUrl: '/integrated/transferLuggage/detail',
        row: null
      },
      showDetail: false,
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
      tabsData: [],
      queryParam: [
        {
          key: 'lugNo',
          label: '行李编号',
          type: 'input',
          width: 214,
          toUpper: true,
          class: 'mb14'
        },
        {
          key: 'flightNoD',
          label: '出港航班号',
          type: 'input',
          width: 214,
          toUpper: true,
          class: 'mb14'
        },
        {
          key: 'flightNoA',
          label: '进港航班号',
          type: 'input',
          width: 214,
          toUpper: true,
          class: 'mb14'
        },
        {
          key: 'flightDate',
          label: '航班日期',
          type: 'elDate',
          dateType: 'date',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          width: 214,
          defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
          clearable: false,
          class: 'mb14'
        },
        {
          key: 'orderStatus',
          label: '中转执行状态',
          type: 'select',
          width: 214,
          enumKey: 'orderStatus',
          itemValue: 'code',
          itemLabel: 'name',
          class: 'mb14'
        },
      ],
      // 获取默认隐藏/显示列路径
      queryDefaultRowUrl: '/sys/sysUserCustom/querySysUserCustom',
      // 保存默认隐藏/显示列路径
      saveDefaultRowUrl: '/sys/sysUserCustom/updateSysUserCustom',
      rowType: 'transfer',
      tableData: {
        multSelection: [],
        loading: false,
        key: 'lugId',
        column: [
          // left
          [
            {key: 'orderNo',  label: '旅客姓名', width: 180, title: true, rowspanMethod: this.rowspanMethod, class: 'col-child-right', type: 'slot'}, // , type: 'slot'
            {key: 'opTypeCn',  label: '订单状态', width: 100, title: true, rowspanMethod: this.rowspanMethod, class: 'col-child-right'}, // , type: 'slot'
            {key: 'orderStatus',  label: '中转执行状态', width: 100, title: true, rowspanMethod: this.rowspanMethod, class: 'col-child-right', type: 'slot'}, // , type: 'slot'
            {key: 'lugNo',  label: '进→出港行李编号', width: 240, colClass: 'bold-underline', type: 'slot'},
            // {key: 'psgNameCh',  label: '旅客姓名', width: 130, type: 'slot'},
            {key: 'flightNo',  label: '进→出港航班号', width: 150, type: 'slot',class: 'col-child-right'},
            
            // {key: 'routeCn',  label: '航线', width: 200, title: true},
            // {key: 'std', label: '预计起飞时间', width: 200, format: [11, 5]},
            // {key: 'etd', label: 'COBT', width: 120},
            // {key: 'atd', label: '预约数', width: 120},
            // {key: 'N-UPLOAD', label: '未接收/已接收', width: 160, type: 'slot'},
            // {key: 'N-UPLOAD', label: '未分拣/已分拣', width: 160, type: 'slot'},
            // {key: 'N-UPLOAD', label: '未装机/已装机', width: 160, type: 'slot'},
            // {key: 'stand',  label: '取消执行数',width: 200},
          ],
          // center
          [
            {key: 'seatNo',  label: '旅客座位号', width: 80, title: true, hidden: false},
            {key: 'originIataCn',  label: '始发站', width: 100, title: true, hidden: false},
            {key: 'execDateA', label: '进港航班预计/计划/实际到达时间', width: 220, hidden: false, type: 'slot'},
            {key: 'standA',  label: '进港机位', width: 100, title: true, hidden: false},
            {key: 'progressStatusACn',  label: '进港航班状态', width: 120,  hidden: false, type:'slot'},
            {key: 'abnormalStatusACn',  label: '进港航班异常状态', width: 120,  hidden: false, type:'slot'},
            {key: 'progressStatusDCn',  label: '出港航班状态', width: 120,  hidden: false, type:'slot'},
            {key: 'abnormalStatusDCn',  label: '出港航班异常状态', width: 120,  hidden: false, type:'slot'},
            {key: 'destIataCn',  label: '目的站', width: 100, title: true, hidden: false},
            {key: 'execDateD', label: '出港航班预计/计划/实际起飞时间', width: 220, hidden: false, type: 'slot'},
            {key: 'standD',  label: '出港机位', width: 80, title: true, hidden: false},
            {key: 'timeA', label: '进港卸机时间', width: 130, title: true, format: [0, 16], hidden: false},
            {key: 'timeD', label: '出港装机时间', width: 130, title: true, format: [0, 16], hidden: false},
          ],
          // right
          [
            {label: '操作',type: 'slot', width: 70},
          ]
        ],
        data: []
      }
    }
  },
  created() {
    this.getDefaultRow('transfer')
  },
  mounted () {
    this.queryParam.forEach(item => {
      if (item.key == 'flightDate') {
        let today = new Date()
        let dateStr = `${today.getFullYear()}-${this.addZero(today.getMonth() + 1)}-${this.addZero(today.getDate())}`
        item.value = dateStr;
        this.$set(this.queryData, item.key, item.value)
      }
    })
    this.tabItemClick()
    this.onceTimer = setInterval(this.queryDataRefresh, 60 * 1000)
  },
  destroyed () {
    clearInterval(this.onceTimer)
  },
  methods: {
    rowspanMethod (index) {
      if (index > 0 && this.tableData.data[index].orderNo === this.tableData.data[index - 1].orderNo) {
        return null
      } else {
        let rowspan = 1
        for (let i = 1; i + index < this.tableData.data.length; i++) {
          if (this.tableData.data[index + i].orderNo === this.tableData.data[index].orderNo) {
            rowspan = i + 1
          } else {
            break
          }
        }
        return rowspan
      }
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
    tabItemClickDay (key) {
      this.selectKeyDay = key
    },
    tabItemClick (key) {
      if (this.selectKey ==  'E') {
        this.$set(this.tableData.column, 1, [
          {key: 'seatNo',  label: '旅客座位号', width: 80, title: true, hidden: false},
          {key: 'originIataCn',  label: '始发站', width: 100, title: true, hidden: false},
          {key: 'execDateA', label: '进港航班预计/计划/实际到达时间', width: 220, format: [0, 10], hidden: false,type: 'slot'},
          {key: 'standA',  label: '进港机位', width: 100, title: true, hidden: false},
          {key: 'progressStatusACn',  label: '进港航班状态', width: 120, title: true, hidden: false, type:'slot'},
          {key: 'abnormalStatusACn',  label: '进港航班异常状态', width: 120, title: true, hidden: false,type:'slot'},
          {key: 'progressStatusDCn',  label: '出港航班状态', width: 120, title: true, hidden: false, type:'slot'},
          {key: 'abnormalStatusDCn',  label: '出港航班异常状态', width: 120, title: true, hidden: false,type:'slot'},
          {key: 'destIataCn',  label: '目的站', width: 100, title: true, hidden: false},
          {key: 'execDateD', label: '出港航班预计/计划/实际起飞时间', width: 220, format: [0, 10], hidden: false,type: 'slot'},
          {key: 'standD',  label: '出港机位', width: 80, title: true, hidden: false},
          {key: 'timeA', label: '进港卸机时间', width: 120, title: true, format: [0, 16], hidden: false},
          {key: 'timeD', label: '出港装机时间', width: 120, title: true, format: [0, 16], hidden: false},
        ])
      } 
      this.queryDataRefresh()
    },
    changeComp (comp, row) {
      this.showComp.is = comp
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
          this.showComp.row = _.assign(row, data);
          this.showDetail = true;
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
        let denominator = (obj['totalNum'] || 0) + (obj['nodeAdditionNum'] || 0)
        let molecule = (obj['nodeNum'] || 0) + (obj['nodeAdditionNum'] || 0)
        // denominator = denominator == 0 ? '0' : denominator
        // molecule = molecule == 0 ? '0' : molecule
        value = (molecule) + '/' + (denominator)
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
      let molecule = row[item.befkey] || 0;
      if (denominator) {
        if(row[item.befkey] === 0) {
          value = 1;
        } else {
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
    customBeforExport() {
      this.exportInfo = `是否确认导出 ${this.pageData.total} 条数据？`
      return true
    },
    handleExport () {
      download(this.exportUrl, {
        data: this.queryData,
        pageNum: 1,
        pageSize: 50
        }).then(response => {
        this.downFile(response, '中转行李按时间查询' + dateFormat(new Date(), 'yyyyMMddhhmmss'))
        this.$msg.success({
          info: '导出成功 !'
        })
        this.handleExportClose()
      })
    },
    // 保存显示/隐藏列 save保存事件
    saveDefaultRow (rowType) {
      this.saveDefaultRowReq(rowType)
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
    // 进出港、中转
    selectKey: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.tabItemClick(value)
          this.getDefaultRow('transfer')
        }
      }
    },
    // 今日昨日历史
    selectKeyDay: {
      handler (value) {
        if (!_.isUndefined(value)) {
          if(value == 0) {
            this.queryParam.forEach(item => {
              if (item.key == 'flightDate') {
                let today = new Date()
                let dateStr = `${today.getFullYear()}-${this.addZero(today.getMonth() + 1)}-${this.addZero(today.getDate())}`
                item.value = dateStr;
                this.$set(this.queryData, item.key, item.value)
              }
            })
          }
          this.queryDataRefresh()
        }
      }
    },
    'pageData.num': {
      handler (num) {
        this.$refs.tables.selectIndex = null;
        this.queryDataReq()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.flight {
  // height: calc(100% - 60px);
  .table-cont {
    height: calc(100% - 80px);
  }
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
      .el-date-editor--date.el-input__inner {
        width: 132px;
      }
      &.mt14 {
        margin-top: 14px;
      }
      &.mb14 {
        margin-bottom: 14px;
      }
    }
  }
  .toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 160px!important;
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
      .right-table {
        border-left: 1px solid $gray-border;
        margin-left: -1px;
      }
      /deep/.left-table {
        border-right: none!important;
      }
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
      >table:first-child > thead > tr:first-child > th:last-child {
        border-left: none;
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
    }
    .table-body {
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
    /deep/.left-table {
       tr {
        td:nth-last-child(4),td:nth-last-child(5),td:nth-last-child(3){
          background-color: #fff;
        } 
      }
    }
    td {
      .type {
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        text-align: center;
        color: $gray-nd;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .value {
        margin-top: 8px;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        color: $gray-st;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

// /deep/.lugHis{
//   flex: 1;
//   display: flex;
//   flex-direction: column;
// }
</style>
