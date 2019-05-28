<template>
  <detail class="log-audit-detail" v-bind="$attrs" v-on="$listeners" :title="title" :type="type" :form="form"></detail>
</template>

<script>
import Detail from '@/views/home/Detail'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  components: {
    Detail
  },
  mixins: [utilMixin],
  props: ['data', 'type'],
  data () {
    return {
      title: '日志审计',
      form: {
        key: 'logId',
        queryParam: {},
        column: [
          // {key: 'atd',  label: '行李号', type: 'input', class: 'bold'},
          // {key: 'abnormalReason', label: '行李类型', type: 'inputlist', enumKey: 'inOutFlag', itemValue: 'airportIata', itemLabel: 'briefC', url: '/base/airport/queryAll', toUpper: true},
          // {key: 'aircraftType',  label: '拉减', type: 'input', enumKey: 'isYOrN'},
          // {key: 'airline',  label: '追加', type: 'input', enumKey: 'isYOrN', isHidden: true},
          // {key: 'ata', label: '行李类型', type: 'textarea', enumKey: 'inOutFlag'}
          {key: 'logId',  label: '日志Id', type: 'input', isHidden: true},
          {key: 'logUser',  label: '用户名', type: 'input'},
          {key: 'empName',  label: '姓名', type: 'input'},
          {key: 'logType',  label: '操作类型', type: 'input'},
          {key: 'logModule',  label: '操作模块', type: 'input'},
          {key: 'logDetail',  label: '操作内容', type: 'input'},
          {key: 'logTime',  label: '操作时间', type: 'input'},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
        ],
        rules: {
          logUser: [
            {type: 'require', trigger: 'blur'},
            {type: 'unique', url: '/integrated/dynamicFlight', trigger: 'blur'},
            {type: 'regex', reg: /[+]{0,1}(\d+)/, info: '必须为正整数'}
          ],
          empName: [
            {type: 'regexRvs', reg: /[+]{0,1}(\d+)/, info: '不能为正整数'}
          ]
        },
        data: null
      }
    }
  },
  mounted () {
    window.onresize = () => {
      this.$nextTick(() => {
        return (() => {
          this.changeWindowSize()
        })()
      })
    }
  },
  methods: {
    changeData () {
      this.$nextTick(() => {
        this.changeWindowSize()
      })
      this.form.data = this.data
      this.visible = true
    },
    changeWindowSize () {
      let dlgBody = document.getElementsByClassName('table-body')[1]
      if (dlgBody) {
        this.tableData.height = document.body.offsetHeight - document.getElementsByClassName('table-body')[1].getBoundingClientRect().top + 8
      }
    }
  },
  watch: {
    data: {
      handler (data) {
        if (data) { //  && data.hasOwnProperty(this.form.key)
          this.changeData()
        }
      },
      immediate: true
    },
    type: {
      handler (type) {
        this.form.column.forEach((item, index) => {
          if (item.key == 'createtime' || item.key == 'createby' || item.key == 'updatetime' || item.key == 'updateby') {
            if (type == 'detail') {
              item.isHidden = false
            } else if (type == 'update') {
              item.isHidden = true
            }
          }
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
$bodyHead: 32px;
.dialog {
  width: 30px;
  height: 50px;
}
</style>
