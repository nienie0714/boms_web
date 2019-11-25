<template>
  <div class="config-audit">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
      <div class="toolbar ">
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
      <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove" ref="tables"></tables>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/LogAuditDetail'
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
    Detail
  },
  mixins: [tableMixin, formMixin],
  data () {
    return {
      // 请求路径
      queryUrl: 'online/userOnline/pageQuery',
      dataS: '',
      dataSS: '',
      queryParam: [
        {
          key: 'userName',
          label: '用户名',
          type: 'input',
          width: 214
        },
        {
          key: 'empName',
          label: '姓名',
          type: 'input',
          width: 214
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'userId',
        column: [
          // left
          [
            {key: 'userName',  label: '用户名', width: 415},
            {key: 'empName', label: '姓名', width: 415},
            {key: 'mac',  label: 'MAC地址', width: 415},
            {key: 'machine',  label: '登录设备类型', width: 415}
          ],
          // center
          [
          ],
          // right
          [
          ]
        ],
        data: []
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>
