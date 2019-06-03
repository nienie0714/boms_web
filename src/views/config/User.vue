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
      <tables :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openDelete="openDelete"></tables>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/UserDetail'
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
    Detail
  },
  mixins: [tableMixin, formMixin],
  data () {
    return {
      baseUrl: '/organization/department',
 
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
          key: 'terminalStation',
          label: '角色',
          type: 'datalist',
          width: 120,
          itemValue: 'airportIata',
          itemLabel: 'briefC',
          url: '/base/airport/queryAll'
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'dynamicFlightId',
        column: [
          // left
          [
            {type: 'mult', width: 50},
            {key: 'userName',  label: '用户名', width: 355},
            {key: 'empName', label: '姓名', width: 355},
            {key: 'deptName',  label: '部门', width: 355},
            {key: 'name',  label: '角色', width: 355},
            // {key: 'attr',  label: '操作类型', width: 150, enumKey: 'attr'},, format: [0, 10]  , title: true
          ],
          // center
          [
          ],
          // right
          [
            {label: '操作', type: 'slot', width: 220}
          ]
        ],
        data: []
      },
      detail: {
        visible: false,
        type: 'detail',
        data: null
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
