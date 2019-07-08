<template>
  <div class="comprhs-query module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img">
        <div class="title">信息共享平台</div>
        <div class="sub-title">Information platform</div>
      </div>
      <second-menu @skipPath="skipPath" :menuData="menuData"></second-menu>
      <div class="hidden-button" @click="hidden = !hidden"></div>
    </div>
    <div class="body container cross">
      <div class="title">
        <div class="icon"></div>
        <div>{{title}}</div>
      </div>
      <!-- <input-tag v-model="value" :prepend="'测试'" :type="'inputlist'" :options="options" :id="'key'" :label="'label'"></input-tag>{{value}} -->
      <component :is="name"></component>
    </div>
  </div>
</template>

<script>
import InputTag from '@view/InputTag/InputTag'
import SecondMenu from '../SecondMenu'
import * as component from '@/views/comprhsQuery'
import { postData } from '@/util/base'

export default {
  components: {
    SecondMenu,
    InputTag
  },
  data () {
    return {
      name: '',
      title: '信息共享平台',
      hidden: false,
      value: '',
      menuData: null,
      options: [
        {
          key: 'XIY',
          label: '西安'
        },
        {
          key: 'INC',
          label: '银川'
        },
        {
          key: 'XNN',
          label: '西宁'
        }
      ]
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
      if (to.path ==  "/comprhsQuery" && this.menuData == null) {
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
.comprhs-query {
  >.header {
    >.module-img {
      background-image: url(~@img/img/img_comprhs.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
