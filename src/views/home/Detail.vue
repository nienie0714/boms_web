<template>
  <my-dialog v-bind="$attrs" v-on="$listeners" :title="title + typeName" :close="close" :header="header" :submit="submit"
  :position="'right'" class="form-dialog under-head-dialog" @handleClose="handleClose" @handleSubmit="handleSubmit">
    <template>
      <div class="form" v-if="'column' in form">
        <div v-for="(item, index) in dataHis" :key="index" v-show="!item.isHidden" class="form-item">
          <div class="label">
            <div class="info">{{ item.label }}</div>
            <div v-if="item.key in errors" class="error">{{ errors[item.key] }}</div>
          </div>
          <div :class="['value', item.key in errors ? 'error' : '']" :style="item.hasOwnProperty('width')?`width: ${item.width}px;`:''">
            <input v-if="['datalist', 'inputlist'].includes(item.type)" v-model.trim="data[item.key]" :list="item.key" style="width: inherit;" :placeholder="'请输入'+item.label"
            :disabled="item.disabled"
            @change="handleChange(item, $event)" @keyup.enter.stop="handleEnter(item, $event)" @focus="handleFocus(item, $event)" @blur="handleBlur(item, $event)"/>
            <component :is="item.type" :id="item.key" v-model.trim="data[item.key]" :value="data[item.key]" :type="item.inputType" :min="item.min" :max="item.max"
            class="value-component" :placeholder="'请输入'+item.label" :disabled="item.disabled"
            :itemKey="item.key" :options="item.options" :itemValue="item.itemValue" :label="item.itemLabel" :input="data[item.key]"
            @blur="item.toUpper&&toUpper(item, $event)" @change="handleChange(item, $event)" @keyup.enter.stop="handleEnter(item, $event)"
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
            </template>
            <!-- <inputlist v-if="item.type == 'inputlist'" :options="item.options" :value="item.itemValue" :label="item.itemLabel" :input="data[item.key]"></inputlist> -->
          </div>
        </div>
      </div>
    </template>
  </my-dialog>
</template>

<script>
import Inputlist from '@view/Inputlist/Inputlist'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import { getNewObjArr } from '@/util/util'
import _ from 'lodash'

export default {
  components: {
    Inputlist
  },
  mixins: [utilMixin],
  props: ['form', 'type', 'title', 'close', 'position', 'header'],
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
    handleChange (item, event) {
      if (['datalist', 'inputlist'].includes(item.type)) {
        let value = event.target.value.trim().toUpperCase()
        if (value && _.isString(value)) {
          let obj = _.find(item.options, (obj) => {
            return obj[item.itemValue].includes(value)
          })
          this.data[item.key] = obj ? obj[item.itemValue] : ''
        } else if (_.isInteger(value)) {
          let obj = _.find(item.options, [obj[item.itemValue], value])
          this.data[item.key] = obj ? obj[item.itemValue] : null
        }
      } else {
        if (event.target.value) {
          this.data[item.key] = event.target.value.trim()
        }
        this.handleError(item, event.target.value)
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
    },
    handleEnter (item, event) {
      if (item.toUpper) {
        this.toUpper(item, event)
      }
      this.$emit('handleEnter')
    },
    handleFocus (item, event) {
      if (item.type == 'inputlist') {
        event.target.nextElementSibling.style.visibility = 'visible'
        let height = window.innerHeight - event.target.getBoundingClientRect().top
        event.target.nextElementSibling.style.width = event.target.offsetWidth + 'px'
        if (height < 0) {
          event.target.nextElementSibling.style.bottom = event.target.innerHeight
        }
      }
    },
    handleBlur (item, event) {
      if (item.type == 'inputlist') {
        event.target.nextElementSibling.style.visibility = 'hidden'
      }
    },
    toUpper (item, event) {
      let value = item.value.trim().toUpperCase()
      event.target.value = value
      this.$set(item, 'value', item.value.trim().toUpperCase())
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
      this.$emit('handleSubmit', this.data)
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
          } else if (item.type == 'regex') {
            let reg = item.reg
            this.errors.push
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
        this.updateData()
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
            max-width: calc(100% - 20px);
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
