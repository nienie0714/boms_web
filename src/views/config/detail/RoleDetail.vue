<template>
  <detail class="log-audit-detail" v-bind="$attrs" v-on="$listeners" :visible="visible" :title="title" :type="type" :form="form"></detail>
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
  props: ['data', 'type', 'visible'],
  data () {
    return {
      title: '角色管理',
      form: {
        key: 'roleId',
        loading: false,
        queryParam: {},
        detailColumn: [
          [
            {key: 'name', label:'角色名称', span: '6'},
          ],
          [
            {key: 'description', label:'角色描述', span: '18'}
          ],
          [
            {key: 'createtime', label:'创建时间', span: '6', formatter: true},
            {key: 'createby', label:'创建人', span: '6'},
            {key: 'updatetime', label:'修改时间', span: '6', formatter: true},
            {key: 'updateby', label:'修改人', span: '6'}
          ],
          [
            {key: 'hasRoleTree', label:'权限', span: '24', type: 'tree'}
          ]
        ],
        column: [
          {key: 'roleId',  label: 'id', width: 2, isHidden: true},
          {key: 'name',  label: '角色名称', type: 'input', maxlength: 10},
          {key: 'description', label: '角色描述', type: 'textarea', maxlength: 100, placeholder: '在此输入描述信息', rows: 2},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true},
          {key: 'hasRoleList', label: '权限配置', type: 'tree', saveKey: 'resourceIds', itemValue: 'id', itemLabel: 'text', itemChild: 'children', url: '/sys/sysRole/resourceTree', urlType: 'get'}// todo: tree
        ],
        rules: {
          name: [
            {type: 'require', trigger: 'blur'},
            {type: 'unique', url: '/sys/sysRole', trigger: 'blur'}
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
      this.$set(this.form,'data',this.data);
    }
  },
  watch: {
    data: {
      handler (data) {
        this.changeData()
      },
      immediate: true
    },
    visible: {
      handler (visible) {
        if (visible) {
          this.form.column = [
          {key: 'roleId',  label: 'id', width: 2, isHidden: true},
          {key: 'name',  label: '角色名称', type: 'input', maxlength: 10},
          {key: 'description', label: '角色描述', type: 'textarea', maxlength: 100, placeholder: '在此输入描述信息', rows: 2},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true},
          {key: 'hasRoleList', label: '权限配置', type: 'tree', saveKey: 'resourceIds', itemValue: 'id', itemLabel: 'text', itemChild: 'children', url: '/sys/sysRole/resourceTree', urlType: 'get'}
        ];
        }
      }
    },
    type: {
      handler (type) {
        this.form.column.forEach((item, index) => {
          this.$set(item, 'disabled', false)
          if (item.key == 'createtime' || item.key == 'createby' || item.key == 'updatetime' || item.key == 'updateby') {
            if (type == 'detail') {
              item.isHidden = false
            } else if (type == 'update' || type == 'insert') {
              item.isHidden = true;
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
