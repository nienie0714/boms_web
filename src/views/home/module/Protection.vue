<template>
  <div class="config module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img">
        <div class="title">保障业务协同管理</div>
        <div class="sub-title">Config settings</div>
      </div>
      <second-menu @skipPath="skipPath" :menuData="menuData"></second-menu>
      <div class="hidden-button" @click="hidden = !hidden"></div>
    </div>
    <div class="body container cross">
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
import * as component from '@/views/protection'
import { postData } from '@/util/base'

export default {
  components: {
    SecondMenu
  },
  data () {
    return {
      name: '',
      title: '业务流程管理',
      hidden: false,
      menuData: null
    }
  },
  mounted () {
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
        // this.menuData = response.data.data
        this.menuData = [
          {
            label: '机位',
            router: 'Stand',
            disabled: false
          },
          {
            label: '值机柜台',
            router: 'Counter',
            disabled: false
          },
          {
            label: '机型',
            router: 'AircraftType',
            disabled: false
          },
          {
            label: '基础数据维护',
            disabled: false,
            open: true,
            children: [
              {
                label: '机位',
                router: 'Stand',
                disabled: false
              },
              {
                label: '机型',
                router: 'AircraftType',
                disabled: false
              },
              {
                label: '值机柜台',
                router: 'Counter',
                disabled: false
              }
            ]
          }]
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
      if (to.path ==  "/protection" && this.menuData == null) {
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
      // background-color: $blue-shadow;
      background-image: url(~@img/img/img_config.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .sub-title {
        margin-left: 16px;
        text-align: left;
      }
    }
  }
}
</style>
