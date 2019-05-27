<template>
  <div class="wt-radio">
    <ul>
      <li v-for="(item, index) in dataSource && dataSource.radioOptions" :key="index"  @click='change(item, index, $event)' :class="{'disable': item.disable}">
        <div v-if="showBtn" :class="{'radio is-checked': index === isActive, 'radio':showBtn, 'disable': item.disable}"></div>
        <div class="item-inner">
          <div class="title" :class="{'normal':showBtn}">{{item.value}}</div>
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
      type: Object,
      default: function () {
        return {};
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
    change (item, index, $event) {
      if (item.disable) {
        return;
      }
      this.selected = item;
      this.isActive = index;
      let ret = {...this.dataSource, ...item}
      // if (this.dataSource.hasOwnProperty('method')) {
      //   let method = this.dataSource.method
      //   method(this.dataSource[item.key], param => {
      //     if (param) {
      //       if (Array.isArray(param)) {
      //         param.forEach(item => {
      //           this.$set(this.dataSource, item.key, item.value)
      //         })
      //       } else {
      //         this.$set(this.dataSource, param.key, param.value)
      //       }
      //     }
      //   })
      // }
      this.$emit('change', {ret, $event});
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