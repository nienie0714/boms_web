<template>
  <div class="container drop-menu">
    <div v-for="(menu, index) in menuList"  :key="index" :class="['menu container cross', getStyle(menu.router)]" @click="changeActive(index, menu)">
      <!-- <template v-if="menu.resourceId !='001003'"> -->
        <template>
        <div class="img">
          <img :src="require('@icon/dropmenu/' + menu.icon + '.png')"/>
        </div>
        <div class="label">{{menu.label}}<i v-if="menu.hasOwnProperty('child')" class="iconfont icon-down"></i></div>
        <template v-if="menu.hasOwnProperty('child')">
          <div class="menu-ul">
            <router-link v-for="(child, c) in menu.child" :key="c" :to="child.router" :append="child.append" class="menu-li" @click="changeActive(index)">{{child.label}}</router-link>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      menuList: {
        type: Array,
        default: ()=>[]
      },
      activeIndex: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        isDisable:false,
        menuLists: [
          {
            label: '信息查询',
            router: '/comprhsQuery',
            append: false,
            icon: 'icon_comprhs_query'
          },
          {
            label: '',
            router: '/config',
            append: false,
            icon: 'icon_config'
          }
        ]
      }
    },
    created () {
      // this.isDisable=this.
    },
    methods: {
      getStyle(router){
        if(this.$route.path.includes(router)){
          return 'active'
        }
      },
      changeActive (index, item) {
        if (item.label == '综合运行监控') {
          window.open(window.location.origin + '/#/operationMonitor',item.label)
        } else if(item.label == '态势分析'){
          window.open(window.location.origin + '/#/situtation',item.label)
        } else {
           this.$emit('changeActive', {index, item})
        }
       
        // this.activeIndex = index
        // if (item && item.hasOwnProperty('router')) {
        //   this.$router.push(item.router)
        // }
      }
    },
    watch: {
      // $route (to, from) {
      //   this.activeIndex = _.findIndex(this.menuList, ['router', to.path])
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .drop-menu {
    height: 100%;
    .menu:not(:first-child) {
      margin-left: 20px;
    }
    .menu {
      width: 140px;
      position: relative;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      cursor: pointer;
      &:hover {
        background-image: url(~@img/header/bg_menu_selected.png);
      }
      &.active {
        background-image: url(~@img/header/bg_menu_selected.png);
      }
      >.img {
        width: 40px;
        height: 40px;
      }
      >.label {
        font-size: 14px;
        padding: 0px 12px;
        >i {
          margin-left: 8px;
        }
      }
      a {
        text-decoration: none;
        color: #fff;
        display: block;
        margin: auto;
      }
      .menu-ul {
        display: none;
        flex-direction: column;
        position: absolute;
        border: 1px solid rgba($color: $blue, $alpha: .7);
        border-radius: 4px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        >div:not(:last-of-type) {
          border-bottom: 1px solid rgba($color: $blue, $alpha: .4);
        }
        >.menu-li {
          padding: 5px 12px;
          color: #fff;
          text-decoration: none;
          cursor: pointer;
          background-color: #2c3e50;
          &:hover {
            background-color: rgba($color: $blue, $alpha: 1);
          }
        }
      }
      &:hover>.menu-ul {
        display: flex;
      }
    }
  }
</style>
