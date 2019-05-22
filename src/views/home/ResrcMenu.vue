<template>
  <div class="resource-menu">
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
          label: '配置管理',
          disabled: false,
          open: true,
          children: [
            {
              label: '日志审计管理',
              path: '/resource/config/LogAudit',
              disabled: false
            },
            {
              label: '用户管理',
              disabled: false
            },
            {
              label: '角色管理',
              disabled: false
            },
            {
              label: '员工管理',
              disabled: false
            },
            {
              label: '部门管理',
              disabled: false
            }
          ]
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

