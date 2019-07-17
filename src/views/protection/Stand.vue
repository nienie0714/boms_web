<template>
  <div class="log-audit">
    <div class="tab-group">
      <tabs :tabsData="tabsDataDay" defaultKey="0" @tabItemClick="tabItemClickDay"></tabs>
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
      <!-- <Report :tableData="tableData" :loading="tableData.loading"></Report> -->
      <div class="table container cross" :style="`height: 660px;background :rgba(255,255,255,1);`">
        <div>
          <el-row class="table-other-header">
            <el-col :span="2"><div class="bold color-gray">机位</div></el-col>
            <el-col :span="1" v-for="(index) in 20" :key="index"><div class="bold">001</div></el-col>
          </el-row>
          <el-row class="table-other-table">
            <el-col :span="2"><div class="color-gray">标准时间约束</div></el-col>
            <el-col :span="1" v-for="(index) in 20" :key="index"><div>001</div></el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from '@view/Tabs/Tabs'
import Report from '@view/Report/Report'
// import tableMixin from '@mixin/tableMixin'
// import formMixin from '@mixin/formMixin'
import { queryAll } from '@/util/base'
import Inputs from '@view/Inputs/Inputs'
import _ from 'lodash'

export default {
  components: {
    Tabs,
    // Report
  },
  // mixins: [formMixin],
  data () {
    return {
      queryUrl: '/integrated/luggage/queryAll',
      queryData: {},
      tabsDataDay: [
        {
          key: 0,
          label: 'T1分拣大厅'
        },
        {
          key: 1,
          label: 'T2分拣大厅'
        },
        {
          key: 2,
          label: 'T3分拣大厅'
        }
      ]
    }
  },
  mounted () {
    this.selectKeyDay = this.tabsDataDay[1].key
    this.queryDataReq()
  },
  methods: {
    customQueryBefore () {
    },
    tabItemClickDay (key) {
      this.selectKeyDay = key
    },
    queryDataReq () {
      this.$set(this.queryData, 'terminalNo', this.selectKeyDay)
      queryAll(this.queryUrl, this.queryData).then(response => {
        if (response.data.code == 0) {

        } else {
          this.$msg.error({
            info: '获取机位信息失败 !',
            tip: res.data.msg
          })
        }
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
