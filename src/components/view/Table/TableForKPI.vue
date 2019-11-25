<!-- KPI 指标统计专用表格。由于 KPI 这边页面情况比较特殊，所以专门封装了一个表格使用 -->
<template>
    <!-- 表格最外围的 div，包括查询结果行、表格、合计 -->
    <div class="kpi-table">
        <div class="kt-table-header">
            <table class="kt-table">
                <thead class="kt-table-header">
                <tr>
                    <th v-if="isHasID"
                        :style="{width: `${100 / totalWidth * 100}%`}">
                        <b>序号</b>
                    </th>
                    <template v-for="col in columns">
                        <th :key="col.key"
                            :style="Object.assign({}, col.thStyle, getWidthPercent(col))">
                            <b>{{col.label}}</b>
                        </th>
                    </template>
                </tr>
                </thead>
            </table>
        </div>
        <!-- 用于遮罩滚动条 -->
        <div class="scroll-mask">
            <div class="scroll-mask-bgcolor"></div>
        </div>
        <div class="scroll-mask scroll-mask-footter">
            <div class="scroll-mask-bgcolor"></div>
        </div>

        <div class="kt-table-box">
            <table class="kt-table">
                <!--                <thead class="kt-table-header">-->
                <!--                <tr>-->
                <!--                    <th v-if="isHasID"-->
                <!--                        :style="{width: `${100 / totalWidth * 100}%`}">-->
                <!--                        <b>序号</b>-->
                <!--                    </th>-->
                <!--                    <template v-for="col in columns">-->
                <!--                        <th :key="col.key"-->
                <!--                            :style="Object.assign({}, col.thStyle, getWidthPercent(col))">-->
                <!--                            <b>{{col.label}}</b>-->
                <!--                        </th>-->
                <!--                    </template>-->
                <!--                </tr>-->
                <!--                </thead>-->

                <tbody class="kt-table-body">
                <template v-for="(trData, index) in tableData">
                    <tr :key="index">
                        <td v-if="isHasID"
                            :style="{width: `${100 / totalWidth * 100}%`}">
                            {{ index+1 }}
                        </td>
                        <template v-for="col in columns">
                            <td :key="col.key"
                                :style="Object.assign({}, col.tdStyle, getWidthPercent(col))">
                                {{col.formatValue && typeof col.formatValue === 'function' ?
                                col.formatValue(trData[col.key], trData, tableData) : trData[col.key]}}
                            </td>
                        </template>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>

        <div class="kt-footter">
            <table class="kt-footter-table">
                <tr>
                    <!-- 宽度 100：默认序号列宽度。宽度 columns[0].width，使用原本第一列。因此在其他地方使用时，需要注意适用度问题 -->
                    <td :style="{width: `${(isIgnoreFirstCol?columns[0].width:100) / totalWidth * 100}%`}">
                        合计
                    </td>

                    <!-- 有totalColumns时使用totalColumns，否则使用 columns -->
                    <template v-for="col in (totalColumns?totalColumns:columns)">
                        <td :key="col.key"
                            :style="Object.assign({}, col.tdStyle, getWidthPercent(col))">
                            {{getTotalRowText(col)}}
                        </td>
                    </template>
                </tr>
            </table>
        </div>
        <div class="kt-header">
            <div class="kt-header-left">
                <span class="kt-h-result">查询结果</span>
                <span class="kt-h-total">共{{tableData.length}}条数据</span>
            </div>
            <div v-if='exportVisible'
                 class="kt-header-right"
                 @click="exportDialogShow">
                <div class="icon"></div>
                <div class="label">导出
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "TableForKPI",
        props: {
            columns: Array,
            totalColumns: Array,
            tableData: Array,
            exportDialogShow: Function,

            // 为 false 时，不显示序号列
            isHasID: {
                type: Boolean,
                default: true
            },
            exportVisible: {
                type: Boolean,
                default: true
            },
            // 是否在合计行不显示内容区域第一列。
            // 比如原本 有三列，但是合计行不显示第一列，于是就要这个值设为 true
            // 这个用于处理特殊情况
            isIgnoreFirstCol: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            // 所有宽度综合，最后要用当前 col 设置的 width 除以这个值，计算宽度百分比
            totalWidth () {
                let width = 0;
                let currentColumns = [
                    ...this.columns
                ]
                if (this.isHasID) {
                    currentColumns = [
                        {
                            key: 'id',
                            label: '序号',
                            width: 100
                        },
                        ...currentColumns
                    ]
                }
                currentColumns.forEach(col => {
                    width += col.width
                })
                return width
            },
            // 总计那一排的数据
            totalObject () {
                let totalObject = {}
                let keys = []
                this.columns.forEach(col => {
                    if (this.tableData.length === 0) {
                        totalObject[col.key] = '';
                    } else {
                        totalObject[col.key] = 0;
                    }
                    keys.push(col.key)
                })
                this.tableData.forEach(item => {
                    keys.forEach(key => {
                        if (Number(item[key]) !== Number(item[key])) {
                            if (totalObject[key] === 0) {
                                totalObject[key] = ''
                            }
                            totalObject[key] = totalObject[key] + '';
                        } else {
                            totalObject[key] = totalObject[key] + item[key]
                        }
                    })
                })
                return totalObject
            }
        },
        methods: {
            // 算出当前宽度的比例
            getWidthPercent (col) {
                return {width: `${col.width / this.totalWidth * 100}%`}
            },
            // 合计行，处理输出数据
            getTotalRowText (col) {
                let result = '';
                if (col.formatValue && typeof col.formatValue === 'function') {
                    result = col.formatValue(this.totalObject[col.key], this.totalObject);
                } else {
                    result = this.totalObject[col.key]
                }
                return result;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .kpi-table {
        @import "~@style/global.scss";
        position: relative;
        height: 100%;
        width: 100%;
        background-color: #fff;
        box-shadow: 0px 4px 8px 0px rgba(104, 129, 153, 0.1);
        border-radius: 8px;
        overflow: hidden;

        .scroll-mask {
            position: absolute;
            top: 0;
            right: 0;
            width: 15px;
            height: 34px;
            z-index: 10;
            background-color: #fff;
            /*border-top: 1px solid #dde6ed;*/
            /*border-bottom: 1px solid #dde6ed;*/

            .scroll-mask-bgcolor {
                width: 100%;
                height: 100%;
                background-color: rgba(221, 230, 237, 0.2);
            }
        }

        .scroll-mask.scroll-mask-footter {
            top: auto;
            bottom: 48px;
            height: 51px;

            .scroll-mask-bgcolor {
                background-color: #fff;
                border-top: 1px solid #dde6ed;
            }
        }

        .kt-header {
            position: absolute;
            width: 100%;
            height: 48px;
            bottom: 0;
            border-top: 1px solid #dde6ed;

            .kt-header-left {
                position: absolute;
                top: 0;
                left: 20px;
                height: 48px;
                line-height: 48px;

                .kt-h-result {
                    color: #3d424c;
                    font-weight: bold;
                    font-size: 16px;
                }

                .kt-h-total {
                    color: #899db2;
                    font-size: 16px;
                    margin-left: 12px;
                }
            }

            .kt-header-right {
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

        .kt-table-header {
            position: relative;
            height: 34px;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;


            .kt-table {
                position: relative;
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                /*border-bottom: 1px solid #dde6ed;*/

                .kt-table-header tr {
                    /*border-top: 1px solid #dde6ed;*/
                    /*border-bottom: 1px solid #dde6ed;*/
                    height: 34px;
                    background-color: rgba(221, 230, 237, 0.2);
                    /*background-color: red;*/

                    th {
                        font-weight: bold;
                        font-size: 14px;
                        color: #718499;
                    }
                }
            }
        }

        .kt-table-box {
            position: absolute;
            top: 34px;
            left: 0;
            width: 100%;
            bottom: 98px;
            overflow-y: scroll;
            overflow-x: hidden;

            .kt-table {
                position: relative;
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                border-bottom: 1px solid #dde6ed;

                .kt-table-body {
                    td {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #3d424d;
                        font-size: 15px;
                        border-bottom: 1px solid #dde6ed;
                        height: 51px;
                        font-weight: normal;
                    }
                }
            }
        }

        .kt-footter {
            position: absolute;
            bottom: 48px;
            left: 0;
            width: 100%;
            height: 51px;
            overflow-y: scroll;
            overflow-x: hidden;

            .kt-footter-table {
                height: 51px;
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;

                tr {
                    height: 51px;
                }

                td {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #3d424d;
                    font-size: 14px;
                    border-top: 1px solid #dde6ed;
                    height: 51px;
                    font-weight: normal;
                }
            }
        }
    }
</style>
