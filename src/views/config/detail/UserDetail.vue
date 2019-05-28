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
      title: '用户管理',
      form: {
        key: 'ata',
        loading: false,
        queryParam: {},
        column: [
          {key: 'ffid', label: '姓名', type: 'inputlist', enumKey: 'inOutFlag', itemValue: 'airportIata', itemLabel: 'briefC', url: '/base/airport/queryAll', toUpper: true},
          {key: 'userName',  label: '用户名', type: 'input'},
          {key: 'deptName',  label: '部门', type: 'input', disabled: true},
          {key: 'password',  label: '密码', type: 'input'},
          {key: 'name', label: '角色', type: 'inputlist', enumKey: 'inOutFlag', itemValue: 'airportIata', itemLabel: 'briefC', url: '/base/airport/queryAll', toUpper: true},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
        ],
        rules: {
          empName: [
            {type: 'require', trigger: 'blur'}
          ],
          userName: [
            {type: 'require', trigger: 'blur'}
          ],
          deptName: [
            {type: 'require', trigger: 'blur'}
          ],
          password: [
            {type: 'require', trigger: 'blur'}// 数字字母组合，区分大小写，不支持汉字
          ],
          name: [
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
