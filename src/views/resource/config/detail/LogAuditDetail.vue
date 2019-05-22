<template>
  <detail class="log-audit-detail" v-bind="$attrs" v-on="$listeners" :title="title" :type="type" :form="form" @handleSubmit="handleSubmit"></detail>
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
        key: 'ata',
        loading: false,
        queryParam: {
          dynamicFlightId: null
        },
        column: [
          {key: 'atd',  label: '行李号', type: 'input', class: 'bold'},
          {key: 'abnormalReason', label: '行李类型', type: 'inputlist', enumKey: 'inOutFlag', itemValue: 'airportIata', itemLabel: 'briefC', url: '/base/airport/queryAll', toUpper: true},
          {key: 'abnormalStatus',  label: '目的站', type: 'input', title: true},
          {key: 'abnormalStatusCn',  label: '始发站', type: 'input', title: true},
          {key: 'agency',  label: '进展状态', type: 'input', color: '#3392ff'},
          {key: 'aircraftNo',  label: '容器', type: 'input', title: true},
          {key: 'aircraftType',  label: '拉减', type: 'input', enumKey: 'isYOrN'},
          {key: 'airline',  label: '追加', type: 'input', enumKey: 'isYOrN', isHidden: true},
          {key: 'alternateReason',  label: 'VIP', type: 'input', enumKey: 'isYOrN'},
          {key: 'alternateStation',  label: '标记次数', type: 'input'},
          {key: 'ata', label: '行李类型', type: 'textarea', enumKey: 'inOutFlag'}
        ],
        rules: {
          atd: [
            {type: 'require', trigger: 'blur'}
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
    },
    handleClose () {
      this.$emit('handleClose')
    },
    handleSubmit () {
      this.$emit('handleSubmit')
    }
  },
  watch: {
    data: {
      handler (data) {
        if (data && data.hasOwnProperty(this.form.key)) {
          this.changeData()
        }
      },
      immediate: true
    },
    type: {
      handler (type) {
        switch (type) {
          case 'detail': console.log('detail')
        }
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
