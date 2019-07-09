<template>
  <div class="login container cross">
    <div class="header">
      <img :src="require('@img/login/xianyang_airport_logo.png')">
    </div>
    <div class="login-card container cross">
      <div class="card-icon"></div>
      <div class="content">
        <div class="title">行李运行管理平台</div>
        <div class="title-tip">用户登录</div>
        <div class="info">
          <input v-model.trim="userName" placeholder="请输入用户名" @blur="getPasswordByUsername" @keyup.enter="login"/>
          <input v-model.trim="password" :type="type" placeholder="请输入密码" @focus="type='text'" @blur="type='password'" @keyup.enter="login"/>
        </div>
        <div class="validator">
          <input v-model.trim="image" type="text" placeholder="请输入验证码" @keyup.enter="login"/>
          <a href="javascript:;" class="verification-code" @click="changeCodeImg()"><img id="image" :src="imageUrl" /></a>
        </div>
        <div class="remember">
          <div>
            <div :class="remember?'radio is-checked':'radio'" @click="remember = !remember"></div>
          </div>
          <div>记住密码</div>
        </div>
        <div :class="['button', loading?'load':'']" @click="login()">
          <div :style="loading?'visibility: hidden;':''">登 录</div>
        </div>
        <div class="footer">如忘记密码请联系管理员</div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryAll, getQueryAll } from '@/util/base'
import Vue from 'vue'
export default {
  data () {
    return {
      loginUrl: 'auth',
      imageUrl: '/createImage',
      remember: false,
      userName: '',
      password: '',
      image: '',
      vsCode: '',
      type: 'password',
      loading: false,
      uuid: ''
    }
  },
  mounted () {
    localStorage.setItem('token', '')
    localStorage.setItem('username', '')
    window.name = this.$route.name
    this.changeCodeImg()
  },
  methods: {
    getPasswordByUsername () {
      let password = localStorage.getItem(this.userName)
      if (password) {
        this.password = password
      }
    },
    login () {
      if (this.userName && this.userName != '') {
        if (this.password == '') {
          this.$msg.error({
            info: '请输入密码'
          })
          return
        }
        if (this.image == '') {
          this.$msg.error({
            info: '请输入验证码'
          })
          return
        }
        if (this.remember) {
          localStorage.setItem(this.userName, this.password)
        }
        let data = {
          username: this.userName,
          password: this.password,
          image: this.image,
          uuid: this.uuid
        }
        // postData
        queryAll(this.loginUrl, data).then(res => {
          if (res.data.code == 0) {
            localStorage.setItem('token', res.data.data.token ? res.data.data.token : '')
            localStorage.setItem('empName', res.data.data.empName ? res.data.data.empName : '')
            localStorage.setItem('empId', res.data.data.empId ? res.data.data.empId : '')
            localStorage.setItem('username', this.userName)
            this.uuid = ''
            this.$router.push('/home')
          } else if (res.data.code == -1) {
            this.$msg.error({
              info: '登录失败',
              tip: res.data.msg
            })
          } else if (res.data.code == -2) {
            // 验证码超时，自动刷新
            this.changeCodeImg()
            this.$msg.error({
              info: '登录失败',
              tip: res.data.msg
            })
          } else {
            this.$msg.error({
              info: '登录失败',
              tip: '请求失败，请检查网络 !'
            })
          }
        })
      } else {
        this.$msg.error({
          info: '登录失败',
          tip: '请输入用户名'
        })
      }
    },
    changeCodeImg() {
      this.uuid = this.getUUID()
      var vue = new Vue({})
      vue.axios.get(this.imageUrl, {
        params: {
          uuid: this.uuid,
        },
        responseType: 'arraybuffer'
      }).then(response => {
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(response.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      }).then(data => {
        document.getElementById('image').src = data
      })
    },
    getUUID() {
      return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
  }
}
</script>


<style lang="scss" scoped>
.login {
  height: 100%;
  width: 100%;
  background-image: url(~@img/login/bg_login.jpg);
  background-size: cover;
  position: relative;
  .header {
    height: 80px;
    width: 300px;
    margin: 30px 0 0 40px;
  }
  .login-card {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 12px;
    width: 360px;
    height: 486px;
    background-color: #fff;
    align-items: center;
    .card-icon {
      $wh: 140px;
      // position: absolute;
      // left: 0;
      // right: 0;
      // margin: auto;
      border-radius: 50%;
      // top: -$wh/2;
      width: $wh;
      height: $wh;
      margin-top: -$wh/2;
      background-image: url(~@img/login/icon_login.png);
      box-shadow: 0 20px 30px rgba($color: $black-shadow, $alpha: .2);
    }
    .content {
      margin: 24px 30px 0 30px;
      height: auto;
      .title {
        color: $blue;
        $h: 20px;
        font-size: $h;
        line-height: $h;
        height: $h;
      }
      .title-tip {
        margin-top: 16px;
        $h: 14px;
        font-size: $h;
        line-height: $h;
        height: $h;
        color: $gray-nd;
      }
      .info {
        margin-top: 24px;
        input {
          border: 1px solid $gray-rs;
          height: 42px;
          width: 300px;
          &:hover, &:focus {
            border-color: rgba(51, 146, 255, 0.8);
          }
        }
        input:last-child {
          margin-top: 20px;
        }
      }
      .validator {
        margin-top: 20px;
        display: flex;
        input {
          border: 1px solid $gray-rs;
          height: 42px;
          width: 229px;
          margin-right: 5px;
          &:hover, &:focus {
            border-color: rgba(51, 146, 255, 0.8);
          }
        }
      }
      .remember {
        height: 54px;
        display: flex;
        align-items: center;
        >div:first-child {
          height: 18px;
        }
        >div:last-child {
          margin-left: 12px;
          $h: 14px;
          font-size: $h;
          line-height: $h;
          height: $h;
          color: $gray-nd;
        }
      }
      .button {
        cursor: pointer;
        height: 42px;
        width: 100%;
        box-shadow: 0 5px 20px rgba(50, 146, 255, .4);
        background: linear-gradient(to right, #5e73ff, #4ab1f3);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        &.load:before {
          content: '';
          background-image: url(~@img/load/btn_loading.png);
          background-position: center;
          background-size: cover;
          position: absolute;
          left: calc(50% - 11px);
          $whc: 22px;
          width: $whc;
          height: $whc;
          animation-fill-mode: both;
          animation: rotate 1.5s 0s linear infinite;
        }
        >div {
          $h: 16px;
          font-size: $h;
          line-height: $h;
          height: $h;
          color: #fff;
        }
      }
      .footer {
        margin-top: 20px;
        $h: 14px;
        font-size: $h;
        line-height: $h;
        height: $h;
        color: $gray-nd;
      }
    }
  }
}
</style>

