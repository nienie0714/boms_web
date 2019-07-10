<template>
  <div class="luggages">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
      <div class="toolbar">
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{tableData.data.length}}条</span>
        </div>
        <div class="right">
          <div class="toolbar">
            <toolbar :permissions="permissions" @openExport="openExport">
              <template v-slot:setlist>
                <!-- <div class="tool-button setlist">
                  <div class="icon"></div>
                  <div class="label">设置列</div>
                </div> -->
                <el-popover placement="bottom" width="310" trigger="click" v-model="defaultRow">
                  <div class="opr-popover">
                    <el-main>
                      <div class="opr-popover-all">
                        <el-header>行李信息</el-header>
                        <el-main>
                          <ul>
                            <div v-for="(field, index) in tableData.column[1]" :key="field.key">
                              <li v-if="field.label" :class="(oprPopoverIndex == index) ? 'opr-popover-li-click' : ''">
                                <div class="opr-popover-li-left">{{ substrValue(field.label, 9) }}</div>
                                <div class="opr-popover-li-right">
                                  <div :class="field.hidden?'button-close':'button-show'" @click="handleEye(field, index)"></div>
                                  <div class="button-up" @click="handleUp(field, index)"></div>
                                  <div class="button-top" @click="handleTop(field, index)"></div>
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
                  <!-- <div class="opr-header-button" slot="reference">编辑表头</div> -->
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
      <tables :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.label=='操作'">
            <!-- <button type="info" @click="changeComp('lug', row)">行李详情</button> -->
            <div class="table-opr detail" @click="changeComp('lug', row)"></div>
          </template>
          <template v-else-if="item.key == 'lugNo'">
            <div @click="changeComp('lug', row)">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key=='psgNameCh'">
            <div class="type">{{row['nameEn']}}</div>
            <div class="value">{{row['nameCh']}}</div>
          </template>
          <template v-else-if="item.key=='flightStatusCn'">
            <div v-if="row[item.key] == '起飞'" class="fly-class">{{row[item.key]}}</div>
            <div v-else-if="row[item.key] == null || row[item.key] == ''">-</div>
            <div v-else class="other-class">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key == 'abnormalStatusCn'">
            <div v-if="row[item.key] == null || row[item.key] == ''">-</div>
            <div v-else class="red-color">{{row[item.key]}}</div>
          </template>
          <!-- <template v-else-if="item.key=='markingCn'">
            <div v-if="row[item.key] == '是'" class="marking-flex"><img src="@lug/mark_marking.png"/></div>
            <div v-else>{{row[item.key]}}</div>
          </template> -->
          <div v-else-if="item.key == 'markingNum'" :class="['mark', (row[item.key] > 0)?'marking':'']"><span v-if="row[item.key] <= 0">否</span></div>
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
          <template v-else>
            <div v-if="row[item.key] == 'Y'" :class="['mark', (item.key=='isCancel')?'pull_down':((item.key=='isAddition')?'added':(item.key=='isLookfor'?'find':'vip'))]"></div>
          </template>
        </template>
      </tables>
    </div>
    <component :is="showComp.is" :row="showComp.row"></component>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" :info="exportInfo" @handleSubmit="handleExport" @handleClose="handleExportClose"></confirm-tip>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Toolbar from '@view/Toolbar/Toolbar'
import Tabs from '@view/Tabs/Tabs'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import lugTableMixin from '@mixin/lugTableMixin'
import { queryAll, download } from '@/util/base'
import Lug from '../detail/LugDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'

