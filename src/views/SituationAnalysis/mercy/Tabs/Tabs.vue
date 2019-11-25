<template>
  <div class="tabs-parent">
    <div class="tabs">
      <div v-for="(item, idx) in tabsData" :key="item.key" :class="['tab-item', index==idx?'current-item':'']" @click="tabItemClick(idx, item.key)">
        <div>
          <div class="icon" v-if="item.icon">
            <img :src="require('@icon/' + item.icon  + '.png')" width="15px"/>
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
  height: 100%;
  .tabs {
    display: flex;
    height: 100%;
    background-color: rgba(0,0,0,0.2);
    border-radius: 17px;
    overflow: hidden;
    box-shadow: 0px 0px 20px 0px rgba(51,170,255,0.6);;
    .tab-item {
      color: #fff;
      cursor: pointer;
      opacity:0.6;
      &.current-item {
        height: 30px;
        color: rgba(255, 255, 255, 1) !important;
        opacity:1;
      }
      &:hover {
        color: #fff!important;
      }
      &:not(:last-child)>div {
        border-right: 1px solid $gray-rs;
      }
      >div {
        margin: 5px 0;
        padding: 0 15px;
        display: flex;
      }
      .icon {
        margin-right: 9px;
        margin-top: 3px;
      }
    }
  }
}
</style>

