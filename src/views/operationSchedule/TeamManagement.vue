<template>
    <!-- 班组信息管理 -->
    <div class="teamContent">
        <div class="query-top">
            <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
            <div class="toolbar">
                <button type="info" @click="cleanQueryData">重置</button>
                <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
            </div>
        </div>
        <div class="table-cont container cross">
            <!-- <div class="table-title">
                <div class="left">
                    <span class="label">查询结果</span>
                    <span class="info">共{{pageData.total}}条</span>
                </div>
                <div class="right">
                    <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
                    <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail"></toolbar>
                </div>
            </div> -->
            <el-table
                height="250"
                class="opera-table table"
                :data="tableData.data"
                ref="elTable" 
                style="width: 100%;"
                highlight-current-row>
                <template slot="empty">
                    <div class="empty">
                        <div class="empty-text">无可显示的结果</div>
                    </div>
                </template>
                <el-table-column
    				v-if="tableData.hasSelect"
    				type="selection"
    				width="55">
    			</el-table-column>
                <template v-for="(item, index) in tableData.column" >
    				<el-table-column
                        v-if="item.type == 'slot'"
    					:key="index"
    					:align="item.align || 'center'"
    					:prop="item.key"
    					:label="item.label"
    					:width="item.width"
    					:min-width="item.minWidth">
                        <template slot-scope="scope" >
    						<div v-if="item.key == 'index'">{{ scope.$index + (pageData.num - 1) * pageData.size + 1}}</div>
                            <div v-if="item.key == 'teamName'">
                                <span class="bold-underline" @click="openDetail({type: 'detail', row: scope.row})" :title="scope.row[item.key]">{{scope.row[item.key]}}</span>
                            </div>
    					</template>
    				</el-table-column>
                    <el-table-column
                        v-else
    					:key="index"
    					:align="item.align || 'center'"
    					:prop="item.key"
    					:label="item.label"
    					:width="item.width"
    					:min-width="item.minWidth">
                        <template slot-scope="scope" >
                            <span :title="scope.row[item.key]">{{scope.row[item.key]}}</span>
                        </template>
    				</el-table-column>
    			</template>  
                <el-table-column 
                    fixed="right"
    				v-if="tableData.operationWidth"
    				label="操作" 
                    align="center"
    				:width="tableData.operationWidth">
    				<template slot-scope="scope">
                        <div class="operation-cell">
                            <div v-if="permissions.update" class="table-opr update" @click="openDetail({type: 'update', row: scope.row})"></div>
                        <div v-if="permissions.remove" class="table-opr remove" @click="openRemove(scope.row)"></div>
                        <div class="table-opr detail" @click="openDetail({type: 'detail', row: scope.row})"></div>
                        </div>
    				</template>
    			</el-table-column>  
            </el-table>
            <div class="table-title">
                <div class="left">
                    <span class="label">查询结果</span>
                    <span class="info">共{{pageData.total}}条</span>
                </div>
                <div class="right">
                    <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
                    <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail" style="font-weight:bolder"></toolbar>
                </div>
            </div>
        </div>
        <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
        <confirm-tip :visible="remove.visible" :data="remove.data" @handleSubmit="handleRemove" @handleClose="handleRemoveClose"></confirm-tip>
    </div>
