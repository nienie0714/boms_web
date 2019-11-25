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
      title: '部门管理',
      form: {
        key: 'deptId',
        loading: false,
        queryParam: {},
        detailColumn: [
          [
            {key: 'deptNo', label:'部门编号', span: '6'},
            {key: 'deptName', label:'部门名称', span: '6'},
            {key: 'pDeptName', label:'上级部门', span: '6'},
            {key: 'pDeptNo', label: '上级部门编号', span: '6'},
            
          ],
          [
            {key: 'phone', label:'联系方式', span: '6'},
          ],
          [
            {key: 'createtime', label:'创建时间', span: '6', formatter: true},
            {key: 'createby', label:'创建人', span: '6'},
            {key: 'updatetime', label:'修改时间', span: '6', formatter: true},
            {key: 'updateby', label:'修改人', span: '6'}
          ],
          [
            {key: 'remark', label:'备注', span: '24'}
          ]
        ],
        column: [
          {key: 'deptNo',  label: '部门编号', type: 'input', maxlength: 20},
          {key: 'phone',  label: '联系电话', type: 'input', maxlength: 15},
          {key: 'deptName',  label: '部门名称', type: 'input', maxlength: 20},
          {key: 'deptParentId', label: '上级部门', type: 'select', itemValue: 'deptId', itemLabel: 'deptName', method: this.queryDept, clearable: false},
          {key: 'pDeptNo', label: '上级部门编号', type: 'input', disabled: true,},
          {key: 'remark', label: '备注', type: 'textarea', rows: 2, maxlength: 100},
          {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
          {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
          {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
          {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
        ],
        rules: {
          deptNo: [
            {type: 'require', trigger: 'blur'},
            {type: 'regex', reg: /^[A-Za-z0-9/]{1,20}$/, info: '必须由数字、字母组成'},
            {type: 'unique', url: '/organization/department', trigger: 'blur'}
          ],
          phone: [
            {type: 'require', trigger: 'blur'},
            {type: 'regex', reg: /^((\d{3}-\d{8})|(\d{4}-\d{7,8})|((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8})?$/, info: '该号码格式或位数有误'}
          ],
          deptName: [
            {type: 'require', trigger: 'blur'},
          ],
          deptParentId: [
            {type: 'require', trigger: 'blur'}
          ],
          // pDeptName: [
          //   {type: 'require', trigger: 'blur'}
          // ]
        },
        data: null
      }
    }
  },
  mounted () {
  },
  methods: {
    queryParentDept() {
	    let options = [];
      // 上级部门下拉列表清除本条部门
      let param = {};
      let queryUrl = '';
      if(this.type != 'insert') {
        param = {
          deptId: this.data.deptId
        }
        queryUrl = '/organization/department/queryDeptAndParent';

      } else {
        param = {};
        queryUrl = '/organization/department/queryUserDeptAndChild';
      }
      queryAll(queryUrl, param).then(res => {
        let rowDeptId = this.data.deptId
        let pDeptId = this.data.deptParentId;

        let i = _.findIndex(res.data.data, function(o) {
          return o.deptId == rowDeptId
          })
        if (i != -1) {
          res.data.data.splice(i, 1)
        }
        this.$set(this.form.column[3], 'options', []);
        this.$set(this.form.column[3], 'options', res.data.data);
      })
    },
    changeData () {
      // this.$set(this.form,'data',this.data)
      this.form.data = this.data;
      
    },
    queryDept(value, callback) {
      if (value) {
        queryAll('/organization/department/queryUserDeptAndChild', {}).then(res => {
          let pdeptInfo = {
            key: 'pDeptNo',
            value: null
          }
          if (res.data.code == 0) {
            if (!_.isNull(res.data.data)) {
              res.data.data.forEach(item=>{
                if(item.deptId == value) {
                  this.$set(pdeptInfo, 'value', item['deptNo'])
                  callback(pdeptInfo)
                  return null
                }
              })
              
            } else {
              this.$msg.error({
                info: '获取部门信息失败 !',
              })
              callback(pdeptInfo)
              return null
            }
          } else {
            this.$msg.error({
              info: '获取部门信息失败 !',
            })
            callback(pdeptInfo)
            return null
          }
        })
      }
    }
  },
  watch: {
    data: {
      handler (data) {
        this.changeData(); 
      },
      immediate: true
    },
    visible: {
      handler (visible) {
        this.queryParentDept();
        if (visible && this.type == 'insert') {
          this.form.column.forEach((item, index) => {
            if (item.key == 'deptParentId') {
              this.$set(item, 'defaultVal', this.parentTreeId)

            }
            if (item.key == 'pDeptName') {
              this.$set(item, 'defaultVal', this.data.pDeptName);
            }

            if (item.key == 'pDeptNo') {
              this.$set(item, 'defaultVal', this.data.parentNo);
            }
            if(item.key == 'deptParentId' || item.key == 'pDeptNo') {
              this.$delete(item, 'isHidden')
            }
          })
        }
        if (visible && this.type == 'update') {
          this.form.column.forEach((item, index) => {
            this.$set(item, 'defaultVal', );
          })
          // 修改顶级部门 隐藏上级部门字段(判断无顶级部门)
          if (_.isNull(this.data.deptParentId)) {
            this.form.column.forEach((item, index) => {
              if (item.key == 'deptParentId') {
                this.$set(item, 'isHidden', true)
              }
              if(item.key == 'pDeptName' || item.key == 'pDeptNo') {
                this.$set(item, 'isHidden', true)
              }
            })
          } else {
            this.form.column.forEach((item, index) => {
              if (item.key == 'deptParentId' || item.key == 'pDeptNo') {
                this.$delete(item, 'isHidden')
              }
            })
          }
          
        }
        // 上级部门下拉列表清除本条部门
        this.changeData();

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
              item.isHidden = true
            }
          }
          
          if (item.key == 'deptParentId') {
            if (type == 'update' || type == 'detail') {
              this.$delete(item, 'disabled')
            } else if (type == 'insert') {
              // this.$set(item, 'disabled', true)
            }
          }
          
          if (item.key == 'pDeptNo') {
            this.$set(item, 'disabled', true)
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
