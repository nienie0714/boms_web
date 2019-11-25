<template>
  <div class="config-dept">
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
      <tables :tableData="tableData" :loading="tableData.loading" :permissions="permissions" @openDetail="openDetail" @openRemove="openRemove" ref="tables">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.key == 'deptNo'">
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
          <toolbar @openExport="openExport" @openDetail="openDetail({type:'insert',row: {pDeptName:parentName,deptParentId:parentTreeId,parentTreeId:parentTreeId,parentNo:parentNo}})" :permissions="permissions" style="font-weight:bolder"></toolbar>
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
import Detail from './detail/DepartmentDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll, insert, update, remove } from '@/util/base'
import { flattenDeep } from '@/util/util'
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
      pageData: {
        num: 1,
        size: 10,
        total: 0
      },
      tableData: {
        // height: 600,
        multSelection: [],
        loading: false,
        key: 'deptId',
        column: [
          // left
          [
            {key: 'index',  label: '序号', width: 80, type: 'slot'},
            {key: 'deptNo',  label: '部门编号', width: 100,colClass: 'bold-underline',type: 'slot'},
            {key: 'deptName', label: '部门名称', width: 355},
            {key: 'pDeptName',  label: '上级部门', width: 330},
            {key: 'phone',  label: '联系电话', width: 330}
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
      topId: '',
      topTree: null,
      deleteFlag: false,
      parentTreeId: null,
      parentName: '',
      parentNo: '',
    }
  },
  mounted () {
    this.getDeptTree(1);
  },
  methods: {
    getDeptTree (init) {
      queryAll(this.deptTreeUrl).then(res => {
        if (res.data.data.length) {
          this.data = res.data.data
          this.topId = res.data.data[0].id
          if (init && this.data.length > 0) {
            this.queryDepNo(res.data.data[0].id);
            this.parentName = res.data.data[0].text;
            this.parentTreeId =  res.data.data[0].id
            this.activeId.push(this.data[0].id);
            this.queryDataReq(2)
          }
        }
      })
    },
    clickNode (node) {
      this.queryDepNo(node.id);
      this.parentTreeId = node.id;
      this.parentName = node.text;
      this.queryDataReq(2)
    },
    queryDepNo(id) {
      queryAll('/organization/department/queryUserDeptAndChild', {}).then(res => {
        let pDeptId = id
        let n = _.findIndex(res.data.data, function(o) {
          return o.deptId == pDeptId
          })
        if (n != -1) {
          this.parentNo = res.data.data[n].deptNo
        }
      })
    },
    customQueryBefore () {
      if (this.queryData.hasOwnProperty('deptId')) {
        this.queryData.deptId = this.activeId[0]
      } else {
          this.$set(this.queryData, 'deptId', this.activeId[0])
      }
    },
    insert (data) {
      insert(this.insertUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$msg.success({
            info: '保存成功 !'
          })
          this.handleClose()
          if (this.hasOwnProperty('queryDataReq')) {
            this.getDeptTree()
            this.queryDataReq(2)
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
    },
    update (data) {
      update(this.updateUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$msg.success({
            info: '保存成功 !'
          })
          this.handleClose()
          if (this.hasOwnProperty('queryDataReq')) {
            this.getDeptTree()
            this.queryDataReq(2)
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
    },
    handleRemove (row) {
      let data = {
        ids: this.getRemove(row)
      }
      remove(this.removeUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$msg.success({
            info: '删除成功 !'
          })
          this.handleRemoveClose()
          if (this.hasOwnProperty('queryDataReq')) {
            this.getDeptTree()
            if(data.ids == this.activeId[0]){
              this.activeId[0] = this.topId
            }
            this.queryDataReq(2)
          }
        } else {
          this.$msg.error({
            info: '删除失败 !',
            tip: res.data.msg
          })
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !'
        })
      })
    }
  },
  watch: {
    'detail.visible':{
      handler(val) {
        if(val) {
          if(!this.detail.data[this.tableData.key]) {
            return
          }
          queryAll('/organization/department/queryUserDeptAndChild', {}).then(res => {
          let pDeptId = this.detail.data.deptParentId
          let n = _.findIndex(res.data.data, function(o) {
            return o.deptId == pDeptId
            })
          if (n != -1) {
            this.$set(this.detail.data,'pDeptNo','');
            this.$set(this.detail.data,'pDeptNo',res.data.data[n].deptNo);
          }
        })
        }
        
      },
      immediate: true,
    }
  }
}
</script>

<style lang="scss" scoped>
.config-dept {
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
