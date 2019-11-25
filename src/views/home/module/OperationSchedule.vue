<template>
    <div class="opertion-query module container">
        <div :class="['header', hidden ? 'hidden' : '']">
            <div class="module-img">
                <div class="title">运行调度</div>
                <!-- <div class="sub-title">Operation Scheduling</div> -->
            </div>
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
            <div class="hidden-button" @click="hidden = !hidden"></div>
        </div>
        <div class="body container cross" style="position: relative;">
            <div class="title">
                <div class="icon"></div>
                <div>{{title}}</div>
            </div>
            <router-view />
        <!-- <component :is="name"></component> -->
        </div>
    </div>
</template>

<script>
import * as component from '@/views/comprhsQuery'
import { postData } from '@/util/base'

export default {
    computed: {

    },
    data () {
        return {
            name: '',
            title: '',
            hidden: false,
            value: '',
            menuData: null,
            activeMenu: "",
        }
    },
    mounted () {
        this.title = this.$route.name
        this.getSecondMenu();
        // this.$emit('select')
    },
    methods: {
        menuSelect(index, indexPath) {
            localStorage.setItem('curPath', index)
            this.$router.push(index)
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
                    // response.data.data = [
                    //     {append: false,icon: null,label: "任务排班",path: null,resourceId: "001007001",router: "/operationSchedule/taskSchedule",
                    //         children: [
                    //             {append: false,children: null,icon: "icon_config",label: "班组信息管理",path: null,resourceId: "001007001001",router: "/operationSchedule/taskSchedule/teamManagement"},
                    //             {append: false,children: null,icon: "icon_config",label: "排班模板管理",path: null,resourceId: "001007001002",router: "/operationSchedule/taskSchedule/scheduleTemplate"},
                    //             {append: false,children: null,icon: "icon_config",label: "分拣排班管理",path: null,resourceId: "001007001003",router: "/operationSchedule/taskSchedule/sortSchedule"},
                    //             {append: false,children: null,icon: "icon_config",label: "装卸排班查询",path: null,resourceId: "001007001004",router: "/operationSchedule/taskSchedule/loadSchedule"},
                    //             {append: false,children: null,icon: "icon_config",label: "状态监控",path: null,resourceId: "001007001005",router: "/operationSchedule/taskSchedule/statusMonitor"}
                    //         ]
                    //     }
                    // ]
                    this.menuData = response.data.data
                    if (arr.length === 2) {
                        this.skipPath(this.menuData[0])
                    }
                })
            }
        },
        skipPath (obj) {
            this.name = obj.router;
            localStorage.setItem('curPath', obj.router);
            if (this.name) {
                this.title = obj.label;
                this.$router.push(this.name);
                this.$options.components[this.name] = component[this.name];
            }
        }
    },
  watch: {
    menuData: {
        handler (value) {
            if (value == null) {
                this.getSecondMenu()
            }
        },
        immediate: true
    },
    '$route': {
        handler (value) {
            let arr = value.path.split('/')
            if (arr && arr.length > 1) {
                this.getSecondMenu()
                this.title = this.$route.name;  
            } 
        },
        immediate: true
    },
    '$store.state.base.ifFullscreen'(val) {
      this.hidden = val;
    }
  }
}
</script>

<style lang="scss" scoped>
.opertion-query {
  >.header {
    >.module-img {
      background-image: url(~@img/img/img_comprhs.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  /deep/.el-menu {
        border-right: none;
        background: transparent;
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
        
        .el-menu-item:focus, {
            color: #fff;
            background: rgba(51, 146, 255, 0.4);
            span {
                color: #fff;
            }
        }
        .el-menu-item.is-active {
            color: #fff;
            background: rgba(51, 146, 255, 0.4);
        }
        .el-menu-item:hover {
            color: #fff;
            background: rgba(97, 112, 128, 0.3);    
            span {
                color: #fff;
            }
        }
        .el-submenu__title:hover {
            color: #fff;
            background: rgba(51, 146, 255, 0.4);
            span {
                color: #fff;
            }
        }
        .el-menu-item {
            padding-left: 30px!important;
            &.is-active {
                color: #fff;
                background: rgba(51, 146, 255, 0.4);
            }
        }
        
  }
}
</style>
