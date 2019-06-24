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
      title: '用户管理',
      form: {
        key: 'userId',
        loading: false,
        queryParam: {},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        column: [
          {key: 'empId', label: '姓名', saveKey: 'empId', type: 'inputlist', itemValue: 'empId', itemLabel: 'empName', url: 'organization/employee/noBindUser', urlType: 'get', method: this.queryDept},
          // {key: 'empId', label: '姓名', saveKey: 'empId', type: 'inputlist', itemValue: 'empId', itemLabel: 'empName', url: '/organization/employee/queryAll', method: this.queryDept},
          {key: 'userName',  label: '用户名', type: 'input', maxlength: 20},
          {key: 'deptName',  label: '部门', type: 'input', disabled: true},
          {key: 'password',  label: '密码', type: 'input', inputType: 'password', maxlength: 255},
          {key: 'roleIds', label: '角色', type: 'inputlistmore', itemValue: 'roleId', itemLabel: 'name', url: '/sys/sysRole/queryAll'},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
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
            {type: 'regex', reg: /^[a-zA-Z0-9-]*$/, info: '必须为数字、字母、-'}
          ],
          deptName: [
            {type: 'require', trigger: 'blur'}
          ],
          password: [
            {type: 'require', trigger: 'blur'},// 数字字母组合，区分大小写，不支持汉字
            {type: 'regex', reg: /^[0-9A-Za-z]*$/, info: '必须为数字、字母'}
          ],
          roleIds: [
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
          if (item.key == 'password') {
            if (type == 'update' || type == 'detail') {
              this.$set(item, 'isHidden', true)
            } else if (type == 'insert') {
              this.$delete(item, 'isHidden')
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
