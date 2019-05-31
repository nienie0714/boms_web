<template>
  <div class="comprhs-query module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img"></div>
      <second-menu @skipPath="skipPath"></second-menu>
      <div class="hidden-button" @click="hidden = !hidden"></div>
    </div>
    <div class="body container cross">
      <div class="title">
        <div class="icon"></div>
        <div>{{title}}</div>
      </div>
      <input-tag v-model="value" :prepend="'测试'" :type="'inputlist'" :options="options" :id="'key'" :label="'label'"></input-tag>{{value}}
      <component :is="name"></component>
    </div>
  </div>
</template>

<script>
import InputTag from '@view/InputTag/InputTag'
import SecondMenu from '../SecondMenu'
import * as component from '@/views/comprhsQuery'

export default {
  components: {
    SecondMenu,
    InputTag
  },
  data () {
    return {
      name: '',
      title: '信息查询',
      hidden: false,
      value: '',
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
