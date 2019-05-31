<template>
  <div class="log-audit">
    <div class="left-tree">
      <tree :data="data" :selectNodeId="selectNodeId" @clickNode="clickNode"></tree>
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
      <tables :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openDelete="openDelete">
        <!-- <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.label=='操作'">
            <button type="info" @click="openDetail('detail', row)">详情</button>
            <button type="info" @click="openDetail('update', row)">编辑</button>
          </template>
        </template> -->
      </tables>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
  </div>
</template>

<script>
import Tree from '@view/Tree/Tree'
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/DepartmentDetail'
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
    Detail
  },
  mixins: [tableMixin, formMixin],
  data () {
    return {
      axiosChildArr: [],
      baseUrl: '/organization/department',
      queryParam: [
        {
          key: 'deptName',
          label: '部门名称',
          type: 'input',
          width: 120,
          toUpper: true
        },
        {
          key: 'phone',
          label: '联系电话',
          type: 'input',
          width: 120,
          toUpper: true
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
            // {type: 'mult', width: 50},
            {key: 'deptId',  label: '部门编号', width: 355},
            {key: 'deptName', label: '部门名称', width: 355},
            {key: 'pDeptName',  label: '上级部门', width: 355},
            {key: 'phone',  label: '联系电话', width: 355},
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
      detail: {
        visible: false,
        type: 'detail',
        data: null
      },
      data: [
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
      selectNodeId: []
    }
  },
  mounted () {
  },
  methods: {
    tabItemClick (key) {
      this.selectKey = key
      this.queryDataReq(1)
    },
    customQueryBefore () {
      this.$set(this.queryData, 'inOutFlag', this.selectKey)
    },
    changeComp (comp, row) {
      this.axiosChildArr.forEach(ever => {
        this.removePending(ever)
      })
      this.axiosChildArr = []
      this.showComp.is = comp
      let idObj = {
        dynamicFlightId: row[this.tableData.key]
      }
      this.showComp.row = {}
      let url = this.showComp[comp + 'Url']
      this.axiosChildArr.push({
        url: url,
        method: 'put',
        params: idObj
      })
      queryAll(url, idObj).then(res => {
        if (res.data.code == 0) {
          let data
          if (comp == 'lug') {
            data = {
              nodes: res.data.data
            }
          } else {
            data = res.data.data
          }
          this.showComp.row = _.assign(row, data)
        }
      })
    },
    formatNum (row, item) {
      let obj = _.get(row, item.key)
      let value = '-/-'
      if (obj) {
        let denominator = (obj['totalNum'] || 0) + (obj['totalAdditionNum'] || 0)
        let molecule = (obj['nodeNum'] || 0) + (obj['nodeAdditionNum'] || 0)
        value = (molecule || '-') + '/' + (denominator || '-')
      }
      return value
    },
    formatPro (row, item) {
      let obj = _.get(row, item.key)
      let value = 0
      if (obj) {
        let denominator = (obj['totalNum'] || 0) + (obj['totalAdditionNum'] || 0)
        let molecule = (obj['nodeNum'] || 0) + (obj['nodeAdditionNum'] || 0)
        if (denominator) {
          value = Math.floor(molecule / denominator * 100) / 100
        }
      }
      return value
    },
    proColor (row, item) {
      let value = this.formatPro(row, item)
      if (value == 1) {
        return 'linear-gradient(to right, #60cb6c, #01b674)'
      } else if (value >= 0.5) {
        return 'linear-gradient(to right, #46a6f9, #578cfe)'
      } else {
        return 'linear-gradient(to right, #f8b53f, #f58c24)'
      }
    },
    clickNode (node) {
      // console.log(node)
    }
  }
}
</script>

<style lang="scss">
</style>
