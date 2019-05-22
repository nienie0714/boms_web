<template>
  <transition name="message">
    <div :class="['message container', type]" v-show="show">
      <div class="img"></div>
      <div class="font container cross">
        <div class="info">{{info}}</div>
        <div v-if="type!='success'" class="tip">{{tip}}</div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'success'
    },
    time: {
      type: Number,
      default: 3
    },
    info: {
      type: String,
      default: '请求失败'
    },
    tip: {
      type: String,
      default: '请重新尝试'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  created () {

  }
}
</script>

<style lang="scss" scoped>
.message {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 0 30px;
  border-radius: 12px;
  background-image: url(~@img/msg/bg_toast.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-shadow: 0 10px 30px rgba($color: $black-shadow, $alpha: .3);
  justify-content: center;
  align-items: center;
  width: fit-content;
  min-width: 200px;
  height: fit-content;
  .img {
    width: 48px;
    height: 48px;
    margin: 22px 20px 22px 0;
  }
}
.message:hover {
  opacity: 1;
}
.message-enter, .message-leave-to {
  opacity: 0;
}
.message-enter-active, .message-leave-active {
  transition: opacity 1s;
}
.success {
  .img {
    background-image: url(~@img/msg/icon_theme_right.png);
  }
}
.error {
  .img {
    background-image: url(~@img/msg/icon_theme_error.png);
  }
}
.info {
  $h: 18px;
  height: $h;
  line-height: $h;
  font-size: $h;
  color: #fff;
}
.tip {
  margin: 10px 0 0 0;
  $h: 14px;
  height: $h;
  line-height: $h;
  font-size: $h;
  color: #ccd2d9;
}
</style>

