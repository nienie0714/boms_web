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
      <!-- <div class="table-title">
        <div class="left">
          <span class="label">查询结果</span>
          <span class="info">共{{pageData.total}}条</span>
        </div>
        <div class="right">
          <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
          <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail"></toolbar>
        </div>
      </div> -->
      <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove" ref="tables">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.key == 'logUser'">
            <div>{{row[item.key]}}</div>
          </template>
          <template v-if="item.key == 'logDetail'">
            <div @click="openDetail({type:'detail',row})">{{row[item.key]}}</div>
          </template>
          <template v-else-if="item.key == 'index'">
            <div>{{ index + (pageData.num - 1) * pageData.size + 1}}</div>
          </template>
          <template v-else-if="item.key=='logSummary'">
            <div class="img-label">
              <img :src="require('@icon/log/icon_query.png')" v-if="row[item.key].includes('查询')"/>
              <img :src="require('@icon/log/icon_detail.png')" v-else-if="row[item.key].includes('查看')"/>
              <img :src="require('@icon/log/icon_add.png')" v-else-if="row[item.key].includes('新增')"/>
              <img :src="require('@icon/log/icon_update.png')" v-else-if="row[item.key].includes('修改')"/>
              <img :src="require('@icon/log/icon_delete.png')" v-else-if="row[item.key].includes('删除')"/>
              <img :src="require('@icon/log/icon_export.png')" v-else-if="row[item.key].includes('导出')"/>
              <img :src="require('@icon/log/icon_import.png')" v-else-if="row[item.key].includes('导入')"/>
              <img :src="require('@icon/log/icon_reset.png')" v-else-if="row[item.key].includes('重置')"/>
              <img :src="require('@icon/log/icon_login.png')" v-else-if="row[item.key].includes('登录')"/>
              <img :src="require('@icon/log/icon_logout.png')" v-else-if="row[item.key].includes('登出')"/>
              <span>{{row[item.key]}}</span>
            </div>
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

    <confirm-tip :visible="exportData.visible" :data="exportData.data" :info="exportInfo" @handleSubmit="handleExport" @handleClose="handleExportClose" @customBeforExport="customBeforExport"></confirm-tip>

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
import { dateFormat } from '@/util/util'
import Inputs from '@view/Inputs/Inputs'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Pagination,
    Toolbar,
    Tables,
    Detail,
    ConfirmTip,
  },
  mixins: [tableMixin, formMixin],
  data () {
    return {
      // 请求路径
      exportInfo: '',
      exportName: '日志审计管理',
      baseUrl: '/base/sysLog',
      permissions: {
        insert: false,
        update: false,
        remove: false,
        detail: false,
        export: true,
      },
      dataS: '',
      dataSS: '',
      queryParam: [
        {
          key: 'logUser',
          label: '用户名',
          type: 'select',
          width: 214,
          itemValue: 'userName',
          itemLabel: 'userName',
          url: '/sys/sysUser/queryLoginUser  ',
          param: {},
          filterable: true,
        },
        {
          key: 'empName',
          label: '姓名',
          type: 'input',
          width: 214
        },
        {
          key: 'logDate',
          label: '操作日期',
          type: 'elDate',
          dateType: 'date',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
          clearable: false,
          width: 214,
        },
        {
          key: 'logTime',
          key1: 'startTime',
          key2: 'endTime',
          label: '操作时间',
          type: 'elTimeRange',
          dateType: 'timeRange',
          format: 'HH:mm',
          valueFormat: 'HH:mm',
          width: 300,
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
            {key: 'index',  label: '序号', width: 80, type: 'slot'},
            {key: 'logUser',  label: '用户名', width: 220,type: 'slot'},
            {key: 'empName', label: '姓名', width: 220},
            {key: 'logSummary',  label: '操作类型', width: 300, type: 'slot'},
            {key: 'logDetail',  label: '操作内容', width: 350,type: 'slot',colClass: 'bold-underline'},
            {key: 'logTime',  label: '操作时间', width: 400},
          ],
          // center
          [
          ],
          // right
          [
            {label: '操作', type: 'opr', width: 100}
          ]
        ],
        data: []
      }
    }
  },
  mounted () {
    this.queryParam.forEach(item => {
        if (item.key == 'logDate') {
        let today = new Date()
        let dateStr = `${today.getFullYear()}-${this.addZero(today.getMonth() + 1)}-${this.addZero(today.getDate())}`
        item.value = dateStr;
        item.defaultValue = dateStr;
        this.$set(this.queryData, item.key, item.value)
      }
      if (item.key == 'logTime') {
        let today = new Date();   //当前时间
        let today2 = new Date(new Date().getTime() - 1800 * 1000); // 前半小时
        let dateStr = `${this.addZero(today.getHours())}:${this.addZero(today.getMinutes())}`
        let dateStr2 = `${this.addZero(today2.getHours())}:${this.addZero(today2.getMinutes())}`
        item.value = [dateStr2, dateStr]
        // item.defaultValue = [dateStr2, dateStr];
        this.$set(this.queryData, item.key1, dateStr2)
        this.$set(this.queryData, item.key2, dateStr)
      }
    })
      
  },
  methods: {
    // customQueryBefore () {
    //   this.$set(this.queryData, 'inOutFlag', this.selectKey)
    // },

    customBeforExport() {
      this.exportInfo = `是否确认导出 ${this.pageData.total} 条数据？`
      return true
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.img-label {
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-right: 8px;
  }
}
.config-audit {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column
}
</style>
