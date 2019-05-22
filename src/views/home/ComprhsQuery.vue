<template>
  <div class="comprhs-query container cross">
    <div class="body container cross">
      <div class="title">{{title}}</div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '信息查询'
    }
  },
  mounted () {
    this.title = this.$route.name
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
  >.body {
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
