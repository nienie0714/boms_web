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
                    <span class="info">共{{pageData.total}}条数据</span>
                </div>
                <div class="right">
                    <pagination :options="pageData.options"
                                :size="pageData.size"
                                :total="pageData.total"
                                @changeData="queryDataReq"
                                v-model="pageData.num"></pagination>

                    <div class="nodeRight" @click="addSetting">
                        <img src="~@img/flow/edit_icon.png" width="20px" height="20px"/>
                        <div>新增</div>
                    </div>
                </div>
            </div> -->
            <!-- <div class="msg-bind-body"> -->
                <tables :loading="tableData.loading"
                        :tableData="tableData"
                        class="msg-bind-body-left"
                        ref="tables">
                    <template v-slot:slot-body="{index, row, item}">
                        <!-- 序号 -->
                        <template v-if="item.key==='id'">
                            {{index+1 +(pageData.num-1)*pageData.size}}
                        </template>
                        <!-- 序号 -->
                        <template v-if="item.key==='msgTypeCn'">
                            <b style="text-decoration: underline; cursor: pointer" @click="detailRow(row)">{{row.msgTypeCn}}</b>
                        </template>
                        <!-- 操作 -->
                        <!-- <template v-if="item.key==='edit'">
                            <div class="msg-alert-edit-btn-list">
                                <img class="edit-btn"
                                     src="~@img/flow/edit.png"
                                     width="24px" height="24px"
                                     @click.stop="editRow(row)"/>
                                <img class="del-btn"
                                     src="~@img/flow/delete.png"
                                     width="24px" height="24px"
                                     @click.stop="deleteRow(row)"/>
                                <img class="detail-btn"
                                     src="~@img/flow/detail_btn.png"
                                     width="24px" height="24px"
                                     @click.stop="detailRow(row)"/>
                            </div>
                        </template> -->
                        <template v-if="item.type=='slot'">
                            <div class="table-opr update" @click="editRow(row)"></div>
                            <div class="table-opr remove" @click="deleteRow(row)"></div>
                            <div  class="table-opr detail" @click="detailRow(row)"></div>
                        </template>
                    </template>
                </tables>
            <!-- </div> -->
            <div class="table-title">
                <div class="left">
                    <span class="label">查询结果</span>
                    <span class="info">共{{pageData.total}}条数据</span>
                </div>
                <div class="right">
                    <pagination :options="pageData.options"
                                :size="pageData.size"
                                :total="pageData.total"
                                @changeData="queryDataReq"
                                v-model="pageData.num"></pagination>

                    <div class="nodeRight" @click="addSetting">
                        <img src="~@icon/toolbar/icon_insert.png" width="20px" height="20px"/>
                        <div>新增</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 详情 -->
        <AlertSettingsDetail v-if="private_isDetailShow"
                             :detailInfo="selectDetail"
                             :closeDetail="closeDetail"/>

        <!-- 新增或编辑 -->
        <AlertSettingsEdit v-if="private_isEditShow"
                           :selectRowData="selectRowData"
                           :closeEdit="closeEdit"/>
    </div>
</template>

