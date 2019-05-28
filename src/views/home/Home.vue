<template>
  <div class="home container cross">
    <div class="header container">
      <div class="logo">
        <img :src="require('@img/logo.png')"/>
      </div>
      <drop-menu></drop-menu>
      <div class="user">
        <div class="img">
          <img :src="require('@img/user/img_usr.png')"/>
        </div>
        <div class="name"></div>
      </div>
    </div>
    <div class="main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import DropMenu from '@view/DropMenu/DropMenu'

export default {
  components: {
    DropMenu,
  },
  mounted () {
    this.$router.push({name: '信息共享平台'})
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  >div {
    width: 100vw;
  }
  >.header {
    height: 80px;
    background: linear-gradient(to right, #696BFF, #50b9f0);
    box-shadow: 0 0 40px rgba($color: $blue-shadow, $alpha: .5);
    justify-content: space-between;
    z-index: 9999;
    >.logo {
      margin: 15px 0 0 20px;
    }
    >.user {
      width: 130px;
      display: flex;
      align-items: center;
      padding: 0 20px 0 30px;
      background-image: url(~@img/header/bg_usr_center.png);
      .img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
      }
      .name {
        width: calc(100% - 50px);
        margin-left: 14px;
        color: #fff;
        font-size: 14px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }
  }
  >.main {
    height: calc(100% - 80px);
    padding: 20px;
    background-color: #edf1f5;
  }
}
</style>

