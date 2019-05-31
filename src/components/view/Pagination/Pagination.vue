<template>
  <div class="pagination">
    <div class="page-options">
      <inputTag v-model="currentSize" :prepend="'条/页'" :type="'select'" :options="options"></inputTag>
    </div>
    <div class="page-list">
      <div :class="['prev', num <= 1 ? 'disabled' : '']" @click.self="(num > 1) && clickButton('prev')">上一页</div>
      <div v-if="list.length > 0" :class="['num', num == 1 ? 'active' : '']"  @click.self="$emit('click', 1)">{{1}}</div>
      <div v-if="currentList.length > 0 && currentList[0] > 2" class="prev-omit" @click.self="clickOmit('prev')">...</div>
      <div :class="['num', item == num ? 'active' : '']" v-for="(item, index) in currentList" :key="index" @click.self="$emit('click', item)">{{item}}</div>
      <div v-if="currentList.length > 0 && currentList[currentList.length - 1] < list[list.length - 2]" @click.self="clickOmit('next')" class="next-omit">...</div>
      <div v-if="list.length > 1" :class="['num', num == list.length ? 'active' : '']"  @click.self="$emit('click', list.length)">{{list.length}}</div>
      <div :class="['next', num == list.length ? 'disabled' : '']" @click.self="(num < list.length) && clickButton('next')">下一页</div>
    </div>
    <div class="page-lists">
      <inputTag v-model="currentNum" :prepend="'跳转至'" :type="'inputlist'" :options="list"></inputTag>
    </div>
  </div>
</template>

<script>
import InputTag from '@view/InputTag/InputTag'
import _ from 'lodash'

export default {
  components: {
    InputTag
  },
  props: {
    options: {
      type: Array,
      default: function () { return [10, 30, 50] }
    },
    total: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 10
    },
    num: {
      type: Number,
      default: 1
    }
  },
  model: {
    prop: 'num',
    event: 'click'
  },
  data () {
    return {
      list: [],
      currentList: []
    }
  },
  methods: {
    clickOmit (type) {
      let num = this.num
      switch (type) {
        case 'prev': num -= 5
        break
        case 'next': num += 5
        break
      }
      if (num < 1) {
        num = 1
      } else if (num > this.list.length) {
        num = this.list.length
      }
      this.$emit('click', num)
    },
    clickButton (type) {
      switch (type) {
        case 'prev': if (this.num > 1) { this.$emit('click', this.num - 1) }
        break
        case 'next': if (this.num < this.list.length) { this.$emit('click', this.num + 1) }
        break
      }
    },
    computeList () {
      let length = this.list.length - 2
      let list = _.drop(_.dropRight(this.list))
      if (length > 5) {
        let left = this.num - 4
        if (left > 0) {
          list = _.drop(list, left)
        }
        this.currentList = _.dropRight(list, list.length - 5)
      } else if (length > 0) {
        this.currentList = list
      } else {
        this.currentList = []
      }
    }
  },
  computed: {
    currentSize: {
      get () {
        return this.size
      },
      set (size) {
        this.$emit('click', 1)
        this.$parent.pageData.size = size
        this.$emit('changeData')
      }
    },
    currentNum: {
      get () {
        return this.num
      },
      set (num) {
        if (num) {
          this.$emit('click', num)
        }
      }
    }
  },
  watch: {
    total: {
      handler (total) {
        if (total > 0) {
          this.$emit('click', 1)
          let count = Math.ceil(total/this.size)
          let arr = Array.from({length: count}, (item, index) => index + 1)
          this.list.splice(0, this.list.length, ...arr)
        } else {
          this.$emit('click', 0)
        }
        this.computeList()
      },
      immediate: true
    },
    num: {
      handler (num) {
        this.$emit('changeData')
        this.computeList()
      }
    },
    size: {
      handler (size) {
        let count = Math.ceil(this.total/size)
        let arr = Array.from({length: count}, (item, index) => index + 1)
        this.list.splice(0, this.list.length, ...arr)
        this.computeList()
      }
    }
  }
}
</script>

<style lang="scss">
$h: 34px;
.pagination {
  height: $h;
  font-size: 14px;
  display: inline-flex;

  .page-options,
  .page-lists {

    >div {
      height: $h;
      line-height: $h;
    }

    input, select {
      width: 80px;
      height: $h;
      line-height: $h;
    }
  }

  .page-list {
    height: $h;
    line-height: $h;

    >div {
      color: $gray-nd;
      display: inline-block;
      padding: 0 12px;
      cursor: pointer;

      &.disabled {
        cursor: not-allowed;
        opacity: 0.4;
      }

      &.active {
        color: #fff;
        font-weight: bold;
        background-color: $blue;
        background: linear-gradient(-90deg,rgba(73,130,255,1),rgba(63,162,249,1));
        border-radius:6px;
      }
    }
  }
}
</style>
