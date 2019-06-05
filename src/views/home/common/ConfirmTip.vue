<template>
  <my-dialog v-bind="$attrs" v-on="$listeners" :title="title" :close="close" :height="height" @submitDialog="handleSubmit" @handleClose="handleClose"
  :position="position" class="confirm-dialog">
    <template>
      <div>{{info}}</div>
    </template>
  </my-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    info: {
      type: String,
      default: '确认进行此操作？'
    },
    height: {
      type: Number,
      default: 200
    },
    position: {
      type: String,
      default: 'center'
    },
    data: {
      type: [String, Number, Object],
      default: null
    }
  },
  data () {
    return {
      row: null
    }
  },
  created () {
  },
  methods: {
    handleSubmit () {
      this.$emit('handleSubmit', this.row)
    },
    handleClose () {
      this.$emit('handleClose')
    }
  },
  watch: {
    data: {
      handler (data) {
        this.row = data
      },
      immediate: true
    }
  }
}
</script>
