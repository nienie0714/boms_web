<template>
  <my-dialog v-bind="$attrs" v-on="$listeners" :visible="visible" :title="title + typeName" :close="close" :header="header" :submit="submit"
  :position="'right'" class="form-dialog under-head-dialog" @handleClose="handleClose" @submitDialog="handleSubmit">
    <template>
      <div class="form" v-if="typeName=='详情'">
        <Row v-for="(item, index) in detailHis" :key="index" justify="start" class="his-info-normal">
          <i-col v-for="obj in item" :key="obj.key" :span="obj.span">
            <div class="his-info-title">{{obj.label}}</div>
            <div class="his-info-cont">
              <template v-if="obj.type == 'tree'">
                <el-tree :data="obj.value" :props="{children: 'children',label: 'text'}"></el-tree>
              </template>
              <template v-else>
                {{obj.value}}
              </template>
            </div>
          </i-col>
        </Row>
      </div>
      <div class="form" v-else>
       <div v-for="(item, index) in dataHis" :key="index" v-show="!item.isHidden" :class="['value', item.key in errors ? 'error' : '', item.type == 'textarea' || item.type == 'tree' ? 'whole-width' : '', item.isHidden ? '': 'form-item']">
          <div class="label" v-if="item.type == 'textarea' || item.type == 'tree'">{{ item.label }}</div>
          <textarea v-if="item.type == 'textarea'" v-model.trim="data[item.key]" :maxlength="item.maxlength" :minlength="item.minlength" :placeholder="item.placeholder" :disabled="item.disabled" :rows="item.rows" cols="80" @change="handleChange(item, $event)"></textarea>
          <div v-else-if="item.type == 'tree'" class="tree-wrapper">
            <my-tree :data="item.options" :selected="true" :disabled="item.disabled" :autoSelectNodeId="data[item.key]" :allSelectNodeId="data[item.saveKey]"
            :nodeKey="item.itemId" :nodeLabel="item.itemLabel" :nodeChild="item.itemChild"
            :expendAll="item.expendAll" :expendLevel="item.expendLevel"></my-tree>
          </div>
          <input-tag v-else v-model.trim="data[item.key]" :type="item.type" :prepend="item.label" :append="item.endLabel" :placeholder="item.disabled ? '' :'请输入'" :maxlength="item.maxlength" :minlength="item.minlength"
          :options="item.options" :id="item.itemValue" :label="item.itemLabel" :require="item.require" :defaultVal="item.defaultVal" :disabled="item.disabled"
          :multiple="item.multiple"
          @change="handleChange(item, $event)"></input-tag>
          <div v-if="item.key in errors" class="error">{{ errors[item.key] }}</div>
        </div>
      </div>
    </template>
  </my-dialog>
</template>

<script>
import Inputs from '@view/Inputs/Inputs'
import TabButton from '@view/TabButton/TabButton'
import InputList from '@view/InputList/InputList'
import InputListMore from '@view/InputListMore/InputListMore'
import Selects from '@view/Selects/Selects'
import MyTree from '@view/Tree/Tree'
import InputTag from '@view/InputTag/InputTag'
import utilMixin from '@mixin/utilMixin'
import { queryAll, queryAllGet } from '@/util/base'
import { getNewObjArr } from '@/util/util'
import _ from 'lodash'
import { debug } from 'util';
import { setTimeout } from 'timers';

