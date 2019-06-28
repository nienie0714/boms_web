<template>
  <div class="second-menu">
    <menu-list :data="menuData" :defaults="defaults" @skipPath="skipPath"></menu-list>
    <!-- <tree :data="data" :selected="true" :selectNodeId="selectNodeId" @clickNode="clickNode"></tree> -->
  </div>
</template>

<script>
import MenuList from '@view/MenuList/MenuList'
import { postData } from '@/util/base'
// import Tree from '@view/Tree/Tree'
import _ from 'lodash'

export default {
  components: {
    MenuList,
    // Tree
  },
  props: {
    menuData: {
      type: Array,
      default: ()=>[]
    }
  },
  data () {
    return {
      defaults: null
    }
  },
  created () {
    // if (this.$route.path == '/config') {
    //   this.menuData = [
    //     {
    //       label: '日志审计管理',
    //       path: 'LogAudit',
    //       disabled: false
    //     },
    //     {
    //       label: '用户管理',
    //       path: 'User',
    //       disabled: false
    //     },
    //     {
    //       label: '角色管理',
    //       path: 'Role',
    //       disabled: false
    //     },
    //     {
    //       label: '人员管理',
    //       path: 'Employee',
    //       disabled: false
    //     },
    //     {
    //       label: '部门管理',
    //       path: 'Department',
    //       disabled: false
    //     },
    //     {
    //       label: '在线用户查看',
    //       path: 'Online',
    //       disabled: false
    //     }
    //   ]
    // } else {
    //   this.menuData = [
    //     {
    //       label: '航班查询',
    //       path: 'Flights',
    //       disabled: false
    //     },
    //     {
    //       label: '行李查询',
    //       path: 'Luggages',
    //       disabled: false
    //     }
    //   ]
    // }
    if (this.menuData && this.menuData.length > 0) {
      this.defaults = this.menuData[0]
    }
  },
  methods: {
    skipPath (obj) {
      this.$emit('skipPath', obj)
    },
    clickNode (node) {
    }
  }
}
</script>

