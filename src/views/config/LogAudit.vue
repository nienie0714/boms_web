<template>
  <div class="log-audit">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
      <div class="toolbar">
        <button type="primary" :name="loading?'loading':''" @click="queryDataReqReset">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail"></toolbar>
        </div>
      </div>
      <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove"></tables>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
    <confirm-tip :visible="exportData.visible" :data="exportData.data" @handleSubmit="handleExport" @handleClose="handleExportClose"></confirm-tip>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/LogAuditDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll } from '@/util/base'
import Inputs from '@view/Inputs/Inputs'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Pagination,
    Toolbar,
    Tables,
    Detail,
    ConfirmTip
  },
  mixins: [tableMixin, formMixin],
  data () {
    return {
      // 请求路径
      baseUrl: '/base/sysLog',
      dataS: '',
      dataSS: '',
      queryParam: [
        {
          key: 'logUser',
          label: '用户名',
          type: 'input',
          width: 214
        },
        {
          key: 'empName',
          label: '姓名',
          type: 'input',
          width: 214,
          toUpper: true
        },
        {
          key: 'beginDate',
          key1: 'beginDate',
          key2: 'endDate',
          label: '登录时间',
          type: 'datepickers',
          width: 278
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
            {key: 'logUser',  label: '用户名', width: 200},
            {key: 'empName', label: '姓名', width: 200},
            {key: 'logSummary',  label: '操作类型', width: 300},
            {key: 'logDetail',  label: '操作内容', width: 500},
            {key: 'logTime',  label: '操作时间', width: 250},
          ],
          // center
          [
          ],
          // right
          [
            {label: '操作', type: 'opr', width: 220}
          ]
        ],
        data: []
      }
    }
  },
  mounted () {
  },
  methods: {
    // customQueryBefore () {
    //   this.$set(this.queryData, 'inOutFlag', this.selectKey)
    // },
  }
}
</script>

<style lang="scss">
</style>
