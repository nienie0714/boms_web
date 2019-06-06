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
          // {key: 'empName', label: '姓名', saveKey: 'empId', type: 'inputlist', itemId: 'empId', itemLabel: 'empName', url: 'organization/employee/noBindUser', urlType: 'get'},
          {key: 'empId', label: '姓名', saveKey: 'empId', type: 'inputlist', itemId: 'empId', itemLabel: 'empName', url: '/organization/employee/queryAll', method: this.queryDept},
          {key: 'userName',  label: '用户名', type: 'input', maxlength: 20},
          {key: 'deptName',  label: '部门', type: 'input', disabled: true},
          {key: 'password',  label: '密码', type: 'password', maxlength: 255},
          {key: 'roleDescs', label: '角色', type: 'inputlist', itemId: 'roleId', itemLabel: 'name', url: '/sys/sysRole/queryAll'},// roleIds
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
      let deptInfo = {
        key: 'deptName',
        value: value
      }
      callback(deptInfo)
      // todo: 根据empName获取deptName
      // queryAll('/airportResource/aircraftStand/detail', value).then(res => {
      //   let terminal = {
      //     key: 'terminal',
      //     value: null
      //   }
      //   if (res.data.code == 0) {
      //     if (!_.isNull(res.data.data)) {
      //       this.$set(terminal, 'value', res.data.data['terminalNo'])
      //       this.setResource(res.data.data['terminalNo'], param => {
      //         callback(terminal)
      //       })
      //       callback(terminal)
      //       return null
      //     } else {
      //       this.showErrorCustom('该机位未设置航站楼', '请先为该机位设置航站楼 !')
      //       callback(terminal)
      //       return null
      //     }
      //   } else {
      //     this.showError('通过机位获取航站楼信息', '请重新选择机位')
      //     callback(terminal)
      //     return null
      //   }
      // })
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
              item.isHidden = true
            } else if (type == 'insert') {
              item.isHidden = false
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
