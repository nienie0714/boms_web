<template>
  <div v-if="menuData.show" ref="rightMenu" class="right-menu-pop" :style="selfStyle">
    <ul class="right-menu-ul">
      <li v-for="(item, index) in menuData.items" :key="index" :class="item.disabled ? 'disabled' : ''" @mouseenter="handleHover(index)" @mouseleave="handleRemoveHover"
      @click="!item.hasOwnProperty('children')&&handleClick(item)">
        <span>{{ item.label }}</span>
        <i v-if="item.hasOwnProperty('children')" class="el-icon-caret-right"></i>
        <child v-if="item.hasOwnProperty('children') && (hoverIndex == index)" :children="item.children" :data="menuData.data" :index="index" :childStyle="style"
        :pWidth="pWidth" :locateX="locateX" :locateY="locateY" @handleClose="handleClose"></child>
      </li>
    </ul>
  </div>
</template>

<script>
import Child from './MenuRightChild'

export default {
  props: ['menuData'],
  components: {
    Child
  },
  data () {
    return {
      hoverIndex: null,
      selfStyle: {},
      locateX: '',
      locateY: '',
      pWidth: 0,
      style: {
        width: 'max-content'
      },
      data: null
    }
  },
  mounted () {
    this.data = this.menuData.data
    document.addEventListener('click', this.hiddenMenu)
  },
  destroyed () {
    document.removeEventListener('click', this.hiddenMenu)
  },
  methods: {
    hiddenMenu (event) {
      if (event.target.className != 'right-menu-ul') {
        this.menuData.show = false
      }
    },
    handleHover (index) {
      if (this.hoverIndex == index) {
        this.hoverIndex = null
      } else {
        this.hoverIndex = index
        this.pWidth = this.$refs.rightMenu.offsetWidth
        this.style = {
          width: 'max-content'
        }
        switch (this.locateY) {
          case 't': this.$set(this.style, 'top', 36 * index + 'px')
          break
          case 'b': this.$set(this.style, 'bottom', 36 * (this.menuData.items.length - index - 1) + 'px')
          break
        }
      }
    },
    handleRemoveHover () {
      this.hoverIndex = null
    },
    handleClick (item) {
      let method = item.method
      if (method) {
        method(this.menuData.data, item.hasOwnProperty('data') ? item.data : null)
      }
    },
    setLocate () {
      this.$nextTick(() => {
        let width = this.$refs.rightMenu.offsetWidth
        let height = this.$refs.rightMenu.offsetHeight
        this.selfStyle = {}
        if (this.menuData.style.x + width > window.innerWidth - (this.menuData.style.maxWidth || 0)) {
          this.$set(this.selfStyle, 'right', window.innerWidth - this.menuData.style.x + 'px')
          this.locateX = 'r'
        } else {
          this.$set(this.selfStyle, 'left', this.menuData.style.x + 'px')
          this.locateX = 'l'
        }
        if (this.menuData.style.y + height > window.innerHeight - (36 * this.menuData.style.maxLength || 0)) {
          this.$set(this.selfStyle, 'bottom', window.innerHeight - this.menuData.style.y + 'px')
          this.locateY = 'b'
        } else {
          this.$set(this.selfStyle, 'top', this.menuData.style.y + 'px')
          this.locateY = 't'
        }
      })
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
.right-menu-pop {
  position: absolute;

  >ul {
    border: 1px solid rgba($color: $blue, $alpha: .7);
    border-radius: 4px;
    background-color: rgba(8, 25, 38, 0.93);
    box-shadow: 0 0 30px rgba($color: $blue, $alpha: .4) inset, 0 8px 20px rgba(6, 13, 20, 0.9);
    padding: 0;
    margin: 0;
    list-style-type: none;

    >li {
      color: #fff;
      font-size: 14px;
      padding: 8px 16px;
      cursor: pointer;
      list-style-type: none;
      display: flex;
      align-items: center;
      justify-content: space-between;

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

      &:hover {
        background-color: rgba($color: $blue, $alpha: .4);
        color: #fff;
      }
    }
  }
}
</style>
