<template>
  <div ref="listMenu" class="list-menu">
    <ul>
      <li v-for="(item, index) in menuData" :key="index" :class="item.disabled ? 'disabled' : ''"
      @click="handleClick(index)"><!--  @mouseenter="handleHover(index)" @mouseleave="handleRemoveHover" -->
        <span>{{ item.label }}</span>
        <!-- <i v-if="item.hasOwnProperty('children')" class="el-icon-caret-right"></i> -->
        <child v-if="item.hasOwnProperty('children') && (hoverIndex == index)" :data="item.children" :index="index" @skipPath="skipPath"
        @handleClose="handleClose"></child>
      </li>
    </ul>
  </div>
</template>

<script>
import Child from './MenuListChild'

export default {
  props: ['menuData'],
  components: {
    Child
  },
  data () {
    return {
      hoverIndex: null,
      childData: []
    }
  },
  mounted () {
    document.addEventListener('click', this.hiddenMenu)
  },
  destroyed () {
    document.removeEventListener('click', this.hiddenMenu)
  },
  methods: {
    hiddenMenu (event) {
      if (event.target.className != 'list-menu-ul') {
        this.menuData.show = false
      }
    },
    handleRemoveHover () {
      this.hoverIndex = null
    },
    handleClick (index) {
      if (this.hoverIndex == index) {
        this.hoverIndex = null
      } else {
        this.hoverIndex = index
      }
    },
    skipPath (obj) {
      this.$emit('skipPath', obj)
    },
    handleClose () {
      this.menuData.show = false
    }
  },
  watch: {
    'menuData.show': {
      handler (show) {
        if (show) {
          this.setLocate()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.list-menu {
  border-radius: 4px;
  overflow: hidden;
  background-color: #FAFBFC;
  box-shadow: 4px -4px 12px #E5EAEF;

  >ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    >li {
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: left;

      >span {
        width: calc(100% - 32px);
        padding: 8px 16px;
        border: 1px solid rgba($color: $blue, $alpha: .7);
        background-color: rgba($color: $blue, $alpha: .7);
      }

      &:hover {
        >span {
          background-color: rgba($color: $blue, $alpha: .9);
        }
      }

      >div {
        width: 100%;
      }

      &.disabled {
        opacity: 0.4;
        pointer-events: none;
      }

      &:not(:last-of-type) {
        border-bottom: 1px solid rgba($color: $blue, $alpha: .4);
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
