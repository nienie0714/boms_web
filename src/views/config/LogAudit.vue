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
          <pagination v-model="pageData.num" :size="pageData.size" :total="pageData.total"></pagination>
        </div>
      </div>
      <tables :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.label=='操作'">
            <button type="info" @click="openDetail('update', row)">详情</button>
          </template>
        </template>
      </tables>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleClose="handleClose" @handleSubmit="handleSubmit"></detail>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Tables from '@view/Table/Table'
import Detail from './detail/LogAuditDetail'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
    Pagination,
    Tables,
    Detail
  },
  mixins: [tableMixin, formMixin],
  data () {
    return {
      axiosChildArr: [],
      // 请求路径
      queryUrl: '/integrated/dynamicFlight/queryAllStat', // /',pageQuery
      queryParam: [
        {
          key: 'flightNo',
          label: '用户名',
          type: 'input',
          width: 120,
          toUpper: true
        },
        {
          key: 'terminalStation',
          label: '员工',
          type: 'datalist',
          width: 120,
          itemValue: 'airportIata',
          itemLabel: 'briefC',
          url: '/base/airport/queryAll',
          toUpper: true
        },
        {
          key: 'stand',
          label: '操作时间',
          type: 'datalist',
          width: 140,
          itemValue: 'standNo',
          itemLabel: 'standNo',
          url: '/base/aircraftStand/queryAll'
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'dynamicFlightId',
        type: 'single',
        column: [
          // left
          [
            // {type: 'mult', width: 50},
            {key: 'flightNoAlias',  label: '用户名', width: 120, class: 'bold'},
            {key: 'execDate', label: '姓名', width: 120, format: [0, 10]},
            {key: 'attr',  label: '操作类型', width: 150, enumKey: 'attr'},
            {key: 'aircraftType',  label: '操作模块', width: 250},
            {key: 'routeCn',  label: '内容', width: 600, title: true},
            {key: 'execDate',  label: '操作时间', width: 180, format: [0, 16]}
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
    }
  }
}
</script>

<style lang="scss">
</style>
