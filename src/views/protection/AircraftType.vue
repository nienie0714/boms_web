<template>
  <div class="aircraft-type">
    <div class="query-top" >
        <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
        <div class="toolbar">
            <button type="info" @click="cleanQueryData">重置</button>
            <button type="primary" :name="loading?'loading':''" @click="queryDataReq">查询</button>
        </div>
    </div>  
    <div class="table-cont container cross">
      <tables :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="['unloadAcftIntervals', 'loadAcftIntervals', 'unloadTruckIntervals', 'loadTruckIntervals'].includes(item.key)">
            <!-- <el-popover placement="bottom" width="232" trigger="manual" v-model="popList[index][item.key]">
              <div class="td-popover">
                <el-main>
                  <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
                    <div class="pop-aircraft">机型</div>
                    <div class="pop-aircraft-value">{{row.aircraftIcao}}</div>
                    <input-tag v-model.number="editData[item.key]" :width="200" type="number" prepend="标准约束时间" :placeholder="'请输入'" :minNumber="0" :maxNumber="100000"></input-tag>
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
            </el-popover> -->
            <div class="label-img" @click="activeTd(index, item.key)">
              <div :class="['label-img-inside', popList[index][item.key] ? 'label-img-active' : '']">
                <span>{{row[item.key]}}</span>
                <img v-if="popList[index][item.key]" :src="require('@icon/toolbar/icon_row_edit.png')" @click="openPop(row, item.key, $event)">
              </div>
            </div>
          </template>
          <template v-if="item.key == 'scroll'">
            <div >{{row[item.key]}}</div>  
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
    <my-dialog :visible="popData.visible" :header="false" :footer="false" :position="'center'" :height="187" :width="232" class="td-popover" @handleClose="closeEditPop"
    :dialogClass="'counter-class'" :top="pop.top" :left="pop.left">
      <div class="td-popover counter-popover">
        <el-main>
          <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
            <div class="pop-aircraft">机型</div>
            <div class="pop-aircraft-value">{{editData.aircraftIcao}}</div>
            <input-tag v-model.number="editData[editData.key]" :width="200" type="number" prepend="标准约束时间" :placeholder="'请输入'" :minNumber="0" :maxNumber="100000"></input-tag>
          </el-form>
        </el-main>
        <el-footer>
          <div class="footer-all">
            <button type="info" @click="closeEditPop">取消</button>
            <button type="primary" @click="saveEditPop(editData.key)">确定</button>
          </div>
        </el-footer>
      </div>
    </my-dialog>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" @handleSubmit="handleExport" @handleClose="handleExportClose"></confirm-tip>
  </div>
</template>

<script>
import Tables from '@view/Table/Table'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import { queryAll, update } from '@/util/base'
import QueryRow from '@view/QueryRow/QueryRow'
import Inputs from '@view/Inputs/Inputs'
import InputTag from '@view/InputTag/InputTag'
import _ from 'lodash'

export default {
  components: {
    Tables,
    ConfirmTip,
    InputTag,
    QueryRow
  },
  mixins: [tableMixin],
  data () {
    return {
      // 请求路径
      queryType: 'nopage',
      queryUrl: '/base/aircraftTypeInterval/queryAircraftTypeInterval',
      queryParam:[
          {
            key: 'aircraftIcao',
            label: '机型',
            type: 'input',
            width: 214
          },
      ],
      filterValue: null,
      tableData: {
        height: 660,
        multSelection: [],
        loading: false,
        key: 'aircraftIcao',
        column: [
          // left
          [
            {key: 'aircraftIcao',  label: '机型', width: 452, colClass: 'bold', title: true}
          ],
          // center
          [
            {key: 'unloadAcftIntervals',  label: '卸机时间', width: 300, title: true, type: 'slot'},
            {key: 'loadAcftIntervals',  label: '装机时间', width: 300, title: true, type: 'slot'},
            {key: 'unloadTruckIntervals',  label: '卸车时间', width: 300, title: true, type: 'slot'},
            {key: 'loadTruckIntervals',  label: '装车时间', width: 300, title: true, type: 'slot'},
          ],
          // right
          [
            {label: '', key: 'scroll', width: 8, type: 'slot'}
          ]
        ],
        data: []
      },
      popList: [],
      editData: {},
      popData: {
        visible: false
      },
      pop: {
        left: 0,
        top: 0
      }
    }
  },
  mounted () {
    this.queryDataReq()
  },
  methods: {
    // customQueryBefore () {
    //   this.$set(this.queryData, 'aircraftIcao', this.filterValue)
    // },
    // 关闭所有弹框，并清空弹框
    closeAllPop() {
      this.$set(this, 'popList', [])
      for(let i = 0; i<this.tableData.data.length; i++) {
        this.popList.push({unloadAcftIntervals: false, loadAcftIntervals: false, unloadTruckIntervals: false, loadTruckIntervals: false})
      }
    },
    customAfterQuery () {
      this.closeAllPop()
    },
    changeFilter(value) {
      this.filterValue = value
      this.queryDataReq()
    },
    activeTd(index, key) {
      this.closeAllPop()
      this.popList[index][key] = true
      this.$set(this.popList[index], key, this.popList[index][key])
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
      this.popData.visible = true
      this.editData = {}
      this.editData = Object.assign({}, row)
      this.editData.key = key
    },
    closeEditPop() {
      this.popData.visible = false
      this.editData = {}
    },
    saveEditPop(key) {
      let data = {}
      for (let editItem of Object.keys(this.editData)) {
        if (editItem == key || editItem == 'aircraftIcao') {
          data[editItem] = this.editData[editItem]
        }
      }
      update('/base/aircraftTypeInterval', data).then(res => {
        if (res.data.code == 0) {
          this.popData.visible = false
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

.label-img {
  height: 47px;
  line-height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  .label-img-inside {
    margin: 0 4px;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    &.label-img-active {
      background-color: #EAF4FF;
      color: #3392FF;
    }
    img {
      cursor: pointer;
      margin-left: 12px;
    }
  }
}
 div.query-top > div.toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 62px;
 };
 div.query-top > div.toolbar > button {
    height: 100%;
    line-height: 100%;
 };
div.query-top >.toolbar > button:not(:last-child) {
    margin-right: 10px;
};
  .toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 0;
    .tool-button {
      display: inline-flex;
      padding: 0 20px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .aircraft-type {
    height: calc(100%);
    display: flex;
    flex-direction: column;
    .counter-class {
      margin: 0 !important;
    }
  }
</style>
