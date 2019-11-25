<template>
    <div class="msg-bind lugByflight">
        <div class="query-top">
            <query-row :data="queryParam"
                       @handleEnter="queryDataReq(2)"></query-row>
            <div class="toolbar">
                <button @click="cleanQueryData"
                        class="tool-button"
                        :class="loading?'clear':''"
                        :style="{display: 'inline-block','box-sizing':'border-box'}"
                        type="info">
                    重置
                </button>
                <button :name="loading?'loading':''"
                        @click="queryDataReq(2)"
                        class="tool-button"
                        type="primary">
                    查询
                </button>
            </div>
        </div>
        <div class="table-cont container cross">
            <!-- <div class="table-title">
                <div class="left">
                    <span class="label">查询结果</span>
                    <span class="info">共{{pageData.total}}条</span>
                </div>
                <div class="right">
                    <pagination :options="pageData.options"
                                :size="pageData.size"
                                :total="pageData.total"
                                @changeData="queryDataReq"
                                v-model="pageData.num"></pagination>

                    <div class="nodeRight" @click="multipleEdit">
                        <img src="~@img/flow/edit_icon.png" width="20px" height="20px"/>
                        <div>批量修改</div>
                    </div>
                </div>
            </div> -->
            <div class="msg-bind-body">
                <tables :loading="tableData.loading"
                        :tableData="tableData"
                        class="msg-bind-body-left"
                        ref="tables">
                    <template v-slot:slot-body="{index, row, item}">
                        <!-- 序号 -->
                        <template v-if="item.key==='id'">
                            <div>{{index+1 +(pageData.num-1)*pageData.size}}</div>
                        </template>

                        <!-- 员工编号 -->
                        <template v-if="item.key==='empNo'">
                            <b style="text-decoration: underline; cursor: pointer"
                               @click="detailRow(row)">{{row.empNo}}</b>
                        </template>

                        <!-- 角色 -->
                        <template v-if="item.key==='roleList'">
                            <div style="width: 100%;padding:0 10px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap">
                                {{row&&row.roleList&&row.roleList.length>0?row.roleList.join("，"):""}}
                            </div>
                        </template>
                        <!-- 已绑定消息 -->
                        <template v-if="item.key==='subscriList'">
                            <div class="msg-info-list">
                                <template v-if="row.subscriMap">
                                    <template v-if="row.subscriMap.flight">
                                        <template v-for="msg in row.subscriMap.flight">
                                            <div class="msg-info flight" :key="msg">
                                                {{msg}}
                                            </div>
                                        </template>
                                    </template>
                                    <template v-if="row.subscriMap.transfer">
                                        <template v-for="msg in row.subscriMap.transfer">
                                            <div class="msg-info transfer" :key="msg">
                                                {{msg}}
                                            </div>
                                        </template>
                                    </template>
                                    <template v-if="row.subscriMap.task">
                                        <template v-for="msg in row.subscriMap.task">
                                            <div class="msg-info task" :key="msg">
                                                {{msg}}
                                            </div>
                                        </template>
                                    </template>
                                    <template v-if="row.subscriMap.warning">
                                        <template v-for="msg in row.subscriMap.warning">
                                            <div class="msg-info warning" :key="msg">
                                                {{msg}}
                                            </div>
                                        </template>
                                    </template>
                                </template>
                            </div>
                        </template>
                        <!-- 操作 -->
                        <template v-if="item.key==='edit'">
                            <div class="msg-bind-edit-btn-list">
                                <img class="edit-btn"
                                     src="~@img/flow/edit.png"
                                     width="24px" height="24px"
                                     @click.stop="editRow(row)"/>
                                <img class="detail-btn"
                                     src="~@img/flow/detail_btn.png"
                                     width="24px" height="24px"
                                     @click.stop="detailRow(row)"/>
                            </div>
                        </template>
                    </template>
                </tables>
            </div>
            <div class="table-title">
                <div class="left">
                    <span class="label">查询结果</span>
                    <span class="info">共{{pageData.total}}条</span>
                </div>
                <div class="right">
                    <pagination :options="pageData.options"
                                :size="pageData.size"
                                :total="pageData.total"
                                @changeData="queryDataReq"
                                v-model="pageData.num"></pagination>

                    <div class="nodeRight" @click="multipleEdit">
                        <img src="~@img/flow/edit_icon.png" width="20px" height="20px"/>
                        <div>批量修改</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 消息详情 -->
        <MessageBindDetail v-if="private_isDetailShow"
                           :detailInfo="selectDetail"
                           :closeDetail="closeDetail"/>
        <!-- 消息编辑 -->
        <MessageBindEdit v-if="private_isEditShow"
                         :edit_type="private_editType"
                         :singleRowData="singleRowData"
                         :closeEdit="closeEdit"/>
    </div>
