<script>
import { postData, queryAll } from '@/util/base'
import _ from 'lodash'
import { filter } from 'minimatch';

export default {
  data () {
    return {
      // 默认隐藏/显示列面板
      defaultRow: false,
      // oprPopoverDirect: '',
      oprPopoverIndex: null,
      showTaskDivId: null,
      axiosArr: [],
      leftAutoNum: 0
    }
  },
  mounted () {
  },
  destroyed () {
    this.axiosArr.forEach(ever => {
      this.removePending(ever)
    })
    this.axiosArr = []
  },
  methods: {
    // 取消隐藏/显示列 close关闭面板事件
    closeDefaultRow () {
      this.defaultRow = false
    },
    saveDefaultRowReq (key) {
      var fields = []
      this.tableData.column[1].forEach(item => {
        if (!item.hidden) {
          fields.push(item.key)
        }
      })
      var data = {
        inOutFlag: this.selectKey
      }
      this.$set(data, 'fields', fields)
      queryAll(this.saveDefaultRowUrl, data).then(response => {
        if (response.data.code == 0) {
          this.defaultRow = false
          this.showSuccess('保存')
        } else {
          this.showError('保存')
        }
      })
    },
    // 获取默认隐藏/显示列  初始化、刷新页面/恢复默认值 按钮方法
    getDefaultRow () {
      var _this = this
      queryAll(this.saveDefaultRowUrl, {}).then(response => {
        if (response.data.code == 0) {
          var result = 0
          let showotherFields = []
          let hiddenotherFields = _this.tableData.column[1]
          // let responseUl = ['seatNo', 'execDate', 'routeCn', 'checkDate', 'flightStatusCn', 'abnormalStatusCn', 'stand', 'luggeTypeCn', 'markingNum', 'counterNo', 'chuteNo', 'secure', 'truckDate', 'airDate']
          // let responseUlA = ['seatNo', 'execDate', 'routeCn', 'flightStatusCn', 'abnormalStatusCn', 'stand', 'luggeTypeCn', 'markingNum', 'belt', 'checkDate', 'upLoadDate']
          let responseUlA = res.data.data.LuggageA ||  []
          let responseUlD = res.data.data.LuggageD ||  []
          if (this.selectKey == 'A') {
            responseUlA.forEach(item => {
              result = -1
              for (let i = 0; i < hiddenotherFields.length; i++) {
                if (hiddenotherFields[i].key == item) {
                  result = i
                }
              }
              if (result > -1) {
                hiddenotherFields[result].hidden = false
                showotherFields.push(hiddenotherFields[result])
                hiddenotherFields.splice(result, 1)
              }
            })
            hiddenotherFields.forEach(item => {
              item.hidden = true
            })
          } else {
            responseUlD.forEach(item => {
              result = -1
              for (let i = 0; i < hiddenotherFields.length; i++) {
                if (hiddenotherFields[i].key == item) {
                  result = i
                }
              }
              if (result > -1) {
                hiddenotherFields[result].hidden = false
                showotherFields.push(hiddenotherFields[result])
                hiddenotherFields.splice(result, 1)
              }
            })
            hiddenotherFields.forEach(item => {
              item.hidden = true
            })
          }
          _this.tableData.column[1] = showotherFields.concat(hiddenotherFields)
        } else {
          this.$msg.error({
            info: '获取动态列设置信息失败 !'
          })
        }
        this.setShowFields(2)
      }).catch(res => {
          this.$msg.error({
            info: '获取动态列设置信息失败 !'
          })
      })
    },
    // 显示/隐藏列 eye点击事件
    handleEye (field, index, isShow) {
      if (isShow) {
        field.hidden = false
      } else {
        this.tableData.column[1][index] = Object.assign({}, this.tableData.column[1][index], {hidden: !field.hidden})
        this.$set(this.tableData.column, 1, this.tableData.column[1])
      }
      this.oprPopoverIndex = index
      this.setShowFields(2)
    },
    setShowFields () {},
    // 前置列 up点击事件
    handleUp (field, index) {
      this.tableData.column[1].splice(index, 1)
      this.tableData.column[1].splice(index - 1, 0, field)
      this.$set(this.tableData.column, 1, this.tableData.column[1])
      this.oprPopoverIndex = index - 1
    },
    // 置顶列 top点击事件
    handleTop (field, index, sign) {
      this.tableData.column[1].splice(index, 1)
      this.tableData.column[1].splice(0, 0, field)
      this.$set(this.tableData.column, 1, this.tableData.column[1])
      this.oprPopoverIndex = 0
    },
    // 超出设置长度省略字符变为...
    substrValue (value, length) {
      if (value) {
        if (value.length > length) {
          return value.substr(0, length - 1) + '...'
        }
      }
      return value
    },
  }
}
</script>
