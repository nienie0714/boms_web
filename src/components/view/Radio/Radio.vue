<template>
  <div class="wt-radio">
    <ul>
      <li v-for="(item, index) in dataSource" :key="index"  @click='handle(item, index)' :class="{'disable': item.disable}">
        <div v-if="showBtn" :class="{'radio is-checked': index === isActive, 'radio':showBtn, 'disable': item.disable}"></div>
        <div class="item-inner">
          <div class="title" :class="{'normal':showBtn}">{{item.title}}</div>
        </div>
        <div v-if="!showBtn" :class="{'radio is-checked': index === isActive}"></div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'wt-radio-group',
  props: {
    dataSource: {
      type: Array,
      default: function () {
        return [];
      }
    },
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isActive: '',
      selected: null
    };
  },
  methods: {
    handle (item, index) {
      if (item.disable) {
        return;
      }
      this.selected = item;
      this.isActive = index;
      this.$emit('handle', item, index);
    }
  }
};
</script>
<style scoped lang="scss">
.wt-radio {
  height: 38px;
  ul {
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    display: flex;
    justify-content: space-around;
    li {
      box-sizing: border-box;
      position: relative;
      text-align: left;
      font-size: 14px;
      display: flex;
      align-items: center;
      &.disable {
        background: #f6f6f6;
      }
      .item-inner {
          width: 100%;
          box-sizing: border-box;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding-left: 8px;
          // &::after {
          //   transform: scaleY(.5);
          //   height: 1px;
          //   content: '';
          //   border-bottom: 1px solid #ccc;
          //   display: block;
          // }
          .title {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            overflow: hidden;
            -webkit-box-orient: vertical;
            white-space: normal;
            margin: 2px;
            padding-right: 2px;
            &.normal {
              padding-right: 0;
            }
          }
          .subtitle {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            overflow: hidden;
            -webkit-box-orient: vertical;
            white-space: normal;
            color: #999;
            font-size: 0.7rem;
            margin: 0.2rem;
            padding-right: 2rem;
            &.normal {
              padding-right: 0;
            }
          }
        }
        .radio {
          &.disable {
            background: #eee;
            cursor: not-allowed;
          }
        }
    }
  }
}
</style>