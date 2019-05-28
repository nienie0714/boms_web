<template>
  <div class="comprhs-query module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img"></div>
      <second-menu @skipPath="skipPath"></second-menu>
      <div class="hidden-button" @click="hidden = !hidden"></div>
    </div>
    <div class="body container cross">
      <div class="title">{{title}}</div>
      <component :is="name"></component>
    </div>
  </div>
</template>

<script>
import SecondMenu from '../SecondMenu'
import * as component from '@/views/comprhsQuery'

export default {
  components: {
    SecondMenu
  },
  data () {
    return {
      name: '',
      title: '信息查询',
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
.comprhs-query {
  >.header {
    >.module-img {
      background-color: $blue-shadow;
    }
  }
}
</style>
