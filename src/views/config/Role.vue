<template>
  <div class="config-audit">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
      <div class="toolbar">
        <button type="info" @click="cleanQueryData">重置</button>
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove" ref="tables">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.key == 'name'">
            <div @click="openDetail({type:'detail',row})">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key == 'index'">
            <div>{{ index + (pageData.num - 1) * pageData.size + 1}}</div>
          </template>
          <template>
              <div v-if="permissions.update && row.isFactoryParam === '0'" class="table-opr update" @click="openDetail({type: 'update', row})"></div>
              <div v-if="permissions.remove && row.isFactoryParam === '0'" class="table-opr remove" @click="openRemove(row)"></div>
              <div  class="table-opr detail" @click="openDetail({type:'detail', row})"></div>   
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
          <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail" style="font-weight:bolder"></toolbar>
        </div>
      </div>
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
import Detail from './detail/RoleDetail'
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
      baseUrl: 'sys/sysRole',
      queryParam: [
        {
          key: 'name',
          label: '角色名称',
          type: 'input',
          width: 214
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'roleId',
        column: [
          // left
          [
            {key: 'roleId',  label: 'id', width: 2, hidden: true},
            {key: 'index',  label: '序号', width: 110, type: 'slot'},
            {key: 'name',  label: '角色名称', width: 500,colClass: 'bold-underline',type: 'slot'},
            {key: 'description', label: '角色描述', width: 600},
            {key: 'isFactoryParam',  label: '出厂参数', width: 200, enumKey: 'isFactoryParam',itemValue: 'code',itemLabel: 'name',},
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
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.config-audit {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  /deep/.right-table td {
    width: 104px!important;
    justify-content: flex-end!important;
  }

}
</style>
