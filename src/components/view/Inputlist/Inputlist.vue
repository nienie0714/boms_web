<template>
  <div class="input-list">
    <ul>
      <li v-for="(item, index) in filtOpts" :key="index" @mousedown="handleSelect(item)">{{label ? item[label] : (itemValue ? item[itemValue] : item)}}</li>
      <li v-if="filtOpts.length <= 0">无搜索结果</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: function () {return []}
    },
    itemKey: {
      type: String,
      default: ''
    },
    itemValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    input: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: '',
      opts: [],
      filtOpts: []
    }
  },
  methods: {
    handleSelect (item) {
      let value = this.itemValue ? item[this.itemValue] : item
      this.value = value
      console.log(value)
      this.$emit('select', {value: value, key: this.itemKey})
    }
  },
  watch: {
    input: {
      handler (value) {
        this.value = value
        this.filtOpts = this.filterOpt(this.value, this.opts, this.itemValue, this.label)
      }
    },
    options: {
      handler (opt) {
        this.opts = []
        this.opts = opt
        this.filtOpts = this.filterOpt(this.value, this.opts, this.itemValue, this.label)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-list {
  position: absolute;
  border: 1px solid rgba(60, 166, 200, 0.5);
  background-color: #fff;
  overflow-x: hidden;
  visibility: hidden;
  max-height: 200px;
  min-height: 25px;

  >ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    >li {
      font-size: 14px;
      color: $gray-st;
      padding: 3px 10px;
      cursor: pointer;

      &:hover {
        background-color: rgba($color: $blue-shadow, $alpha: 0.3);
      }

      &:focus {
        background-color: rgba($color: $red-shadow, $alpha: 0.3);
      }
    }
  }
}
</style>

