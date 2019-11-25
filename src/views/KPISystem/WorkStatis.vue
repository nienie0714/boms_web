<!-- 工作量统计 -->
<template>
    <div class="work-statistics">
        <div class="tab-group">
            <!-- <tabs :tabsData="tabsData" @tabItemClick="tabItemClick" :defaultKey="selectKey"></tabs> -->
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
                       :exportDialogShow="exportDialogShow"/>
        </div>

        <confirm-tip :visible="dialogVisible"
                     :info="exportInfo"
                     @handleSubmit="exportExcel"
                     @handleClose="handleExportClose"></confirm-tip>
    </div>
</template>
<script>
    // import Tabs from '@view/Tabs/Tabs'
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
    // 中文名，很多地方要用
    const CLASSIFICATION = {
        [CLASSIFICATIONKEYS.DEPARTMENT]: '部门',
        [CLASSIFICATIONKEYS.TEAM]: '班组',
        [CLASSIFICATIONKEYS.PERSONAL]: '个人',
    }

    export default {
        components: {
            // Tabs,
            QueryRow,
            KPITables,
            // Toolbar
            ConfirmTip
        },
        mixins: [tableMixin],
        name: "WorkStatis",
        mounted () {
            this.queryDataReqReset();
        },
        data () {
            return {

                // tabs 选项，
                tabsData: [
                    // {
                    //     key: CLASSIFICATIONKEYS.DEPARTMENT,
                    //     label: CLASSIFICATION[CLASSIFICATIONKEYS.DEPARTMENT],
                    //     tableUrl: '/queryKpiByDept',
                    //     exportUrl: '/kpiByDeptExcel',
                    // },
                    // 班组暂时不显示
                    // {
                    //     key: CLASSIFICATIONKEYS.TEAM,
                    //     label: CLASSIFICATION[CLASSIFICATIONKEYS.TEAM],
                    //     tableUrl:'/queryKpiByTeam',
                    //     exportUrl: '/kpiByTeamExcel',
                    // },
                    {
                        key: CLASSIFICATIONKEYS.PERSONAL,
                        label: CLASSIFICATION[CLASSIFICATIONKEYS.PERSONAL],
                        tableUrl: '/queryKpiByEmp',
                        exportUrl: '/kpiByEmpExcel',
                    }
                ],
                selectKey: CLASSIFICATIONKEYS.PERSONAL, // 当前选中的

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
                        key: this.selectKey,
                        label: `${CLASSIFICATION[this.selectKey]}名称`,
                        type: 'input',
                        width: 214,
                        class: 'mb14'
                    },
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
                    [CLASSIFICATIONKEYS.DEPARTMENT]: '部门',
                    [CLASSIFICATIONKEYS.TEAM]: '班组',
                    [CLASSIFICATIONKEYS.PERSONAL]: '姓名',
                }
                return [
                    {
                        key: this.selectKey,
                        label: firstLabel[this.selectKey],
                        width: 200,
                    },
                    {
                        key: 'loadTruckNum',
                        label: '分拣保障',
                        width: 150,
                    },
                    {
                        key: 'loadAcftNum',
                        label: '装机保障',
                        width: 150,
                    },
                    {
                        key: 'unloadAcftNum',
                        label: '卸机保障',
                        width: 150,
                    },
                    {
                        key: 'unloadTruckNum',
                        label: '卸车保障',
                        width: 150,
                    },
                    {
                        key: 'luggageSum',
                        label: '行李保障总量',
                        width: 150,
                    },
                    {
                      key: 'markingNum',
                      label: '行李标记总量',
                      width: 150
                    },
                    {
                        key: 'flightSum',
                        label: '保障航班总量',
                        width: 150,
                    },
                    {
                        key: 'dflightNum',
                        label: ' 保障航班量-出港',
                        width: 200,
                    },
                    {
                        key: 'aflightNum',
                        label: ' 保障航班量-进港',
                        width: 200,
                    },
                ]
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
                // let payload = {};
                // payload[CLASSIFICATIONKEYS[this.selectKey]] = this.queryData[CLASSIFICATIONKEYS[this.selectKey]];
                // console.log(this.queryData)
                let url = '';
                this.tabsData.forEach(tab => {
                    if (tab.key === this.selectKey) {
                        url = tab.tableUrl;
                    }
                })

                const payload = this.queryData

                // 拿到参数后，手动去请求
                $post(`/kpi/work${url}`, payload).then(response => {
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
                // console.log(url, payload)

                $download(`/kpi/work${url}`, payload).then(response => {
                    this.downFile(response, '工作量统计导出')
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

