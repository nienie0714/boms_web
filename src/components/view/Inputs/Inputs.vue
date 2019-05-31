<template>
  <div class="inputs">
    <input :value="value" :maxlength="maxlength" :minlength="minlength" :placeholder="placeholder ? ('请输入'+ placeholder) : ''"
    @input="$emit('input', $event.target.value)" @change="$emit('change', $event.target.value)"/>
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
    value: {
      type: [String, Number, Object],
      default: ''
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
        this.$emit('click', this.defaultVal)
      }
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

    &:focus, &:hover {
      border: 1px solid rgba(63, 153, 255, 0.8);
      box-shadow: 0 0 0 2px rgba($color: $blue-shadow, $alpha: .3);
    }
  }
}
</style>
