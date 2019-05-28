<template>
  <div class="container drop-menu">
    <div v-for="(menu, index) in menuList" :key="index" :class="['menu container cross', activeIndex==index?'active':'']" @click="changeActive(index, menu)">
      <div class="img">
        <img :src="require('@icon/dropmenu/' + menu.icon + '.png')"/>
      </div>
      <div class="label">{{menu.label}}<i v-if="menu.hasOwnProperty('child')" class="iconfont icon-down"></i></div>
      <template v-if="menu.hasOwnProperty('child')">
        <div class="menu-ul">
          <router-link v-for="(child, c) in menu.child" :key="c" :to="child.router" :append="child.append" class="menu-li" @click="changeActive(index)">{{child.label}}</router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      menuList: [
        // {
        //   label: '综合查询',
        //   child: [
        //     {
        //       label: '航班信息查询',
        //       router: '/home/flight',
        //       append: false
        //     },
        //     {
        //       label: '行李信息查询',
        //       router: '/home/luggage',
        //       append: false
        //     }
        //   ],
        //   icon: 'icon_menu_sch'
        // },
        {
          label: '信息共享平台',
          router: '/comprhsQuery',
          append: false,
          icon: 'icon_comprhs_query'
        },
        // {
        //   label: '行李信息查询',
        //   router: '/luggage',
        //   append: false,
        //   icon: 'icon_luggage_info'
        // },
        {
          label: '配置管理',
          router: '/config',
          append: false,
          icon: 'icon_config'
        }
      ],
      activeIndex: 0
    }
  },
  // mounted () {
  //   this.activeIndex = _.findIndex(this.menuList, ['router', this.$route.path])
  // },
  methods: {
    changeActive (index, item) {
      this.activeIndex = index
      if (item && item.hasOwnProperty('router')) {
        this.$router.push(item.router)
      }
    }
  },
  watch: {
    $route (to, from) {
      this.activeIndex = _.findIndex(this.menuList, ['router', to.path])
    }
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
    &.active {
      background-image: url(~@img/header/bg_menu_selected.png);
    }
    >.img {
      width: 30px;
      height: 30px;
    }
    >.label {
      padding: 5px 12px;
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