</template>

<script>
    import QueryRow from '@view/QueryRow/QueryRow'
    import Pagination from '@view/Pagination/Pagination'
    import Tables from '@view/Table/Table'
    import tableMixin from '@mixin/tableMixin'
    import MessageBindDetail from './MessageBindDetail'
    import MessageBindEdit from "./MessageBindEdit";

    export default {
        components: {
            QueryRow,
            Pagination,
            Tables,
            MessageBindDetail,
            MessageBindEdit
        },
        mixins: [
            tableMixin
        ],
        data () {
            return {
                // 消息详情是否显示
                private_isDetailShow: false,
                // 消息详情的内容
                selectDetail: {},

                // 消息编辑是否显示
                private_isEditShow: false,
                // 单行编辑"single"还是多重编辑"multiple"
                private_editType: 'single',
                // 单行编辑时，被编辑目标
                singleRowData: {},

                // 请求路径
                queryUrl: '/imMessage/messageSubscribe/queryMsgSubscribe', // /',pageQuery
                pageData: {
                    num: 1,
                    size: 10,
                    total: 0
                },
                queryParam: [
                    {
                        key: 'empName',
                        label: '员工姓名',
                        type: 'input',
                        width: 214,
                        // toUpper: true,
                        class: 'mb14'
                    },
                    {
                        key: 'roleName',
                        label: '角色名称',
                        type: 'input',
                        width: 214,
                        // toUpper: true,
                        class: 'mb14'
                    },
                    {
                        key: 'subscriName',
                        label: '已绑定消息',
                        type: 'input',
                        width: 214,
                        // toUpper: true,
                        class: 'mb14'
                    },
                ],
                tableData: {
                    // height: 700, // 不应该加这个属性，加了表格区域就会被限高
                    loading: false,
                    multSelection: [],
                    key: 'msg-bind',
                    type: 'signle',
                    column: [
                        // left
                        [
                            {
                                key: 'id',
                                label: '序号',
                                width: 100,
                                type: 'slot'
                            },
                            {
                                key: 'empNo',
                                label: '员工编号',
                                width: 200,
                                type: 'slot',
                            },
                            {
                                key: 'empName',
                                label: '员工姓名',
                                width: 200,
                            },
                            {
                                key: 'roleList',
                                label: '角色',
                                width: 300,
                                type: 'slot'
                            },
                            {
                                key: 'subscriList',
                                label: '已绑定消息',
                                width: 800,
                                // title: true,
                                type: 'slot'
                            },
                            {
                                key: 'edit',
                                label: '操作',
                                width: 200,
                                // title: true,
                                type: 'slot'
                            },
                        ],
                        // center
                        [],
                        // right
                        [
                            // {label: '', key: 'scroll', width: 8, type: 'slot'}
                        ]
                    ],
                    data: []
                },
            }
        },
        methods: {
            // 批量修改
            multipleEdit () {
                // console.log(this.tableData.multSelection);
                this.private_editType = 'multpile';
                this.private_isEditShow = true;
                this.singleRowData = {};
            },

            // 编辑消息
            editRow (row) {
                // console.log('edit', row);
                this.private_editType = 'single';
                this.private_isEditShow = true;
                this.singleRowData = row;
            },
            // 查看详情
            detailRow (row) {
                this.selectDetail = row;
                this.private_isDetailShow = true;
            },
            // 关闭查看详情
            closeDetail () {
                this.selectDetail = {};
                this.private_isDetailShow = false;
            },
            // 关闭编辑
            closeEdit (isUpdate) {
                this.private_isEditShow = false;
                this.singleRowData = {};
                if (isUpdate) {
                    this.queryDataReqReset();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .msg-bind {
        position: relative;

        .query-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px 0;
            background: #fff;
            box-shadow: 0px 4px 8px 0px rgba(104, 129, 153, 0.1);
            border-radius: 8px;

            .query-row {
                width: 100%;
            }

            /deep/.query-item {
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .el-date-editor--daterange.el-input__inner {
                    width: 221px;
                }

                &.mt14 {
                    margin-top: 14px;
                }

                &.mb14 {
                    margin-bottom: 14px;
                }
            }

        }

        .toolbar {
            height: 38px;
            align-self: flex-start;
            min-width: 160px;

            .tool-button {
                display: inline-flex;
                padding: 4px 16px;
                font-size: 14px;
                cursor: pointer;
                margin-left: 10px;
                height: 38px;
                width: 60px;
                line-height: 32px;
                vertical-align: top;
            }

            .tool-button.clear {
                width: 70px;
            }

            .tool-button[name='loading'] {
                width: 120px;
            }
        }

        div > .table {
            .table-header {
                .row_height_2 {
                    $rowHeight: 66px;
                    max-height: $rowHeight !important;
                    height: $rowHeight !important;
                    line-height: $rowHeight !important;
                }
            }

            .table-body {

                .left-table {
                    overflow: auto;
                }

                .center-table {
                    table {
                        margin-left: -1px;
                    }
                }

                .col-pro {
                    height: 100%;

                    > div {
                        &:first-child {
                            height: 50%;
                            line-height: 100%;
                            padding: 0 12px;
                            justify-content: space-between;
                            align-items: center;

                            .label {
                                color: $gray-nd;
                            }
                        }

                        &:last-child {
                            position: relative;
                            height: 50%;
                        }
                    }
                }
            }

            td {
                .type {
                    font-size: 12px;
                    height: 12px;
                    line-height: 12px;
                    text-align: center;
                    color: $gray-nd;
                }

                .value {
                    margin-top: 8px;
                    font-size: 14px;
                    height: 14px;
                    line-height: 14px;
                    text-align: center;
                    color: $gray-st;
                }
            }
        }

        .table-cont {
            height: calc(100% - 80px);

            .right {
                .pagination {
                    margin-top: 9px;
                }

                .nodeRight {
                    display: inline-block;
                    color: #3392ff;
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 52px;
                    height: 100%;
                    cursor: pointer;
                    width: 100px;
                    margin-left: 32px;
                }

                .nodeRight img {
                    float: left;
                    margin-top: 16px;
                    margin-right: 5px;
                }
            }
        }
    }

    .lugByflight {
        /*height: calc(100% - 60px);*/
        height: 100%;


        .msg-bind-body {
            display: flex;
            height: calc(100% - 52px);

            .msg-bind-body-left {
                flex: 1;
                height: auto !important;
            }

            .msg-info-list {
                height: 100%;
                width: 100%;
                white-space: normal;
                text-align: left;
                line-height: 40px;
                padding: 5px 0;
                /*text-overflow: ellipsis;*/
                /*overflow: hidden;*/
                /*white-space: nowrap;*/

                .msg-info {
                    display: inline-block;
                    padding: 0 10px;
                    height: 32px;
                    line-height: 32px;
                    background: rgba(51, 161, 255, 0.1);
                    /*opacity: 0.1;*/
                    border-radius: 6px;
                    color: #33A1FF;
                    margin-right: 10px;
                    text-align: center;
                }

                .flight {
                    background: #e7f3fe;
                    color: #33a1ff;
                }

                .transfer {
                    background: #eeeefe;
                    color: #696BFF;
                }

                .task {
                    background: #e1f7ef;
                    color: #01B674;
                }

                .warning {
                    background: #fff0e5;
                    color: #FF8022;
                }
            }

            .msg-bind-edit-btn-list {
                position: relative;
                height: 100%;
                width: 100%;

                .edit-btn {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin-left: -20px;
                    cursor: pointer;
                }

                .detail-btn {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin-left: 20px;
                    cursor: pointer;
                }
            }
        }
    }
</style>

<style lang="scss">
    .msg-bind {
        .msg-bind-body {
            .msg-bind-body-left {
                .table-body {
                    height: auto !important;

                    .left-table {
                        overflow: auto;
                        height: auto !important;
                    }
                }
            }
        }
    }
</style>
