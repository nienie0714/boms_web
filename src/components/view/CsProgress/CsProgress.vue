<template>
  <div class="progress">
    <div :style="`width: calc(100% * ${progress}); background: ${bgColor}`"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#7a939e'
    }
  },
  data () {
    return {
      progress: 0,
      bgColor: ''
    }
  },
  watch: {
    value: {
      handler (value) {
        this.progress = value
      },
      immediate: true
    },
    color: {
      handler (value) {
        this.bgColor = value
      },
      immediate: true
    }
  }
}
</script>


<style lang="scss" scoped>
.progress {
  position: absolute;
  left: 10%;
  top: calc(50% - 8px);
  width: 80%;
  height: 12px;
  background-color: rgba(167,185,200,0.3);
  border-radius: 8%/50%;
  overflow: hidden;

  >div {
    height: 100%;
    width: 0%;
    // background-color: rgba($color: $blue, $alpha: 0.6);
  }
}
</style>
