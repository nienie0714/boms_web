<template>
  <div class="home container cross">
    <div class="header container" v-if="!$store.state.base.ifFullscreen">
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
          <div class="name" :title="empName">{{empName?empName:''}}</div>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="editPass">修改密码</DropdownItem>
            <DropdownItem @click.native="loginOut">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="main" :style="`height: ${$store.state.base.ifFullscreen?'100%':'calc(100% - 80px)'};`">
      <router-view></router-view>
    </div>
    <my-dialog :visible="onlineData.visible" :header="false" :footer="false" :position="'right'" :width="400" class="form-dialog unline-dialog under-head-dialog" @handleClose="handleClose">
      <div class="online-header">
        <div class="online-header_title">
          当前在线用户数
        </div>
        <div class="online-header_body">
          <div>
            <img :src="require('@icon/online/phone.png')">
            <div>{{onlineData.APPNUM}}</div>
          </div>
          <div>
            <img :src="require('@icon/online/mac.png')">
            <div>{{onlineData.WEBNUM}}</div>
          </div>
        </div>
        <div class="query-box">
          <inputs type="text" v-model="filterValue" placeholder="输入关键字搜索" @enter="changeFilter($event)"></inputs>
        </div>
      </div>
      <div class="close" @click="handleClose"><span class="icon iconfont icon-close icon-button"></span></div>
      <div class="online-table-header">
        <div>
          在线用户列表
        </div>
        <div>
          共{{this.tableData.data.length}}条数据
        </div>
      </div>
      <div class="body-second">
        <tables :tableData="tableData" :loading="false">
          <template v-slot:slot-body="{index, row, item}">
            <div v-if="item.key == 'index'">{{ index + 1 }}</div>
            <template v-if="item.key=='machine'">
              <div class="img-label">
                <img v-if="row['machine'] == 1" :src="require('@icon/online/phone.png')">
                <img v-if="row['webMachine'] == 1" :src="require('@icon/online/mac.png')">
              </div>
            </template>
          </template>
        </tables>
      </div>
    </my-dialog>

    <!-- 修改密码 -->
    <my-dialog :visible="passVisible" title="修改密码" position="center" :footer="false" :height="330" :width="360" class="td-popover dialog-passForm" @handleClose="closePass('passForm')">
      <div class="td-popover-body">
          <el-form :model="passForm" ref="passForm" :rules="passRules">
            <el-form-item prop="oldPass">
                <el-input type="password" v-model.trim="passForm.oldPass" auto-complete="off" placeholder="原密码" maxlength="20" @keydown.enter.native="updatePass('passForm')"></el-input>
            </el-form-item>
            <el-form-item prop="newPass">
                <el-input type="password" v-model.trim="passForm.newPass" auto-complete="off" placeholder="新密码" maxlength="20" @keydown.enter.native="updatePass('passForm')"></el-input>
            </el-form-item>
            <el-form-item prop="surepass">
                <el-input type="password" v-model.trim="passForm.surepass" auto-complete="off" placeholder="请再次输入新密码" maxlength="20" @keydown.enter.native="updatePass('passForm')"></el-input>
            </el-form-item>
          </el-form>
        <el-footer>
          <div class="footer-all">
            <button type="info" @click="closePass('passForm')">取消</button>
            <button type="primary" @click="updatePass('passForm')">确定</button>
          </div>
        </el-footer>
      </div>
    </my-dialog>

    <!-- 全屏显示按钮 -->
    <div class="toggleScreen-button" v-if="!($route.path =='/config/protection/safeguardFlight' || $route.path =='/config/protection/processManage/processes')" :class="$store.state.base.ifFullscreen?'active':''" @click="toggleFullscreen" :style="`top: ${!$store.state.base.ifFullscreen?'100px':'20px'};`">
      <div class="icon" ></div>
      <div class="label" >{{!$store.state.base.ifFullscreen?'全屏显示':'退出全屏'}}</div>
    </div>

    <!-- 消息悬浮窗按钮 -->
    <div class="message-button" v-if="!($route.path =='/config/protection/safeguardFlight' || $route.path =='/config/protection/processManage/processes')"  @click="setMessViewDisplay" :style="`top: ${!$store.state.base.ifFullscreen?'100px':'20px'};`">
      <div class="icon" ></div>
      <div class="text">
          <div class="label" v-if="!$store.state.event.isUnread">暂无新消息</div>
          <el-carousel v-else height="20px" direction="vertical" :autoplay="true" indicator-position="none" >
            <el-carousel-item v-for="item in $store.state.event.isUnreadList" :key="item.msgId">
              <template>
                <div class="text-list">
                  <div class="label" :title="item.textBody.msgText">{{item.textBody.msgText}}</div>
                  <div class="time">{{item.textBody.msgPublishTime.substr(11, 5)}}</div>
                </div>
              </template>
            </el-carousel-item>
          </el-carousel>
      </div>
      <div class="red-dotted" v-if="$store.state.event.isUnread">{{$store.state.event.isUnreadNum > 99?'99+': $store.state.event.isUnreadNum}}</div> 
    </div>

    <!-- 消息悬浮窗 -->
    <MessView v-if="!($route.path =='/config/protection/safeguardFlight' || $route.path =='/config/protection/processManage/processes')"></MessView>
  </div>
