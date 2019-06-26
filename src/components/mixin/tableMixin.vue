<script>
import { postData, pageQuery, nopageQuery, remove, download } from '@/util/base'
import _ from 'lodash'

export default {
  data () {
    return {
      baseUrl: '',
      // 请求路径
      queryUrl: '',
      // 下载路径
      exportUrl: '',
      // 请求的查询参数
      queryData: {},
      pageData: {
        num: 1,
        size: 10,
        total: 0
      },
      detail: {
        visible: false,
        type: 'insert',
        data: null
      },
      remove: {
        visible: false,
        data: null
      },
      axiosArr: [],
      loading: false
    }
  },
  created () {
    if (!this.queryUrl) {
      this.queryUrl = this.baseUrl + '/pageQuery'
    }
    if (!this.exportUrl || this.exportUrl == '') {
      this.exportUrl = this.baseUrl + '/exportExcel'
    }
  },
  mounted () {
    this.tableData.loading = false
    let table = document.getElementsByClassName('table')[0]
    if (table) {
      this.$nextTick(() => {
        // this.queryDataReq()
        this.changeTableHeight(table)
      })
      window.onresize = () => {
        this.$nextTick(() => {
          return (() => {
            this.changeTableHeight(table)
          })()
        })
      }
    }
  },
  methods: {
    changeTableHeight(table) {
      this.tableData.height = window.innerHeight - table.getBoundingClientRect().top - 36
    },
    // 获取查询参数
    getQueryData (arr) {
      var data = {}
      if (arr) {
        arr.forEach(item => {
          if (item.value === '') {
            this.$set(data, item.key, null)
          } else {
            this.$set(data, item.key, item.value)
          }
        })
        this.queryData = data
        return data
      } else {
        this.queryParam.forEach(item => {
          if (item.value === '') {
            this.$set(data, item.key, null)
          } else {
            if (item.hasOwnProperty('key1') && item.hasOwnProperty('key2')) {
              this.$set(data, item.key1, item.value[0])
              this.$set(data, item.key2, item.value[1])
            } else {
              this.$set(data, item.key, item.value)
            }
          }
        })
        this.queryData = data
      }
    },
    customQueryBefore () {},
    customAfterQuery () {},
    // 发送查询请求
    queryDataReq (status) {
      // if (!this.loading) {
        this.tableData.loading = true
        if (status != 1) {
          this.getQueryData()
          this.tableData.data = []
        }
        this.customQueryBefore()
        this.axiosArr.push({
          url: this.queryUrl,
          method: 'post',
          data: this.queryData
        })
        this.loading = true
        if (this.queryType == 'nopage') {
          nopageQuery(this.queryUrl, this.queryData).then(response => {
            this.tableData.multSelection = []
            if (response.data.code == 0) {
              this.pageData.total = response.data.data.total
              if (response.data.data.hasOwnProperty('rows')) {
                this.tableData.data = response.data.data.rows
              } else {
                this.tableData.data = response.data.data
              }
              this.customAfterQuery()
              /* this.$msg.success({
                info: '获取列表数据失败 !'
              }) */
            } else {
              this.$msg.error({
                info: '获取列表数据失败 !',
                tip: '请重新尝试 !'
              })
            }
            this.tableData.loading = false
            this.loading = false
          }).catch(() => {
            this.tableData.loading = false
            this.loading = false
          })
        } else {
          if (this.pageData.num > 0) {
            pageQuery(this.queryUrl, this.queryData, this.pageData).then(response => {
              this.tableData.multSelection = []
              if (response.data.code == 0) {
                this.pageData.total = response.data.data.total
                if (response.data.data.hasOwnProperty('rows')) {
                  this.tableData.data = response.data.data.rows
                } else {
                  this.tableData.data = response.data.data
                }
                this.customAfterQuery()
                /* this.$msg.success({
                  info: '获取列表数据失败 !'
                }) */
              } else {
                this.$msg.error({
                  info: '获取列表数据失败 !',
                  tip: '请重新尝试 !'
                })
              }
              this.tableData.loading = false
              this.loading = false
            }).catch(() => {
              this.tableData.loading = false
              this.loading = false
            })
          }
          }
      // }
    },
    openDetail ({type, row}) {
      this.detail.type = type
      this.$set(this.detail, 'data', row || null)
      this.detail.visible = true
    },
    openRemove (row) {
      this.remove.data = row
      this.remove.visible = true
    },
    getRemove (row) {
      let data = []
      if (row) {
        data.push(this.tableData.key ? row[this.tableData.key] : row)
      } else {
        let arr = this.tableData.key ? _.map(this.tableData.multSelection, this.tableData.key) : this.tableData.multSelection
        data.splice(0, 0, ...arr)
      }
      return data
    },
    handleRemove (row) {
      let data = {
        ids: this.getRemove(row)
      }
      remove(this.removeUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$msg.success({
            info: '删除成功 !'
          })
          this.handleRemoveClose()
          if (this.hasOwnProperty('queryDataReq')) {
            this.queryDataReq()
          }
        } else {
          this.$msg.error({
            info: '删除失败 !',
            tip: res.data.msg
          })
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !'
        })
      })
    },
    handleRemoveClose () {
      this.remove.visible = false
    },
    // 下载
    openExport (total) {
      if (!_.isEmpty(total)) {
        if (total) {
          download(this.exportUrl, this.queryData, total).then(response => {
            this.$msg.success({
              info: '导出成功 !'
            })
            // this.downFile(response, this.fileName)
            this.downFile(response, '导出')
          })
        } else {
          this.$msg.error({
            info: '导出失败，当前导出结果为空 !'
          })
        }
      } else {
        let sum = this.pageData ? this.pageData.total : 1
        if (sum) {
          download(this.exportUrl, this.queryData, sum).then(response => {
            this.$msg.success({
              info: '导出成功 !'
            })
            // this.downFile(response, this.fileName)
            this.downFile(response, '导出')
          })
        } else {
          this.$msg.error({
            info: '导出失败，当前导出结果为空 !'
          })
        }
      }
    },
    // Blob文件转换下载
    downFile (result, fileName, fileType) {
      var data = result.data
      let type
      if (fileType) {
        type = fileType
      } else {
        type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
      var blob = new Blob([data], { type: type })
      var objectUrl = URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', objectUrl)
      a.setAttribute('download', fileName)
      a.click()
      URL.revokeObjectURL(objectUrl)
    }
  },
  destroyed () {
    this.axiosArr.forEach(ever => {
      this.removePending(ever)
    })
    this.axiosArr = []
  }
}
</script>
