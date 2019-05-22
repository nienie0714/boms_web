<template>
  <div class="resource container">
    <div class="header">
      <resrc-menu @skipPath="skipPath"></resrc-menu>
    </div>
    <div class="body container cross">
      <div class="title">{{title}}</div>
      <component :is="name"></component >
      <!-- <router-view/> -->
      <!-- <loader-auto :component="component" :path="path"></loader-auto> -->
    </div>
  </div>
</template>

<script>
import ResrcMenu from './ResrcMenu'
import Vue from 'vue'
import LogAudit from '@/views/resource/config/LogAudit'

export default {
  components: {
    ResrcMenu,
    LogAudit
  },
  data () {
    return {
      name: '',
      path: '',
      title: '信息查询'
    }
  },
  mounted () {
    this.title = this.$route.name
  },
  methods: {
    skipPath (obj) {
      let p = 'resource/config/LogAudit'
      let arr = obj.path.split('/')
      this.name = arr[arr.length - 1]
      if (obj.path) {
        this.title = obj.label
        this.$options.components[this.name] = () => ({
          // 需要加载的组件 (应该是一个 `Promise` 对象)
          component: import(`@/views/resource/config/LogAudit`),
          // 展示加载时组件的延时时间。默认值是 200 (毫秒)
          delay: 200,
          // 如果提供了超时时间且组件加载也超时了，
          // 则使用加载失败时使用的组件。默认值是：`Infinity`
          timeout: 3000
        })
        // this.$options.components[this.name] = require.ensure([], function (require) {
        //   require(`@/views/resource/config/LogAudit`)
        // })
      }
      // this.registerComponent(this.name, this.path)
      // const route = {path: path, component: module.default}
      // /*添加路由信息*/
      // this.$router.options.routes.push(route)
      // this.$router.addRoutes([route])
      // // this.Component = Vue.extend(arr[arr.length - 1])
      // // new Component().$mount('')
      // // this.registerComponent(this.path).then((Component) => {
      // //     new Component({el: this.component})
      // // })
    },
    registerComponent (name, path) {
      // let p = 'resource/config/LogAudit'
      // return () => import(`@/views/${p}`) // .then(component => { // () => import(`@/views/${path}.vue`) // 
      //   const constructor = Vue.extend(component.default)
      //   const instance = new constructor()
        
      //   // 监听抛出的数据  this.$emit("emitStream", {  data: "data" });
      //   instance.$on('emitStream', params => {
      //     //  params 为组件内部抛出的数据
      //   })

      //   // 挂载到 ID 为 plateContainer 的DOM元素
      //   instance.$mount('#' + name)
      //   // console.log(templateName + " 加载成功");
      // })
    },
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
    >.header {
    }
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
