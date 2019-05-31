<template>
  <div class="tab-button">
    <div v-for="(item, index) in options" :key="index" :class="['tab-button-item', value == (id ? item[id] : item) ? 'select' : '']" @click="clickButton(item)">{{label ? item[label] : item}}</div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: function () { return [] }
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
    value: {
      type: [String, Number, Object],
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'click'
  },
  mounted () {
    this.setDefaultValue()
  },
  methods: {
    clickButton (item) {
      let value = this.id ? item[this.id] : item
      this.$emit('click', value)
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
.tab-button {
  display: inline-flex;
  height: 38px;
  width: fit-content;
  line-height: 14px;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid rgba($color: $gray-border, $alpha: 1);
  border-radius: 6px;

  >.tab-button-item {
    padding: 0 12px;
    margin: 12px 0;
    color: $gray-nd;
    cursor: pointer;

    &:not(:last-child) {
      border-right: 1px solid rgba($color: $gray-border, $alpha: 1);
    }

    &.select {
      color: $blue;
      // font-weight: bold;
    }
  }
}
</style>
