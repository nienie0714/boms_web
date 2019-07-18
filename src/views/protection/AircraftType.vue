<template>
  <div class="aircraft-type">
    <div class="table-cont container cross">
      <div class="table-title">
        <div class="left">
          <span class="label">机型表</span>
        </div>
        <div class="right">
          <span class="label">提示：点击列表项的时间可进行更改</span>
          <div class="query-box">
            <inputs type="text" v-model="filterValue" placeholder="输入机型快速筛选" @enter="changeFilter($event)"></inputs>
          </div>
        </div>
      </div>
      <tables :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="['unloadAcftIntervals', 'loadAcftIntervals', 'unloadTruckIntervals', 'loadTruckIntervals'].includes(item.key)">
          <!-- <template v-if="item.key == 'unloadAcftIntervals'"> -->
            <el-popover placement="bottom" width="232" trigger="manual" v-model="popList[index][item.key]">
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
            </el-popover>
          </template>
        </template>
      </tables>
    </div>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" @handleSubmit="handleExport" @handleClose="handleExportClose"></confirm-tip>
  </div>
</template>

<script>
import Tables from '@view/Table/Table'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import { queryAll, update } from '@/util/base'
import Inputs from '@view/Inputs/Inputs'
import InputTag from '@view/InputTag/InputTag'
import _ from 'lodash'

export default {
  components: {
    Tables,
    ConfirmTip,
    Inputs,
    InputTag
  },
  mixins: [tableMixin],
  data () {
    return {
      // 请求路径
      queryType: 'nopage',
      queryUrl: '/base/aircraftTypeInterval/queryAircraftTypeInterval',
      queryParam: [
        {
          key: 'stand',
          label: '机型',
          type: 'input',
          width: 214
        }
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
            {label: '', key: 'scroll', width: 8}
          ]
        ],
        data: []
      },
      popList: [],
      editData: {}
    }
  },
  mounted () {
    this.queryDataReq()
  },
  methods: {
    customQueryBefore () {
      this.$set(this.queryData, 'aircraftIcao', this.filterValue)
    },
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
    openPop(index, row, key) {
      this.closeAllPop()
      this.popList[index][key] = true
      this.editData = {}
      // this.editData.aircraftIcao = row.aircraftIcao
      // this.editData[key] = row[key]
      this.editData = Object.assign({}, row)
    },
    closeEditPop(index, key) {
      this.popList[index][key] = false
    },
    saveEditPop(index, key) {
      let data = {}
      for (let editItem of Object.keys(this.editData)) {
        if (editItem == key || editItem == 'aircraftIcao') {
          data[editItem] = this.editData[editItem]
        }
      }
      update('/base/aircraftTypeInterval', data).then(res => {
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
