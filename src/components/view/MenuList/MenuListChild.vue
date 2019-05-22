<template>
  <div class="list-menu-child" :ref="'listMenuChild' + index">
    <ul>
      <li v-for="(child, idx) in data" :key="idx"  :class="[(idx%2==0)?'single-index':'', selectIndex==idx?'select-index':'']"
      @click.stop="handleClick(child, idx)"><!-- :class="child.disabled ? 'disabled' : ''" @mouseenter.stop="handleHover(idx)" @mouseleave.stop="handleRemoveHover" -->
        <span>{{ child.label }}</span>
        <i v-if="child.hasOwnProperty('children')" class="el-icon-caret-right"></i>
        <child v-if="child.hasOwnProperty('children') && (selectIndex == idx)" :data="child.children"
        @handleClose="handleClose"></child>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'child',
  props: ['data', 'index'],
  data () {
    return {
      selectIndex: null,
      width: 0,
      style: {
        width: 'max-content'
      }
    }
  },
  methods: {
    handleRemoveHover () {
      this.selectIndex = null
    },
    handleClick (item, index) {
      this.selectIndex = index
      if (!item.hasOwnProperty('children')) {
        // this.$router.push(item.path)
        this.$emit('skipPath', item)
      }
    },
    handleClose () {
      this.$emit('handleClose')
    }
  },
  watch: {
    $route (to, from) {
      this.title = to.name
    }
  }
}
</script>

<style lang="scss" scoped>
.list-menu-child {
  // overflow: hidden;

  >ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    >li {
      color: $gray-nd;
      font-size: 14px;
      cursor: pointer;
      list-style-type: none;
      display: flex;
      align-items: center;
      justify-content: space-between;

      >span {
        background-color: #f5f7f9;
        width: calc(100% - 32px);
        padding: 8px 16px;
      }

      &.single-index {
        >span {
          background-color: #fff;
        }
      }

      &:hover {
        >span {
          background-color: rgba($color: $blue-shadow, $alpha: .2);
          color: $gray-st;
        }
      }

      &.select-index {
        >span {
          background-color: rgba($color: $blue-shadow, $alpha: .4);
          color: $gray-st;
        }
      }

      &.disabled {
        opacity: 0.4;
        pointer-events: none;
      }

      &:not(:last-of-type) {
        // border-bottom: 1px solid rgba($color: $gray-rd, $alpha: .4);
      }

      &:first-of-type {
        border-radius: 4px 4px 0 0;
      }

      &:last-of-type {
        border-radius: 0 0 4px 4px;
      }
    }
  }
}
</style>
