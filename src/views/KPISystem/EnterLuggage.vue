<!-- 出港行李统计 -->
<template>
    <div class="enter-luggage">
        <div class="tab-group">
            <tabs :tabsData="tabsData"
                  :defaultKey="selectKey"
                  @tabItemClick="tabItemClick"></tabs>
            <template v-if="isChartsMode">
                <tabs :tabsData="tabsDataDay"
                      :defaultKey="selectDate"
                      @tabItemClick="tabItemClickDay"></tabs>
            </template>
        </div>

        <div class="query-top">
            <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
            <div class="toolbar">
                <button type="info"
                        class="tool-button"
                        @click="cleanQueryData">重置
                </button>
                <button type="primary"
                        class="tool-button"
                        :name="loading?'loading':''" @click="queryDataReq">查询
                </button>
            </div>
        </div>

        <div class="container">
            <!-- 非图表模式，表格占全部空间-->
            <template v-if="!isChartsMode">
                <KPITables :columns="columns"
                           :totalColumns="tableTotalColumns"
                           :tableData="dataForTable"
                           :exportDialogShow="exportDialogShow"/>
            </template>
            <!-- 图表模式，上charts 下 table，需要手动限制 charts 和 table 的范围 -->
            <template v-if="isChartsMode">
                <!--         顶部的按天统计、导出功能 -->
                <div class="charts-header">
                    <div class="c-header-left">
                        <span class="c-h-label">{{chartsTitle}}</span>
                    </div>
                    <div class="c-header-right"
                         @click="exportDialogShow">
                        <div class="icon"></div>
                        <div class="label">导出
                        </div>
                    </div>
                </div>

                <div class="c-charts">
                    <KPITableCharts :optionForCharts="optionForCharts"
                                    :dataForCharts="dataForCharts"/>
                </div>
                <div class="c-table">
                    <KPITables :columns="columns"
                               :totalColumns="totalColumns"
                               :tableData="dataForTable"
                               :exportDialogShow="exportDialogShow"
                               :exportVisible="false"
                               :isHasID="false"/>
                </div>
            </template>
        </div>

        <confirm-tip :visible="dialogVisible"
                     :info="exportInfo"
                     @handleSubmit="exportExcel"
                     @handleClose="handleExportClose"></confirm-tip>
    </div>
</template>

