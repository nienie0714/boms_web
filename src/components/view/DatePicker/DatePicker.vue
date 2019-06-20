<template>
  <div class="dates">
    <input :type="type" :value="value.key1" :placeholder="placeholder" :disabled="disabled"
    @input="$emit('input', $event.target.value)" @change="$emit('change', $event.target.value)" :max="max" :min="min"/>
    <span>--</span>
    <input :type="type" :value="value.key2" :placeholder="placeholder" :disabled="disabled"
    @input="$emit('input', $event.target.value)" @change="$emit('change', $event.target.value)" :max="max" :min="min"/>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    key1: {
      type: String,
      default: 'date'
    },
    key2: {
      type: String,
      default: ''
    },
    defaultVal: {
      type: [String, Number, Object],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: ()=>{}
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
  },
  watch: {
    'value': {
      handler (data) {
        console.log(data)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.dates {
  display: inline-block;
  width: fit-content;
  box-sizing: border-box;

  >input {
    border: 1px solid rgba($color: $gray-border, $alpha: 1);
    border-radius: 6px;
    width: 45%;

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
