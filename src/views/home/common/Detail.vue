<template>
  <my-dialog v-bind="$attrs" v-on="$listeners" :title="title + typeName" :close="close" :header="header" :submit="submit"
  :position="'right'" class="form-dialog under-head-dialog" @handleClose="handleClose" @submitDialog="handleSubmit">
    <template>
      <div class="form" v-if="'column' in form">
        <div v-for="(item, index) in dataHis" :key="index" v-show="!item.isHidden" class="form-item">
          <div class="label">
            <div class="info">{{ item.label }}</div>
            <div v-if="item.key in errors" class="error">{{ errors[item.key] }}</div>
          </div>
          <div :class="['value', item.key in errors ? 'error' : '']" :style="item.hasOwnProperty('width')?`width: ${item.width}px;`:''">
            <inputs v-if="item.type == 'input' || item.type == 'password'" v-model.trim="data[item.key]" :maxlength="item.maxlength" :minlength="item.minlength" :type="item.type"
            :placeholder="item.label" :disabled="item.disabled"
            @change="handleChange(item, $event)"></inputs>
            <tab-button v-else-if="item.type == 'tab'" v-model="data[item.key]" :options="item.options" :id="item.itemId" :label="item.itemLabel" :disabled="item.disabled"
            @change="handleChange(item, $event)"></tab-button>
            <input-list v-else-if="item.type == 'inputlist'" v-model="data[item.saveKey ? item.saveKey : item.key]" :options="item.options" :disabled="item.disabled"
            :id="item.itemId" :label="item.itemLabel"
            @change="handleChange(item, $event)"></input-list>
             <input-list-more v-else-if="item.type == 'inputlistmore'" v-model="data[item.saveKey ? item.saveKey : item.key]" :options="item.options" :disabled="item.disabled"
            :id="item.itemId" :label="item.itemLabel"
            @change="handleChange(item, $event)"></input-list-more>
            <selects v-else-if="item.type == 'select'" v-model="data[item.saveKey ? item.saveKey : item.key]" :options="item.options" :disabled="item.disabled"
            @change="handleChange(item, $event)"></selects>
            <textarea v-else-if="item.type == 'textarea'" v-model.trim="data[item.key]" :maxlength="item.maxlength" :minlength="item.minlength"
            :placeholder="'请输入'+item.label" :disabled="item.disabled" :rows="item.rows" :cols="item.cols"
            @change="handleChange(item, $event)"></textarea>
            <tree v-else-if="item.type == 'tree'" :data="item.options" :selected="true" :disabled="item.disabled"
            :allSelectNodeId="data[item.saveKey ? item.saveKey : item.key]"
            :nodeKey="item.itemId" :nodeLabel="item.itemLabel" :nodeChild="item.itemChild"></tree>
          </div>
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
import Tree from '@view/Tree/Tree'
import utilMixin from '@mixin/utilMixin'
import { queryAll, queryAllGet } from '@/util/base'
import { getNewObjArr } from '@/util/util'
import _ from 'lodash'
import { debug } from 'util';

export default {
  components: {
    Inputs,
    TabButton,
    InputList,
    InputListMore,
    Selects,
    Tree
  },
  mixins: [utilMixin],
  props: ['form', 'type', 'title', 'close', 'position', 'header', 'maxlength', 'minlength'],
  data () {
    return {
      typeName: '',
      emptyTime: '----/--/-- --:--:--',
      submit: false,
      data: {},
      errors: {},
      dataHis: null
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
    updateData () {
      this.errors = {}
      this.dataHis = []
      this.dataHis = _.cloneDeep(this.form.column)
      
      this.dataHis.forEach(item => {
        if (this.type == 'insert') {
          this.$set(this.data, item.key, item.hasOwnProperty('default') ? item.default : null)
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
      this.updateData()// 新增页面关闭后打开字段不清空。bug:编辑页面修改后取消 重新打开会保留上次错误信息
      this.$emit('handleClose')
    },
    handleSubmit () {
      this.errors = {}
      let hiddenKeys = []
      // 表单字段隐藏时不校验
      this.dataHis.forEach((item, index) => {
        if (item.hasOwnProperty('isHidden')) {
          hiddenKeys.push(item.key)
        }
      })
      _.forEach(this.form.rules, (arr, key) => {
        if(!hiddenKeys.includes(key)) {
          this.handleError(key, this.data[key])
        }
      })
      debugger
      console.log(this.data)
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
            if (value || value === 0) {
              let url = item.url + '/exist'
              let data = {}
              let k = item.hasOwnProperty('key') ? item['key'] : key
              this.$set(data, k, value)
              queryAll(url, data).then(res => {
                if (res.data.code == 0 && res.data.data.hasOwnProperty('exist')) {
                  if (res.data.data.exist > 0) {
                    this.$set(this.errors, key, '数据已存在')
                  }
                } else {
                  this.$msg.error({
                    info: '请求失败 !'
                  })
                }
              }).catch(err => {
                this.$msg.error({
                  info: '请求异常 !',
                  tip: err
                })
              })
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
    type: {
      handler (type) {
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
          break
        }
        this.updateData()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.form-dialog {
  .body {
    overflow: hidden;

    .form {
      height: 100%;
      overflow-x: hidden;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;

      .form-item {
        $top: 5px;
        $left: 20px;
        $size: 14px;
        width: calc(50% - 2 * #{$left});
        padding: $top $left;
        text-align: left;

        >.label {
          font-size: $size;
          margin: 5px;

          >.info {
            color: $gray-nd;
            display: inline;
          }

          >.error {
            color: $red;
            margin-left: 10px;
            display: inline;
          }
        }
        >.value {
          input, textarea {
            // max-width: calc(100% - 20px);
            border: 1px solid rgba($color: $blue-shadow, $alpha: 0.8);
          }
          
          &.error {
            input, textarea {
              border: 1px solid rgba($color: $red-shadow, $alpha: 0.8);
              box-shadow: 0 0 0 2px rgba($color: $red-shadow, $alpha: 0.3);
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bodyHead: 32px;
.dialog {
  width: 30px;
  height: 50px;
}
.body {
}
</style>