<script>
    import Tabs from '@view/Tabs/Tabs'
    import QueryRow from '@view/QueryRow/QueryRowKPI'
    import KPITables from '@view/Table/TableForKPI'
    import {
        CLASSIFICATIONKEYS,
        CLASSIFICATION,
        getTitleText,
        getColumnData
    } from '@view/Table/libForCharts'
    import KPITableCharts from '@view/Table/ChartsForKPI'
    import tableMixin from '@mixin/tableMixin'
    import ConfirmTip from '@/views/home/common/ConfirmTip'
    import {queryAll as $post, download as $download} from '@/util/base';
    import {dateFormat} from '@/util/util'

    // 上图下表模式，请求 url 的值
    const TableWithChartURL = {
        [CLASSIFICATIONKEYS.DAY]: '/kpi/luggage/queryLuggageByDay',
        // [CLASSIFICATIONKEYS.WEEK]: '周',  取消
        [CLASSIFICATIONKEYS.MONTH]: '/kpi/luggage/queryLuggageByMonth',
        [CLASSIFICATIONKEYS.YEAR]: '/kpi/luggage/queryLuggageByYear',
    }
    // 上图下表模式，请求 url 的值
    const TableWithCharExporttURL = {
        [CLASSIFICATIONKEYS.DAY]: '/kpi/luggage/luggageByDayExcel',
        // [CLASSIFICATIONKEYS.WEEK]: '周',  取消
        [CLASSIFICATIONKEYS.MONTH]: '/kpi/luggage/luggageByMonthExcel',
        [CLASSIFICATIONKEYS.YEAR]: '/kpi/luggage/luggageByYearExcel',
    }

    // 获取参数，使用时，需要绑定 this
    const getQueryParam = function () {
        if (this.isChartsMode) {
            if (this.selectDate === CLASSIFICATIONKEYS.DAY) {
                let list = [
                    {
                        key: 'airline',
                        label: '航司',
                        type: 'input',
                        width: 150,
                        class: 'mb14'
                    },
                    {
                        key: 'agency',
                        label: '地面代理',
                        type: 'select',
                        width: 200,
                        class: 'mb14',
                        url: '/kpi/luggage/getAgency',
                        itemValue: 'CODE',
                        itemLabel: 'NAME',
                    },
                    {
                        key: 'terminal',
                        label: '航站楼',
                        type: 'select',
                        width: 200,
                        class: 'mb14',
                        url: '/base/terminal/getTerminal',
                        itemValue: 'TERMINAL_NO',
                        itemLabel: 'NAME',
                    },
                    {
                        key: 'beginDate',
                        label: '航班日期',
                        type: 'elDate',
                        dateType: 'date',
                        format: 'yyyy-MM-dd',
                        valueFormat: 'yyyy-MM-dd',
                        value: dateFormat(new Date(), 'yyyy-MM-dd'),
                        width: 214,
                        clearable: false,
                    }
                ]
                return list;
            } else if (this.selectDate === CLASSIFICATIONKEYS.MONTH) {
                let list = [
                    {
                        key: 'airline',
                        label: '航司',
                        type: 'input',
                        width: 150,
                        class: 'mb14'
                    },
                    {
                        key: 'agency',
                        label: '地面代理',
                        type: 'select',
                        width: 200,
                        class: 'mb14',
                        url: '/kpi/luggage/getAgency',
                        itemValue: 'CODE',
                        itemLabel: 'NAME',
                    },
                    {
                        key: 'terminal',
                        label: '航站楼',
                        type: 'select',
                        width: 200,
                        class: 'mb14',
                        url: '/base/terminal/getTerminal',
                        itemValue: 'TERMINAL_NO',
                        itemLabel: 'NAME',
                    },
                    {
                        key: 'beginDate',
                        label: '月份',
                        type: 'elDate',
                        dateType: 'month',
                        format: 'yyyy-MM',
                        valueFormat: 'yyyy-MM',
                        value: dateFormat(new Date(), 'yyyy-MM'),
                        width: 300,
                        clearable: false,
                    }
                ]
                return list;
            } else if (this.selectDate === CLASSIFICATIONKEYS.YEAR) {
                let list = [
                    {
                        key: 'airline',
                        label: '航司',
                        type: 'input',
                        width: 150,
                        class: 'mb14'
                    },
                    {
                        key: 'agency',
                        label: '地面代理',
                        type: 'select',
                        width: 200,
                        class: 'mb14',
                        url: '/kpi/luggage/getAgency',
                        itemValue: 'CODE',
                        itemLabel: 'NAME',
                    },
                    {
                        key: 'terminal',
                        label: '航站楼',
                        type: 'select',
                        width: 200,
                        class: 'mb14',
                        url: '/base/terminal/getTerminal',
                        itemValue: 'TERMINAL_NO',
                        itemLabel: 'NAME',
                    },
                    {
                        key: 'beginDate',
                        label: '年份',
                        type: 'elDate',
                        dateType: 'year',
                        format: 'yyyy',
                        valueFormat: 'yyyy',
                        value: dateFormat(new Date(), 'yyyy'),
                        width: 300,
                        clearable: false,
                        class: 'mb14'
                    }
                ]
                return list;
            }
        } else {
            // 统计表单页
            let list = [
                {
                    key: 'airline',
                    label: '航司',
                    type: 'input',
                    width: 150,
                    class: 'mb14'
                },
                {
                    key: 'agency',
                    label: '地面代理',
                    type: 'select',
                    width: 200,
                    class: 'mb14',
                    url: '/kpi/luggage/getAgency',
                    itemValue: 'CODE',
                    itemLabel: 'NAME',
                },
                {
                    key: 'terminal',
                    label: '航站楼',
                    type: 'select',
                    width: 200,
                    class: 'mb14',
                    url: '/base/terminal/getTerminal',
                    itemValue: 'TERMINAL_NO',
                    itemLabel: 'NAME',
                },
                {
                    key: 'beginDate',
                    label: '航班日期',
                    type: 'elDate',
                    dateType: 'date',
                    format: 'yyyy-MM-dd',
                    valueFormat: 'yyyy-MM-dd',
                    value: dateFormat(new Date(), 'yyyy-MM-dd'),
                    width: 214,
                    clearable: false,
                }
            ];
            return list;
        }
    }
    export default {
        name: "LeaveLuggage",
        created () {
            this.queryParam = getQueryParam.bind(this)();
        },
        components: {
            Tabs,
            QueryRow,
            KPITables,
            KPITableCharts,
            ConfirmTip
        },
        mixins: [tableMixin],
        mounted () {
            this.queryDataReqReset();
        },
        data () {
            return {

                // tabs 选项，
                tabsData: [
                    {
                        key: CLASSIFICATIONKEYS.TABLE,
                        label: CLASSIFICATION[CLASSIFICATIONKEYS.TABLE]
                    },
                    {
                        key: CLASSIFICATIONKEYS.CHARTS,
                        label: CLASSIFICATION[CLASSIFICATIONKEYS.CHARTS]
                    }
                ],
                tabsDataDay: [
                    {
                        key: CLASSIFICATIONKEYS.DAY,
                        label: CLASSIFICATION[CLASSIFICATIONKEYS.DAY]
                    },
                    {
                        key: CLASSIFICATIONKEYS.MONTH,
                        label: CLASSIFICATION[CLASSIFICATIONKEYS.MONTH]
                    },
                    {
                        key: CLASSIFICATIONKEYS.YEAR,
                        label: CLASSIFICATION[CLASSIFICATIONKEYS.YEAR]
                    },
                ],
                selectKey: CLASSIFICATIONKEYS.TABLE, // 当前选中的
                selectDate: CLASSIFICATIONKEYS.DAY, // 默认选中日

                // tableData 是为了迎合 tablemixin，实际没用
                tableData: {},
                dataForTable: [],
                dataForCharts: [],
                queryParam: [],

                dialogVisible: false,
            }
        },
        computed: {
            exportInfo () {
                return `是否确认导出 ${this.dataForTable.length} 条数据？`
            },
            // 是否显示【日、周、月、年】
            isChartsMode () {
                return this.selectKey === CLASSIFICATIONKEYS['CHARTS']
            },

            chartsTitle () {
                return getTitleText(this.selectDate)
            },

            // 获取 charts 的列数据
            optionForCharts () {
                return this.getChartsOption()
            },
            columns () {
                let columns = [
                    {
                        key: 'totalNum',
                        label: '行李总数',
                        width: 100,
                        thStyle: this.isChartsMode ? {} : {
                            'border-right': '1px solid #DDE6ED'
                        },
                        tdStyle: this.isChartsMode ? {
                            'font-weight': 'bold'
                        } : {
                            'font-weight': 'bold',
                            'border-right': '1px solid #DDE6ED'
                        },
                    },
                    {
                        key: 'generalNum',
                        label: '普通',
                        width: 100,
                    },
                    // {
                    //     key: 'additionNum',
                    //     label: '追加',
                    //     width: 100,
                    //     thStyle: this.isChartsMode ? {} : {
                    //         'border-right': '1px solid #DDE6ED'
                    //     },
                    //     tdStyle: this.isChartsMode ? {
                    //         'font-weight': 'bold'
                    //     } : {
                    //         'border-right': '1px solid #DDE6ED'
                    //     },
                    // },
                    // {
                    //     key: 'cancelNum',
                    //     label: '拉减',
                    //     width: 100,
                    //     thStyle: this.isChartsMode ? {} : {
                    //         'border-right': '1px solid #DDE6ED'
                    //     },
                    //     tdStyle: this.isChartsMode ? {
                    //         'font-weight': 'bold'
                    //     } : {
                    //         'border-right': '1px solid #DDE6ED'
                    //     },
                    // },
                    {
                        key: 'vipNum',
                        label: 'VIP',
                        width: 100,
                    },
                    {
                        key: 'damageNum',
                        label: '破损',
                        width: 100,
                    },
                    {
                        key: 'fragileNum',
                        label: '易碎',
                        width: 100,
                    },
                    {
                        key: 'lateNum',
                        label: '晚到',
                        width: 100,
                    },
                    {
                        key: 'liveNum',
                        label: '活物',
                        width: 100,
                    },
                    // {
                    //     key: 'unpackNum',
                    //     label: '开包',
                    //     width: 100,
                    // },
                ]
                // 统计表单，首列显示航班号
                if (this.selectKey === CLASSIFICATIONKEYS.TABLE) {
                    columns = [
                        {
                            key: 'flightNo',
                            label: '航班号',
                            width: 100,
                            tdStyle: {
                                'font-weight': 'bold'
                            }
                        },
                        ...columns
                    ]
                } else {
                    // 根据当前是哪一个，显示不同的内容
                    const FirstColumn = {
                        [CLASSIFICATIONKEYS.DAY]: '时间点',
                        // [CLASSIFICATIONKEYS.WEEK]: '周',  取消
                        [CLASSIFICATIONKEYS.MONTH]: '日期',
                        [CLASSIFICATIONKEYS.YEAR]: '月份'
                    }

                    columns = [
                        {
                            key: 'firstCol',
                            label: FirstColumn[this.selectDate],
                            width: 100,
                        },
                        ...columns
                    ]
                }

                return columns
            },
            totalColumns () {
                return this.columns.slice(1).map(item => {
                    let tdStyle = Object.assign({}, item.tdStyle, {
                        'border-right': 'none'
                    })
                    return Object.assign({}, item, {
                        tdStyle
                    })
                })
            },
            tableTotalColumns () {
                return this.columns.map(item => {
                    let tdStyle = Object.assign({}, item.tdStyle, {
                        'border-right': 'none'
                    })
                    return Object.assign({}, item, {
                        tdStyle
                    })
                })
            }
        },
        methods: {
            // 当切换 tab 标签的时候，发起异步请求
            tabItemClick (tab) {
                this.selectKey = tab;
                this.queryParam = getQueryParam.bind(this)();
                this.queryDataReqReset();
            },

            tabItemClickDay (tab) {
                this.selectDate = tab;
                this.queryParam = getQueryParam.bind(this)();
                this.queryDataReqReset();
            },

            // 查询入口函数
            queryDataReq () {
                this.dataForCharts = [];
                this.dataForTable = [];
                this.queryTableData();
            },

            //查询【统计图表】
            queryTableData () {
                // 通过这个函数获取生成参数
                this.getQueryData();

                const payload = this.getQueryParams();
                // console.log(payload);

                let url = '';
                if (this.selectKey === CLASSIFICATIONKEYS.TABLE) {
                    url = '/kpi/luggage/queryLuggage';
                } else {
                    url = TableWithChartURL[this.selectDate]
                }
                $post(url, payload).then(response => {
                    if (response.data.code !== 0) {
                        this.$msg.error({
                            info: response.data.msg
                        });
                        return
                    }
                    let data = response.data.data;

                    // console.log(data);
                    this.dataForTable = data.map(item => {
                        item.firstCol = (item.hours && String(Number(item.hours))) || Number(item.day) || `${Number(item.month)}月`;
                        return item;
                    });
                    if (this.isChartsMode) {
                        this.dataForCharts = data;
                    }
                }).catch(err => {
                    this.$msg.error({info: err ? err : '未知错误'});
                })
            },

            // 导出表格
            exportDialogShow () {
                this.dialogVisible = true;
            },

            // 关闭表格
            handleExportClose () {
                this.dialogVisible = false;
            },

            // 获取参数
            getQueryParams () {
                // 获取请求参数
                let {
                    terminal,
                    beginDate,
                    endDate,
                    airline,
                    agency
                } = this.queryData;

                const payload = {
                    terminal,
                    beginDate,
                    endDate,
                    airline,
                    agency,
                    inOutFlag: 'A', // 'A' 进港，'D' 出港
                }

                // 如果是图表模式下，只能选择一个日期，但后端需要补全日期，因此需要将 endDate 的值设置为和 beginDate 一样
                //代码注释，需求变更，统计表单改为按天查询
                // if (this.isChartsMode) {
                //     payload.endDate = payload.beginDate;
                // } 
                payload.endDate = payload.beginDate;

                return payload;
            },

            // 导出 excel 的相关逻辑
            exportExcel () {
                // this.$message.info('正在导出中...');

                const payload = this.getQueryParams();

                let url = '';
                if (this.selectKey === CLASSIFICATIONKEYS.TABLE) {
                    url = '/kpi/luggage/luggageExcel';
                } else {
                    url = TableWithCharExporttURL[this.selectDate]
                }
                // console.log(url, payload)

                $download(url, payload).then(response => {
                    this.downFile(response, this.selectKey === CLASSIFICATIONKEYS.TABLE ? '出港行李信息导出' : `出港行李信息导出(${this.chartsTitle})`)
                    this.$msg.success({
                        info: '导出成功 !'
                    })
                    this.dialogVisible = false;
                })
            },

            // 生成图表的选项
            getChartsOption () {
                const dataForCharts = this.dataForCharts;
                const self = this;
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            color: '#899DB2',
                        },
                        extraCssText: 'box-shadow:0px 5px 20px 0px rgba(104,129,153,0.15); border-radius:8px;background-color:rgba(255,255,255,1);',

                        formatter: function (params) {
                            // console.log(params)
                            let colorSpan = color => '<span style="position: relative;top: -2px; display:inline-block;margin-right:3px;border-radius:3px;width:5px;height:5px;background-color:' + color + '"></span>'
                            const index = params[0].dataIndex;
                            const style = 'padding:0 5px;font-size:12px; font-weight:400; color:#899DB2;';
                            const numberStyle = 'padding:0 5px;font-size:12px; font-weight:400; color:#3D424D; padding:0 5px; font-weight:400;text-align:center;'
                            const TableHtml = `<table>
    <tr>
        <td style="${style}">总数</td>
        <td  style="${style}">${colorSpan("#F79F2D")}普通</td>
        <!-- <td  style="${style}">${colorSpan("#3392FF")}追加</td>-->
<!--        <td  style="${style}">${colorSpan("#F75467")}拉减</td>-->
        <td  style="${style}">${colorSpan("#01B674")}VIP</td>
    </tr>
    <tr>
        <td  style="${numberStyle}">${self.dataForTable[index].totalNum}</td>
        <td  style="${numberStyle}">${self.dataForTable[index].generalNum}</td>
        <td  style="${numberStyle}">${self.dataForTable[index].additionNum}</td>
<!--        <td  style="${numberStyle}">${self.dataForTable[index].cancelNum}</td>-->
        <td  style="${numberStyle}">${self.dataForTable[index].vipNum}</td>
    </tr>
    <tr>
        <td  style="${style}">破损</td>
        <td  style="${style}">易碎</td>
        <td  style="${style}">晚到</td>
        <td  style="${style}">活物</td>
<!--        <td  style="${style}">开包</td>-->
    </tr>
    <tr>
        <td  style="${numberStyle}">${self.dataForTable[index].damageNum}</td>
        <td  style="${numberStyle}">${self.dataForTable[index].fragileNum}</td>
        <td  style="${numberStyle}">${self.dataForTable[index].lateNum}</td>
        <td  style="${numberStyle}">${self.dataForTable[index].liveNum}</td>
<!--        <td  style="${numberStyle}">${self.dataForTable[index].unpackNum}</td>-->
    </tr>
</table>`
                            return TableHtml
                        },
                    },
                    legend: {
                        data: ['行李总数', '普通', /*'追加', /*'拉减',*/ 'VIP'],
                        y: 'bottom',
                        left: 'center'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        top: '12%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        name: this.selectDate == 'day'?'时':(this.selectDate == 'month'?'天':'月'),
                        nameLocation: 'end',
                        data: dataForCharts.map(item => (item.hours && String(Number(item.hours))) || item.day || Number(item.month))
                    },
                    yAxis: {
                        type: 'value',
                        name: '件',
                    },
                    series: [
                        {
                            name: '行李总数',
                            type: 'bar',
                            barWidth: '10%',
                            data: getColumnData(dataForCharts, 'totalNum'),
                            itemStyle: {
                                color: '#DDE6ED'
                            },
                            emphasis: {
                                itemStyle: {
                                    color: '#DDE6ED'
                                },
                            }
                        },
                        {
                            name: '普通',
                            type: 'line',
                            // stack: '总量',
                            data: getColumnData(dataForCharts, 'generalNum'),
                            itemStyle: {
                                normal: {
                                    color: '#F79F2D'
                                }
                            }
                        },
                        // {
                        //     name: '追加',
                        //     type: 'line',
                        //     // stack: '总量',
                        //     data: getColumnData(dataForCharts, 'additionNum'),
                        //     itemStyle: {
                        //         normal: {
                        //             color: '#3392FF'
                        //         }
                        //     }
                        // },
                        // {
                        //     name: '拉减',
                        //     type: 'line',
                        //     // stack: '总量',
                        //     data: getColumnData(dataForCharts, 'cancelNum'),
                        //     itemStyle: {
                        //         normal: {
                        //             color: '#F75467'
                        //         }
                        //     }
                        // },
                        {
                            name: 'VIP',
                            type: 'line',
                            // stack: '总量',
                            data: getColumnData(dataForCharts, 'vipNum'),
                            itemStyle: {
                                normal: {
                                    color: '#01B674'
                                }
                            }
                        }
                    ]
                };
                return option;
            },
        }
    }
