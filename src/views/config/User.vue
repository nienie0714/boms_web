<template>
  <div class="log-audit">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
      <div class="toolbar">
        <button type="info" @click="cleanQueryData">重置</button>
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
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
      <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove">
        <template v-slot:slot-body="{index, row, item}">
          <div v-if="item.key == 'index'">{{ index + (pageData.num - 1) * pageData.size + 1}}</div>
          <div v-if="item.key == 'userName'" @click="openDetail({type: 'detail', row})">{{ row[item.key] }}</div>
        </template>
      </tables>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
    <confirm-tip :visible="remove.visible" :data="remove.data" @handleSubmit="handleRemove" @handleClose="handleRemoveClose"></confirm-tip>
    <confirm-tip :visible="reset.visible" :data="reset.data" @handleSubmit="handleReset" @handleClose="handleResetClose"></confirm-tip>
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
import { queryAll, update } from '@/util/base'
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
          width: 214
        },
        {
          key: 'empName',
          label: '姓名',
          type: 'input',
          width: 214
        },
        {
          key: 'roleId',
          label: '角色',
          type: 'select',
          width: 214,
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
            {key: 'index',  label: '序号', width: 80, type: 'slot'},
            {key: 'userName',  label: '用户名', width: 330, colClass: 'bold-underline', type: 'slot'},
            {key: 'empName', label: '姓名', width: 330},
            {key: 'deptName',  label: '部门', width: 330},
            {key: 'roleNames',  label: '角色', width: 600},
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
      reset: {
        visible: false,
        url: 'sys/sysUser/resetPassword',
        data: null
      }
    }
  },
  mounted () {
  },
  methods: {
    openDetail ({type, row}) {
      if (type == 'reset') {
        this.reset.data = row
        this.reset.visible = true
      } else {
        this.detail.type = type
        this.$set(this.detail, 'data', row || null)
        this.detail.visible = true
      }
    },
    handleReset(row) {
      let data = {
        userId: row.userId
      }
      update(this.reset.url, data).then(res => {
        if (res.data.code == 0) {
          this.$msg.success({
            info: '重置密码成功 !'
          })
          this.reset.visible = false
          if (this.hasOwnProperty('queryDataReq')) {
            this.queryDataReq()
          }
        } else {
          this.$msg.error({
            info: '重置密码失败 !',
            tip: res.data.msg
          })
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !'
        })
      })
    },
    handleResetClose() {
      this.reset.visible = false
    }
  }
}
</script>

<style lang="scss">
</style>
