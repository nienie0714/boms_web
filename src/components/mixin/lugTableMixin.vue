<script>
import { postData, queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  data () {
    return {
      // 默认隐藏/显示列面板
      defaultRow: false,
      // oprPopoverDirect: '',
      oprPopoverIndex: null,
      showTaskDivId: null,
      leftAutoNum: 0
    }
  },
  mounted () {
  },
  methods: {
    // 取消隐藏/显示列 close关闭面板事件
    closeDefaultRow () {
      this.defaultRow = false
    },
    saveDefaultRowReq (rowType) {
      var fields = []
      this.tableData.column[1].forEach(item => {
        if (!item.hidden) {
          fields.push(item.key)
        }
      })
      var data = {
        type: rowType
      }
      if (this.selectKey == 'A') {
        this.$set(data, 'luggageA', fields)
      } else if(this.selectKey == 'D') {
        this.$set(data, 'luggageD', fields)
      } else {
        this.$set(data, 'transfer', fields)
      }
      queryAll(this.saveDefaultRowUrl, data).then(response => {
        if (response.data.code == 0) {
          this.defaultRow = false
          this.$msg.success({
            info: '保存成功 !'
          })
        } else {
          this.$msg.error({
            info: '保存失败 !',
            tip: res.data.msg
          })
        }
      })
    },
    // 获取默认隐藏/显示列  初始化、刷新页面/恢复默认值 按钮方法
    getDefaultRow (rowType) {
      var _this = this
      queryAll(this.queryDefaultRowUrl, {type: rowType}).then(response => {
        if (response.data.code == 0) {
          var result = 0
          let showotherFields = []
          let hiddenotherFields = _this.tableData.column[1]
          // let responseUl = ['seatNo', 'execDate', 'routeCn', 'checkDate', 'flightStatusCn', 'abnormalStatusCn', 'stand', 'luggeTypeCn', 'markingNum', 'counterNo', 'chuteNo', 'secure', 'truckDate', 'airDate']
          // let responseUlA = ['seatNo', 'execDate', 'routeCn', 'flightStatusCn', 'abnormalStatusCn', 'stand', 'luggeTypeCn', 'markingNum', 'belt', 'checkDate', 'upLoadDate'
          if(rowType == 'Luggage') {
            let responseUlA = response.data.data.luggageA || [];
            let responseUlD = response.data.data.luggageD || [];
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
          } else if(rowType == 'transfer' || rowType == 'transferByf') {
            let responseUlE = response.data.data.transfer || [];
            responseUlE.forEach(item => {
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
          this.$set(this.tableData.column, 1, this.tableData.column[1])
        }
        this.setShowFields(2)
      }).catch(res => {
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
      if (index > 0) {
        this.tableData.column[1].splice(index, 1)
        this.tableData.column[1].splice(index - 1, 0, field)
      } else {
        this.tableData.column[1].splice(index, 1)
        this.tableData.column[1].splice(this.tableData.column[1].length, 0, field)
      }
      this.$set(this.tableData.column, 1, this.tableData.column[1])
      this.oprPopoverIndex = index - 1
    },
    // 置顶列 top点击事件
    handleTop (field, index) {
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