</script>

<style lang='scss' scoped>
    .enter-luggage {
        position: relative;
        width: 100%;
        height: 100%;

        .container {
            position: absolute;
            top: 96px;
            bottom: 0;
            width: 100%;
            background-color: #fff;
            box-shadow: 0px 4px 8px 0px rgba(104, 129, 153, 0.1);
            border-radius: 8px;

            .charts-header {
                position: relative;
                width: 100%;
                height: 48px;

                .c-header-left {
                    position: absolute;
                    top: 0;
                    left: 20px;
                    height: 48px;
                    line-height: 48px;

                    .c-h-label {
                        color: #3d424c;
                        font-weight: bold;
                        font-size: 16px;
                    }
                }

                .c-header-right {
                    position: absolute;
                    display: inline-block;
                    top: 13.5px;
                    right: 30px;
                    width: 64px;
                    height: 21px;
                    cursor: pointer;

                    .icon {
                        float: left;
                        width: 20px;
                        height: 20px;
                        background-image: url(~@icon/toolbar/icon_export.png);
                    }

                    .label {
                        margin-left: 6px;
                        float: left;
                        color: $gray-nd;
                        font-size: 14px;
                    }
                }
            }

            .c-charts {
                position: absolute;
                top: 48px;
                left: 0;
                height: 250px;
                width: 100%;
            }

            .c-table {
                position: absolute;
                top: 300px;
                bottom: 0;
                left: 0;
                width: 100%;
            }
        }
    }
</style>
<style lang="scss">
    // 必须放在 .enter-luggage 里引入
    .enter-luggage {
        @import '~@style/kpisystem.scss';
    }
</style>
