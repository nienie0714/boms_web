<template>
  <div class="config module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img">
        <div class="title">保障协同管理</div>
        <!-- <div class="sub-title">Collaboration</div> -->
      </div>
      <!-- <second-menu @skipPath="skipPath" :menuData="menuData"></second-menu> -->
      <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          text-color="#a3b6cc"
          @select="menuSelect"
          route>   
          <template v-for="(item,index) in menuData">
              <el-submenu :index="item.router" v-if="item.children&&item.children.length" :key="index">
                  <template slot="title">
                      <span>{{item.label}}</span>
                  </template>
                  <el-menu-item v-for="(child,childIndex) in item.children" :index="child.router" :key="childIndex">
                      <span>{{child.label}}</span>
                  </el-menu-item>
              </el-submenu>
              <el-menu-item v-if="!item.children" :index="item.router" :key="index">
                  <span slot="title">{{item.label}}</span>
              </el-menu-item>
          </template> 
      </el-menu>

      <div class="hidden-button" @click="hidden = !hidden" style="z-index:99"></div>
    </div>
    <div class="body container cross" style="{isProcess ? {margin-left:0}:'',}">
      <div class="title" v-if="isProcess">
        <div class="icon"></div>
        <div>{{title}}</div>
      </div>
      <router-view />
      <!-- <component :is="name"></component> -->
    </div>
  </div>
</template>

<script>
// import SecondMenu from '../SecondMenu'
import * as component from '@/views/protection'
import { postData } from '@/util/base'

export default {
  components: {
    // SecondMenu
  },
  data() {
    return {
      name: '',
      title: '业务流程管理',
      hidden: false,
      menuData: null,
      isShowTitle: true,
      isProcess: true,
      activeMenu: "",
    }
  },
  mounted() {
    this.title = this.$route.name
    this.getSecondMenu()
  },
  methods: {
    menuSelect(index, indexPath) {
      localStorage.setItem('curPath', index)
      this.$router.push(index)
      this.isProcess = index == "/protection/processManage/processes" ? false : true
    },
    getSecondMenu() {
      let arr = this.$route.path.split('/')
      this.isProcess = arr && arr.length == 4 && arr[3] == "processes" ? false : true
      if (arr && arr.length > 1) {
        let data = {
          resourceType: 0,
          url: '/' + arr[1]
        }
        // 获取二级菜单
        postData('sys/sysResource/queryHasSysResource', data).then(response => {
          // this.menuData = response.data.data.filter(item => {return item.label != '消息管理'});
          this.menuData = response.data.data;
          if (arr.length === 2) {
            this.skipPath(this.menuData[0])
          }
        })
      }
    },
    skipPath(obj) {
      this.name = obj.router
      localStorage.setItem('curPath', obj.router)
      if (this.name) {
        this.title = obj.label
        this.$router.push(this.name)
        // this.$options.components[this.name] = component[this.name]
      }
    }
  },
  watch: {
    $route(to, from) {
      this.title = to.name
      this.isProcess = this.title == "流程关系管理" ? false : true
      localStorage.setItem('topMenuActive', to.path)
      this.getSecondMenu()
      // this.title = this.$route.name
    },
    menuData: {
      handler(value) {
        if (value == null) {
          this.getSecondMenu()
        }
      },
      immediate: true
    },
    hidden:{
      handler(value){
        if(document.getElementById("add-menu")){
          if(value) {
           document.getElementById("add-menu").style.width = '100%'
          }else {
            document.getElementById("add-menu").style.width = 'calc(100% - 218px)'
          }
        }
        if(document.getElementById("flight-menu")){
          if(value) {
           document.getElementById("flight-menu").style.width = '100%'
          }else {
            document.getElementById("flight-menu").style.width = 'calc(100% - 218px)'
          }
        }
      }
    },
    '$store.state.base.ifFullscreen'(val) {
      this.hidden = val;
    }
  }
}
</script>

<style lang="scss" scoped>
.config {
  > .header {
    > .module-img {
      // background-color: $blue-shadow;
      background-image: url(~@img/img/img_config.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .sub-title {
        margin-left: 16px;
        text-align: left;
      }
    }
  }
  /deep/.el-menu {
    background: transparent;
  }
  /deep/.el-menu-vertical-demo {
        flex: 1;
        border-right: none;
        background: transparent;
        overflow: auto;
        .el-submenu__icon-arrow {
            right: auto;
            color: #a3b6cc;
            font-size: 14px;
            transform: rotateZ(0deg);
            &::before {
                content: "\E791";
            }
        }
        .el-menu-item, .el-submenu__title {
            height: 37px;
            line-height: 37px;
            text-align: left;
            padding: 0 16px!important;
            min-width: 160px;
            border-radius: 4px;
        }
        
        .el-menu-item:focus {
            color: #fff;
            background: rgba(97, 112, 128, 0.5);
            span {
                color: #fff;
            }
        }
        .el-menu-item.is-active {
            color: #fff;
            background: rgba(97, 112, 128, 0.5);
        }
        .el-menu-item:hover {
            color: #fff;
            background: rgba(97, 112, 128, 0.3)  
            span {
                color: #fff;
            }
        }
        .el-submenu__title:hover {
            color: #fff;
            background: rgba(97, 112, 128, 0.5);
            span {
                color: #fff;
            }
        }
        .el-submenu .el-menu-item {
            padding-left: 30px!important;
            &.is-active {
                color: #fff;
                background: rgba(97, 112, 128, 0.5);
            }
        }
        .el-submenu>.el-menu>.el-submenu {
            padding-left: 14px!important;
        }
        
  }
}
</style>
