<template>
  <div class="second-menu">
    <menu-list :data="menuData" @skipPath="skipPath"></menu-list>
    <!-- <tree :data="data" :selected="true" :selectNodeId="selectNodeId" @clickNode="clickNode"></tree> -->
  </div>
</template>

<script>
import MenuList from '@view/MenuList/MenuList'
// import Tree from '@view/Tree/Tree'
import _ from 'lodash'

export default {
  components: {
    MenuList,
    // Tree
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
              label: '员工管理',
              path: 'Employee',
              disabled: false
            },
            {
              label: '部门管理',
              path: 'Department',
              disabled: false
            },
            {
              label: '测试三级菜单',
              disabled: false,
              open: true,
              children: [
                {
                  label: '日志审计管理',
                  path: 'LogAudit',
                  disabled: false
                }
              ]
            }
          ]
        }
      ],
      data: [
        {
          id: 1,
          label: '节点一'
        },
        {
          id: 2,
          label: '节点二'
        },
        {
          id: 3,
          label: '节点三',
          children: [
            {
              id: 301,
              label: '子节点一'
            },
            {
              id: 302,
              label: '子节点二',
              children: [
                {
                  id: 30201,
                  label: '子节点1',
                  children: [
                    {
                      id: 3020101,
                      label: '子节点1'
                    },
                    {
                      id: 3020102,
                      label: '子节点2'
                    }
                  ]
                },
                {
                  id: 30202,
                  label: '子节点2'
                }
              ]
            },
            {
              id: 303,
              label: '子节点三'
            }
          ]
        },
        {
          id: 4,
          label: '节点四'
        }
      ],
      selectNodeId: []
    }
  },
  mounted () {
    if (this.$route.path == '/config') {
      this.menuData = [
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
          label: '员工管理',
          path: 'Employee',
          disabled: false
        },
        {
          label: '部门管理',
          path: 'Department',
          disabled: false
        },
        {
          label: '测试三级菜单',
          disabled: false,
          open: true,
          children: [
            {
              label: '测试4级菜单',
              disabled: false,
              open: true,
              children: [
                {
                  label: '日志审计管理',
                  path: 'LogAudit',
                  disabled: false
                }
              ]
            }
          ]
        }
      ]
    } else {
      this.menuData = [
        {
          label: '航班查询',
          path: 'Flights',
          disabled: false
        },
        {
          label: '行李查询',
          path: 'Luggages',
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
    },
    clickNode (node) {
      // console.log(node)
    }
  }
}
</script>

