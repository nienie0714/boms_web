<template>
    <!-- 员工上岗查询、装卸排班 -->
    <div class="templateContent">
        <div class="query-top">
            <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
            <div class="toolbar">
                <button type="info" @click="cleanQueryData">重置</button>
                <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
            </div>
        </div>
        <div class="table-cont container cross">
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
                        <template slot-scope="scope">
    						<div v-if="item.key == 'index'">{{ scope.$index + (pageData.num - 1) * pageData.size + 1}}</div>
                            <div v-if="item.key == 'empName'">
                                <span :class="scope.row[item.key]?'bold-underline':''" @click="openDetail({type: 'detail', row: scope.row})" :title="scope.row[item.key]">{{scope.row[item.key]?scope.row[item.key]:'-'}}</span>
                            </div>
                            <div v-if="item.key == 'flightNo2' || item.key == 'stand' || item.key == 'chute'">
                                <!-- 1-上班  2-休息 -->
                                <span style="color: #3392FF;">{{scope.row[item.key]}}</span>
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
                            <span :title="scope.row[item.key]">
                                {{showValue(scope.row, item)}}
                            </span>
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
                            <!-- <div v-if="permissions.update " class="table-opr update" @click="openDetail({type: 'update', row: scope.row})"></div> -->
                            <!-- <div v-if="permissions.remove" class="table-opr remove" @click="openRemove(scope.row)"></div> -->
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
                    <div class="toolbar" >
                        <div class="tool-button export" @click="openExport">
                            <div class="icon"></div>
                            <div class="label">导出</div>
                        </div>
                        <!-- <div v-if="permissions.insert" class="tool-button insert" @click="openDetail({type: 'insert'})">
                            <div class="icon"></div>
                            <div class="label">新增</div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
        <confirm-tip :visible="exportData.visible" :data="exportData.data" :info="exportInfo" @handleSubmit="handleExport" @handleClose="handleExportClose" @customBeforExport="customBeforExport"></confirm-tip>
    </div>
</template>
<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
// import Toolbar from '@view/Toolbar/Toolbar'
import Detail from './detail/LoadDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import utilMixin from '@mixin/utilMixin'
import { queryAll, update } from '@/util/base'
import { dateFormat } from '@/util/util'
import _ from 'lodash'
export default {
    components: {
        QueryRow,
        Pagination,
        // Toolbar,
        Detail,
        ConfirmTip
    }, 
    mixins: [tableMixin, formMixin, utilMixin],
    data() {
        return {
            exportInfo: '',
            exportName: '员工上岗查询',
            baseUrl: '/employeePost',
            queryParam: [
                {
                    key: 'dutyDate',
                    label: '值班日期',
                    type: 'elDate',
                    dateType: 'date',
                    format: 'yyyy-MM-dd',
                    valueFormat: 'yyyy-MM-dd',
                    width: 214,
                    defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                    clearable: false,
                    class: 'mb14'
                },
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
                {
                  key: 'nodeNo',
                  label: '岗位角色',
                  type: 'select',
                  width: 214,
                  enumKey: 'nodeNo',
                  itemValue: 'code',
                  itemLabel: 'name',
                }
            ],
            tableData: {
                hasSelect: false,
                loading: false,
                key: 'dutyDetailId',
                operationWidth: 120,
                column: [
                    {key: 'index',  label: '序号', width: 80, type: 'slot'},
                    {key: 'teamName', label: '班组名称', minWidth: 100},
                    {key: 'empName', label: '班组人员', minWidth: 100, type: 'slot'},
                    {key: 'nodeCn',  label: '保障环节', minWidth: 100},
                    {key: 'flightNo1',  label: '计划保障航班号', minWidth: 200},
                    {key: 'flightNo2',  label: '保障中航班号', minWidth: 200, type: 'slot'},
                    {key: 'stand',  label: '保障中航班机位', minWidth: 200, type: 'slot'},
                    {key: 'chute',  label: '保障中滑槽号', minWidth: 200, type: 'slot'},
                    {key: 'flightNo3',  label: '已保障航班号', minWidth: 200}, 
                ],
                data: []
            },
            visibleEnable: false,
            dataEnable: {},
            infoEnable: '',
            todayStr: '',
        }
    },
    mounted() {
        this.queryParam.forEach(item => {
            if (item.key == 'dutyDate') {
                let today = new Date()
                let dayStr = `${today.getFullYear()}-${this.addZero(today.getMonth() + 1)}-${this.addZero(today.getDate())}`;
                this.todayStr = dayStr;
                item.value = dayStr;
                this.$set(this.queryData, item.key, item.value)
            }
        })
        this.queryResourcePerm()
        this.queryDataRefresh()
    },
    methods: {
        openDetail ({type, row}) {
            this.detail.type = type
            this.$set(this.detail, 'data', row || null)
            this.detail.visible = true
        },
        customBeforExport() {
            this.exportInfo = `是否确认导出 ${this.pageData.total} 条数据？`
            return true
        },
        addZero (value) {
            if (value < 10) {
                return `0${value}`
            } else {
                return value
            }
        },
    },
    watch: {

    }

}
</script>
<style lang="scss" scoped>
.templateContent {
    border-radius: 10px;
    height: 100%;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .container.cross {
        flex: 1;
        .toolbar {
            display: inline-flex;

            >.tool-button {
                display: inline-flex;
                padding: 0 20px;
                font-size: 14px;
                cursor: pointer;

                >.icon {
                    width: 20px;
                    height: 20px;
                }

                >.label {
                    margin-left: 6px;
                }

                &.export {
                    >.icon {
                        background-image: url(~@icon/toolbar/icon_export.png);
                    }
                    >.label {
                        color: $gray-nd;
                    }
                }

                &.setlist {
                    >.icon {
                        background-image: url(~@icon/toolbar/icon_setlist.png);
                    }
                    >.label {
                        color: $gray-nd;
                    }
                }

                &.insert {
                    >.icon {
                        background-image: url(~@icon/toolbar/icon_insert.png);
                    }
                    >.label {
                        color: $blue;
                    }
                }

                &:hover {
                    opacity: .8;
                }

                &:not(:last-child) {
                    border-right: 1px solid $gray-border;
                }
            }
        }
    }
    /deep/.el-table--border::after, .el-table--group::after, .el-table::before {
        z-index: 0;
    }
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
            border-top: 1px solid $gray-border!important;
            border-bottom: 1px solid $gray-border!important;
            font-size: 14px;
            font-weight: bold;
            color: #718499;
        } 
        tbody tr {
            height: 50px;
            border-top: 1px solid $gray-border!important;
        }
        
        td {
            padding: 6px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #3d424d;
            font-size: 15px;
            border-bottom: 1px solid $gray-border!important;
            .cell {
                line-height: 30px!important;
                .operate-icon {
                    // cursor: pointer;
                    color: #52565F;
                    padding: 6px 24px;
                    border-radius: 6px;
                    // box-shadow: 0px 5px 20px 0px rgba(99, 126, 153, 0.25);
                    &.active {
                        color: #fff;
                        background: linear-gradient(to right, #3fa2f9, #4982ff);
                        box-shadow: none;
                    }
                }
            }

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
            justify-content: flex-end;
            align-items: center;
            padding: 0 38px;
        }
    }
    
}
</style>


