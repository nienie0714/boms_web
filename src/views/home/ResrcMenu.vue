<template>
  <div class="second-menu">
    <menu-list :menuData="menuData" @skipPath="skipPath"></menu-list>
  </div>
</template>

<script>
import MenuList from '@view/MenuList/MenuList'
import _ from 'lodash'

export default {
  components: {
    MenuList
  },
  data () {
    return {
      menuData: [
        {
          label: '日志审计管理',
          path: 'LogAudit',
          disabled: false
        },
        {
          label: '用户管理',
          path: 'User',
          disabled: false
        },
        {
          label: '角色管理',
          path: 'Role',
          disabled: false
        },
        {
          label: '人员管理',
          path: 'Employee',
          disabled: false
        },
        {
          label: '部门管理',
          path: 'Department',
          disabled: false
        }
      ]
    }
  },
  methods: {
    // skipPath (path) {
    //   let arr = path.split('/')
    // }
    skipPath (obj) {
      this.$emit('skipPath', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.second-menu {
}
</style>
