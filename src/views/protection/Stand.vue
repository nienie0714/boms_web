<template>
  <div class="log-audit">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" defaultKey="T1" @tabItemClick="tabItemClickDay"></tabs>
    </div>
    <div class="table-cont container cross">
      <div class="table-title">
        <div class="left">
          <span class="label">机位表</span>
        </div>
        <div class="right">
          <span class="label">提示：点击列表项的时间可进行更改</span>
        </div>
      </div>
      <div class="table container cross" :style="`height: 680px;background :rgba(255,255,255,1);overflow-y: auto;`">
        <div v-for="(item, index) in data" :key="index">
          <el-row class="table-other-header">
            <el-col :span="2"><div class="bold color-gray">机位</div></el-col>
            <el-col :span="1" v-for="(val, i) in data[index]" :key="i"><div class="bold">{{data[index][i].standNo}}</div></el-col>
          </el-row>
          <el-row class="table-other-table">
            <el-col :span="2"><div class="color-gray">标准时间约束</div></el-col>
            <el-col :span="1" v-for="(val2, i2) in data[index]" :key="i2">
              <div class="label-img" @click="activeTd(index, i2)">
                <div :class="['label-img-inside', data[index][i2].pop ? 'label-img-active' : '']">
                  <span>{{data[index][i2].intervals}}</span>
                  <img v-if="data[index][i2].pop" :src="require('@icon/toolbar/icon_row_edit.png')" @click="openPop(index, i2, $event)">
                </div>
              </div>
                <!-- <el-popover placement="bottom" width="232" trigger="manual" v-model="data[index][i2].pop">
                <div class="td-popover">
                  <el-main>
                    <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
                      <div class="edit-form-half">
                        <div class="pop-aircraft">分拣大厅</div>
                        <div class="pop-aircraft-value">{{selectKeyDay}}分拣大厅</div>
                      </div>
                      <div class="edit-form-half">
                        <div class="pop-aircraft">机位</div>
                        <div class="pop-aircraft-value">{{data[index][i2].standNo}}</div>
                      </div>
                      <input-tag v-model.number="editData.intervals" :width="200" type="number" prepend="标准约束时间" :placeholder="'请输入'" :minNumber="0" :maxNumber="100000"></input-tag>
                    </el-form>
                  </el-main>
                  <el-footer>
                    <div class="footer-all">
                      <button type="info" @click="closeEditPop(index, i2)">取消</button>
                      <button type="primary" @click="saveEditPop(index, i2)">确定</button>
                    </div>
                  </el-footer>
                </div>
                <div slot="reference" @click="openPop(index, i2)">{{data[index][i2].intervals}}</div>
              </el-popover> -->
            </el-col>
          </el-row>
        </div>
      </div>
      <my-dialog :visible="counterData.visible" :header="false" :footer="false" :position="'center'" :height="187" :width="232" class="td-popover" @handleClose="closeEditPop"
      :dialogClass="'counter-class'" :top="pop.top" :left="pop.left">
        <div class="td-popover counter-popover">
          <el-main>
            <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
              <div class="edit-form-half">
                <div class="pop-aircraft">分拣大厅</div>
                <div class="pop-aircraft-value">{{editData.terminalNo}}分拣大厅</div>
              </div>
              <div class="edit-form-half">
                <div class="pop-aircraft">机位</div>
                <div class="pop-aircraft-value">{{editData.standNo}}</div>
              </div>
              <input-tag v-model.number="editData.intervals" :width="200" type="number" prepend="标准约束时间" :placeholder="'请输入'" :minNumber="0" :maxNumber="100000"></input-tag>
            </el-form>
          </el-main>
          <el-footer>
            <div class="footer-all">
              <button type="info" @click="closeEditPop">取消</button>
              <button type="primary" @click="saveEditPop">确定</button>
            </div>
          </el-footer>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import Tabs from '@view/Tabs/Tabs'
import Report from '@view/Report/Report'
import { queryAll, update } from '@/util/base'
import Inputs from '@view/Inputs/Inputs'
import InputTag from '@view/InputTag/InputTag'
import _ from 'lodash'

export default {
  components: {
    Tabs,
    InputTag
  },
  data () {
    return {
      queryUrl: '/base/lugTransportInterval/queryLugTransportInterval',
      queryData: {},
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
      data: [],
      editData: {},
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
    this.queryDataReq()
  },
  methods: {
    tabItemClickDay (key) {
      this.selectKeyDay = key
      this.queryDataReq()
    },
    activeTd(index, key) {
      this.closeAllPop()
      this.data[index][key].pop = true
      this.$set(this.data[index], key, this.data[index][key])
    },
    queryDataReq () {
      this.$set(this.queryData, 'terminalNo', this.selectKeyDay)
      queryAll(this.queryUrl, this.queryData).then(response => {
        if (response.data.code == 0) {
          this.data = _.chunk(response.data.data, 20)
          this.closeAllPop()
        } else {
          this.$msg.error({
            info: '获取机位信息失败 !',
            tip: response.data.msg
          })
        }
      })
    },
    // 关闭所有弹框，并清空弹框
    closeAllPop() { 
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
          this.data[i][j].pop = false
        }
      }
    },
    openPop(row, col, $event) {      
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
      this.editData.terminalNo = this.selectKeyDay
      this.editData = Object.assign({}, this.data[row][col])
    },
    closeEditPop(row, col) {
      // this.data[row][col].pop = false
      // this.$set(this.data[row], col, this.data[row][col])
      this.counterData.visible = false
    },
    saveEditPop() {
      // 编辑保存
      update('/base/lugTransportInterval', this.editData).then(res => {
        if (res.data.code == 0) {
          this.counterData.visible = false
          // this.data[row][col].pop = false
          // this.$set(this.data[row], col, this.data[row][col])
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
.table {
  .el-col-1 {
    width: 4.55%;
  }
  .table-other-header {
    max-height: 32px;
    height: 32px;
    line-height: 32px;
    background-color: rgba(221, 230, 237, 0.2);
    border-top: 1px solid #dde6ed;
    border-bottom: 1px solid #dde6ed;
    font-weight: normal;
    font-size: 14px;
    color: #90A3B6;
  }
  .table-other-table {
    height: 48px;
    width: 100%;
    margin-bottom: 10px;
    line-height: 48px;
    overflow: hidden;
    border-bottom: 1px solid #dde6ed;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #3d424d;
    font-size: 14px;
  }
  .bold {
    font-size:14px;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(61,66,77,1);
  }
  .color-gray {
    color:rgba(137,157,178,1);
  }
}
</style>
