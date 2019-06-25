<template>
  <div class="log-audit">
    <div class="left-tree">
      <tree :data="data" :nodeLabel="'text'" :activeId="activeId" @clickNode="clickNode"></tree>
    </div>
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
import Tree from '@view/Tree/Tree'
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/DepartmentDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  components: {
    Tree,
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
      baseUrl: '/organization/department',
      deptTreeUrl: '/organization/department/queryDeptTreeByUserId',
      queryParam: [
        {
          key: 'deptName',
          label: '部门名称',
          type: 'input',
          width: 214
        },
        {
          key: 'phone',
          label: '联系电话',
          type: 'input',
          width: 214
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'deptId',
        column: [
          // left
          [
            {key: 'deptNo',  label: '部门编号', width: 355},
            {key: 'deptName', label: '部门名称', width: 355},
            {key: 'pDeptName',  label: '上级部门', width: 355},
            {key: 'phone',  label: '联系电话', width: 355}
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
      data1: [
        {
          id: 1,
          label: '节点一'
        },
        {
          id: 2,
          label: '节点二'
        },
        {
          id: 3,
          label: '节点三',
          children: [
            {
              id: 301,
              label: '子节点一'
            },
            {
              id: 302,
              label: '子节点二',
              children: [
                {
                  id: 30201,
                  label: '子节点1',
                  children: [
                    {
                      id: 3020101,
                      label: '子节点1'
                    },
                    {
                      id: 3020102,
                      label: '子节点2'
                    }
                  ]
                },
                {
                  id: 30202,
                  label: '子节点2'
                }
              ]
            },
            {
              id: 303,
              label: '子节点三'
            }
          ]
        },
        {
          id: 4,
          label: '节点四'
        }
      ],
      data: [],
      activeId: []
    }
  },
  mounted () {
    this.getDeptTree()
  },
  methods: {
    getDeptTree () {
      queryAll(this.deptTreeUrl, {"empId": 714}).then(res => {
        if (res.data.data.length) {
          this.data = res.data.data
          if (this.data.length > 0) {
            this.activeId.push(this.data[0].id)
            this.clickNode(this.data[0])
          }
        }
      })
    },
    clickNode (node) {
      this.queryDataReq()
    },
    customQueryBefore () {
      if (this.queryData.hasOwnProperty('deptId')) {
        this.queryData.deptId = this.activeId[0]
      } else {
        this.$set(this.queryData, 'deptId', this.activeId[0])
      }
    }
  }
}
</script>

<style lang="scss">
</style>
