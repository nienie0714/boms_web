<script>
import { postData, queryAll } from '@/util/base'
import _ from 'lodash'

export default {
  data () {
    return {
      // 默认隐藏/显示列面板
      defaultRow: false,
      oprPopoverDirect: '',
      oprPopoverIndex: null,
      showTaskDivId: null,
      axiosArr: [],
      leftAutoNum: 0,
      rightAutoNum: 5,
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
      queryAll('/online/userOnline/queryOnlineUser', {}).then(response => {
        // let hiddenotherFields = _this.tableData.column[1]
        // console.log(_this.tableData.column[1], _this.tableData.column[1][0].child)
        // // let responseUl = ['seatNo', 'execDate', 'routeCn', 'checkDate', 'flightStatusCn', 'abnormalStatusCn', 'stand', 'luggeTypeCn', 'markingNum', 'counterNo', 'chuteNo', 'secure', 'truckDate', 'airDate']
        // // let responseUlA = ['seatNo', 'execDate', 'routeCn', 'flightStatusCn', 'abnormalStatusCn', 'stand', 'luggeTypeCn', 'markingNum', 'belt', 'checkDate', 'upLoadDate']
        // let runList = ['lugTotal', 'unLoadAirNum', 'unLoadAirCostTime', 'N-UNLOAD-AIRCRAFT', 'unLoadCarNum', 'unLoadCarCostTime', 'N-UPLOAD']
        // let lugList = ['lugCommonTotal', 'lugAdditionTotal', 'vipFlag', 'lugMarkingTotal']
        // let runLength = runList.length
        // let lugLength = lugList.length
        if (response.data.code == 0) {
          var result = 0
          var showflightfields = []
          let hiddenflightfields = _this.tableData.fields.slice(_this.leftAutoNum)
          response.data.data.flightFields.forEach(item => {
            result = -1
            for (let i = 0; i < hiddenflightfields.length; i++) {
              if (hiddenflightfields[i].prop == item) {
                result = i
              }
            }
            if (result > -1) {
              hiddenflightfields[result].hidden = false
              showflightfields.push(hiddenflightfields[result])
              hiddenflightfields.splice(result, 1)
            }
          })
          hiddenflightfields.forEach(item => {
            item.hidden = true
          })
          _this.tableData.fields.splice(_this.leftAutoNum, _this.tableData.fields.length - _this.leftAutoNum)
          _this.tableData.fields = _this.tableData.fields.concat(showflightfields, hiddenflightfields)

          if (_this.rightAutoNum) {
            let key = _this.customOtherFields()
            let showFlightOtherFields = []
            let hiddenFlightOtherfields = _this.tableData[key].slice(0, _this.rightAutoNum)

            response.data.data[key].forEach(item => {
              result = -1
              for (let i = 0; i < hiddenFlightOtherfields.length; i++) {
                if (hiddenFlightOtherfields[i].prop == item) {
                  result = i
                }
              }
              if (result > -1) {
                hiddenFlightOtherfields[result].hidden = false
                showFlightOtherFields.push(hiddenFlightOtherfields[result])
                hiddenFlightOtherfields.splice(result, 1)
              }
            })
            hiddenFlightOtherfields.forEach(item => {
              item.hidden = true
            })
            _this.tableData[key].splice(0, _this.rightAutoNum, ...showFlightOtherFields, ...hiddenFlightOtherfields)

            let showotherFields = []
            let hiddenotherFields = _this.tableData[key].slice(_this.rightAutoNum)
            response.data.data[key].forEach(item => {
              result = -1
              for (let i = 0; i < hiddenotherFields.length; i++) {
                if (hiddenotherFields[i].prop == item) {
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
            _this.tableData[key].splice(_this.rightAutoNum, _this.tableData[key].length - _this.rightAutoNum, ...showotherFields, ...hiddenotherFields)
          } else {
            let key = _this.customOtherFields()
            let showotherFields = []
            let hiddenotherFields = _this.tableData[key]
            response.data.data[key].forEach(item => {
              result = -1
              for (let i = 0; i < hiddenotherFields.length; i++) {
                if (hiddenotherFields[i].prop == item) {
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
            _this.tableData[key] = showotherFields.concat(hiddenotherFields)
          }
        }
        this.setShowFields(2)
        this.updateTableWidth()
      })
    },
    // 显示/隐藏列 eye点击事件
    handleEye (field, index, sign, isShow) {
      if (isShow) {
        field.hidden = false
      } else {
        field.hidden = !field.hidden
      }
      var widthSum = 0
      if (sign == 'left') {
        this.tableData.fields.forEach(item => {
          if (!item.hidden) {
            widthSum += parseInt(item.width)
          }
        })
        this.divLeftTableStyle.width = widthSum + 2 + 'px'
        this.divLeftTableStyle.minWidth = widthSum + 2 + 'px'
        this.divRightTableStyle.width = 'calc(100% - ' + this.divLeftTableStyle.width + ' - ' + this.divOprTableStyle.width + ')'
      } else if (sign == 'right') {
        var key = this.customOtherFields()
        var otherFieldsWidth = 0
        this.tableData[key].forEach(item => {
          if (!item.hidden) {
            otherFieldsWidth += parseInt(item.width)
          }
        })
        this.rightTableWidthStyle.width = otherFieldsWidth + 'px'
        this.rightTableBlockWidthStyle.left = otherFieldsWidth + 'px'
        this.rightTableBlockWidthStyle.width = 'calc(100% - ' + otherFieldsWidth + 'px)'
      }
      this.oprPopoverDirect = sign
      this.oprPopoverIndex = index
      this.setShowFields(2)
    },
    setShowFields () {},
    // 前置列 up点击事件
    handleUp (field, index, sign) {
      if (sign == 'left' && index > this.leftAutoNum) {
        this.tableData.fields.splice(index, 1)
        this.tableData.fields.splice(index - 1, 0, field)
        this.oprPopoverIndex = index - 1
      } else if (sign == 'right' && index > 0) {
        let key = this.customOtherFields()
        if (this.rightAutoNum && (index > this.rightAutoNum)) {
          this.tableData[key].splice(index, 1)
          this.tableData[key].splice(index - 1, 0, field)
          this.oprPopoverIndex = index - 1
        } else {
          this.tableData[key].splice(index, 1)
          this.tableData[key].splice(index - 1, 0, field)
          this.oprPopoverIndex = index - 1
        }
      }
      this.oprPopoverDirect = sign
    },
    // 置顶列 top点击事件
    handleTop (field, index, sign) {
      if (sign == 'left' && index > this.leftAutoNum) {
        this.tableData.fields.splice(index, 1)
        this.tableData.fields.splice(this.leftAutoNum, 0, field)
        this.oprPopoverIndex = this.leftAutoNum
      } else if (sign == 'right' && index > 0) {
        if (this.rightAutoNum && (index >= this.rightAutoNum)) {
          let key = this.customOtherFields()
          this.tableData[key].splice(index, 1)
          this.tableData[key].splice(this.rightAutoNum, 0, field)
          this.oprPopoverIndex = this.rightAutoNum
        } else {
          let key = this.customOtherFields()
          this.tableData[key].splice(index, 1)
          this.tableData[key].splice(0, 0, field)
          this.oprPopoverIndex = 0
        }
      }
      this.oprPopoverDirect = sign
    },
    // 获取默认隐藏/显示列  初始化、刷新页面/恢复默认值 按钮方法
    getDefaultRow1 () {
      var _this = this
      queryAll('/online/userOnline/queryOnlineUser', {}).then(response => {
        if (response.data.code == 0) {
          var result = 0
          let showotherFields = []
          let hiddenotherFields = _this.tableData.column[1]
          console.log(_this.tableData.column[1], _this.tableData.column[1][0].child)
          // let responseUl = ['seatNo', 'execDate', 'routeCn', 'checkDate', 'flightStatusCn', 'abnormalStatusCn', 'stand', 'luggeTypeCn', 'markingNum', 'counterNo', 'chuteNo', 'secure', 'truckDate', 'airDate']
          // let responseUlA = ['seatNo', 'execDate', 'routeCn', 'flightStatusCn', 'abnormalStatusCn', 'stand', 'luggeTypeCn', 'markingNum', 'belt', 'checkDate', 'upLoadDate']
          let runList = ['lugTotal', 'unLoadAirNum', 'unLoadAirCostTime', 'N-UNLOAD-AIRCRAFT', 'unLoadCarNum', 'unLoadCarCostTime', 'N-UPLOAD']
          let lugList = ['lugCommonTotal', 'lugAdditionTotal', 'vipFlag', 'lugMarkingTotal']
          let runLength = runList.length
          let lugLength = lugList.length
          // let responseUlA = res.data.data.LuggageA ||  []
          // let responseUlD = res.data.data.LuggageD ||  []
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
    handleEye1 (field, index, isShow) {
      if (isShow) {
        field.hidden = false
      } else {
        this.tableData.column[1][index] = Object.assign({}, this.tableData.column[1][index], {hidden: !field.hidden})
        this.$set(this.tableData.column, 1, this.tableData.column[1])
      }
      this.oprPopoverIndex = index
      this.setShowFields(2)
    },
    // 前置列 up点击事件
    handleUp1 (field, index) {
      this.tableData.column[1].splice(index, 1)
      this.tableData.column[1].splice(index - 1, 0, field)
      this.$set(this.tableData.column, 1, this.tableData.column[1])
      this.oprPopoverIndex = index - 1
    },
    // 置顶列 top点击事件
    handleTop1 (field, index) {
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
