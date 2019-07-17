<template>
  <div class="log-audit">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" defaultKey="0" @tabItemClick="tabItemClickDay"></tabs>
    </div>
    <div class="table-cont container cross">
      <div class="table-title">
        <div class="left">
          <span class="label">值机柜台表</span>
        </div>
        <div class="right">
          <span class="label">提示：点击列表项的时间可进行更改</span>
        </div>
      </div>
      <Report :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.type == 'slot'">
            <el-popover placement="bottom" width="232" trigger="manual" v-model="popList[index][item.key]"> <!-- popList[index][item.key]-->
              <div class="td-popover">
                <el-main>
                  <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
                    <div class="edit-form-half">
                      <div class="pop-aircraft">柜台号</div>
                      <div class="pop-aircraft-value">{{row.counterNo}}</div>
                    </div>
                    <div class="edit-form-half">
                      <div class="pop-aircraft">滑槽号</div>
                      <div class="pop-aircraft-value">{{item.key}}</div>
                    </div>
                    <input-tag v-model.number="editData[item.key]" :width="200" type="number" prepend="标准约束时间" :placeholder="'请输入'"></input-tag>
                  </el-form>
                </el-main>
                <el-footer>
                  <div class="footer-all">
                    <button type="info" @click="closeEditPop(index, item.key)">取消</button>
                    <button type="primary" @click="saveEditPop(index, item.key)">确定</button>
                  </div>
                </el-footer>
              </div>
              <div class="img-label" slot="reference" @click="openPop(index, row, item.key)">
                <span>{{row[item.key]}}</span>
              </div>
            </el-popover>
          </template>
        </template>
      </Report>
    </div>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" @handleSubmit="handleExport" @handleClose="handleExportClose"></confirm-tip>
  </div>
</template>

<script>
import Tabs from '@view/Tabs/Tabs'
import Report from '@view/Report/Report'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll, update } from '@/util/base'
import InputTag from '@view/InputTag/InputTag'
import _ from 'lodash'

export default {
  components: {
    Tabs,
    Report,
    ConfirmTip,
    InputTag
  },
  mixins: [tableMixin, formMixin],
  data () {
    return {
      // 请求路径
      queryType: 'nopage',
      queryTableHeaderUrl: '/base/lugConveyorInterval/queryChuteNoByTerminalNo',
      queryUrl: '/base/lugConveyorInterval/queryLugConveyorByTerminalNo',
      queryParam: [
        {
          key: 'counter',
          label: '柜台',
          type: 'input',
          width: 214
        }
      ],
      tabsDataDay: [
        {
          key: 'T1',
          label: 'T1分拣大厅'
        },
        {
          key: 'T2',
          label: 'T2分拣大厅'
        },
        {
          key: 'T3',
          label: 'T3分拣大厅'
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'logId',
        column: [
          // left
          [
            {key: 'counterNo',  label: '柜台/滑槽', width: 100, colClass: 'bold', title: true}
          ],
          // center
          [
            // {key: 'unloadAcftIntervals',  label: '001', width: 100}
          ],
          // right
          [
            {label: '', type: 'opr', width: 8}
          ]
        ],
        data: []
      },
      tableHeader: [],
      popList: [],
      editData: {},
      pop: false
    }
  },
  mounted () {
    this.selectKeyDay = this.tabsDataDay[0].key
    this.queryTableHeader()
    // this.queryDataReq()
  },
  methods: {
    customQueryBefore () {
      this.$set(this.queryData, 'terminalNo', this.selectKeyDay)
    },
    tabItemClickDay (key) {
      this.selectKeyDay = key
      this.queryTableHeader()
    },
    queryTableHeader() {
      this.$set(this.queryData, 'terminalNo', this.selectKeyDay)
      queryAll(this.queryTableHeaderUrl, this.queryData).then(response => {
        if (response.data.code == 0) {
          this.$set(this.tableData.column, 1, [])
          this.tableHeader = []
          this.tableHeader = response.data.data
          for (let i=0; i<this.tableHeader.length; i++) {
            this.tableData.column[1].push({key: this.tableHeader[i],  label: this.tableHeader[i], width: 100, type: 'slot'})
          }
          this.$set(this.tableData.column, 1, this.tableData.column[1])
        } else {
          this.$msg.error({
            info: '获取滑槽失败 !',
            tip: res.data.msg
          })
        }
      }).then(response => {
        this.queryDataReq()
      })
    },
    // 关闭所有弹框，并清空弹框
    closeAllPop() {
      this.$set(this, 'popList', [])
      for(let i = 0; i<this.tableData.data.length; i++) {
        let data = {}
        for(let i = 0; i<this.tableHeader.length; i++) {
          data[this.tableHeader[i]] = false
        }
        this.popList.push(data)
      }
    },
    customAfterQuery () {
      this.closeAllPop()
    },
    openPop(index, row, key) {
      this.closeAllPop()
      this.popList[index][key] = true
      this.editData = {}
      this.editData.counterNo = row.counterNo
      this.editData[key] = row[key]
    },
    closeEditPop(index, key) {
      this.popList[index][key] = false
    },
    saveEditPop(index, key) {
      // 解析列数据（滑槽：约束时间）
      let tmpData = {}
      let data = {}
      for (let editItem of Object.keys(this.editData)) {
        if (editItem == key) { //  || editItem == 'counterNo'
          tmpData[editItem] = this.editData[editItem]
        }
      }
      Object.keys(tmpData).forEach(function(key,i,v){
        data['chuteNo'] = key
        data['intervals'] = tmpData[key]
      })
      // 补充数据
      data['counterNo'] = this.editData['counterNo']
      data['terminalNo'] = this.selectKeyDay
      // 编辑保存
      update('/base/lugConveyorInterval', data).then(res => {
        if (res.data.code == 0) {
          this.popList[index][key] = false
          if (this.hasOwnProperty('queryDataReq')) {
            this.queryDataReq()
          }
        } else {
          this.$msg.error({
            info: '保存失败 !'
          })
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.aircraft-type {
  .query-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .inputs > input {
      border: 1px solid #dde6ed;
      border-radius: 6px;
      width: 240px!important;
      &::-webkit-input-placeholder {
        text-align: left;
      }
    }
  }
}
</style>
