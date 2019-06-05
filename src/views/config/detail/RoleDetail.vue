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
      title: '角色管理',
      form: {
        key: 'roleId',
        loading: false,
        queryParam: {},
        column: [
          {key: 'roleId',  label: 'id', width: 2, isHidden: true},
          {key: 'name',  label: '角色名称', type: 'input'},
          {key: 'description', label: '角色描述', type: 'textarea'},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true},
          {key: 'resource', label: '权限配置', type: 'tree', itemId: 'id', itemLabel: 'text', itemChild: 'children', url: '/sys/sysRole/resourceTree', urlType: 'get'}// todo: tree
        ],
        rules: {
          name: [
            {type: 'require', trigger: 'blur'}
          ],
          resource: [
            {type: 'require', trigger: 'blur'}
          ],
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