<script>
    import QueryRow from '@view/QueryRow/QueryRow'
    import Pagination from '@view/Pagination/Pagination'
    import Tables from '@view/Table/Table'
    import tableMixin from '@mixin/tableMixin'
    import AlertSettingsDetail from './MessageAlertSettingsDetail'
    import AlertSettingsEdit from './MessageAlertSettingsEdit'

    import {remove as $delete} from '@/util/base';

    export default {
        components: {
            QueryRow,
            Pagination,
            Tables,
            AlertSettingsDetail,
            AlertSettingsEdit
        },
        mixins: [
            tableMixin
        ],
        data () {
            return {
                // 预警详情是否显示
                private_isDetailShow: false,
                // 预警详情的内容
                selectDetail: {},

                // 消息编辑是否显示（包括新增和编辑）
                private_isEditShow: false,
                // 单行编辑时，被编辑目标（根据数据来判断当前是新增还是编辑）
                selectRowData: {},

                // 请求路径
                queryUrl: '/imMessage/messageWarning/queryMsgWarning', // /',pageQuery
                pageData: {
                    num: 1,
                    size: 10,
                    total: 0
                },
                queryParam: [
                    {
                        key: 'msgTypeCn',
                        label: '消息类型',
                        type: 'input',
                        width: 300,
                        class: 'mb14',
                        onChange (val) {
                            return val.replace(/[^0-9a-zA-Z_\-\u4E00-\u9FA5]/g, '').slice(0, 20);
                        }
                    },
                    {
                        key: 'msgTypeSubCn',
                        label: '消息子类型',
                        type: 'input',
                        width: 300,
                        class: 'mb14',
                        onChange (val) {
                            return val.replace(/[^0-9a-zA-Z_\-\u4E00-\u9FA5]/g, '').slice(0, 20);
                        }
                    }
                ],
                tableData: {
                    // height: 700, // 不应该加这个属性，加了表格区域就会被限高
                    loading: false,
                    multSelection: [],
                    key: 'alert-setting',
                    type: 'signle',
                    column: [
                        // left
                        [
                            {
                                key: 'id',
                                label: '序号',
                                width: 75,
                                type: 'slot'
                            },
                            {
                                key: 'msgTypeNo',
                                label: '消息类型编号',
                                width: 200
                            },
                            {
                                key: 'msgTypeCn',
                                label: '消息类型名称',
                                width: 200,
                                type: 'slot'
                            },
                            {
                                key: 'msgTypeSubNo',
                                label: '消息子类型编号',
                                width: 200,
                            },
                            {
                                key: 'msgTypeSubCn',
                                label: '消息子类型名称',
                                width: 300
                            },
                            {
                                key: 'warning1',
                                label: '预警阈值1',
                                width: 120,
                            },
                            {
                                key: 'warning2',
                                label: '预警阈值2',
                                width: 120,
                            },
                            {
                                key: 'remark',
                                label: '备注',
                                width: 240,
                            },
                            // {
                            //     key: 'edit',
                            //     label: '操作',
                            //     width: 150,
                            //     type: 'slot'
                            // },
                        ],
                        // center
                        [],
                        // right
                        [
                            {label: '操作', width: 220, type: 'slot'}
                        ]
                    ],
                    data: []
                },
            }
        },
        methods: {
            // 新增
            addSetting () {
                this.private_isEditShow = true;
                this.selectRowData = {};
            },
            // 编辑
            editRow (row) {
                // console.log('edit', row);
                this.private_isEditShow = true;
                this.selectRowData = row;
            },
            // 删除预警设置
            deleteRow (row) {
                // console.log('delete', row);
                this.$confirm('你是否确认删除该消息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const msgWarnId = row.msgWarnId;
                    $delete('/imMessage/messageWarning', {ids: [msgWarnId]}).then(response => {
                        if (response.data.code !== 0) {
                            return this.$msg.error({info: response.data.msg});
                        }
                        this.queryDataReqReset();
                        this.$msg.success({
                            info: '删除成功，表格已刷新'
                        })
                    }).catch(() => {
                        this.$msg.error({info: '未知错误'});
                    })
                }).catch(() => {
                    // this.$message.info('已取消删除')
                });

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
                this.selectRowData = {};

                if (isUpdate) {
                    // 更新表格，目前没有做其他逻辑处理，主要是封装的表格似乎他喵的没提供更新方法
                    this.queryDataReqReset();
                    this.$msg.success({
                        info: '表格已刷新'
                    })
                    // this.$message.success('表格已刷新')
                }
            }
        }
    }
</script>

<style lang="scss">
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

            .query-item {
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
                width: 70px;
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
        .right-table {
            margin-left: -1px;
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
                    width: 70px;
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

    .lugByflight.msg-bind {
        /*height: calc(100% - 60px);*/
        height: 100%;
        flex-direction: column;


        // .msg-bind-body {
            display: flex;
            // height: calc(100% - 48px);

            .msg-bind-body-left {
                flex: 1;
            }

            .msg-info-list {
                height: 100%;
                width: 100%;
                white-space: normal;
                text-align: left;
                line-height: 40px;
                padding: 5px 0;

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

            .msg-alert-edit-btn-list {
                position: relative;
                height: 100%;
                width: 100%;

                .edit-btn {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin-left: -40px;
                    cursor: pointer;
                }

                .del-btn {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin-left: 0;
                    cursor: pointer;
                }

                .detail-btn {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin-left: 40px;
                    cursor: pointer;
                }
            }
        // }
    }
</style>
