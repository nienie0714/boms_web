<template>
  <div class="config module container">
    <div :class="['header', hidden ? 'hidden' : '']">
      <div class="module-img">
        <div class="title">配置管理</div>
        <!-- <div class="sub-title">Config settings</div> -->
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
                  <template v-for="(child,childIndex) in item.children">
                      <el-submenu v-if="child.children&&child.children.length" :index="child.router" :key="childIndex" >
                          <template slot="title">
                              <span>{{child.label}}</span>
                          </template>
                          <el-menu-item v-for="(tchild,tchildIndex) in child.children" :index="tchild.router" :key="tchildIndex">
                              <span slot="title">{{tchild.label}}</span>
                          </el-menu-item>
                      </el-submenu>
                      <el-menu-item v-if="!child.children" :index="child.router" :key="childIndex">
                          <span slot="title">{{child.label}}</span>
                      </el-menu-item>
                  </template>
              </el-submenu>
              <el-menu-item v-if="!item.children" :index="item.router" :key="index">
                  <span slot="title">{{item.label}}</span>
              </el-menu-item>
          </template> 
      </el-menu>     
      <div class="hidden-button" @click="hidden = !hidden"></div>
    </div>
    <div :class="['body container', ['/config/department', '/config/employee'].includes(name) ? 'tree' : 'cross']">
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
// import * as component from '@/views/config'
import { postData } from '@/util/base'

export default {
  components: {
  //  SecondMenu
  },
  data () {
    return {
      name: '',
      title: '配置管理',
      hidden: false,
      menuData: null,
      isShowTitle: true,
      isProcess: true,
      activeMenu: "",
    }
  },
  mounted () {
    this.title = this.$route.name
    this.getSecondMenu()
  },
  methods: {
    menuSelect(index, indexPath) {
      localStorage.setItem('curPath', indexPath[indexPath.length-1])
      this.$router.push(index)
      this.isProcess = index == "/config/protection/processManage/processes" ? false : true
    },
    getSecondMenu () {
      let arr = this.$route.path.split('/')
      if (arr && arr.length > 1) {
        let data = {
          resourceType: 0,
          url: '/' + arr[1]
        }
        // 获取二级菜单
        postData('sys/sysResource/queryHasSysResource', data).then(response => {
          // this.menuData = response.data.data.filter(item => {return item.label != '基础数据维护'});
          // let obj = {append: false, children: null, icon: null, label: "定时任务", path: null, resourceId: "001001008", router: "/config/scheduled" }
          this.menuData = response.data.data
          // this.menuData.push(obj)
          if (arr.length === 2) {
            this.skipPath(this.menuData[0])
          } 
          else {
            this.name = this.$route.path
            this.isProcess = this.name == "/config/protection/processManage/processes" ? false : true
          }
        })
      }
    },
    skipPath (obj) {
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
    $route (to, from) {
      this.title = to.name
      localStorage.setItem('topMenuActive', to.path)
      this.getSecondMenu()
    },
    menuData: {
      handler (value) {
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
  >.header {
    >.module-img {
      // background-color: $blue-shadow;
      background-image: url(~@img/img/img_config.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      flex: 0 0 109px;
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
            // transform: rotateZ(0deg);
            &::before {
                content: "\E791";
            }
        }
        .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow {
          -webkit-transform: rotateZ(90deg);
          transform: rotateZ(90deg);
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
            // background: rgba(51, 146, 255, 0.4);
            background: rgba(97, 112, 128, 0.5);
            span {
                color: #fff;
            }
        }
        .el-menu-item.is-active {
            color: #fff;
            // background: rgba(51, 146, 255, 0.4);
            background: rgba(97, 112, 128, 0.5);
        }
        .el-menu-item:hover {
            color: #fff;
            // background: rgba(51, 146, 255, 0.2); 
            background: rgba(97, 112, 128, 0.3);   
            span {
                color: #fff;
            }
        }
        .el-submenu__title:hover {
            color: #fff;
            // background: rgba(51, 146, 255, 0.4);
            background: rgba(97, 112, 128, 0.5);
            span {
                color: #fff;
            }
        }
        .el-submenu .el-menu-item {
            padding-left: 30px!important;
            &.is-active {
                color: #fff;
                // background: rgba(51, 146, 255, 0.4);
                background: rgba(97, 112, 128, 0.5);
            }
            
        }
        .el-submenu>.el-menu>.el-submenu {
            // padding-left: 14px!important;
            // >div.el-submenu__title {
            //   padding-left: 28px!important;
            // }
        }
        .el-submenu>.el-menu>.el-submenu{
          >.el-submenu__title {
            padding-left: 28px!important;
          }
          >.el-menu .el-menu-item{
            padding-left: 42px!important;
          }
        }
        



      }
}
</style>
