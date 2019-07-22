<template>
  <div class="config module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img">
        <div class="title">保障业务协同管理</div>
        <div class="sub-title">Collaboration</div>
      </div>
      <second-menu @skipPath="skipPath" :menuData="menuData"></second-menu>
      <div class="hidden-button" @click="hidden = !hidden"></div>
    </div>
    <div class="body container cross">
      <div class="title">
        <div class="icon"></div>
        <div>{{title}}</div>
      </div>
      <router-view />
      <!-- <component :is="name"></component> -->
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
      let arr = this.$route.path.split('/')
      if (arr && arr.length > 1) {
        let data = {
          resourceType: 0,
          url: '/' + arr[1]
        }
        // 获取二级菜单
        postData('sys/sysResource/queryHasSysResource', data).then(response => {
          let onlyBasicArr = []
          let data = _.find(response.data.data, {router: 'BasicData'})
          onlyBasicArr.push(data)
          // 只保留基础数据模块，流程模块隐藏
          this.menuData = onlyBasicArr
          // 默认打开可看到三级菜单
          this.menuData[0].open
          this.$set(this.menuData[0], 'open', true)
          if (arr.length === 2) {
            // 无三级菜单
            if (this.menuData[0].hasOwnProperty('children') && this.menuData[0].children) {
              this.skipPath(this.menuData[0].children[0])
            } else {
              this.skipPath(this.menuData[0])
            }
          } else if (arr.length === 3) {
            // 三级
            this.name = this.$route.path
            // }
          }
        })
      }
    },
    skipPath (obj) {
      this.name = obj.router
      localStorage.setItem('curPath', obj.router)
      if (this.name) {
        this.title = obj.label
        this.$router.push(this.name)
        // this.$options.components[this.name] = component[this.name]
      }
    }
  },
  watch: {
    $route (to, from) {
      this.title = to.name
      localStorage.setItem('topMenuActive', to.path)
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
