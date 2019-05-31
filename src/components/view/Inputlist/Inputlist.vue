<template>
  <div class="input-list">
    <input :value="text" :placeholder="placeholder ? ('请输入'+ placeholder) : ''" @input="input($event.target.value)"
    @change="change($event.target.value)" @keyup.enter="enter($event.target.value)"
    @keyup.up="keyUp($event.target.value)" @keyup.down="keyDown($event)"
    @compositionstart="compositionstart($event)" @compositionend="compositionend()"/>
    <div class="input-list-ul">
      <ul>
        <li v-for="(item, index) in filtOpts" :key="index" :class="['input-list-li', activeKey == (id ? item[id] : item) ? 'active' : '']"
        @mousedown="handleSelect(item)">{{label ? item[label] : (id ? item[id] : item)}}</li>
        <li v-if="filtOpts.length <= 0">无搜索结果</li>
      </ul>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    options: {
      type: Array,
      default: function () {return []}
    },
    id: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    require: {
      type: Boolean,
      default: true
    },
    defaultVal: {
      type: [String, Number, Object],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Object],
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      opts: [],
      filtOpts: [],
      text: '',
      activeKey: null,
      composition: false,
      selected: false,
    }
  },
  mounted () {
    this.setDefaultValue()
  },
  methods: {
    compositionstart (event) {
      this.composition = true
    },
    compositionend () {
      this.composition = false
    },
    setDefaultValue () {
      if (!this.defaultVal && this.defaultVal !== 0) {
        if (this.require && this.options.length > 0) {
          let obj = this.id ? this.options[0][this.id] : this.options[0]
          this.$emit('click', obj)
        }
      } else {
        this.$emit('click', this.defaultVal)
      }
    },
    handleSelect (item) {
      let value = this.id ? item[this.id] : item
      this.text = this.label ? item[this.label] : item
      this.activeKey = value
      this.selected = true
      this.$emit('change', value)
    },
    input (val) {
      if (!this.composition) {
        let value = val.toString().trim().toUpperCase()
        this.text = value
        // this.$emit('change', value)
        this.filtOpts = this.filterOpt(value, this.opts, this.id, this.label)
        if (this.filtOpts.length > 0) {
          this.activeKey = this.id ? this.filtOpts[0][this.id] : this.filtOpts[0]
        }
        console.log('text' + this.text)
        console.log('value' + this.value)
      }
    },
    enter (val) {
      if (this.activeKey) {
        this.change(this.activeKey)
      } else {
        this.change(val)
      }
    },
    change (val) {
      let value = val.toString().trim().toUpperCase()
      if (value) {
        let obj = _.find(this.opts, (obj) => {
          if (this.id && this.label) {
            return obj[this.id].toString().includes(value) || obj[this.label].toString().includes(value)
          } else {
            return obj.toString().includes(value)
          }
        })
        if (obj) {
          let id = this.id ? obj[this.id] : obj
          let text = this.label ? obj[this.label] : obj
          this.$emit('change', id)
          this.text = text
          this.activeKey = id
        } else {
          this.$emit('change', null)
          this.activeKey = null
          this.input('')
        }
      }
    },
    keyUp (val) {
      if (this.filtOpts.length > 0) {
        let index = this.filtOpts.length - 1
        if (this.activeKey) {
          let value = this.activeKey
          index = _.findIndex(this.filtOpts, (obj) => {
            if (this.id && this.label) {
              return (obj[this.id] == value) || (obj[this.label] == value)
            } else {
              return (obj == value)
            }
          })
          if (index == 0) {
            index = this.filtOpts.length - 1
          } else {
            index --
          }
        }
        event.target.parentElement.querySelectorAll('.input-list-li')[index].scrollIntoView(false)
        this.activeKey = this.id ? this.filtOpts[index][this.id] : this.filtOpts[index]
      }
    },
    keyDown (event) {
      if (this.filtOpts.length > 0) {
        let index = 0
        if (this.activeKey) {
          let value = this.activeKey
          index = _.findIndex(this.filtOpts, (obj) => {
            if (this.id && this.label) {
              return (obj[this.id] == value) || (obj[this.label] == value)
            } else {
              return (obj == value)
            }
          })
          if (index == (this.filtOpts.length - 1)) {
            index = 0
          } else {
            index ++
          }
        }
        event.target.parentElement.querySelectorAll('.input-list-li')[index].scrollIntoView(false)
        this.activeKey = this.id ? this.filtOpts[index][this.id] : this.filtOpts[index]
      }
    }
  },
  watch: {
    options: {
      handler (opt) {
        this.opts = []
        this.opts = opt
        this.filtOpts = this.filterOpt(this.value, this.opts, this.id, this.label)
      },
      immediate: true
    },
    value: {
      handler (value) {
        if (value) {
          if (!this.selected) {
            this.change(value)
          } else {
            this.selected = false
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.input-list {
  display: inline-block;
  width: fit-content;
  height: fit-content;
  box-sizing: border-box;
  position: relative;
  box-sizing: border-box;

  &:before {
    content: '';
    position: absolute;
    top: 13px;
    right: 12px;
    background-image: url(~@icon/component/select_arrow.png);
    height: 12px;
    width: 12px;
  }

  &:focus-within {
    .input-list-ul {
      visibility: visible;
    }
    
    &:before {
      transform: rotate(180deg);
    }
  }

  >input {
    border: 1px solid rgba($color: $gray-border, $alpha: 1);
    border-radius: 6px;
    box-sizing: border-box;

    &:focus, &:hover {
      border: 1px solid rgba(63, 153, 255, 0.8);
      box-shadow: 0 0 0 2px rgba($color: $blue-shadow, $alpha: .3);
    }
  }

  >.input-list-ul {
    border-radius: 6px;
    overflow: hidden;
    position: absolute;
    border: 1px solid rgba(60, 166, 200, 0.5);
    width: 100%;
    background-color: #fff;
    visibility: hidden;
    max-height: 380px;
    min-height: 38px;
    height: fit-content;
    text-align: left;
    overflow-y: auto;
    z-index: 9;

    >ul {
      list-style-type: none;
      margin: 0;
      padding: 0;

      >li {
        font-size: 14px;
        color: $gray-st;
        padding: 5px 10px;
        cursor: pointer;

        &:hover {
          background-color: rgba($color: $blue-shadow, $alpha: 0.3);
        }

        &.active {
          background-color: rgba($color: $blue-shadow, $alpha: 0.5);
        }
      }
    }
  }
}
</style>

