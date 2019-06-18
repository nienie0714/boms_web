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
      title: '部门管理',
      form: {
        key: 'deptId',
        loading: false,
        queryParam: {},
        column: [
          {key: 'deptId',  label: '部门编号', type: 'input', maxlength: 20},
          {key: 'phone',  label: '联系电话', type: 'input', maxlength: 15},
          {key: 'deptName',  label: '部门名称', type: 'input', maxlength: 20},
          {key: 'deptParentId', label: '上级部门', type: 'inputlist', itemId: 'deptId', itemLabel: 'deptName', url: '/organization/department/queryAll'},
          {key: 'remark', label: '备注', type: 'textarea', rows: 2, maxlength: 100},
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
          deptParentId: [
            {type: 'require', trigger: 'blur'}
          ]
        },
        data: null
      }
    }
  },
  mounted () {
  },
  methods: {
    changeData () {
      this.form.data = this.data
      this.visible = true
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