export default {
  components: {
    MyTree,
    InputTag
  },
  mixins: [utilMixin],
  props: ['form', 'visible', 'type', 'title', 'close', 'position', 'header', 'maxlength', 'minlength'],
  data () {
    return {
      typeName: '',
      emptyTime: '----/--/-- --:--:--',
      submit: false,
      data: {},
      errors: {},
      dataHis: null,
      detailHis: null,
      test: ''
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
    this.detailHis = []
    this.detailHis = _.cloneDeep(this.form.detailColumn)
  },
  methods: {
    handleDetail() {
      this.dataHis = _.cloneDeep(this.form.detailColumn)
    },
    updateData () {
      this.errors = {}
      this.dataHis = []
      this.dataHis = _.cloneDeep(this.form.column)
      
      this.dataHis.forEach(item => {
        if (this.type == 'insert') {
          this.$set(this.data, item.key, item.hasOwnProperty('defaultVal') ? item.defaultVal : null)
          if (item.hasOwnProperty('saveKey')) {
            if (item.type == 'tree') {
              this.$set(this.data, item.saveKey, [])
            } else {
              this.$set(this.data, item.saveKey, null)
            }
          }
        } else if (!this.data.hasOwnProperty(item.key)) {
          this.$set(this.data, item.key, null)
        }

        if (this.type == 'detail') {
          this.$set(item, 'disabled', true)
        }
        if (item.hasOwnProperty('url')) {
          let https = queryAll
          if (item.hasOwnProperty('urlType')) {
            switch (item.urlType) {
              case 'get': https = queryAllGet
              break
              case 'post': https = queryAll
              break
            }
          }
          https(item.url, item.param || {}).then(res => {
            if (res.data.code == 0) {
              this.$set(item, 'options', [])
              item.options = res.data.data
            } else {
              this.$msg.error({
                info: '获取' + item.label + '失败 !'
              })
            }
          })
        } else if (item.hasOwnProperty('enumKey')) {
          this.$set(item, 'options', this.$store.getters.getOptions(item.enumKey))
        }
      })
    },
    handleChange (item, val) {
      let value = val
      if (_.isNumber(value) || _.isString(value)) {
        value = value.toString().trim()
        if (item.hasOwnProperty('toUpper') && item.toUpper) {
          value = value.toUpperCase()
        }
      }
      if (item.hasOwnProperty('method')) {
        let method = item.method
        method(this.data[item.key], param => {
          if (param) {
            if (Array.isArray(param)) {
              param.forEach(item => {
                this.$set(this.data, item.key, item.value)
              })
            } else {
              this.$set(this.data, param.key, param.value)
            }
          }
        })
      }
      this.handleError(item.key, value)
      this.$emit('changeData', {data: this.data, type: this.type})
    },
    handleClose () {
      this.$emit('handleClose')
    },
    handleSubmit () {
      // this.errors = {}
      let hiddenKeys = []
      // 表单字段隐藏时不校验
      this.dataHis.forEach((item, index) => {
        if (item.hasOwnProperty('isHidden')) {
          hiddenKeys.push(item.key)
        }
      })
      _.forEach(this.form.rules, (arr, key) => {
        if(!hiddenKeys.includes(key)) {
          if (!this.errors.hasOwnProperty(key)) {
            this.handleError(key, this.data[key])
          }
        }
      })
      if (!_.isEmpty(this.errors)) {
        return
      } else {
        this.$emit('handleSubmit', {data: this.data, type: this.type})
      }
    },
    handleError (key, value) {
      this.$delete(this.errors, key)
      if (this.type == 'detail') {
        return
      }
      if (this.form.rules.hasOwnProperty(key)) {
        let arr = this.form.rules[key]
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          if (item.type == 'require') {
            if (!value && value !== 0) {
              this.$set(this.errors, key, '必填')
              break
            }
          } else if (item.type == 'unique') {
            let k = item.hasOwnProperty('key') ? item['key'] : key
            if (value || value === 0) {
              let url = item.url + '/checkExist'
              let data = {}
              let k = item.hasOwnProperty('key') ? item['key'] : key
              this.$set(data, k, value)
              if (this.form.data == null) {
                queryAll(url, data).then(res => {
                  if (res.data.code == 0 && res.data.data.hasOwnProperty('exist')) {
                    this.$set(this.errors, key, '数据已存在')
                  }
                }).catch(err => {
                  this.$msg.error({
                    info: '请求异常 !',
                    tip: err
                  })
                })
              } else if (value != this.form.data[k]) {
                queryAll(url, data).then(res => {
                  if (res.data.code == 0 && res.data.data.hasOwnProperty('exist')) {
                    this.$set(this.errors, key, '数据已存在')
                  }
                }).catch(err => {
                  this.$msg.error({
                    info: '请求异常 !',
                    tip: err
                  })
                })
              }
            }
          } else if (item.type == 'regex') { // 匹配
            let reg = item.reg
            if (!reg.test(value)) {
              let info = item.hasOwnProperty('info') ? item['info'] : '数据格式有误'
              this.$set(this.errors, key, info)
              break
            }
          } else if (item.type == 'regexRvs') { // 不匹配
            let reg = item.reg
            if (reg.test(value)) {
              let info = item.hasOwnProperty('info') ? item['info'] : '数据格式有误'
              this.$set(this.errors, key, info)
              break
            }
          } else if (item.type == 'method') {
            let method = item.method
            method(value, param => {
            })
          }
        }
      }
    }
  },
  watch: {
    'form.data': {
      handler (data) {
        this.$set(this, 'data', JSON.parse(JSON.stringify(data)))
      },
      immediate: true
    },
    visible: {
      handler (visible) {
        if (visible) {
          let type = this.type
          switch (type) {
            case 'detail': this.typeName = '详情'
            this.submit = false
            break
            case 'insert': this.typeName = '新增'
            this.submit = true
            if (this.form.key) {
              this.data = {}
              this.$set(this.data, this.form.key, null)
            }
            break
            case 'update': this.typeName = '编辑'
            this.submit = true
            this.$set(this, 'data', JSON.parse(JSON.stringify(this.form.data)))
            break
          }
          this.updateData()
        }
      }
    },
    data: {
      handler (data) {
        if (this.detailHis) {
          for (let i = 0; i < this.detailHis.length; i++) {
            for (let j = 0; j < this.detailHis[i].length; j++) {
              if (this.detailHis[i][j].formatter && data[this.detailHis[i][j].key]) {
                this.$set(this.detailHis[i][j], 'value', data[this.detailHis[i][j].key].substr(0, 16))
                // if (value.length > 8) {
                //   name = `${value.substr(0, 4)}\n${value.substr(4, 3)}...`
                // } else if (value.length > 4) {
                //   name = `${value.substr(0, 4)}\n${value.substr(4, 4)}`
                // } else {
                //   name = value
                // }
              } else {
                this.$set(this.detailHis[i][j], 'value', data[this.detailHis[i][j].key])
              }
            }
          }
        }
      },
      immediate: true
    },
  }
}
</script>

