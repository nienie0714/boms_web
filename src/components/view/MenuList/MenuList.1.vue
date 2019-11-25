<template>
  <div ref="listMenu" class="list-menu">
    <ul>
      <li v-for="(child, index) in data" :key="index"  :class="[(index%2==0)?'single-index':'', selectIndex==index?'select-index':'']"
      @click.stop="handleClick(child, index)"><!-- :class="child.disabled ? 'disabled' : ''" @mouseenter.stop="handleHover(idx)" @mouseleave.stop="handleRemoveHover" -->
        <span>{{ child.label }}<i v-if="child.hasOwnProperty('children') && child.children" class="el-icon-caret-right"></i></span>
        <child v-if="child.hasOwnProperty('children') && (selectIndex == index)" class="list-menu-child" :data="child.children" :index="index"
        @skipPath="skipPath" @handleClose="handleClose"></child>
      </li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'child',
  props: ['data', 'index', 'defaults'],
  data () {
    return {
      selectIndex: 0,
      width: 0,
      style: {
        width: 'max-content'
      }
    }
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    handleRemoveHover () {
      this.selectIndex = null
    },
    handleClick (item, index) {
      if (item && _.isUndefined(index)) {
        index = _.findIndex(this.data, ['path', item.router])
      }
      this.selectIndex = index
      if (item.hasOwnProperty('children') && !item.children || !item.hasOwnProperty('children')) {
        this.$emit('skipPath', item)
      }
    },
    handleClose () {
      this.$emit('handleClose')
    },
    skipPath (obj) {
      this.$emit('skipPath', obj)
    }
  },
  watch: {
    $route (to, from) {
      this.title = to.name
    },
    data() {
      // 左侧边菜单记住当前路由
      let j = _.findIndex(this.data, ['router', this.$route.path])
      this.selectIndex = j != -1 ? j : 0
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin list-menu-span-child($length) {
  @if $length == 10 {
  } @else {
    >ul>li {
      >span {
        text-indent: 10px * $length;
      }
      >.list-menu {
        @include list-menu-span-child($length + 1);
      }
    }
  }
}
.list-menu {
  // overflow: hidden;
  @include list-menu-span-child(0);

  &:not(.list-menu-child) {
    width: 100%;
  }

  &.list-menu-child {
    width: 100%;
  }

  >ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    >li {
      color: $gray-rd;
      font-size: 14px;
      cursor: pointer;
      width: 100%;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: start;

      >span {
        // background-color: #f5f7f9;
        // width: calc(100% - 32px);
        width: 100%;
        padding: 8px 16px;
        border-radius: 4px;
      }

      &.single-index {
        >span {
          // background-color: #fff;
        }
      }

      &:hover {
        >span {
          // background-color: rgba($color: $blue-shadow, $alpha: .2);
          background: rgba(97, 112, 128, 0.3);  
          color: $gray-rs;
        }
      }

      &.select-index {
        >span {
          // background-color: rgba($color: $blue-shadow, $alpha: .4);
          background: rgba(97, 112, 128, 0.5);
          color: #fff;
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
