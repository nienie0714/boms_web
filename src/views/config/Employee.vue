<template>
  <div class="config-employee">
    <div class="left-tree">
      <tree :data="data" :nodeLabel="'text'" :activeId="activeId" @clickNode="clickNode" :expendAll="true"></tree>
    </div>
    <div class="query-top" style="margin-top: 60px;">
      <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
      <div class="toolbar">
        <button type="info" @click="cleanQueryData">重置</button>
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <!-- <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail({type:'insert',row: {deptId:parentTreeId}})"></toolbar>
        </div>
      </div> -->
      <tables :tableData="tableData" :loading="tableData.loading" :permissions="permissions" @openDetail="openDetail" @openRemove="openRemove" ref="tables">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.key == 'empName'">
            <div @click="openDetail({type:'detail',row})">{{row[item.key]}}</div>
          </template>

          <template v-else-if="item.key == 'index'">
            <div>{{ index + (pageData.num - 1) * pageData.size + 1}}</div>
          </template>
        </template>
      </tables>
      <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail({type:'insert',row: {deptId:parentTreeId}})" style="font-weight:bolder"></toolbar>
        </div>
      </div>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" :parentTreeId="parentTreeId" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
    <confirm-tip :visible="remove.visible" :data="remove.data" @handleSubmit="handleRemove" @handleClose="handleRemoveClose"></confirm-tip>
  </div>
</template>

<script>
import Tree from '@view/Tree/Tree'
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/EmployeeDetail'
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
      baseUrl: '/organization/employee',
      deptTreeUrl: '/organization/department/queryDeptTreeByUserId',
      queryParam: [
        {
          key: 'empName',
          label: '姓名',
          type: 'input',
          width: 214
        }
        // ,{
        //   key: 'deptId',
        //   label: '部门',
        //   type: 'inputlist',
        //   width: 214,
        //   itemValue: 'deptId',
        //   itemLabel: 'deptName',
        //   url: '/organization/department/queryAll'
        // }
      ],
      tableData: {
        // height: 600,
        multSelection: [],
        loading: false,
        key: 'empId',
        column: [
          // left
          [
            {key: 'index',  label: '序号', width: 80, type: 'slot'},
            {key: 'deptName',  label: '单位/部门', width: 300},
            {key: 'empName', label: '姓名', width: 300,colClass: 'bold-underline',type: 'slot'},
            {key: 'post',  label: '职务名称', width: 300},
            {key: 'phone',  label: '联系方式', width: 300}
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
      activeId: [],
      parentTreeId: null,
      parentName: '',
    }
  },
  mounted () {
    this.getDeptTree(1)
  },
  methods: {
    getDeptTree (init) {
      queryAll(this.deptTreeUrl).then(res => {
        if (res.data.data.length) {
          this.data = res.data.data
          if (init && this.data.length > 0) {
            this.queryDataReq(2)
            this.parentName = res.data.data[0].text;
            this.parentTreeId =  res.data.data[0].id
            this.activeId.push(this.data[0].id)
            this.clickNode(this.data[0])
          }
        }
      })
    },
    clickNode (node) {
      this.parentTreeId = node.id;
      this.parentName = node.text;
      this.queryDataReq(2)
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

<style lang="scss" scoped>
.config-employee {
  display: flex;
  flex-direction: column;
  >.table-cont {
    flex: 1;
    >.table  {
      flex: 1;
    }
  }
}
</style>
