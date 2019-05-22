<script>
import { postData } from '@/util/base'

export default {
  data () {
    return {
      // 请求路径
      queryUrl: '',
      // 请求的查询参数
      queryData: {},
      axiosArr: [],
      loading: false
    }
  },
  created () {
    this.queryDataReq()
  },
  mounted () {
    let table = document.getElementsByClassName('table')[0]
    if (table) {
      this.$nextTick(() => {
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
      this.tableData.height = window.innerHeight - table.getBoundingClientRect().top - 20
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
            this.$set(data, item.key, item.value)
          }
        })
        this.queryData = data
      }
    },
    customQueryBefore () {},
    customAfterQuery () {},
    // 发送查询请求
    queryDataReq (status) {
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
      postData(this.queryUrl, this.queryData).then(response => {
        this.tableData.multSelection = []
        if (response.data.code == 0) {
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
    },
  },
  destroyed () {
    this.axiosArr.forEach(ever => {
      this.removePending(ever)
    })
    this.axiosArr = []
  }
}
</script>
