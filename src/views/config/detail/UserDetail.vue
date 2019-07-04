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
  props: ['data', 'type', 'visible'],
  data () {
    return {
      title: '用户管理',
      form: {
        key: 'userId',
        loading: false,
        queryParam: {},
        detailColumn: [
          [
            {key: 'empName', label:'姓名', span: '6'},
            {key: 'userName', label:'用户名', span: '6'},
            {key: 'deptName', label:'部门', span: '12'}
          ],
          [
            {key: 'createtime', label:'创建时间', span: '6', formatter: true},
            {key: 'createby', label:'创建人', span: '6'},
            {key: 'updatetime', label:'修改时间', span: '6', formatter: true},
            {key: 'updateby', label:'修改人', span: '6'}
          ],
          [
            {key: 'roleNames', label:'角色', span: '24'}
          ]
        ],
        column: [
          {key: 'userName',  label: '用户名', type: 'input', maxlength: 20},
          {key: 'roleIds', label: '角色', type: 'inputlistmore', itemValue: 'roleId', itemLabel: 'name', url: '/sys/sysRole/queryAll'},
          {key: 'empId', label: '姓名', saveKey: 'empId', type: 'select', itemValue: 'empId', itemLabel: 'empName', url: 'organization/employee/noBindUser', method: this.queryDept},
          // {key: 'empId', label: '姓名', saveKey: 'empId', type: 'inputlist', itemValue: 'empId', itemLabel: 'empName', url: '/organization/employee/queryAll', method: this.queryDept},
          {key: 'deptName',  label: '部门', type: 'input', disabled: true},
          {key: 'password',  label: '密码', type: 'input', defaultVal: 1, inputType: 'password', maxlength: 255},
          {key: 'createtime', label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
        ],
        rules: {
          empId: [
            {type: 'require', trigger: 'blur'}
          ],
          userName: [
            {type: 'require', trigger: 'blur'},
            {type: 'regex', reg: /^[a-zA-Z0-9-]{1,20}$/, info: '必须为数字、字母、-'},
            {type: 'unique', url: '/sys/sysUser', trigger: 'blur'}
          ],
          deptName: [
            {type: 'require', trigger: 'blur'}
          ],
          // password: [ // disabled
          //   {type: 'require', trigger: 'blur'},// 数字字母组合，区分大小写，不支持汉字
          //   {type: 'regex', reg: /^[0-9A-Za-z]*$/, info: '必须为数字、字母'}
          // ],
          roleIds: [
            {type: 'require', trigger: 'blur'}
          ]
        },
        data: null
      }
    }
  },
  mounted () {
    const pw = this.$store.getters.getConfigValue('defaultPw')
    _.forEach(this.form.column, (item) => {
      if (item.key == 'password') {
        item.defaultVal = pw
        this.$set(item, 'defaultVal', pw)
      }
    })
  },
  methods: {
    queryDept(value, callback) {
      if (value) {
        queryAll('/sys/sysUser/getDept', {"empId": value}).then(res => {
          let deptInfo = {
            key: 'deptName',
            value: null
          }
          if (res.data.code == 0) {
            if (!_.isNull(res.data.data)) {
              this.$set(deptInfo, 'value', res.data.data['deptName'])
              callback(deptInfo)
              return null
            } else {
              this.$msg.error({
                info: '获取部门信息失败 !',
                tip: '请重新选择人员 !'
              })
              callback(deptInfo)
              return null
            }
          } else {
            this.$msg.error({
              info: '获取部门信息失败 !',
              tip: '请重新选择人员 !'
            })
            callback(deptInfo)
            return null
          }
        })
      }
    },
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
        if (visible && this.type == 'update') {
          this.form.column.forEach((item, index) => {
            if (item.key == 'empId') {
              if (this.type == 'update') {
                this.$set(item, 'param', {empId: this.data.empId})
              } else if (this.type == 'insert') {
                this.$set(item, 'param', {})
              }
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
              item.isHidden = true
            }
          }
          if (item.key == 'password') {
            if (type == 'update' || type == 'detail') {
              this.$set(item, 'isHidden', true)
            } else if (type == 'insert') {
              this.$delete(item, 'isHidden')
              this.$set(item, 'disabled', true)
            }
          }
          if (item.key == 'userName') {
            if (type == 'update' || type == 'detail') {
              this.$set(item, 'disabled', true)
            } else if (type == 'insert') {
              this.$delete(item, 'disabled')
            }
          }
          if (item.key == 'empId') {
            if (type == 'update') {
              this.$set(item, 'param', {empId: this.data.empId})
            } else if (type == 'insert') {
              this.$set(item, 'param', {})
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
