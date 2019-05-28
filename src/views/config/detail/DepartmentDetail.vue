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
        key: 'deptId',
        loading: false,
        queryParam: {},
        column: [
          {key: 'deptId',  label: '部门编号', type: 'input', maxlength: 20},
          {key: 'phone',  label: '联系电话', type: 'input', maxlength: 15},
          {key: 'deptName',  label: '部门名称', type: 'input', maxlength: 50},
          {key: 'parentDeptName', label: '上级部门名称', type: 'inputlist', enumKey: 'inOutFlag', itemValue: 'airportIata', itemLabel: 'briefC', url: '/base/airport/queryAll', toUpper: true},
          {key: 'remark', label: '备注', type: 'textarea', maxlength: 100},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
        ],
        rules: {
          deptId: [
            {type: 'require', trigger: 'blur'}
          ],
          phone: [
            {type: 'require', trigger: 'blur'}
          ],
          deptName: [
            {type: 'require', trigger: 'blur'}
          ],
          parentDeptName: [
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
            } else if (type == 'update' || type == 'insert') {
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