</template>
<script>
// import None from'../home/common/none'
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
// import Tables from '@view/Table/Table'
import Detail from './detail/TeamDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import { queryAll, update, remove } from '@/util/base'
import _ from 'lodash'
export default {
    components: {
        // None,
        QueryRow,
        Pagination,
        Toolbar,
        // Tables,
        Detail,
        ConfirmTip
    }, 
    mixins: [tableMixin, formMixin],
    data() {
        return {
            baseUrl: 'team/teamInfos',
            permissions: {
                insert: false,
                update: false,
                remove: false,
                detail: false,
                export: false,
            },
            insertUrl: 'team',
            updateUrl: 'team',
            removeUrl: 'team',
            queryParam: [
                {
                    key: 'teamName',
                    label: '班组名称',
                    type: 'input',
                    width: 214
                },
                {
                    key: 'empName',
                    label: '人员姓名',
                    type: 'input',
                    width: 214
                },
            ],
            tableData: {
                hasSelect: false,
                loading: false,
                key: 'teamId',
                operationWidth: 200,
                column: [
                    {key: 'index',  label: '序号', width: 80, type: 'slot'},
                    {key: 'teamName',  label: '班组名称', minWidth: 200, type: 'slot'},
                    {key: 'empNames', label: '班组人员', minWidth: 200},
                    {key: 'phone',  label: '联系电话', minWidth: 200},
                    {key: 'remark',  label: '备注', minWidth: 200},
                ],
                data: []
            },
        }
    },
    created() {
       
    },
    methods: {
        openDetail ({type, row}) {
            if(row && !row.lstEmpId) {
                row.lstEmpId = [];
                row.employeeTables = {};
                row.employeeTables.column = [
                    [
                        {key: 'index',  label: '序号', width: 80, type: 'slot'},
                        {key: 'empName',  label: '姓名', width: 180},
                        {key: 'post',  label: '职务', width: 160},
                        {key: 'deptName',  label: '所属部门名称', width: 160},
                    ],
                    [],
                    []
                ];
                row.employeeTables.data = row.lstEmployee || []
            }
            this.detail.type = type
            this.$set(this.detail, 'data', row || {})
            this.detail.visible = true
        },
        openRemove (row) {
            this.remove.data = row
            this.remove.visible = true
        },
        handleRemove (row) {
            let data = {
                teamId: row.teamId
            }
            remove(this.removeUrl, data).then(res => {
                if (res.data.code == 0) {
                    this.$msg.success({
                        info: '删除成功 !'
                    })
                    this.handleRemoveClose()
                    if (this.hasOwnProperty('queryDataReq')) {
                        this.queryDataReq()
                    }
                } else {
                    this.$msg.error({
                        info: '删除失败 !',
                        tip: res.data.msg
                    })
                }
            }).catch(err => {
                this.$msg.error({
                    info: '请求异常 !'
                })
            })
        },
    }

}
</script>
<style lang="scss" scoped>
.teamContent {
    border-radius: 10px;
    height: 100%;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .container.cross {
        flex: 1;
    }
    // /deep/.table {
    //     .table-body tr{
    //         height: 49px;
    //     }
    //     .right-table td{
    //         height: 49px!important;
    //     }
    // }
    .opera-table {
        .table-opr {
            width: 24px;
            height: 24px;
            cursor: pointer;

            &:not(:last-child) {
                margin-right: 16px;
            }
            &.detail {
                background-image: url(~@icon/table/icon_detail.png);
                &:hover {
                    background-image: url(~@icon/table/icon_detail_hover.png);
                }
            }
            &.remove {
                background-image: url(~@icon/table/icon_delete.png);
                &:hover {
                  background-image: url(~@icon/table/icon_delete_hover.png);
                }
            }
            &.reset {
                background-image: url(~@icon/table/icon_reset.png);
                &:hover {
                  background-image: url(~@icon/table/icon_reset_hover.png);
                }
            }
            &.update {
                background-image: url(~@icon/table/icon_update.png);
                &:hover {
                  background-image: url(~@icon/table/icon_update_hover.png);
                }
            }
        }
    }
    /deep/.el-table--border::after, .el-table--group::after, .el-table::before {
        z-index: 0;
    }
    /deep/.el-table {
        .cell {
            white-space: nowrap;
        }
        thead {
            border-top: 1px solid $gray-border;

        }
        th{
            padding: 4px 0;
            background-color: rgba($color: $gray-border, $alpha: .2);
          //  border-top: 1px solid $gray-border!important;
            border-bottom: 1px solid $gray-border!important;
            font-size: 14px;
            font-weight: bold;
            color: #718499;
        }
        tbody tr {
            height: 50px;
            border-top: 1px solid $gray-border!important;
            border-bottom: 1px solid $gray-border!important;
        }
        
        td {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #3d424d;
            font-size: 15px;
            
        }
        .el-table__fixed-right {
            // box-shadow: -4px 0 30px rgba($color: $white-shadow, $alpha: .1);
            z-index: 0;
        }
        .el-table__fixed-right-patch {
            top: 0;
            background-color: rgba($color: $gray-border, $alpha: .2);
            border-top: 1px solid $gray-border!important;
            border-bottom: 1px solid $gray-border!important;
        }

        .el-table__body tr.hover-row.current-row>td,
        .el-table__body tr.hover-row.el-table__row--striped.current-row>td,
        .el-table__body tr.hover-row.el-table__row--striped>td,
        .el-table__body tr.hover-row>td {
            background: transparent;
        }
        .el-table__body tr.current-row>td {
            background-color: rgba($color: $blue-shadow, $alpha: .2);
        }
        .el-table__empty-text {
            width: 100%;
            height: 100%;
            position: relative;
            .empty {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                $wh: 160px;
                width: $wh;
                height: $wh + 40px;
                background-image: url(~@img/load/theme_no_result.png);
                background-repeat: no-repeat;
                .empty-text {
                    $height: 16px;
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    height: $height;
                    line-height: $height;
                    font-size: $height;
                    color: $gray-nd;
                    text-align: center;
                }
            }
        }
    }
    td {
        .operation-cell {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>


