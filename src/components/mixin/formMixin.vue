<script>
import { insert, update } from '@/util/base'
export default {
  data () {
    return {
      baseUrl: '',
      insertUrl: '',
      updateUrl: '',
      deleteUrl: ''
    }
  },
  mounted () {
    if (!this.insertUrl) {
      this.insertUrl = this.baseUrl
    }
    if (!this.updateUrl) {
      this.updateUrl = this.baseUrl
    }
    if (!this.deleteUrl) {
      this.deleteUrl = this.baseUrl
    }
  },
  methods: {
    handleSubmit ({data, type}) {
      data = this.submitBefore(data, type)
      if (data) {
        switch (type) {
          case 'insert': this.insert(data)
          break
          case 'update': this.update(data)
          break
        }
      }
    },
    insert (data) {
      insert(this.insertUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$msg.success({
            info: '保存成功 !'
          })
          this.handleClose()
          if (this.hasOwnProperty('queryDataReq')) {
            this.queryDataReq()
          }
        } else {
          this.$msg.error({
            info: '保存失败 !'
          })
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !'
        })
        console.log(err)
      })
    },
    update (data) {
      update(this.updateUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$msg.success({
            info: '保存成功 !'
          })
          this.handleClose()
          if (this.hasOwnProperty('queryDataReq')) {
            this.queryDataReq()
          }
        } else {
          this.$msg.error({
            info: '保存失败 !'
          })
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !'
        })
        console.log(err)
      })
    },
    submitBefore (data, type) { return data },
    handleClose () {
      this.detail.visible = false
    }
  }
}
</script>
