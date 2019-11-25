<!-- 中转行李破损率 -->
<template>
    <div class="work-statistics">
        <div class="tab-group">
            <tabs :tabsData="tabsData" @tabItemClick="tabItemClick" :defaultKey="selectKey"></tabs>
        </div>

        <div class="query-top">
            <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
            <div class="toolbar">
                <button type="info"
                        class="tool-button"
                        @click="cleanQueryData">重置
                </button>
                <button type="primary"
                        class="tool-button"
                        :name="loading?'loading':''" @click="queryDataReq(2)">查询
                </button>
            </div>
        </div>

        <div class="container">
            <KPITables :columns="columns"
                       :tableData="dataForTable"
                       :totalColumns="totalColumns"
                       :exportDialogShow="exportDialogShow"/>
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
    import tableMixin from '@mixin/tableMixin'
    import KPITables from '@view/Table/TableForKPI'
    import ConfirmTip from '@/views/home/common/ConfirmTip'
    import {queryAll as $post, download as $download} from '@/util/base';
    import {dateFormat} from '@/util/util'

    // 前面的 key 是固定的，后面根据异步请求的字段来
    const CLASSIFICATIONKEYS = {
        'DEPARTMENT': 'deptName', // 部门
        'TEAM': 'team',      // 班组
        'PERSONAL': 'empName',     // 个人
    }

    export default {
        components: {
            Tabs,
            QueryRow,
            KPITables,
            ConfirmTip
        },
        mixins: [tableMixin],
        name: "TransBreakon",
        mounted () {
            this.queryDataReqReset();
        },
        data () {
            return {

                // tabs 选项，
                tabsData: [
                    {
                        key: '/queryKpiByAirlineBroken',
                        label: '航司',
                        tableUrl: '/kpi/transfer/queryKpiByAirlineBroken',
                        exportUrl: '/kpi/transfer/kpiByAirlineBrokenExcel',
                    },
                    {
                        key: "/queryKpiByRouteBroken",
                        label: '航线',
                        tableUrl: '/kpi/transfer/queryKpiByRouteBroken',
                        exportUrl: '/kpi/transfer/kpiByRouteBrokenExcel',
                    }
                ],
                selectKey: '/queryKpiByAirlineBroken', // 当前选中的

                queryUrl: '', //
                // queryParam:  这个值在 computed 里，动态计算

                dataForTable: [],

                dialogVisible: false,

                tableData: {
                    pageLoad: true,
                    multSelection: [],
                    loading: false,
                    key: '',
                    data: []
                }
            }
        },
        computed: {
            queryParam () {
                return [
                    {
                        key: 'date',
                        key1: 'beginDate',
                        key2: 'endDate',
                        label: '航班日期',
                        type: 'elDateTimeRange',
                        dateType: 'daterange',
                        format: 'yyyy-MM-dd',
                        valueFormat: 'yyyy-MM-dd',
                        value: [dateFormat(new Date(), 'yyyy-MM-dd'), dateFormat(new Date(), 'yyyy-MM-dd')],
                        width: 390,
                        class: 'mb14',
                    }
                ]
            },

            // 导出信息
            exportInfo () {
                return `是否确认导出${this.dataForTable.length}条数据？`
            },
            columns () {
                const firstLabel = {
                    '/queryKpiByAirlineBroken': '航司',
                    '/queryKpiByRouteBroken': '航线',
                }
                const firstKey = {
                    '/queryKpiByAirlineBroken': 'airlineCn',
                    '/queryKpiByRouteBroken': 'route',
                }
                return [
                    {
                        key: firstKey[this.selectKey],
                        label: firstLabel[this.selectKey],
                        width: 200,
                    },
                    {
                        key: 'orderNumTotal',
                        label: '总数',
                        width: 150,
                    },
                    {
                        key: 'orderNum',
                        label: '预约数',
                        width: 150,
                    },
                    {
                        key: 'damageNumTotal',
                        label: '破损数',
                        width: 150,
                    },
                    {
                        key: 'brokenRate',
                        label: '破损率',
                        width: 150,
                        formatValue (val, row, tableData) {
                            return String(val) + '%'
                        }
                    },
                ]
            },
            totalColumns () {
                let columns = [
                    {
                        key: 'queryKpiByAirlineBroken',
                        label: '航司',
                        width: 200,
                    },
                    {
                        key: 'orderNumTotal',
                        label: '总数',
                        width: 150,
                    },
                    {
                        key: 'orderNum',
                        label: '预约数',
                        width: 150,
                    },
                    {
                        key: 'damageNumTotal',
                        label: '破损数',
                        width: 150,
                    },
                    {
                        key: 'brokenRate',
                        label: '破损率',
                        width: 150,
                        formatValue (val, row) {
                            if ((typeof val !== 'number' && typeof val !== 'string') && !val) {
                                return ''
                            }
                            if (val == '') {
                              return ''
                            }
                            if (row['orderNumTotal'] === 0) {
                                return '0%';
                            }
                            let proportion = row['damageNumTotal'] / row['orderNumTotal'] * 100;
                            return proportion.toFixed(2) + '%'
                        }
                    },
                ];
                return columns
            }
        },
        methods: {
            // 当切换 tab 标签的时候，发起异步请求
            tabItemClick (tab) {
                this.selectKey = tab;
                this.queryDataReqReset();
            },

            // 在表格请求前，加上一个字段
            customQueryBefore () {
                this.$set(this.queryData, 'execRange', this.selectKey)
            },

            queryDataReq () {
                // 通过这个函数获取生成参数
                this.getQueryData();

                let url = '';
                this.tabsData.forEach(tab => {
                    if (tab.key === this.selectKey) {
                        url = tab.tableUrl;
                    }
                })

                const payload = this.queryData

                // 拿到参数后，手动去请求
                $post(url, payload).then(response => {
                    if (response.data.code !== 0) {
                        this.$msg.error({
                            info: response.data.msg
                        });
                        return
                    }
                    let data = response.data.data;

                    // console.log(data);
                    this.dataForTable = data;
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

            // 导出 excel 的相关逻辑
            exportExcel () {
                // this.$message.info('正在导出中...')

                const payload = this.queryData;
                let url = '';
                this.tabsData.forEach(data => {
                    if (this.selectKey === data.key) {
                        url = data.exportUrl
                    }
                })

                let type = '';
                this.tabsData.forEach(tab => {
                    if (tab.key === this.selectKey) {
                        type = tab.label;
                    }
                })
                $download(url, payload).then(response => {
                    this.downFile(response, `中转行李破损率导出（按${type}）`)
                    this.$msg.success({
                        info: '导出成功 !'
                    })
                    this.dialogVisible = false;
                })
            }
        }

    }
</script>
<style lang="scss" scoped>
    .work-statistics {
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
        }
    }
</style>

<style lang="scss">
    .work-statistics {
        @import '~@style/kpisystem.scss';
    }
</style>


