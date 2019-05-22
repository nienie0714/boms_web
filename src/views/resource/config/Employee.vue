<template>
  <div class="log-audit">
    <div class="query-top">
      <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
      <div class="toolbar">
        <button type="primary" :name="loading?'loading':''" @click="queryDataReq">查询</button>
      </div>
    </div>
    <div class="table-cont container cross">
      <tables :tableData="tableData" :loading="tableData.loading">
        <template v-slot:slot-body="{index, row, item}">
          <template v-if="item.label=='操作'">
            <button type="info" @click="openDetail('detail', row)">详情</button>
            <button type="info" @click="openDetail('update', row)">编辑</button>
          </template>
        </template>
      </tables>
    </div>
    <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleClose="handleClose"></detail>
  </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Tables from '@view/Table/Table'
import Detail from './detail/EmployeeDetail'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  components: {
    QueryRow,
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
          key: 'empName',
          label: '姓名',
          type: 'input',
          width: 120
        },
        {
          key: 'deptName',
          label: '部门',
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
            {key: 'deptName',  label: '单位/部门', width: 355},
            {key: 'empName', label: '姓名', width: 355},
            {key: 'post',  label: '职务名称', width: 355},
            {key: 'phone',  label: '联系方式', width: 355}
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
    openDetail (type, row) {
      this.detail.type = type
      this.detail.data = row
      this.detail.visible = true
    },
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
        method: 'post',
        data: idObj
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
