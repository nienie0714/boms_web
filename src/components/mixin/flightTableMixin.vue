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
                leftAutoNum: 0,
                rightAutoNum: 5,
            }
        },
        mounted () {
        },
        methods: {
            // 取消隐藏/显示列 close关闭面板事件
            closeDefaultRow () {
                this.defaultRow = false
            },
            saveDefaultRowReq (key) {
                // 运行信息
                var runList = []
                this.tableData.column[1][0].child.forEach(item => {
                    if (!item.hidden) {
                        runList.push(item.key)
                    }
                })
                // 行李类型
                var lugList = []
                this.tableData.column[1][1].child.forEach(item => {
                    if (!item.hidden) {
                        lugList.push(item.key)
                    }
                })
                var data = {
                    type: 'flight'
                }
                if (this.selectKey == 'A') {
                    this.$set(data, 'flightAR', runList)
                    this.$set(data, 'flightAL', lugList)
                } else {
                    this.$set(data, 'flightDR', runList)
                    this.$set(data, 'flightDL', lugList)
                }
                queryAll(this.saveDefaultRowUrl, data).then(res => {
                    if (res.data.code == 0) {
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
            getDefaultRow () {
                var _this = this
                queryAll(this.queryDefaultRowUrl, {type: 'flight'}).then(response => {
                    if (response.data.code == 0) {
                        // let runListA = ['unLoadAirCostTime', 'lugTotal', 'unLoadAirNum', 'N-UNLOAD-AIRCRAFT', 'unLoadCarNum', 'unLoadCarCostTime', 'N-UPLOAD']
                        // flightAR = ['lugTotal', 'unLoadAirNum','unLoadAirCostTime',  'N-UNLOAD-AIRCRAFT', 'unLoadCarNum', 'unLoadCarCostTime', 'N-UPLOAD']
                        // flightAL = ['lugCommonTotal', 'lugAdditionTotal', 'allNodeCancelSum', 'vipFlag', 'lugMarkingTotal']
                        // flightDR = ['lugTotal', 'checkinCount', 'loadTruckCost', 'N-LOAD-TRUCK', 'loadAircraftCount', 'loadAircraftCost', 'N-LOAD-AIRCRAFT']
                        // flightDL = ['lugCommonTotal', 'lugAdditionTotal', 'allNodeCancelSum', 'vipFlag', 'lugMarkingTotal']

                        let runList = []
                        let lugList = []
                        if (this.selectKey == 'A') {
                            runList = response.data.data.flightAR || []
                            lugList = response.data.data.flightAL || []
                        } else {
                            runList = response.data.data.flightDR || []
                            lugList = response.data.data.flightDL || []
                        }

                        // 运行情况--------------------------------------------------------------------
                        var result = 0
                        let showotherFields = []
                        let hiddenotherFields = _this.tableData.column[1][0].child
                        runList.forEach(item => {
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
                        _this.tableData.column[1][0].child = showotherFields.concat(hiddenotherFields)
                        _this.tableData.column[1][0].colspan = runList.length
                        if(showotherFields.length > 0) {
                            // 有运行情况列
                            // 行李类型--------------------------------------------------------------------
                            var result2 = 0
                            let showotherFields2 = []
                            let hiddenotherFields2 = _this.tableData.column[1][1].child
                            lugList.forEach(item => {
                                result2 = -1
                                for (let i = 0; i < hiddenotherFields2.length; i++) {
                                    if (hiddenotherFields2[i].key == item) {
                                        result2 = i
                                    }
                                }
                                if (result2 > -1) {
                                    hiddenotherFields2[result2].hidden = false
                                    showotherFields2.push(hiddenotherFields2[result2])
                                    hiddenotherFields2.splice(result2, 1)
                                }
                            })
                            hiddenotherFields2.forEach(item => {
                                item.hidden = true
                            })
                            if (lugList.length == 0) {
                                // _this.tableData.column[1][1].child = [{key: 'noData',  label: '', width: 60}]
                                // 有运行情况  没有行李列
                                _this.tableData.column[1][1].colspan = 0
                                _this.tableData.column[1][1].hidden = true
                            } else {
                                // 有运行情况  有行李列
                                _this.tableData.column[1][1].hidden = false
                                _this.tableData.column[1][0].hidden = false
                                _this.tableData.column[1][1].child = showotherFields2.concat(hiddenotherFields2)
                                _this.tableData.column[1][1].colspan = lugList.length
                            }
                        } else {
                            // 没有运行情况 有行李列-----------------------------------------------------------
                            _this.tableData.column[1][0].colspan = 0
                            _this.tableData.column[1][0].hidden = true
                            // this.$delete(_this.tableData.column[1], 0)
                            var result1_2 = 0
                            let showotherFields1_2 = []
                            let hiddenotherFields1_2 = _this.tableData.column[1][1].child
                            lugList.forEach(item => {
                                result1_2 = -1
                                for (let i = 0; i < hiddenotherFields1_2.length; i++) {
                                    if (hiddenotherFields1_2[i].key == item) {
                                        result1_2 = i
                                    }
                                }
                                if (result1_2 > -1) {
                                    hiddenotherFields1_2[result1_2].hidden = false
                                    showotherFields1_2.push(hiddenotherFields1_2[result1_2])
                                    hiddenotherFields1_2.splice(result1_2, 1)
                                }
                            })
                            hiddenotherFields1_2.forEach(item => {
                                item.hidden = true
                            })

                            if (lugList.length == 0) {
                                // 没有运行情况  没有行李列
                                _this.tableData.column[1][1].colspan = 0
                                _this.tableData.column[1][1].hidden = true
                                // bug  table出现断档
                            } else {
                                // 没有运行情况  有行李列
                                _this.tableData.column[1][0].hidden = true
                                _this.tableData.column[1][1].hidden = false
                                _this.tableData.column[1][1].child = showotherFields1_2.concat(hiddenotherFields1_2)
                                _this.tableData.column[1][1].colspan = lugList.length
                            }
                        }
                        this.lastRunAddRBorder();
                        this.firstRunAddRBorder();
                    }
                    this.setShowFields(2)
                })
            },
            // 显示/隐藏列 eye点击事件
            handleEye (field, index, sign, isShow) {
                if (sign == 'left') {
                    this.tableData.column[1][0].child[index] = Object.assign({}, this.tableData.column[1][0].child[index], {hidden: !field.hidden})
                    if (field.hidden) {
                        // 显示
                        this.tableData.column[1][0].hidden = false
                        this.$set(this.tableData.column[1][0], 'colspan', this.tableData.column[1][0].colspan + 1)
                    } else {
                        // 隐藏
                        this.$set(this.tableData.column[1][0], 'colspan', this.tableData.column[1][0].colspan - 1)
                        if(this.tableData.column[1][0].colspan <= 0) {
                            this.tableData.column[1][0].hidden = true
                        }
                    }
                    this.lastRunAddRBorder();
                    this.firstRunAddRBorder();
                    this.$set(this.tableData.column[1], 0, this.tableData.column[1][0])
                } else if (sign == 'right') {
                    this.tableData.column[1][1].child[index] = Object.assign({}, this.tableData.column[1][1].child[index], {hidden: !field.hidden})
                    if (field.hidden) {
                        // 显示
                        this.tableData.column[1][1].hidden = false
                        this.$set(this.tableData.column[1][1], 'colspan', this.tableData.column[1][1].colspan + 1)
                    } else {
                        // 隐藏
                        this.$set(this.tableData.column[1][1], 'colspan', this.tableData.column[1][1].colspan - 1)
                        if(this.tableData.column[1][1].colspan <= 0) {
                            this.tableData.column[1][1].hidden = true
                        }
                    }
                    this.lastRunAddRBorder();
                    this.firstRunAddRBorder();
                    this.$set(this.tableData.column[1], 1, this.tableData.column[1][1])
                }
                this.oprPopoverDirect = sign
                this.oprPopoverIndex = index
                this.setShowFields(2)
            },
            setShowFields () {},
            // 前置列 up点击事件
            handleUp (field, index, sign) {
                if (sign == 'left' && index > this.leftAutoNum) {
                    this.tableData.column[1][0].child.splice(index, 1)
                    this.tableData.column[1][0].child.splice(index - 1, 0, field)
                    this.$set(this.tableData.column[1], 0, this.tableData.column[1][0])
                    this.oprPopoverIndex = index - 1
                } else if (sign == 'right' && index > 0) {
                    this.tableData.column[1][1].child.splice(index, 1)
                    this.tableData.column[1][1].child.splice(index - 1, 0, field)
                    this.$set(this.tableData.column[1], 1, this.tableData.column[1][1])
                }
                this.lastRunAddRBorder();
                this.firstRunAddRBorder();
                this.oprPopoverIndex = index - 1;
                this.oprPopoverDirect = sign;
            },
            // 置顶列 top点击事件
            handleTop (field, index, sign) {
                if (sign == 'left' && index > this.leftAutoNum) {
                    this.tableData.column[1][0].child.splice(index, 1)
                    this.tableData.column[1][0].child.splice(0, 0, field)
                } else if (sign == 'right' && index > 0) {
                    this.tableData.column[1][1].child.splice(index, 1)
                    this.tableData.column[1][1].child.splice(0, 0, field)
                }
                this.lastRunAddRBorder();
                this.firstRunAddRBorder();
                this.oprPopoverIndex = 0
                this.oprPopoverDirect = sign
            },
            // center table 最后一列添加右border
            lastRunAddRBorder() {
                // 运行情况最后一列
                _.forEach(this.tableData.column[1][0].child, (item, index) => {
                    this.$delete(item, 'class')
                })
                let lastRunItemIndex = _.findLastIndex(this.tableData.column[1][0].child, function(o) { return o.hidden == false; });
                if (~lastRunItemIndex) {
                    // this.$set(this.tableData.column[1][0].child[lastRunItemIndex], 'class', 'col-child-right')
                }
                // 行李信息最后一列
                _.forEach(this.tableData.column[1][1].child, (item, index) => {
                    this.$delete(item, 'class')
                })
                let lastLugItemIndex = _.findLastIndex(this.tableData.column[1][1].child, function(o) { return o.hidden == false; });
                if (~lastLugItemIndex) {
                    // this.$set(this.tableData.column[1][1].child[lastLugItemIndex], 'class', 'col-child-right')
                }
            },
            // 行李类型的第一列添加 border-left
            firstRunAddRBorder() {
                 _.forEach(this.tableData.column[1][1].child, (item, index) => {
                    this.$delete(item, 'class')
                })
                let firstLugItemIndex = _.findIndex(this.tableData.column[1][1].child, function(o) { return o.hidden == false; });
                if (~firstLugItemIndex) {
                    this.$set(this.tableData.column[1][1].child[firstLugItemIndex], 'class', 'col-child-left')
                }
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
