<template> 
  <div class="flight lugByflight">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
      <div class="toolbar">
        <button type="info" @click="cleanQueryData">重置</button>
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <div class="flight-body">
        <tables :tableData="tableData" :loading="tableData.loading" class="flight-body-left" ref="tables">
          <template v-slot:slot-body="{index, row, item}">
            <template v-if="item.label=='操作'">
              <div class="table-opr detail" @click="changeComp(row)"></div>
            </template>
            <template v-else-if="item.key=='psgNameCh'">
              <div class="type" >{{row['nameEn']}}</div>
              <div class="value" >{{row['nameCh']}}</div>
            </template>
            <!-- 出港航班号 -->
            <template v-else-if="item.key == 'flightNoD'">
              <div @click="changeComp(row)">{{row[item.key]}}</div>
            </template>
            <template v-else-if="item.key == 'index'">
              <div>{{ index + (pageData.num - 1) * pageData.size + 1}}</div>
            </template>
            <!-- type == 'slot' -->
            <template v-else>
              <!-- 未接收/已接收、未分拣/已分拣、未装机/已装机-->
              <div v-if="['dealLugNum', 'loadLugNum', 'aircraftLugNum'].includes(item.key)" class="container cross col-pro">
                <div class="container">
                  <div>{{formatNum(row, item)}}</div>
                </div>
                <div>
                  <div class="pro-box">
                    <div class="pro-box-left" :style="'width:' + formatPro(row, item)[0]+ ';'"></div>
                    <div class="pro-box-right" v-if="formatPro(row, item)[1] && formatPro(row, item)[1] != '0%'" :style="'width:' + formatPro(row, item)[1] + ';'"></div>
                  </div>
                </div>

              </div>
            </template>
          </template>
        </tables>

        <!-- 右侧单个航班行李列表 -->
        <div class="flight-body-right" v-show="lugListShow" ref="flightRight">
          <div class="title">
            <el-input v-model="optionName" clearable placeholder="请输入行李号/航班号/始发站/旅客姓名 查找行李"  prefix-icon="el-icon-search" @keyup.enter.native="handleSearch" @clear="handleSearch(true)">
            </el-input>
          </div>
          <div class="list-cont-box">
            <ul class="list-cont" >
              <li class="list-item" v-for="(item,index) in  lugListData" :key="index" @click="toShowDetail('lug', item, index)" :class="activeIndex == index? 'active':''">
                <div class="list-item-left">
                  <h3></h3>
                  <h4 :title="showValue(item, lugListCol.nameCh)">{{showValue(item, lugListCol.nameCh)}}</h4>
                  <p :title="showValue(item, lugListCol.nameEn)">{{showValue(item, lugListCol.nameEn)}}</p>
                </div>
                <div class="list-item-right">
                  <el-row>
                    <el-col :span="12">进港：<span class="bold blue">{{showValue(item, lugListCol.lugNo)}}</span></el-col>
                    <el-col :span="12">出港：<span class="bold blue">{{showValue(item, lugListCol.newLugNo)}}</span></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11" :title="showValue(item, lugListCol.originIataCn) + ',' + showValue(item, lugListCol.flightNoA)">{{showValue(item, lugListCol.originIataCn)}},{{showValue(item, lugListCol.flightNoA)}}</el-col>
                    <el-col :span="2"><i></i></el-col>
                    <el-col :span="11" :title="showValue(item, lugListCol.flightNoD) + ',' + showValue(item, lugListCol.destIataCn)">{{showValue(item, lugListCol.flightNoD)}},{{showValue(item, lugListCol.destIataCn)}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">{{showValue(item, lugListCol.execDateA)}}</el-col>
                    <el-col :span="12">{{showValue(item, lugListCol.execDateD)}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">{{showValue(item, {key: 'eta'})}}/{{showValue(item, {key: 'sta'})}}/{{showValue(item, {key: 'ata'})}}</el-col>
                    <el-col :span="12">{{showValue(item, {key: 'etd'})}}/{{showValue(item, {key: 'std'})}}/{{showValue(item, {key: 'atd'})}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">卸机时间: {{showValue(item, lugListCol.timeA)}}</el-col>
                    <el-col :span="12">装机时间: {{showValue(item, lugListCol.timeD)}}</el-col>
                  </el-row>
                </div>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
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
                      <el-button type="info" plain @click="getDefaultRow('transferByf')">恢复默认值</el-button>
                    </div>
                    <div class="footer-right">
                      <el-button type="info" plain @click="closeDefaultRow()">关闭</el-button>
                      <el-button type="primary" @click="saveDefaultRow('transferByf')">保存</el-button>
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
import { queryAll, download } from '@/util/base'
import { dateFormat } from '@/util/util'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import TransferLugDetail from './detail/TransferLugDetail';
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Pagination,
    Toolbar,
    Tables,
    ConfirmTip,
    TransferLugDetail
  },
  mixins: [tableMixin, lugTableMixin],
  data () {
    return {
      transferPage: true,
      // 请求路径
      queryUrl: '/integrated/transferLuggage/queryTransferByFlight', // /',pageQuery
      exportUrl: '/integrated/transferLuggage/exportExcelTransferByFlight',
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
      tabsDataDay: [],
      tabsData: [],
      queryParam: [
        {
          key: 'flightNo',
          label: '出港航班号',
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
      ],
      // 获取默认隐藏/显示列路径
      queryDefaultRowUrl: '/sys/sysUserCustom/querySysUserCustom',
      // 保存默认隐藏/显示列路径
      saveDefaultRowUrl: '/sys/sysUserCustom/updateSysUserCustom',
      rowType: 'transferByf',
      tableData: {
        multSelection: [],
        loading: false,
        key: 'dynamicFlightId',
        column: [
          // left
          [
            {key: 'flightNoD',  label: '出港航班号', width: 140, title: true, type: 'slot',colClass: 'bold-underline'},
            {key: 'execDateD', label: '航班日期', width: 120, format: [0, 10], hidden: false},
            {key: 'routeDCn',  label: '航线', width: 160, title: true},
            {key: 'etd', label: '预计起飞时间', width: 130, format: [11, 5], class: 'col-child-right'},  
          ],
          // center
          [
            {key: 'COBT',  label: '预计撤轮档时间', width: 160, format: [0, 16], hidden: false},
            {key: 'transferAllNum',  label: '总数', width: 120, hidden: false},
            {key: 'applyNum',  label: '预约数', width: 120, hidden: false, headerTitle: '从中转免提预约系统预约中转的中转行李数；不包含已中断的行李数'},
            {key: 'dealLugNum', befkey: 'noDealNum', aftkey: 'dealNum', label: '未中转/已中转', width: 120, type: 'slot', hidden: false, headerTitle: '未中转：未接收到的中转行李数（即需要确认接收的中转行李数；记录的是从卸车上包处移交过来未接收的中转行李数；以及需要到转盘上挑找的中转行李数；）已中转：已接收的中转行李数，即已录入新条码的中转行李'},
            {key: 'loadLugNum', befkey: 'unLoadTruck', aftkey: 'loadTruck', label: '未分拣/已分拣', width: 120, type: 'slot', hidden: false, headerTitle: '未分拣：已接收，但未执行离港分拣操作的中转行李；已分拣：已执行离港分拣操作的中转行李数；'},
            {key: 'aircraftLugNum', befkey: 'unLoadAircraft', aftkey: 'loadAircraft', label: '未装机/已装机', width: 120, type: 'slot', hidden: false, headerTitle: '未装机：未执行装机的中转行李数；（已接收，但未执行离港分拣操作的中转行李；已进行离港分拣，但未执行卸车装机操作的中转行李；）已装机：已执行装机的中转行李数；'},
            {key: 'cancelExectNum',  label: '取消执行数', width: 100, title: true, headerTitle: '执行中断的；已接收但未执行离港分拣操作的；已执行离港分拣操作但未执行卸车装机操作的中转行李；在离港分拣环节和卸车装机环节执行拉下的中转行李；行李号去重；'},
          ],
          // right
          [
          ]
        ],
        data: []
      },
      currFlghtIdD: null,
      optionName: '',
      searchInfoUrl: '/integrated/transferLuggage/queryTransferDetailByFlight',
      lugListData: [],
      lugListShow: false,
      lugListCol: {
        nameCh: {key: 'nameCh', label: '中文姓名'},
        nameEn: {key: 'nameEn', label: '英文姓名'},
        lugNo: {key: 'lugNo', label: '进港行李号'},
        newLugNo: {key: 'newLugNo', label: '出港行李号'},
        originIataCn: {key: 'originIataCn', label: '始发站'},
        destIataCn: {key: 'destIataCn', label: '目的站'},
        flightNoA: {key: 'flightNoA', label: '进港航班号'},
        flightNoD: {key: 'flightNoD', label: '出港航班号'},
        execDateA: {key: 'execDateA', label: '进港航班日期', format: [0, 10]},
        execDateD: {key: 'execDateD', label: '出港航班日期', format: [0, 10]},
        // execTimeA: {key: 'execTimeA', label: '进港航班预计/计划/实际到达时间'},
        // execTimeD: {key: 'execTimeD', label: '出港航班预计/计划/实际起飞时间'},
        timeA: {key: 'timeA', label: '进港卸机时间', format: [11, 5]},
        timeD: {key: 'timeD', label: '出港装机时间', format: [11, 5]},
      },
      activeIndex: null,
    }
  },
  created() {
    this.getDefaultRow('transferByf')
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
    this.queryDataRefresh();
    this.onceTimer = setInterval(this.queryDataRefresh, 60 * 1000);

  },
  destroyed () {
    clearInterval(this.onceTimer)
  },
  methods: {
    changeComp (row) {
      if(!row) {
        this.lugListShow = false;
        return;
      }
      this.activeIndex = null;
      this.currFlghtIdD = row.dynamicFlightIdD;
      let idObj = {
				dynamicFlightIdD: row.dynamicFlightIdD,
        flightDate: row.execDateD.slice(0,10),
        optionName: this.optionName.trim()
      }
      let url = this.searchInfoUrl;
      this.lugListData= [];
      queryAll(url, idObj).then(res => {
        if (res.data.code == 0) {
          this.lugListShow = true;
          this.lugListData =  _.assign([], res.data.data);
        }else {
            this.$msg.error({
              info: '获取详情失败 !',
              tip: res.data.msg
            })
          }
      })
    },
    handleSearch(flag) {
      if(!flag && !this.optionName.trim()) {
        return
      }
      queryAll(this.searchInfoUrl, {
        dynamicFlightIdD: this.currFlghtIdD,
        flightDate: this.queryData.flightDate,
        optionName: this.optionName.trim()
      }).then(res => {
        if (res.data.code == 0) {
          this.lugListShow = true;
          this.lugListData =  _.assign([], res.data.data);
        }else {
            this.$msg.error({
              info: '获取详情失败 !',
              tip: res.data.msg
            })
          }
      })
    },
    toShowDetail(comp, row, i) {
      this.activeIndex = i;
      this.showComp.is = comp;
      // this.showComp.row = row;
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
        flightDate: this.queryData.flightDate,
      }
      let url = this.showComp[comp + 'Url'];

      queryAll(url, idObj).then(res => {
        if (res.data.code == 0) {
          let data
          data = res.data.data
          this.showComp.row = _.assign(row, data)
          this.showDetail = true;
        }else {
            this.$msg.error({
              info: '获取详情失败 !',
              tip: res.data.msg
            })
          }
      })
    },
    showValue (row, item) {
      let value = ''
      if (_.get(row, item.key)) {
        if (item.format) {
          if (item.format.constructor == Array) {
            value = this.formatSubstr(_.get(row, item.key), item.format)
          } else {
            // this.runMethod(row, item)
            let method = item.format
            value = method({row: row, item: item})
          }
        } else if (item.hasOwnProperty('enumKey')) {
          let obj = {
            key: item.enumKey,
            value: _.get(row, item.key)
          }
          value = this.$store.getters.getName(obj) || value
        } else {
          value = _.get(row, item.key) || value
        }
      } else if (_.get(row, item.key) === 0) {
        value = 0
      }
      return value
    },
    formatSubstr (value, indexArr) {
      return value.substr(indexArr[0], indexArr[1])
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
    customQueryBefore () {
    },
    
    formatTotalAdd ({row, item}) {
      return row[item.key]
    },
    formatNum (row, item) {
      let value = '-/-'
      let denominator = row[item.aftkey]? row[item.aftkey]: '-';
      let molecule = (row[item.befkey] === 0 || row[item.befkey]) ? row[item.befkey]:'-';
      value = molecule  + '/' + denominator
      return value
    },
    formatPro (row, item) {
      let obj = [0,0];
      let total = (row[item.befkey] || 0) + (row[item.aftkey] || 0);
      let befNum = row[item.befkey] || 0;
      let aftNum = row[item.aftkey] || 0;
      if(total == 0) {
        obj = [0,0];
      } else {
        obj[0] = Math.round(befNum / total * 100) + '%'
        obj[1] = Math.round(aftNum / total * 100) + '%'
      }
      return obj
    },
    customBeforExport() {
      this.exportInfo = `是否确认导出 ${this.pageData.total} 条数据？`
      return true
    },
    handleExport () {
      download(this.exportUrl, this.queryData).then(response => {
        this.downFile(response, '中转行李按航班查询' + dateFormat(new Date(), 'yyyyMMddhhmmss'))
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

<style lang="scss" >
.flight {
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
  div>.table {
    .table-header {
      .right-table {
        border-left: 1px solid $gray-border;
        margin-left: -1px;
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
  .table-cont  {
    height: calc(100% - 80px);
  }
  
}
.lugByflight {
  // height: calc(100% - 60px);
  .pro-box {
    position: absolute;
    left: 10%;
    top: calc(50% - 8px);
    width: 80%;
    height: 8px;
    background-color: rgba(167, 185, 200, 0.3);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    .pro-box-left {
      height: 100%;
      background: linear-gradient(to right, #f78491, #F75467);
    }
    .pro-box-right {
      height: 100%;
      background: linear-gradient(to right, #60cb6c, #01b674);
      border-left: 1px solid #fff;
      margin-left: -1px;
    }
  }
  .flight-body {
    display: flex;
    height: calc(100% - 48px);
    .flight-body-left {
      height: 100%!important;
      flex: 1;
      table td {
        height: 50px!important;
      }
    }
    .flight-body-right {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 0 0 520px;
      background-color: #fff;
      border-top: 1px solid $gray-border;
      border-left: 1px solid $gray-border;
      .title {
        flex: 0 0 33px;
        border-bottom: 1px solid $gray-border;
        input {
          height: 32px;
          line-height: 32px;
          border: none;
          &::-webkit-input-placeholder {
            text-align: left;
          } 
        }
        .el-input__icon {
          line-height: 32px;
        }

      }
      .list-cont-box {
        flex: 1;
        overflow-y: auto;
      }
      .list-cont {
        .list-item {
          display: flex;
          height: 158px;
          border-bottom: 1px solid $gray-border;
          cursor: pointer;
          &.active {
            background: rgba($color: $blue-shadow, $alpha: .2);
          }
          .list-item-left {
            flex: 0 0 88px;
            padding: 0 10px;
            text-align: center;
            border-right: 1px solid $gray-border;
            h3 {
              display: block;
              width: 42px;
              height: 42px;
              border-radius: 100%;
              box-shadow: 0px 5px 10px rgba($color: $white-shadow, $alpha: .3);
              margin: 30px auto 10px;
              background: url(~@icon/lug/icon_head.png) no-repeat;
            }
            h4 {
              width: 88px;
              font-size: 16px;
              font-weight: normal;
              line-height: 20px;
              color: #3F4450;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            p {
              width: 88px;
              font-size: 12px;
              color: #899DB2;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .list-item-right {
            flex: 1;
            padding: 20px;
            .el-row {
              margin-bottom: 2px;
              .el-col {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &:first-child {
                  text-align: left;
                }
                &:last-child {
                  text-align: right;
                }
                >i {
                  display: block;
                  height: 26px;
                  border-radius: 100%;
                  background: url(~@icon/lug/icon_flight.png) center center no-repeat;
                }
              }
              .bold {
                font-weight: bold;
              }
              .blue {
                color: #3392FF;
              }
              &:nth-child(1) {
                font-size: 16px;
                color: #3F4450;
              }
              &:nth-child(2) {
                font-size: 20px;
                font-family: 'DINPRO-BOLD';
                color: #3F4450;
              }
              &:nth-child(3), &:nth-child(4){
                font-size: 14px;
                color: #899DB2;
              }
            }
            
          }
        }
      }
    }
  }
}

// .flight{
//   height: calc(100% - 60px);
//   display: flex;
//   flex-direction: column
// }

</style>


