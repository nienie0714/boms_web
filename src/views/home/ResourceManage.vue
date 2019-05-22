<template>
  <div class="resource container">
    <div class="header">
      <resrc-menu @skipPath="skipPath"></resrc-menu>
    </div>
    <div class="body container cross">
      <div class="title">{{title}}</div>
      <component :is="name"></component >
    </div>
  </div>
</template>

<script>
import ResrcMenu from './ResrcMenu'
import Vue from 'vue'
import * as component from '@/views/resource'

export default {
  components: {
    ResrcMenu
  },
  data () {
    return {
      name: '',
      title: '信息查询'
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
$menuW: 200px;
.resource {
  >.header {
    width: $menuW - 20px;
    margin-right: 20px;
  }

  >.body {
    width: calc(100% - #{$menuW});
    >.title {
      height: 50px;
      color: $gray-st;
      line-height: 50px;
      font-size: 20px;
      text-align: left;
    }
  }
}
</style>
