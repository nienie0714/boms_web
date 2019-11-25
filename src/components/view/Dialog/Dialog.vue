<template>
  <div v-if="showDialog" class="dialog-shade">
    <div class="container cross dialog" :position="position" :class="dialogClass"
    :style="`left: ${left}px; top: ${top}px; right: ${right}px; bottom: ${bottom}px; width: ${width}px; ${height ? ('height: ' + height + 'px;') : 'auto'}`">
      <div v-if="header" class="header">
        <slot name="header">
          <div class="title">{{title}}</div>
        </slot>
        <div v-if="close" class="close" @click="closeDialog"><span class="icon iconfont icon-close icon-button"></span></div>
      </div>
      <div class="main container cross">
        <div class="body">
          <slot></slot>
        </div>
        <div v-if="footer" class="footer">
          <slot name="footer" :submit="submit" :closeDialog="closeDialog" :submitDialog="submitDialog">
            <button @click="closeDialog">取 消</button>
            <button v-if="submit" type="primary" @click="submitDialog">确 认</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    close: {
      type: Boolean,
      default: true
    },
    dialogClass: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 640
    },
    height: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    right: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      default: 'right'
    },
    header: {
      type: Boolean,
      default: true
    },
    footer: {
      type: Boolean,
      default: true
    },
    submit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showDialog: false,
    }
  },
  created () {
    this.showDialog = this.visible
  },
  methods: {
    closeDialog () {
      this.showDialog = false
      this.$emit('handleClose')
    },
    submitDialog () {
      this.$emit('submitDialog')
    }
  },
  watch: {
    visible: {
      handler (value) {
        this.showDialog = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-shade {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-sizing: border-box;
  z-index: 2;
}
.dialog {
  position: absolute;
  background-color: #fff;
  box-shadow: 0 0 100px rgba($color: $white-shadow, $alpha: .6);
  border-radius: 12px;
  margin: auto;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 640px;
  $headerH: 72px;
  >.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $headerH;
    line-height: $headerH;
    text-align: left;
    padding: 0 20px;
    >.title {
      font-size: 16px;
      color: rgba(61,66,77,1);
      font-weight: bold;
      margin: 0 auto;
    }
    >.close {
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
        font-size: 20px;
      }
    }
  }
  >.main {
    height: calc(100% - #{$headerH});
    overflow-x: hidden;
    box-sizing: border-box;
    >.body {
      flex-grow: 1;
      height: 100%;
      position: relative;
    }
    >.footer {
      height: 60px;
      flex-grow: 0;
      padding: 0 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      >button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }
}
</style>
