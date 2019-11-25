<template>
  <detail class="log-audit-detail" v-bind="$attrs" v-on="$listeners" :title="title" :type="type" :form="form"></detail>
</template>

<script>
import Detail from '@/views/home/common/Detail'
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
        detailColumn: [
          [
            {key: 'logUser', label:'用户名', span: '6'},
            {key: 'empName', label:'姓名', span: '6'},
            {key: 'logSummary', label:'操作类型', span: '6'},
            {key: 'logTime', label:'操作时间', span: '6', formatter: true},
          ],
          [
            {key: 'createtime', label:'创建时间', span: '6', formatter: true},
            {key: 'createby', label:'创建人', span: '6'},
            // {key: 'updatetime', label:'修改时间', span: '6', formatter: true},
            // {key: 'updateby', label:'修改人', span: '6'}
          ],
          [
            {key: 'logDetail', label:'操作内容', span: '24'}
          ]
        ],
        column: [
          {key: 'logId',  label: '日志Id', type: 'input', isHidden: true},
          {key: 'logUser',  label: '用户名', type: 'input'},
          {key: 'empName',  label: '姓名', type: 'input'},
          {key: 'logType',  label: '操作类型', type: 'input'},
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
    }
  },
  watch: {
    data: {
      handler (data) {
        this.changeData()
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