</template>

<script>
import DropMenu from '@view/DropMenu/DropMenu'
// import webSocketMixin from '../../components/mixin/webSocketMixin'
import { postData, queryAll } from '@/util/base'
import QueryRow from '@view/QueryRow/QueryRow'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import Inputs from '@view/Inputs/Inputs'
import MessView from '../home/common/MessView'

export default {
  components: {
    DropMenu,
    Tables,
    // QueryRow
    Inputs,
    MessView
  },
  mixins: [tableMixin],
  data () {
    //密码校验
    const checkOldPass = (rule, value, callback) => {
      if(!value){
		    return callback(new Error('必填'));
	    }
      // let reg = /^[a-zA-Z]{1,}|(\d{1,})|(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{1,}$/;
      this.passForm.oldPass = value.replace(/\s/g,'');
      let v = value.replace(/\s/g,'');
      let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
			if(!reg.test(v)) {
        callback(new Error('密码8~20位字母、数字、特殊符号任两种或三种的组合'));
			} else {
				callback();
			}
    };
    //新密码校验
    const checkNewPass = (rule, value, callback) => {
      if(!value){
        return callback(new Error('必填'));
      }
      this.passForm.newPass = value.replace(/\s/g,'');
      let v = value.replace(/\s/g,'');
      let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
      if(!reg.test(v)) {
        callback(new Error('密码8~20位字母、数字、特殊符号任两种或三种的组合'));
       
      } else if(v == this.passForm.oldPass){
        callback(new Error('新旧密码不允许相同'));
      } else {
        callback();
      }
    };
        //确认密码校验
		let validatePass = (rule, value, callback) => {
			if(!value){
				return callback(new Error('必填'));
			}
			if(value != this.passForm.newPass) {
				callback(new Error('两次输入密码不一致'));
			} else {
				callback();
			}
		};
    return {
      onceTimer: null,
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
        APPNUM: 0,
        WEBNUM: 0
      },
      queryType: 'nopage',
      // 请求路径
      queryUrl: '/online/userOnline/queryOnlineUser',
      heartTimer: null,
      heartUrl: '/online/userOnline/check',
      queryParam: [
        {
          key: 'userName',
          label: '用户名',
          type: 'input',
          width: 214,
          toUpper: true
        }
      ],
      tableData: {
        height: '100%',
        multSelection: [],
        loading: false,
        key: 'userName',
        column: [
          // left
          [
            {key: 'index',  label: '序号', width: 50, type: 'slot'},
            {key: 'userName',  label: '用户名', width: 70, title: true},
            {key: 'empName',  label: '姓名', width: 100, title: true},
            {key: 'machine',  label: '设备', width: 70, type: 'slot'},
            {key: 'mac',  label: 'MAC地址', width: 110, title: true}
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
      filterValue: null,
      passForm: {
        oldPass: '',
        newPass: '',
        surepass: '',
      },
      passRules: {
        oldPass: [
          {required: true, message: '必填', trigger: 'blur'},
        ],
        newPass: [
          {required: true, validator: checkNewPass, trigger: 'blur'}
        ],
        surepass: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ]
      },
      passVisible: false,
    }
  },
  // mixins: [webSocketMixin],
  mounted () {
    this.$store.commit('messViewChange');

    this.heartTimer = clearInterval(this.heartTimer)
    this.empName = localStorage.getItem('empName')

    this.getTopMenu()

    this.heartBeat()
    this.heartTimer = setInterval(this.heartBeat, 60000)
    this.$once('hook:beforeDestroy', () => {
      this.heartTimer = clearInterval(this.heartTimer)
    })

  },
  methods: {
    // 获取顶级菜单
    getTopMenu() {
      postData('sys/sysResource/queryHasSysResource', {url: null, resourceType: 0}).then(response => {
        // this.topResource = response.data.data.filter(item => {return item.label != '综合运行监控'})
        this.topResource = response.data.data;
        let arr = this.$route.path.split('/')
        if (arr && arr.length == 2) {
          if (arr[1] == 'home') {
            let j = _.findIndex(this.topResource, ['router', '/comprhsQuery'])
            if(j=='-1'){
              this.activeIndex = 0
              this.changeActive({index: 0, item: this.topResource[0]})
            }else {
              this.activeIndex = j
              this.changeActive({index: j, item: this.topResource[j]})
            }
          }
        } else if (arr && arr.length == 3) {
          // 二级菜单
          let j = _.findIndex(this.topResource, ['router', '/' + arr[1]])
          this.activeIndex = j
        }
        // let i = _.findIndex(this.topResource, ['router', localStorage.getItem('topMenuActive')])
        // if (i == -1) {
        //   let j = _.findIndex(this.topResource, ['router', '/comprhsQuery'])
        //   this.activeIndex = j
        //   this.changeActive({index: j, item: this.topResource[j]})
        // } else {
        //   this.activeIndex = i
        //   let data = {index: i, item: this.topResource[i]}
        //   this.changeActive(data)
        // }
      })
    },
    // 一级菜单路由切换
    changeActive ({index, item}) {
      // console.log('changeActive--------', index,item)
      this.activeIndex = index
      if(item.children){
        this.$router.push(item.children[0].router)
      }else {
        this.$router.push(item.router)
      } 
    },
    // 修改密码
    editPass() {
      this.passVisible = true;
    },
    closePass(formName) {
      this.passVisible = false;
      this.$refs[formName].resetFields();
    },
    updatePass(formName) { 
        this.$refs[formName].validate((valid) => {
        if(valid) {
          let params = {
            password: this.passForm.oldPass,
            newPassword: this.passForm.newPass,
          }
          queryAll('/sys/sysUser/updatePassword', params).then(res => {
              if (res.data.code == 0 ) {
                this.$msg.success({
                  info: '密码修改成功!',
                })
                this.$router.push({path: '/'})
              } else {
                this.$msg.error({
                  info: res.data.msg,
                  tip: '请重新尝试'
                })
              }
          }).catch(err => {
              this.$msg.error({
                  info: '请求异常 !',
                  tip: err
              })
          })
        } else {
          return false;
        }
      });
      
      
    },
    loginOut() {
      this.$router.push('/')
    },
    // 用户在线列表
    getOnlineUser() {
      this.filterValue = null
      this.queryDataReq()
      this.queryDataNum()
      this.onlineData.visible = true
    },
    // 用户在线数量
    queryDataNum() {
      postData('/online/userOnline/queryOnlineNum', {}).then(res => {
        this.onlineData.APPNUM = res.data.data.APPNUM || 0
        this.onlineData.WEBNUM = res.data.data.WEBNUM || 0
      })
    },
    customQueryBefore () {
      this.$set(this.queryData, 'userName', this.filterValue)
    },
    changeFilter(value) {
      this.filterValue = value
      this.queryDataReq()
      this.queryDataNum()
    },
    handleClose() {
      this.onlineData.visible = false
    },
    // 心跳监测
    heartBeat() {
      let data = {
        mac: null,
        userName: localStorage.getItem('username'),
        machine: 1
      }
      postData(this.heartUrl, data).then(response => {
        if(response.data.code == -1) {
          this.$router.push('/')
        }
      })
    },
    toggleFullscreen() {
      this.$store.state.base.ifFullscreen = !this.$store.state.base.ifFullscreen;
    },
    setMessViewDisplay () {
      this.$store.commit('messViewChange',true);
    }

  },
  destroyed () {
    clearInterval(this.onceTimer)
  },
  watch: {
    'onlineData.visible': {
      handler (val) {
        if(val) {
          this.onceTimer = setInterval(()=>{
            this.queryDataReq()
            this.queryDataNum()
          }, 3 * 1000)
        } else {
          clearInterval(this.onceTimer)  
        }
      },
      deep: true      
    },
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  position: relative;
  >div {
    // width: 100vw;
    width: 100%;
  }
  >.header {
    height: 80px;
    background: linear-gradient(to right, #696BFF, #50b9f0);
    box-shadow: 0 0 40px rgba($color: $blue-shadow, $alpha: .5);
    justify-content: space-between;
    // z-index: 2000;
    >.logo {
      margin: 18px 0 0 20px;
    }
    >.user {
      /*width: 220px;*/
      display: flex;
      align-items: center;
      padding: 0 20px 0 30px;
      background-image: url(~@img/header/bg_usr_center.png);
      .onlineUser {
        width: 24px;
        height: 24px;
        background-image: url(~@img/header/icon_online_user.png);
        margin-right: 32px;
        cursor: pointer;
      }
      .img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
      }
      .name {
        width: calc(100% - 50px);
        max-width: 48px;
        margin-left: 14px;
        color: #fff;
        font-size: 16px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        cursor: pointer;
      }
    }
  }
  >.main {
    height: calc(100% - 80px);
    padding: 20px;
    background-color: #edf1f5;
  }
  .unline-dialog {
    z-index: 30;
  }
  .form-dialog {
    /deep/.container.cross.dialog {
      overflow: hidden;
    }
    >.main {
      height: 100%!important;
    }
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
    /deep/.body-second {
      height: calc(100% - 220px);
      // overflow: hidden;
      >div {
        height: 100%!important;
        >.table-body {
          overflow-x: hidden;
          .left-table {
            overflow-y: auto;
          }
        }
      }
    }
    .close {
      $wh: 20px;
      $tr: 12px;
      position: absolute;
      height: $wh;
      width: $wh;
      top: $tr;
      right: $tr;
      display: flex;
      align-items: center;
      >.icon {
        font-weight: 900;
        font-size: 20px;
      }
    }
    .img-label {
      height: 48px;
      line-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        margin-right: 0px;
      }
    }
  }
  .toggleScreen-button {
    position: absolute;
    width: 112px;
    height: 38px;
    background-color: #fff;
    box-shadow:0px 5px 20px 0px rgba(99,126,153,0.25);
    border-radius: 19px;
    right: 20px;
    top: 100px;
    font-size: 14px;
    cursor: pointer;
    display: inline-flex;
    padding: 9px 12px;
    >.icon {
      width: 20px;
      height: 20px;
      background-image: url(~@icon/icon_home_fullscreen.png);
    }
    >.label {
      margin-left: 6px;
      color: #899DB2;
    }
    &.active {
      background-color: #F75467;
      >.icon {
        background-image: url(~@icon/icon_home_quitfullscreen.png);  
      }
      >.label {
        color: #fff;
      }
    }
  }
  .message-button {
    position: absolute;
    width: 320px;
    height: 38px;
    background-color: #fff;
    box-shadow:0px 5px 20px 0px rgba(99,126,153,0.25);
    border-radius: 19px;
    right: 152px;
    top: 100px;
    font-size: 14px;
    cursor: pointer;
    display: inline-flex;
    padding: 9px 12px;
    z-index: 1;
    >.icon {
      width: 20px;
      height: 20px;
      background-image: url(~@icon/icon_message_bell.png);
    }
    >.text {
      width: 275px;
      margin-left: 10px;
      position: relative;
      text-align: left;
      overflow: hidden;
      .text-list {
        position: relative;  
        >.label {
          width: 225px;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #3D424D;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
        }
        >.time {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 14px;
          color: #899DB2;
        }  
      }
      
    }
    
    .red-dotted {
      position: absolute;
      top: -9px;
      right: -8px;
      height: 24px;
      min-width: 24px;
      line-height: 24px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      padding: 0 5px;
      background: rgba(247, 84, 103, 1);
      border-radius: 12px;
    }
  }
}
.dialog-passForm {
  background-color: rgba(0, 0, 0, 0.4);
  /deep/.dialog {
    margin: auto;
  }
  .td-popover-body {
    padding: 0 30px;
    .el-form-item {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 30px;
      }
      /deep/.el-form-item__error {
        color: #f75467;
        font-size: 10px;
        white-space: nowrap;
        left: 50%;
        transform: translateX(-50%);
      }
      
    }
    /deep/.el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus {
      border-color: rgba(247, 84, 103, 0.8);
      box-shadow: 0 0 0 2px rgba(247, 84, 103, 0.3);
    }
  }
  .footer-all {
    button {
      padding: 8px 36px;
      &:last-child{
        margin-left: 10px;
      }
    }
  }

}

</style>
<style lang="scss">
.query-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .inputs > input {
    border: 1px solid #dde6ed;
    border-radius: 6px;
    width: 368px!important;
    background-color: #F1F5F8;
    &::-webkit-input-placeholder {
      text-align: left;
    }
  }
}
.home {
  .dialog {
    >.main {
      height: 100%!important;
    }
  }
}
</style>
