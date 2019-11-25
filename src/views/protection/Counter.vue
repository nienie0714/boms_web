<template>
  <div class="log-audit">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" defaultKey="T1" @tabItemClick="tabItemClickDay"></tabs>
    </div>
    <div class="query-top" >
        <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
        <div class="toolbar">
            <button type="info" @click="cleanQueryData">重置</button>
            <button type="primary" :name="loading?'loading':''" @click="queryDataReq">查询</button>
        </div>
    </div> 
    <div class="table-cont container cross">
      <!-- <div class="table-title">
        <div class="left">
            <span class="label">查询结果</span>
            <span class="info">共{{tableData.data.length}}条</span>
        </div>
        <div class="right">
          <span class="label">提示：点击列表项的时间可进行更改</span>
        </div>
      </div> -->
      <tables :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.type == 'slot'">
            <div class="label-img" @click="activeTd(index, item.key)">
              <div :class="['label-img-inside', popList[index][item.key] ? 'label-img-active' : '']">
                <span>{{row[item.key]}}</span>
                <img v-if="popList[index][item.key]" :src="require('@icon/toolbar/icon_row_edit.png')" @click="openPop(row, item.key, $event)">
              </div>
            </div>
          </template>
        </template>
      </tables>
      <div class="table-title">
        <div class="left">
            <span class="label">查询结果</span>
            <span class="info">共{{tableData.data.length}}条</span>
        </div>
        <div class="right">
          <span class="label">提示：点击列表项的时间可进行更改</span>
        </div>
      </div>
    </div>
    <my-dialog :visible="counterData.visible" :header="false" :footer="false" :position="'center'" :height="187" :width="232" class="td-popover" @handleClose="closeEditPop"
    :dialogClass="'counter-class'" :top="pop.top" :left="pop.left">
      <div class="td-popover counter-popover">
        <el-main>
          <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
            <div class="edit-form-half">
              <div class="pop-aircraft">柜台号</div>
              <div class="pop-aircraft-value">{{editData.counterNo}}</div>
            </div>
            <div class="edit-form-half">
              <div class="pop-aircraft">滑槽号</div>
              <div class="pop-aircraft-value">{{editData.chuteNo}}</div>
            </div>
            <input-tag v-model.number="editData[editData.chuteNo]" :width="200" type="number" prepend="标准约束时间" :placeholder="'请输入'" :minNumber="0" :maxNumber="100000"></input-tag>
          </el-form>
        </el-main>
        <el-footer>
          <div class="footer-all">
            <button type="info" @click="closeEditPop()">取消</button>
            <button type="primary" @click="saveEditPop(editData.chuteNo)">确定</button>
          </div>
        </el-footer>
      </div>
    </my-dialog>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" @handleSubmit="handleExport" @handleClose="handleExportClose"></confirm-tip>
  </div>
</template>

<script>
import Tabs from '@view/Tabs/Tabs'
import Tables from '@view/Table/Table'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import QueryRow from '@view/QueryRow/QueryRow'
import { queryAll, update } from '@/util/base'
import InputTag from '@view/InputTag/InputTag'
import _ from 'lodash'

export default {
  components: {
    Tabs,
    Tables,
    ConfirmTip,
    InputTag,
    QueryRow
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
          key: 'counterNo',
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
        height: 660,
        multSelection: [],
        loading: false,
        key: 'counterNo',
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
            {label: '', key: 'scroll', width: 8}
          ]
        ],
        data: []
      },
      tableHeader: [],
      popList: [],
      editData: {},
      a: 0,
      counterData: {
        visible: false
      },
      pop: {
        left: 0,
        top: 0
      }
    }
  },
  mounted () {
    this.selectKeyDay = this.tabsDataDay[0].key
    this.queryTableHeader()
    // this.queryDataReq()
  },
  methods: {
    activeTd(index, key) {
      this.closeAllPop()
      this.popList[index][key] = true
      this.$set(this.popList[index], key, this.popList[index][key])
    },
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
    openPop(row, key, $event) {
      if ($event.clientY > 650) {
        // 向上展示
        this.pop.top = $event.clientY - 187 - 30
      } else {
        // 向下展示
        this.pop.top = $event.clientY + 30
      }
      if ($event.clientX > 1686) {
        // 偏左展示
        this.pop.left = $event.clientX - 232
      } else {
        // 居中展示
        this.pop.left = $event.clientX - 232 / 2
      }
      this.counterData.visible = true
      this.editData = {}
      this.editData = Object.assign({}, row)
      this.editData.chuteNo = key
    },
    closeEditPop(index, key) {
      this.counterData.visible = false
      this.editData = {}
    },
    saveEditPop(key) {
      let data = {}
      data = Object.assign({}, this.editData)
      data['terminalNo'] = this.selectKeyDay
      data['intervals'] = data[key]

      // 编辑保存
      update('/base/lugConveyorInterval', data).then(res => {
        if (res.data.code == 0) {
          this.closeEditPop()
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
    },
  }
}
</script>

<style lang="scss">
.counter-popover {
  padding-top: 10px;
}
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
.log-audit {
  height: calc(100%);
  display: flex;
  flex-direction: column
}
</style>

<style lang="scss">
.counter-class {
  margin: 0 !important;
}
</style>