export default {
  components: {
    QueryRow,
    Toolbar,
    Tabs,
    Tables,
    Lug,
    ConfirmTip
  },
  mixins: [tableMixin, lugTableMixin],
  props: ['selectKeyDay', 'selectKey'],
  data () {
    return {
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/luggage/queryAll',
      exportUrl: '/integrated/luggage/exportExcel',
      // 菜单对应按钮权限
      permissions: {
        insert: false,
        export: true,
        setlist: true
      },
      exportInfo: '是否确认导出0条数据？',
      showComp: {
        is: null,
        lugUrl: '/integrated/luggage/detail',
        row: null
      },
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
          key: 'flightStatus',
          label: '航班状态',
          type: 'select',
          width: 214,
          width: 214,
          itemValue: 'statusCode',
          itemLabel: 'nameC',
          url: '/base/flightStatus/queryFlightStatus',
          param: {inOutFlag: 'D'}
        },
        {
          key: 'luggeType',
          label: '行李类型',// todo 行李类型
          type: 'select',
          width: 214,
          enumKey: 'lugType',
          itemValue: 'code',
          itemLabel: 'name',
          // url: '/base/aircraftStand/queryAll'
        },
        {
          key: 'marking',
          label: '是否标记',
          type: 'tab',
          width: 214,
          enumKey: 'yOrNOrAll',
          itemValue: 'code',
          itemLabel: 'name',
          value: null
        },
        // todo 保障状态
        {
          key: 'lugNo',
          label: '行李编号',
          type: 'input',
          width: 214
        },
        {
          key: 'chute',
          label: '行李滑槽号',// todo 行李滑槽号改为文本框
          type: 'input',
          width: 214,
        },
        {
          key: 'counterNo',
          label: '值机柜台号',// todo 值机柜台号
          type: 'input',
          width: 214,
          toUpper: true,
          class: 'mt14'
        },
        {
          key: 'checkinTime',
          key1: 'beginCheckin',
          key2: 'endCheckin',
          label: '值机时间',// todo 值机时间
          type: 'elDateRange',
          dateType: 'date',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          width: 390,
          class: 'mt14',
        },
        {
          key: 'belt',
          label: '行李转盘号',
          type: 'input',
          width: 214
        },
        {
          key: 'checkinTime2',
          key1: 'beginCheckin',
          key2: 'endCheckin',
          label: '卸机时间',// todo 卸机时间
          type: 'elDateRange',
          dateType: 'date',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          width: 390,
          class: 'mt14'
        },
      ],
      // 获取默认隐藏/显示列路径
      queryDefaultRowUrl: 'sysconfig/Luggage/list',
      // 保存默认隐藏/显示列路径
      saveDefaultRowUrl: 'sysconfig/Luggage/saveAll',
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'lugId',
        column: [
          // left
          [
            {key: 'lugNo',  label: '行李编号', width: 120, colClass: 'bold-underline', title: true, type: 'slot'},
            // todo 保障状态
            // todo 旅客姓名
            {key: 'psgNameCh',  label: '旅客姓名', width: 130, type: 'slot'},
            {key: 'flightNo',  label: '航班号', width: 120, title: true},
          ],
          // center
          [
            {key: 'seatNo',  label: '旅客座位号', width: 100, title: true},
            {key: 'execDate',  label: '航班日期', width: 100, format: [0, 10]},
            // todo 航线
            {key: 'routeCn',  label: '航线', width: 120, title: true},
            // todo 值机时间
            {key: 'checkDate',  label: '值机时间', width: 120, title: true, format: [0, 16]},
            // todo 航班状态
            {key: 'flightStatusCn',  label: '航班状态', width: 100, title: true, type:'slot'},
            // todo 航班异常状态
            {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true, type:'slot'},
            // todo 机位
            {key: 'stand',  label: '机位', width: 110, title: true},
            {key: 'luggeTypeCn', label: '行李类型', width: 90, enumKey: 'inOutFlag', type:'slot'},
            // todo 是否标记
            {key: 'markingNum',  label: '是否标记', width: 90, type: 'slot'},
            {key: 'counterNo',  label: '值机柜台号', width: 90},
            {key: 'chuteNo',  label: '行李滑槽号', width: 90, title: true},
            // todo 安检状态
            {key: 'secure',  label: '安检状态', width: 100, title: true},
            // todo 人工分拣时间
            {key: 'truckDate',  label: '人工分拣时间', width: 120, title: true, format: [0, 16]},
            // todo 装机时间
            {key: 'airDate',  label: '装机时间', width: 120, title: true, format: [0, 16]}
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
  mounted () {
    if (this.selectKey == 'A') {
      this.queryParam[5].isHidden = true
      this.queryParam[6].isHidden = true
      this.queryParam[7].isHidden = true
      this.queryParam[8].isHidden = false
      this.queryParam[9].isHidden = false

    } else {
      this.queryParam[5].isHidden = false
      this.queryParam[6].isHidden = false
      this.queryParam[7].isHidden = false
      this.queryParam[8].isHidden = true
      this.queryParam[9].isHidden = true
    }
    this.timer = clearInterval(this.timer)
    this.queryDataRefresh()
    this.getFlightStatus()
    this.timer = setInterval(this.queryDataRefresh, 600000000)
    this.$once('hook:beforeDestroy', () => {            
      this.timer = clearInterval(this.timer)
    })
  },
  created() {
    this.getDefaultRow()
  },
  methods: {
    getFlightStatus() {
       // 更新航班状态下拉框
      _.forEach(this.queryParam, (item) => {
        if (item.key == 'flightStatus') {
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
    tabItemClickDay (key) {
      this.selectKeyDay = key
    },
    tabItemClick (key) {
      if (key == 'A') {
        this.queryParam[5].isHidden = true
        this.queryParam[6].isHidden = true
        this.queryParam[7].isHidden = true
        this.queryParam[8].isHidden = false
        this.queryParam[9].isHidden = false

        this.$set(this.tableData.column, 1, [
          {key: 'seatNo',  label: '旅客座位号', width: 120, title: true},
          {key: 'execDate',  label: '航班日期', width: 120, format: [0, 10]},
          // todo 航线
          {key: 'routeCn',  label: '航线', width: 140, title: true},
          // todo 航班状态
          {key: 'flightStatusCn',  label: '航班状态', width: 110, title: true, type:'slot'},
          // todo 航班异常状态
          {key: 'abnormalStatusCn',  label: '航班异常状态', width: 110, title: true, type:'slot'},
          // todo 机位
          {key: 'stand',  label: '机位', width: 110, title: true},
          {key: 'luggeTypeCn', label: '行李类型', width: 100, enumKey: 'inOutFlag', type:'slot'},
          // todo 是否标记
          {key: 'markingNum',  label: '是否标记', width: 100, type: 'slot'},
          {key: 'belt',  label: '行李转盘号', width: 110, title: true},
          // todo 卸机时间
          {key: 'checkDate',  label: '卸机时间', width: 120, title: true, format: [0, 16]},
          // todo 上转盘时间
          {key: 'upLoadDate',  label: '上转盘时间', width: 120, title: true, format: [0, 16]}
        ])
      } else {
        this.queryParam[5].isHidden = false
        this.queryParam[6].isHidden = false
        this.queryParam[7].isHidden = false
        this.queryParam[8].isHidden = true
        this.queryParam[9].isHidden = true

        this.$set(this.tableData.column, 1, [
          {key: 'seatNo',  label: '旅客座位号', width: 100, title: true},
          {key: 'execDate',  label: '航班日期', width: 100, format: [0, 10]},
          // todo 航线
          {key: 'routeCn',  label: '航线', width: 120, title: true},
          // todo 值机时间
          {key: 'checkDate',  label: '值机时间', width: 120, title: true, format: [0, 16]},
          // todo 航班状态
          {key: 'flightStatusCn',  label: '航班状态', width: 100, title: true, type:'slot'},
          // todo 航班异常状态
          {key: 'abnormalStatusCn',  label: '航班异常状态', width: 100, title: true, type:'slot'},
          // todo 机位
          {key: 'stand',  label: '机位', width: 110, title: true},
          {key: 'luggeTypeCn', label: '行李类型', width: 90, enumKey: 'inOutFlag', type:'slot'},
          // todo 是否标记
          {key: 'markingNum',  label: '是否标记', width: 90, type: 'slot'},
          {key: 'counterNo',  label: '值机柜台号', width: 90},
          {key: 'chuteNo',  label: '行李滑槽号', width: 90, title: true},
          // todo 安检状态
          {key: 'secure',  label: '安检状态', width: 100, title: true},
          // todo 人工分拣时间
          {key: 'truckDate',  label: '人工分拣时间', width: 120, title: true, format: [0, 16]},
          // todo 装机时间
          {key: 'airDate',  label: '装机时间', width: 120, title: true, format: [0, 16]}
        ])
      }

      this.timer = clearInterval(this.timer)
      this.queryDataRefresh()
      this.getFlightStatus()
      this.timer = setInterval(this.queryDataRefresh, 600000000)
    },
    customQueryBefore () {
      this.$set(this.queryData, 'inOutFlag', this.selectKey)
      this.$set(this.queryData, 'execRange', this.selectKeyDay)
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
          } else {
            this.$msg.error({
              info: '获取详情失败 !',
              tip: res.data.msg
            })
          }
        }).catch(res => {
          this.$msg.error({
            info: '获取详情失败 !',
            tip: res
          })
        })
      }
    },
    customBeforExport() {
      this.exportInfo = `是否确认导出 ${this.tableData.data.length} 条数据？`
      return true
    },
    handleExport () {
      download(this.exportUrl, this.queryData).then(response => {
        this.downFile(response, '导出')
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
  },
  watch: {
    selectKey: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.tabItemClick(value)
          this.getDefaultRow()
        }
      }
    },
    selectKeyDay: {
      handler (value) {
        if (!_.isUndefined(value)) {
          this.timer = clearInterval(this.timer)
          this.queryDataRefresh()
          this.getFlightStatus()
          this.timer = setInterval(this.queryDataRefresh, 600000000)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.luggages {
  .query-top {
    .query-item {
      &.mt14 {
        margin-top: 14px;
      }
    }
  }
  .toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 87px;
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
</style>
<style>
</style>

