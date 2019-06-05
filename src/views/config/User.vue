<template>
  <div class="log-audit">
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
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <toolbar @openExport="openExport" @openDetail="openDetail"></toolbar>
        </div>
      </div>
      <tables :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove"></tables>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
    <confirm-tip :visible="remove.visible" :data="remove.data" @handleSubmit="handleRemove" @handleClose="handleRemoveClose"></confirm-tip>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/UserDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll } from '@/util/base'
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
      baseUrl: 'sys/sysUser',
      queryParam: [
        {
          key: 'userName',
          label: '用户名',
          type: 'input',
          width: 120,
          toUpper: true
        },
        {
          key: 'empName',
          label: '姓名',
          type: 'input',
          width: 120,
          toUpper: true
        },
        {
          key: 'roleId',
          label: '角色',
          type: 'datalist',
          width: 140,
          itemValue: 'roleId',
          itemLabel: 'name',
          url: '/sys/sysRole/queryAll'
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
            {key: 'userName',  label: '用户名', width: 355},
            {key: 'empName', label: '姓名', width: 355},
            {key: 'deptName',  label: '部门', width: 355},
            {key: 'roleDescs',  label: '角色', width: 355},
            // {key: 'attr',  label: '操作类型', width: 150, enumKey: 'attr'},, format: [0, 10]  , title: true
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
      },
    }
  },
  mounted () {
  },
  methods: {
    openDetail ({type, row}) {
      if (type == 'reset') {
        // debugger
      }
      this.detail.type = type
      this.$set(this.detail, 'data', row || null)
      this.detail.visible = true
    },
  }
}
</script>

<style lang="scss">
</style>
