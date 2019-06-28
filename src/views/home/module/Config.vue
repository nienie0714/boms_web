<template>
  <div class="config module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img"></div>
      <second-menu @skipPath="skipPath" :menuData="menuData"></second-menu>
      <div class="hidden-button" @click="hidden = !hidden"></div>
    </div>
    <div :class="['body container', ['Department', 'Employee'].includes(name) ? 'tree' : 'cross']">
      <div class="title">
        <div class="icon"></div>
        <div>{{title}}</div>
      </div>
      <component :is="name"></component>
    </div>
  </div>
</template>

<script>
import SecondMenu from '../SecondMenu'
import * as component from '@/views/config'
import { postData } from '@/util/base'

export default {
  components: {
    SecondMenu
  },
  data () {
    return {
      name: '',
      title: '配置管理',
      hidden: false,
      menuData: null
    }
  },
  mounted () {
    console.log('tag', 'mounted')
    this.title = this.$route.name
    this.getSecondMenu()
  },
  methods: {
    getSecondMenu () {
      let data = {
        resourceType: 0,
        url: this.$route.path
      }

      // 获取二级菜单
      postData('sys/sysResource/queryHasSysResource', data).then(response => {
        this.menuData = response.data.data
        this.skipPath(this.menuData[0])
      })
    },
    skipPath (obj) {
      this.name = obj.router
      localStorage.setItem('curPath', obj.router)
      if (this.name) {
        this.title = obj.label
        this.$options.components[this.name] = component[this.name]
      }
    }
  },
  watch: {
    $route (to, from) {
      this.title = to.name
      localStorage.setItem('topMenuActive', to.path)
      if (to.path ==  "/config" && this.menuData == null) {
        this.getSecondMenu()
      }
    },
    menuData: {
      handler (value) {
        if (value == null) {
          this.getSecondMenu()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.config {
  >.header {
    >.module-img {
      background-color: $blue-shadow;
    }
  }
}
</style>
