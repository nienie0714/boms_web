<template>
  <detail class="log-audit-detail" v-bind="$attrs" :visible="visible" v-on="$listeners" :title="title" :type="type" :form="form"></detail>
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
  props: ['data', 'type', 'visible', 'parentTreeId'],
  data () {
    return {
      title: '人员管理',
      form: {
        key: 'empId',
        loading: false,
        queryParam: {},
        detailColumn: [
          [
            {key: 'empName', label:'姓名', span: '6'},
            {key: 'genderName', label:'性别', span: '6'},
            {key: 'post', label:'职务名称', span: '6'},
            {key: 'phone', label:'联系方式', span: '6'},
          ],
          [
            {key: 'createtime', label:'创建时间', span: '6', formatter: true},
            {key: 'createby', label:'创建人', span: '6'},
            {key: 'updatetime', label:'修改时间', span: '6', formatter: true},
            {key: 'updateby', label:'修改人', span: '6'}
          ],
          [
            {key: 'empNo', label:'人员编号', span: '6'},
            {key: 'deptName', label:'单位/部门', span: '18'}
          ]
        ],
        column: [
          {key: 'empNo',  label: '人员编号', type: 'input', maxlength: 20},
          {key: 'empName',  label: '姓名', type: 'input', maxlength: 50},
          {key: 'gender',  label: '性别', type: 'tab', enumKey: 'gender', itemValue: 'code', itemLabel: 'name', defaultVal: 'M'},
          {key: 'deptId', label: '单位/部门', type: 'select', itemValue: 'deptId', itemLabel: 'deptName', url: '/organization/department/queryAll',clearable: false},
          {key: 'post',  label: '职务名称', type: 'input', maxlength: 30},
          {key: 'phone',  label: '联系方式', type: 'input', maxlength: 15},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
        ],
        rules: {
          empNo: [
            {type: 'regex', reg: /^[a-zA-Z0-9]{1,20}$/, info: '必须为数字、字母'},
            {type: 'unique', url: '/organization/employee', trigger: 'blur'},
            {type: 'require', trigger: 'blur'}
          ],
          empName: [
            {type: 'require', trigger: 'blur'}
          ],
          gender: [
            {type: 'require', trigger: 'blur'}
          ],
          deptId: [
            {type: 'require', trigger: 'blur'}
          ],
          post: [
            {type: 'require', trigger: 'blur'}
          ],
          phone: [
            {type: 'require', trigger: 'blur'},
            {type: 'regex', reg: /^((\d{3}-\d{8})|(\d{4}-\d{7,8})|((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8})?$/, info: '该号码格式或位数有误'}
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
        if (visible && this.type == 'insert') {
          this.form.column.forEach((item, index) => {
            if (item.key == 'deptId') {
              this.$set(item, 'defaultVal', this.parentTreeId)
            }
          })
        }  
      }
    },
    type: {
      handler (type) {
        this.form.column.forEach((item, index) => {
          if (item.key == 'createtime' || item.key == 'createby' || item.key == 'updatetime' || item.key == 'updateby') {
            if (type == 'detail') {
              item.isHidden = false
            } else if (type == 'update' || type == 'insert') {
              item.isHidden = true;
              
            }
          }
          if (item.key == 'gender') {
            if (type == 'update' || type == 'detail') {
              this.$delete(item, 'defaultVal')
            } else if(type == 'insert') {
              this.$set(item, 'defaultVal', 'M')
            }
          }
          this.$set(item, 'disabled', false)
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