<style lang="scss">
.form-dialog {
  .body {
    overflow: hidden;
  }
}
.form {
  height: 100%;
  padding: 0 20px;
  overflow-x: hidden;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.form-row, .form-item {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.form-item {
  flex-wrap: nowrap;
  flex-direction: column;
  &:nth-child(odd) {
    margin-right: 16px; 
  }

  &.whole-width {
    width: 100%;
    margin-right: 0px;
  }
  &.error {
    .input-tag {
      border: 1px solid rgba($color: $red-shadow, $alpha: 0.8);
      box-shadow: 0 0 0 2px rgba($color: $red-shadow, $alpha: 0.3);
    }
    textarea {
      border: 1px solid rgba($color: $red-shadow, $alpha: 0.8);
      box-shadow: 0 0 0 2px rgba($color: $red-shadow, $alpha: 0.3);
    }
  }
  >.error {
    color: $red;
    font-size: 10px;
    display: inline;

  }
  >.label {
    font-size: 12px;
    margin-bottom: 5px;
    color: $gray-nd;
    align-self: flex-start;
  }

  textarea {
    border: 1px solid rgba($color: $gray-border, $alpha: 1);
    border-radius: 6px;
    font-size: 14px;
    width: 100%;
    min-height: 80px;
    resize: vertical;
    margin-bottom: 20px;

    &:focus, &:hover {
      border: 1px solid rgba(63, 153, 255, 0.8);
      box-shadow: 0 0 0 2px rgba($color: $blue-shadow, $alpha: .3);
    }
  }

  .tree-wrapper {
    border: 1px solid rgba($color: $gray-border, $alpha: 1);
    border-radius: 6px;
    width: 100%;
  }
}
// >.label {
//   font-size: $size;
//   margin: 5px;

//   >.info {
//     color: $gray-nd;
//     display: inline;
//   }

//   >.error {
//     color: $red;
//     margin-left: 10px;
//     display: inline;
//   }
// }
.his-info-normal {
  width: 100%;
  height: fit-content;
  padding: 20px 0;
  border-bottom: 1px solid rgba(221,230,237,1);
  &:last-child{
    border-bottom: none;
  }
  &:first-child{
    padding-top: 0px;
  }
}
.his-info-title {
  font-size: 14px;
  color: #899DB2;
  text-align: left;
  margin-bottom: 8px;
}
.his-info-cont {
    max-width: 600px;
    overflow-y: auto;
    font-size: 16px;
    min-height: 16px;
    line-height: 16px;
    color: #3d424d;
    text-align: left;
    word-wrap: break-word;
    word-break: break-all;
}

.ivu-tree ul {
  font-size: 16px;
}
</style>
