<template>
  <div class="right-menu-pop" :ref="'rightMenuChild' + index" :style="childStyle">
    <ul class="right-menu-ul">
      <li v-for="(child, idx) in children" :key="idx" :class="child.disabled ? 'disabled' : ''" @mouseenter.stop="handleHover(idx)" @mouseleave.stop="handleRemoveHover"
      @click.stop="!child.hasOwnProperty('children')&&handleClick(child)">
        <span>{{ child.label }}</span>
        <i v-if="child.hasOwnProperty('children')" class="el-icon-caret-right"></i>
        <child v-if="child.hasOwnProperty('children') && (hoverIndex == idx)" :children="child.children" :data="data" :childStyle="style"
        :pWidth="width" :locateX="locateX" :locateY="locateY" @handleClose="handleClose"></child>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'child',
  props: ['children', 'data', 'index', 'childStyle', 'pWidth', 'locateX', 'locateY'],
  data () {
    return {
      hoverIndex: null,
      width: 0,
      style: {
        width: 'max-content'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let width = this.$refs['rightMenuChild' + this.index].offsetWidth
      switch (this.locateX) {
        case 'l': this.$set(this.childStyle, 'left', this.pWidth + 'px')
        break
        case 'r': this.$set(this.childStyle, 'left', 0 - width + 'px')
        break
      }
    })
  },
  methods: {
    handleHover (index) {
      if (this.hoverIndex == index) {
        this.hoverIndex = null
      } else {
        this.hoverIndex = index
        this.width = this.$refs['rightMenuChild' + this.index].offsetWidth
        switch (this.locateY) {
          case 't': this.$set(this.style, 'top', 36 * index + 'px')
          break
          case 'b': this.$set(this.style, 'bottom', 36 * (this.children.length - index - 1) + 'px')
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
        method(this.data, item.hasOwnProperty('data') ? item.data : null)
        this.$emit('handleClose')
      }
    },
    handleClose () {
      this.$emit('handleClose')
    }
  }
}
</script>
