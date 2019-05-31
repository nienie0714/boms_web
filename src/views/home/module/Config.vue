<template>
  <div class="config module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img"></div>
      <second-menu @skipPath="skipPath"></second-menu>
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

export default {
  components: {
    SecondMenu
  },
  data () {
    return {
      name: '',
      title: '配置管理',
      hidden: false
    }
  },
  mounted () {
    this.title = this.$route.name
  },
  methods: {
    skipPath (obj) {
      this.name = obj.path
      if (this.name) {
        this.title = obj.label
        this.$options.components[this.name] = component[this.name]
      }
    }
  },
  watch: {
    $route (to, from) {
      this.title = to.name
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
