<template>
  <div class="selects">
    <select @change="change($event.target.value)" :disabled="disabled">
      <option v-for="(item, index) in options" :key="index" :value="id ? item[id] : item">{{label ? item[label] : (id ? item[id] : item)}}</option>
    </select>
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
    disabled: {
      type: Boolean,
      default: false
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
  mounted () {
    this.setDefaultValue()
  },
  methods: {
    change (value) {
      let obj = _.find(this.options, (obj) => {
        if (this.id) {
          return (obj[this.id].toString() === value)
        } else {
          return (obj.toString() === value)
        }
      })
      this.$emit('change', this.id ? obj[this.id] : obj)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.selects {
  display: inline-block;
  width: fit-content;
  box-sizing: border-box;
  position: relative;
  
  select {
    padding: 0 30px 0 12px;
    border: 1px solid rgba($color: $gray-border, $alpha: 1);
    border-radius: 6px;
  }

  &:after {
    content: '';
    position: absolute;
    top: 13px;
    right: 12px;
    background-image: url(~@icon/component/select_arrow.png);
    height: 12px;
    width: 12px;
  }
}
</style>
