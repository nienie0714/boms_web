<template>
  <div class="home container cross">
    <div class="header container">
      <div class="logo">
        <img :src="require('@img/logo.png')"/>
      </div>
      <drop-menu :menuList="topResource" :activeIndex="activeIndex" @changeActive="changeActive"></drop-menu>
      <!-- <div class="user">
        <div class="img">
          <img :src="require('@img/user/img_usr.png')"/>
        </div>
        <div class="name">{{empName?empName:''}}</div>
      </div> -->
      <div class="user">
        <div class="onlineUser" @click="getOnlineUser"></div>
        <Dropdown trigger="click">
          <div class="img">
            <img :src="require('@img/user/img_usr.png')"/>
          </div>
          <div class="name">{{empName?empName:''}}</div>
          <DropdownMenu slot="list">
              <DropdownItem @click.native="loginOut">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- <online-list :visible="onlineDetail.visible" :data="onlineDetail.data"></online-list> -->
    <my-dialog v-bind="$attrs" v-on="$listeners" :visible="onlineData.visible" :title="onlineData.title" :close="true" :header="false" :submit="false"
    :position="'right'" :width="400" class="form-dialog under-head-dialog" @handleClose="handleClose">
      <div class="online-header">
        <div class="online-header_title">
          当前在线用户数
        </div>
        <div class="online-header_body">
          <div>
            <img :src="require('@icon/online/phone.png')">
            <div>36</div>
          </div>
          <div>
            <img :src="require('@icon/online/mac.png')">
            <div>8</div>
          </div>
        </div>
        <div class="query-box">
          <inputs type="text" v-model="filterValue" placeholder="输入关键字搜索" @change="changeFilter($event)" @enter="changeFilter($event)"></inputs>
        </div>
      </div>
      <div class="online-table-header">
        <div>
          在线用户列表
        </div>
        <div>
          共89条数据
        </div>
      </div>
      <div class="table-cont container cross">
        <tables :tableData="tableData" :loading="tableData.loading">
          <template v-slot:slot-body="{index, row, item}">
            <template v-if="item.key=='seatNo'">
              <img v-if="row['seatNo'] == '34A'" :src="require('@icon/online/phone.png')">
              <img v-else :src="require('@icon/online/mac.png')">
              <span class="value">{{row['psgNameCh']}}</span>
            </template>
          </template>
        </tables>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import DropMenu from '@view/DropMenu/DropMenu'
// import webSocketMixin from '../../components/mixin/webSocketMixin'
import { postData } from '@/util/base'
import QueryRow from '@view/QueryRow/QueryRow'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import Inputs from '@view/Inputs/Inputs'

export default {
  components: {
    DropMenu,
    Tables,
    // QueryRow
    Inputs
  },
  mixins: [tableMixin],
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
      activeIndex: 0,
      onlineData: {
        visible: false,
        title: '当前在线用户数',
      },
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/integrated/luggage/queryAll',
      queryParam: [
        {
          key: 'flightNo',
          label: '航班号',
          type: 'input',
          width: 214,
          toUpper: true
        }
      ],
      tableData: {
        height: 600,
        multSelection: [],
        loading: false,
        key: 'lugId',
        column: [
          // left
          [
            {key: 'lugNo',  label: '行李编号', width: 100, colClass: 'bold-underline', title: true},
            {key: 'flightNo',  label: '航班号', width: 100, title: true},
            {key: 'seatNo',  label: '旅客座位号', width: 200, title: true, type: 'slot'}
          ],
          // center
          [
          ],
          // right
          [
          ]
        ],
        data: []
      },
      filterValue: ''
    }
  },
  // mixins: [webSocketMixin],
  mounted () {
    this.empName = localStorage.getItem('empName')
    // 获取顶级菜单
    postData('sys/sysResource/queryHasSysResource', {url: null, resourceType: 0}).then(response => {
      this.topResource = response.data.data
      // this.$router.push({name: '信息共享平台'})
      
      let i = _.findIndex(this.topResource, ['router', localStorage.getItem('topMenuActive')])
      if (i == -1) {
        let j = _.findIndex(this.topResource, ['router', '/comprhsQuery'])
        this.activeIndex = j
        this.changeActive({index: j, item: this.topResource[j]})
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
    },
    loginOut() {
      this.$router.push('/')
    },
    getOnlineUser() {
      // todo
      this.queryDataReq()
      this.onlineData.visible = true
    },
    handleClose() {
      this.onlineData.visible = false
    },
    changeFilter(value) {
      debugger
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
      width: 178px;
      display: flex;
      align-items: center;
      padding: 0 20px 0 30px;
      background-image: url(~@img/header/bg_usr_center.png);
      .onlineUser {
        width: 20px;
        height: 20px;
        background-color: #f00;
        margin-right: 10px;
      }
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
        font-size: 16px;
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
  // .dialog {
  //   .main {
  //     height: 100%!important;
  //     overflow-x: hidden;
  //     overflow-y: scroll; 
  //     box-sizing: border-box;
  //   } 
  // } 
  .form-dialog {
    .online-header {
      height: 150px;
      background-image: url(~@icon/online/online-header.png);
      display: flex;
      flex-direction: column;
      padding: 0 16px;
      margin-bottom: 30px;
      .online-header_title {
        height: 56px;
        line-height: 56px;
        text-align: left;
        font-size:16px;
        font-weight:400;
        color:rgba(137,157,178,1);
      }
      .online-header_body {
        display: flex;
        margin-bottom: 20px;
        >div {
          height: 30px;
          display: flex;
          align-items: center;
          &:nth-child(1) {
            margin-right: 26px;
          }
          img {
            margin-right: 8px;
          }
          >div {
            font-size:32px;
            font-weight:bold;
            color:rgba(61,66,77,1);
          }
        }
      }
      .query-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .inputs > input {
          border: 1px solid #dde6ed;
          border-radius: 6px;
          width: 100%;
          background-color: rgba(241,245,248,1);
          width: 368px!important;
          &::-webkit-input-placeholder {
            text-align: left;
          }
        }
      }
    }
    .online-table-header {
      display: flex;
      padding: 0 16px;
      >div:first-child {
        font-size:16px;
        font-weight:bold;
        color:#3D424D;
        margin-right: 5px;
      }
      >div:last-child {
        font-size:16px;
        color:#899DB2;
      }
    }
    td {
      height: 52px !important;
      display: flex!important;
      .type {
        width: 10%;
        margin-right: 16px;
        img {
          vertical-align:middle;
        }
      }
      img {
        vertical-align:middle;
        margin-right: 16px;
      }
      .value {
        flex: 1;
      }
    }
  }
}
</style>

