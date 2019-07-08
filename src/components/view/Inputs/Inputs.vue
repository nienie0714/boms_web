<template>
  <div class="inputs">
    <input :type="type" :value="value" :placeholder="placeholder" :disabled="disabled"
    :max="max" :min="min" :maxlength="maxlength" :minlength="minlength"
    @input="$emit('input', $event.target.value)" @change="$emit('change', $event.target.value)" @keyup.enter.stop="$emit('enter', $event.target.value)"/>
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
      default: 'key'
    },
    label: {
      type: String,
      default: 'label'
    },
    defaultVal: {
      type: [String, Number, Object],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: null
    },
    minlength: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Object],
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: null
    },
    min: {
      type: String,
      default: null
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd HH:mm'
    }
  },
  mounted () {
    this.setDefaultValue()
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  methods: {
    setDefaultValue () {
      if (!this.defaultVal && this.defaultVal !== 0) {
        return
      } else {
        this.$emit('change', this.defaultVal)
      }
    }
  },
  watch: {
    'value': {
      handler (data) {
        if (this.type == 'datetime-local') { // 2019-12-31T23:59 // yyyy-mm-ddThh:mm 12小时制
        } else if (this.type == 'date') { // 2019-12-31
          // console.log(this.value)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.inputs {
  display: inline-block;
  width: fit-content;
  box-sizing: border-box;

  >input {
    border: 1px solid rgba($color: $gray-border, $alpha: 1);
    border-radius: 6px;
    width: 100%;

    &:focus, &:hover {
      border: 1px solid rgba(63, 153, 255, 0.8);
      box-shadow: 0 0 0 2px rgba($color: $blue-shadow, $alpha: .3);
    }
  }
}
::-webkit-inner-spin-button {
  position: relative;
  top: 50%;
  transform: translateY(-50%)
}
</style>
