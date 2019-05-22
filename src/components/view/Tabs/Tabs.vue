<template>
  <div class="tabs-parent">
    <div class="tabs">
      <div v-for="(item, idx) in tabsData" :key="item.key" :class="['tab-item', index==idx?'current-item':'']" @click="tabItemClick(idx, item.key)">
        <div>
          <div class="icon" v-if="item.icon">
            <img :src="require('@icon/' + item.icon + (index==idx?'_blue':'_gray') + '.png')"/>
          </div>{{item.label}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tabsData', 'defaultKey'],
  data () {
    return {
      index: 0
    }
  },
  methods: {
    tabItemClick (idx, key) {
      this.index = idx
      this.$emit('tabItemClick', key)
    }
  },
  watch: {
    defaultKey: {
      handler (value) {
        if (value) {
          this.tabsData.forEach((item, idx) => {
            if (item.key == value) {
              this.index = idx
            }
          })
        }
      },
      immediate: true
    }
  }
}
</script>


<style lang="scss" scoped>
.tabs-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  .tabs {
    display: flex;
    background-color: #fff;
    border-radius: 60px/50px;
    overflow: hidden;
    box-shadow: 0 0 40px rgba($color: $black-shadow, $alpha: .3);
    .tab-item {
      color: $gray-rd;
      cursor: pointer;
      &.current-item {
        color: #3392ff;
      }
      &:hover {
        color: #3392ff;
      }
      &:not(:last-child)>div {
        border-right: 1px solid $gray-rs;
      }
      >div {
        margin: 8px 0;
        padding: 0 24px;
        display: flex;
      }
      .icon {
        margin-right: 12px;
      }
    }
  }
}
</style>

