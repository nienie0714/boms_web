<!-- 中转行李统计 -->
<template>
    <div class="enter-luggage">
        <div class="tab-group">
            <tabs :tabsData="tabsData"
                  :defaultKey="selectKey.key"
                  @tabItemClick="tabItemClick"></tabs>
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
                           :tableData="dataForTable"
                           :exportDialogShow="exportDialogShow"
                           :totalColumns="totalColumnsForTable"/>
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
                               :isHasID="false"
                               :isIgnoreFirstCol="true"/>
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
        getColumnData
    } from '@view/Table/libForCharts'
    import KPITableCharts from '@view/Table/ChartsForKPI'
    import tableMixin from '@mixin/tableMixin'
    import {queryAll as $post, download as $download} from '@/util/base';
    import {dateFormat} from '@/util/util'
    import ConfirmTip from '@/views/home/common/ConfirmTip'

    export default {
        name: "TransferStatistics",
        components: {
            Tabs,
            QueryRow,
            KPITables,
            KPITableCharts,
            ConfirmTip
        },
        mixins: [tableMixin],
        mounted () {
            this.queryDataReq()
        },
        data () {
            return {
                // tabs 选项，
                tabsData: [
                    {
                        key: '/queryKpiByYear',
                        label: '年度',
                        tableUrl: '/queryKpiByYear',
                        exportUrl: '/kpiByYearExcel'
                    },
                    {
                        key: '/queryKpiByRoute',
                        label: '航线',
                        tableUrl: '/queryKpiByRoute',
                        exportUrl: '/kpiByRouteExcel'
                    },
                    {
                        key: '/queryKpiByAirline',
                        label: '航司',
                        tableUrl: '/queryKpiByAirline',
                        exportUrl: '/kpiByAirlineExcel'
                    },
                    {
                        key: '/queryKpiByTermianl',
                        label: '航站楼',
                        tableUrl: '/queryKpiByTermianl',
                        exportUrl: '/kpiByTermianlExcel'
                    }
                ],
                selectKey: '/queryKpiByYear', // 当前选中的

                queryUrl: '', // 这个没用，为了配合 tablemixin，占位，实际不使用。
                // queryParam: [],  这个值在 computed 获取
                // columns: [],     这个值也在 computed 获取

                // tableData 是为了迎合 tablemixin，实际没用
                tableData: {},
                dataForTable: [],
                dataForCharts: [],

                // 导出弹窗是否显示
                dialogVisible: false,
            }
        },
        computed: {
            exportInfo () {
                return `是否确认导出 ${this.dataForTable.length} 条数据？`
            },
            // 是否显示上图下表
            isChartsMode () {
                const isChartsMode = ['/queryKpiByYear', '/queryKpiByTermianl'].indexOf(this.selectKey) > -1;
                return isChartsMode;
            },
            // 生成上方 search 区域 input 的数据（原因是不同 tab 下这个不一样）
            queryParam () {
                if (this.selectKey === '/queryKpiByYear') {
                    return [
                        {
                            key: 'statDate',
                            label: '年份',
                            type: 'elDate',
                            dateType: 'year',
                            format: 'yyyy',
                            valueFormat: 'yyyy',
                            width: 300,
                            value: dateFormat(new Date(), 'yyyy'),
                            clearable: false,
                            class: 'mb14'
                        }
                    ]
                } else {
                    return [
                        {
                            key: 'date',
                            key1: 'beginDate',
                            key2: 'endDate',
                            label: '航班日期',
                            type: 'elDateRange',
                            dateType: 'daterange',
                            format: 'yyyy-MM-dd',
                            valueFormat: 'yyyy-MM-dd',
                            value: [dateFormat(new Date(), 'yyyy-MM-dd'), dateFormat(new Date(), 'yyyy-MM-dd')],
                            width: 390,
                            class: 'mb14',
                        }
                    ]
                }


            },
            // 获取表格的列数据
            columns () {
                if (['/queryKpiByYear', '/queryKpiByTermianl'].indexOf(this.selectKey) > -1) {
                    let columns = [
                        {
                            key: 'orderNumTotal',
                            label: '总数',
                            width: 240,
                        },
                        {
                            key: 'orderNum',
                            label: '预约数',
                            width: 240,
                        },
                        {
                            key: 'loadAcftNumTotal',
                            label: '已装机数',
                            width: 240,
                        },
                        {
                            key: 'damageNumTotal',
                            label: '破损数',
                            width: 240,
                        },
                        {
                            key: 'cancelNumTotal',
                            label: '取消执行数',
                            width: 240,
                        },
                    ]
                    if (this.selectKey === '/queryKpiByYear') {
                        columns = [
                            {
                                key: 'statDate',
                                label: '月份',
                                width: 200,
                                tdStyle: {
                                    'font-weight': 'bold'
                                }
                            },
                            ...columns
                        ]
                    } else {
                        columns = [
                            {
                                key: 'terminal',
                                label: '航站楼',
                                width: 200,
                                tdStyle: {
                                    'font-weight': 'bold'
                                }
                            },
                            ...columns
                        ]
                    }
                    return columns
                } else if ('/queryKpiByRoute' === this.selectKey) {
                    return [
                        {
                            key: 'route',
                            label: '航线',
                            width: 200,
                            tdStyle: {
                                'font-weight': 'bold'
                            }
                        },
                        {
                            key: 'orderNumTotal',
                            label: '总数',
                            width: 240,
                        },
                        {
                            key: 'orderNum',
                            label: '预约数',
                            width: 240,
                        },
                        {
                            key: 'loadAcftNumTotal',
                            label: '已装机数',
                            width: 240,
                        },
                        {
                            key: 'damageNumTotal',
                            label: '破损数',
                            width: 240,
                        },
                        {
                            key: 'cancelNumTotal',
                            label: '取消执行数',
                            width: 240,
                        },
                    ]
                } else /*if ('/queryKpiByAirline' === this.selectKey)*/ {
                    return [
                        {
                            key: 'airlineCn',
                            label: '航司',
                            width: 200,
                            tdStyle: {
                                'font-weight': 'bold'
                            }
                        },
                        {
                            key: 'orderNumTotal',
                            label: '总数',
                            width: 240,
                        },
                        {
                            key: 'orderNum',
                            label: '预约数',
                            width: 240,
                        },
                        {
                            key: 'loadAcftNumTotal',
                            label: '已装机数',
                            width: 240,
                        },
                        {
                            key: 'damageNumTotal',
                            label: '破损数',
                            width: 240,
                        },
                        {
                            key: 'cancelNumTotal',
                            label: '取消执行数',
                            width: 240,
                        },
                    ]
                }
            },

            totalColumns () {
                return this.columns.slice(1).map(col => {
                    let c = Object.assign({}, col);
                    c.tdStyle = {
                        'font-weight': 'bold'
                    }
                    return c
                })
            },
            totalColumnsForTable () {
                return this.columns.map(col => {
                    let c = Object.assign({}, col);
                    c.tdStyle = {
                        'font-weight': 'bold'
                    }
                    return c
                })
            },

            // 获取 charts 的列数据
            optionForCharts () {
                return this.getChartsOption()
            },
            // 图表的标题
            chartsTitle () {
                if (this.selectKey === '/queryKpiByYear') {
                    return '按年统计'
                } else {
                    return '按航站楼统计'
                }
            }
        },
        methods: {
            // 当切换 tab 标签的时候，发起异步请求
            tabItemClick (tab) {
                this.selectKey = tab;
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
                let payload = this.getQueryParams();

                const url = this.selectKey;

                // 拿到参数后，手动去请求
                $post(`/kpi/transfer${url}`, payload).then(response => {
                    if (response.data.code !== 0) {
                        this.$msg.error({
                            info: response.data.msg
                        });
                        return
                    }
                    let data = response.data.data;

                    // console.log(data);
                    if (this.isChartsMode) {
                        this.dataForCharts = data.map(item => {
                            let d = {
                                orderNumTotal: item.orderNumTotal,
                                loadAcftNumTotal: item.loadAcftNumTotal,
                                damageNumTotal: item.damageNumTotal,
                                cancelNumTotal: item.cancelNumTotal
                            }
                            if (this.selectKey === '/queryKpiByYear') {
                                d.statDate = item.statDate
                            } else {
                                d.terminal = item.terminal
                            }
                            return d
                        })
                        this.dataForTable = data.map(item => {
                            item.statDate = `${String(Number(item.statDate))}月`;
                            return item;
                        })
                    } else {
                        this.dataForTable = data;
                    }
                }).catch(err => {
                    this.$msg.error({info: err ? err : '未知错误'});
                })
            },

            // 获取请求参数
            getQueryParams () {
                let payload = {};
                // 如果是年度tab，参数不同
                if (this.selectKey === '/queryKpiByYear') {
                    const {statDate} = this.queryData;
                    payload = {
                        beginDate: statDate,
                        endDate: statDate
                    }
                } else {
                    // 获取请求参数
                    const {
                        beginDate,
                        endDate
                    } = this.queryData;
                    payload = {
                        beginDate, endDate
                    }
                }
                return payload;
            },

            // 生成图表的选项
            getChartsOption () {
                const dataForCharts = this.dataForCharts;
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            color: '#899DB2',
                        },
                        extraCssText: 'box-shadow:0px 5px 20px 0px rgba(104,129,153,0.15); border-radius:8px;background-color:rgba(255,255,255,1);',
                    },
                    legend: {
                        data: ['预约数', '已装机数', '破损数', '取消执行数'],
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
                        name: '月',
                        // 返回月份（需要添加月），或者终端
                        data: dataForCharts.map(item => this.selectKey === '/queryKpiByYear' ? String(Number(item.statDate)) : item.terminal)
                    },
                    yAxis: {
                        type: 'value',
                        name: '件',
                    },
                    series: [
                        {
                            name: '预约数',
                            type: 'bar',
                            barWidth: '10%',
                            data: getColumnData(dataForCharts, 'orderNumTotal'),
                            itemStyle: {
                                normal: {
                                    color: '#DDE6ED'
                                }
                            },
                            emphasis: {
                                itemStyle: {
                                    color: '#DDE6ED'
                                },
                            }
                        },
                        {
                            name: '已装机数',
                            type: 'line',
                            // stack: '总量',
                            data: getColumnData(dataForCharts, 'loadAcftNumTotal'),
                            itemStyle: {
                                normal: {
                                    color: '#F79F2D'
                                }
                            }
                        },
                        {
                            name: '破损数',
                            type: 'line',
                            // stack: '总量',
                            data: getColumnData(dataForCharts, 'damageNumTotal'),
                            itemStyle: {
                                normal: {
                                    color: '#3392FF'
                                }
                            }
                        },
                        {
                            name: '取消执行数',
                            type: 'line',
                            // stack: '总量',
                            data: getColumnData(dataForCharts, 'cancelNumTotal'),
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

            // 导出表格
            exportDialogShow () {
                this.dialogVisible = true;
            },
            // 关闭表格
            handleExportClose () {
                this.dialogVisible = false;
            },

            // 导出 excel 的相关逻辑
            exportExcel () {
                // this.$message.info('正在导出中...')

                const payload = this.getQueryParams();
                let url = '';
                this.tabsData.forEach(data => {
                    if (this.selectKey === data.key) {
                        url = data.exportUrl
                    }
                })
                console.log(url, payload)

                $download(`/kpi/transfer${url}`, payload).then(response => {
                    this.downFile(response, '中转行李信息导出')
                    this.$msg.success({
                        info: '导出成功 !'
                    })
                    this.dialogVisible = false;
                })
            }
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
