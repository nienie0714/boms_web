<template>
  <div class="home container cross">
    <div class="header container">
      <div class="logo">
        <img :src="require('@img/logo.png')"/>
      </div>
      <drop-menu :menuList="topResource" :activeIndex="activeIndex" @changeActive="changeActive"></drop-menu>
      <div class="user">
        <div class="img">
          <img :src="require('@img/user/img_usr.png')"/>
        </div>
        <div class="name">{{empName?empName:''}}</div>
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
import webSocketMixin from '../../components/mixin/webSocketMixin'
import { postData } from '@/util/base'

export default {
  components: {
    DropMenu,
  },
  data () {
    return {
      empName: '',
      topResource: [
        {
          label: '无权限',
          router: '',
          append: false,
          icon: 'icon_comprhs_query'
        }
      ],
      activeIndex: 0
    }
  },
  mixins: [webSocketMixin],
  mounted () {
    this.empName = localStorage.getItem('empName')
    // 获取顶级菜单
    postData('sys/sysResource/queryHasSysResource', {url: null, resourceType: 0}).then(response => {
      this.topResource = response.data.data
      // this.$router.push({name: '信息共享平台'})
      
      let i = _.findIndex(this.topResource, ['router', localStorage.getItem('topMenuActive')])
      if (i == -1) {
        this.activeIndex = 0
        this.changeActive(0, this.topResource[0]) 
      } else {
        this.activeIndex = i
        let data = {index: i, item: this.topResource[i]}
        this.changeActive(data)
      }
    })
  },
  methods: {
    changeActive ({index, item}) {
      this.activeIndex = index
      if (item && item.hasOwnProperty('router')) {
        this.$router.push(item.router)
      }
    }
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
    // z-index: 2000;
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

