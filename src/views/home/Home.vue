<template>
  <div class="home container cross">
    <div class="header container">
      <div class="logo">
        <img :src="require('@img/logo.png')"/>
      </div>
      <drop-menu :menuList="menuList"></drop-menu>
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

export default {
  components: {
    DropMenu,
  },
  data () {
    return {
      empName: '',
      topResource: [],
      menuList: [
        {
          label: '信息共享平台',
          router: '/comprhsQuery',
          append: false,
          icon: 'icon_comprhs_query'
        },
        {
          label: '配置管理',
          router: '/config',
          append: false,
          icon: 'icon_config'
        }
      ],
      activeIndex: 0
    }
  },
  mixins: [webSocketMixin],
  mounted () {
    this.$router.push({name: '信息共享平台'})
    this.empName = localStorage.getItem('empName')
    // postData('basicdata/sysUser/queryTopResource', {}).then(response => {
    //   this.topResource = response.data.data
    // })
    // {"code":0,"msg":"success","data":[{"resourceId":"c5d07c0c4c5e4d29b1106895c54f4f1","name":"指挥监控","url":"dynamicmap","icon":"card-commond","resourceType":1,"status":"Y","sortkey":1,"pid":null,"parentIds":null,"parentName":null},{"resourceId":"3610d459a68f41c3bb05279ef6ad150","name":"基础数据","url":"/basicdata","icon":"card-basic","resourceType":1,"status":"Y","sortkey":4,"pid":null,"parentIds":null,"parentName":null}]}
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

