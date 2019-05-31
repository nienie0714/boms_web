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
            <inputs v-if="item.type == 'input'" v-model.trim="data[item.key]" :maxlength="maxlength" :minlength="minlength"
            :placeholder="'请输入'+item.label" :disabled="item.disabled"
            @change="handleChange(item, data[item.key])"></inputs>
            <tab-button v-else-if="item.type == 'tab'" v-model="data[item.key]" :options="item.options" :id="item.itemId" :label="item.itemLabel"
            @change="handleChange(item, data[item.key])"></tab-button>
            <input-list v-else-if="item.type == 'inputlist'" v-model="data[item.saveKey ? item.saveKey : item.key]" :options="item.options" :id="item.itemId" :label="item.itemLabel"></input-list>
            <selects v-else-if="item.type == 'select'" v-model="data[item.saveKey ? item.saveKey : item.key]" :options="item.options"></selects>
            <textarea v-else-if="item.type == 'textarea'" v-model.trim="data[item.key]" :maxlength="maxlength" :minlength="minlength"
            :placeholder="'请输入'+item.label" :disabled="item.disabled" :rows="item.rows" :cols="item.cols"
            @change="handleChange(item, data[item.key])"></textarea>
            <!-- <input v-if="['datalist', 'inputlist'].includes(item.type)" v-model.trim="data[item.key]" :list="item.key" style="width: inherit;" :placeholder="'请输入'+item.label"
            :disabled="item.disabled"
            @change="handleChange(item, $event)" @keyup.enter.stop="handleEnter(item, $event)" @focus="handleFocus(item, $event)" @blur="handleBlur(item, $event)"/>
            <component :is="item.type" :id="item.key" v-model.trim="data[item.key]" :value="data[item.key]" :type="item.inputType" :min="item.min" :max="item.max"
            class="value-component" :placeholder="'请输入'+item.label" :disabled="item.disabled"
            :itemKey="item.key" :options="item.options" :itemValue="item.itemValue" :label="item.itemLabel" :input="data[item.key]"
            @blur="item.toUpper&&toUpper(item, $event)" @change="handleChange(item, $event.target.value)" @keyup.enter.stop="handleEnter(item, $event)"
            @select="selectList">
              <template v-if="item.type=='datalist'">
                <option v-for="(opt, idx) in item.options" :key="idx" :value="(opt.constructor==Object)?opt[item.itemValue]:opt">{{(opt.constructor==Object)?opt[item.itemLabel]:opt}}</option>
              </template>
            </component>
            <template v-if="item.type == 'select'">
              <component :is="item.type" v-model="data[item.key]" :type="item.inputType" :min="item.min" :max="item.max" class="value-component" :disabled="item.disabled">
                <template v-if="item.type=='select'">
                  <option v-for="opt in item.options" :key="opt[item.itemKey]" :value="opt[item.itemKey]">{{opt[item.itemLabel]}}</option>
                </template>
              </component>
            </template> -->
            <!-- <inputlist v-if="item.type == 'inputlist'" :options="item.options" :value="item.itemValue" :label="item.itemLabel" :input="data[item.key]"></inputlist> -->
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
import Selects from '@view/Selects/Selects'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import { getNewObjArr } from '@/util/util'
import _ from 'lodash'

export default {
  components: {
    Inputs,
    TabButton,
    InputList,
    Selects
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
      this.dataHis = JSON.parse(JSON.stringify(this.form.column))
      
      this.dataHis.forEach(item => {
        if (this.type == 'detail') {
          this.$set(item, 'disabled', true)
        }
        if (item.hasOwnProperty('url')) {
          queryAll(item.url, item.param || {}).then(res => {
            if (res.data.code == 0) {
              this.$set(item, 'options', res.data.data)
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
    selectList ({value, key}) {
      if (key) {
        this.data[key] = value
        event.target.parentElement.parentElement.style.visibility = 'hidden'
      }
    },
    handleChange (item, val) {
      let value = val.toString().trim()
      if (item.hasOwnProperty('toUpper') && item.toUpper) {
        value = value.toUpperCase()
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
      this.handleError(item, value)
      this.$emit('changeData', {data: this.data, type: this.type})
    },
    handleClose () {
      this.$emit('handleClose')
    },
    handleSubmit () {
      this.errors = {}
      _.forEach(this.form.rules, (arr, key) => {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          if (item.type == 'require') {
            if (!this.data[key] && this.data[key] !== 0) {
              this.$set(this.errors, key, '必填')
              break
            }
          } else if (item.type == 'regex') {
            let reg = item.reg
            this.errors.push
          } else if (item.type == 'method') {
            let method = item.method
            method(this.data[key], param => {
            })
          }
        }
      })
      if (this.errors.length > 0) {
        return
      } else {
        this.$emit('handleSubmit', {data: this.data, type: this.type})
      }
    },
    handleError (obj, value) {
      let key = obj.key
      this.$delete(this.errors, key)
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
        if (data) {
          this.$set(this, 'data', data)
        }
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
