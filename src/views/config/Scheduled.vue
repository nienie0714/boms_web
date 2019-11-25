<template>
    <!-- 定时任务 -->
    <div class="templateContent">
        <div class="query-top">
            <query-row :data="queryParam" @handleEnter="queryDataReq"></query-row>
            <div class="toolbar">
                <button type="info" @click="cleanQueryData">重置</button>
                <button type="primary" :name="loading?'loading':''" @click="queryDataReq">查询</button>
            </div>
        </div>
        <div class="table-cont container cross">
        <!-- <div class="table-title">
            <div class="left">
                <span class="label">查询结果</span>
                <span class="info">共{{tableData.data.length}}条</span>
            </div>
            <div class="right">
                <toolbar :permissions="permissions"></toolbar>
            </div>
        </div> -->
        <div class="table-load-body" v-if="tableLoading">
            <div  class="table-load">
                <div class="icon-load">
                    <div class="load-center"></div>
                </div>
            </div>
        </div>
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
						<div v-if="item.key == 'index'">{{ scope.$index + 1}}</div>
                        <div v-if="item.key == 'taskCron'" class="label-img" @click="activeTd(scope.$index, item.key)">
                            <div :class="['label-img-inside', popList[scope.$index]&& popList[scope.$index][item.key] ? 'label-img-active' : '']">
                                <span>{{scope.row[item.key]}}</span>
                                <img v-if="popList[scope.$index]&& popList[scope.$index][item.key]" :src="require('@icon/toolbar/icon_row_edit.png')" @click="openPop(scope.row, item.key, $event)">
                            </div>
                        </div>
                        <div v-if="item.key == 'startFlag'">
                            <my-switch
                              :width="80"
                              :active-value="1"
                              :inactive-value="0"
                              active-innertext="启用"
                              inactive-innertext="暂停"
                              v-model="scope.row[item.key]"
                              active-color="#3392FF"
                              inactive-color="#f8fafb"
                              @click="switchHandle(scope.row)">
                            </my-switch>
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
                        <!-- {{scope.row[item.key] || '-'}} -->
                        {{showValue(scope.row, item)}}
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
                        <div class="table-opr restart" title="重启" @click="restartDetail(scope.row)"></div>
                    </div>
				</template>
			</el-table-column>  
        </el-table>
        <div class="table-title">
            <div class="left">
                <span class="label">查询结果</span>
                <span class="info">共{{tableData.data.length}}条</span>
            </div>
            <div class="right">
                <toolbar :permissions="permissions"></toolbar>
            </div>
        </div>
        </div>
        <!-- 启用 停用 -->
        <confirm-tip :visible="visibleEnable" :data="dataEnable" @handleSubmit="handleEnable(dataEnable)" @handleClose="handleEnableClose" :info="infoEnable"></confirm-tip>
        <!-- 编辑 -->
        <my-dialog :visible="popData.visible" :header="false" :footer="false" :position="'center'" :height="187" :width="232" class="td-popover" @handleClose="closeEditPop" :dialogClass="'counter-class'" :top="pop.top" :left="pop.left">
            <div class="td-popover counter-popover">
                <el-main>
                    <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
                        <div class="pop-aircraft" style="margin-top:12px">执行时间</div>
                        <input-tag v-model="editData[editData.key]" :width="200"  :placeholder="'请输入'" :maxlength="20"></input-tag>
                    </el-form>
                </el-main>
                <el-footer>
                    <div class="footer-all">
                        <button type="info" @click="closeEditPop">取消</button>
                        <button type="primary" @click="saveEditPop(editData)">确定</button>
                    </div>
                </el-footer>
            </div>
        </my-dialog>
    </div>
</template>
<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Toolbar from '@view/Toolbar/Toolbar'
import MySwitch from '@view/switch/MySwitch'
import ConfirmTip from '@/views/home/common/ConfirmTip'
// import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'
import utilMixin from '@mixin/utilMixin'
import { queryAllj, update, remove, nopageQueryj } from '@/util/base'
import InputTag from '@view/InputTag/InputTag'
import _ from 'lodash'
export default {
    components: {
        QueryRow,
        Toolbar,
        MySwitch,
        ConfirmTip,
        InputTag
    }, 
    mixins: [ formMixin, utilMixin],
    data() {
        return {
            baseUrl: '/scheduled/taskList',
            permissions: {
                insert: false,
                update: false,
                remove: false,
                detail: false,
            },
            updateUrl: '/scheduled/updateTask',
            queryParam: [
                {
                    key: 'taskDesc',
                    label: '任务名称',
                    type: 'input',
                    width: 214
                },,
            ],
            // 请求的查询参数
            queryData: {},
            loading: false,
            tableData: {
                hasSelect: false,
                loading: true,
                key: 'userId',
                operationWidth: 120,
                column: [
                    {key: 'index',  label: '序号', width: 80, type: 'slot'},
                    {key: 'taskKey', label: '任务key', minWidth: 200,},
                    {key: 'taskClass', label: '任务实现类', minWidth: 300,},
                    {key: 'taskDesc',  label: '任务名称', minWidth: 200,},
                    {key: 'taskCron',  label: '执行时间', minWidth: 200, type: 'slot'},
                    {key: 'startFlag',  label: '状态', minWidth: 160, type: 'slot'},
                ],
                data: []
            },
            tableLoading: false,
            visibleEnable: false,
            dataEnable: {},
            infoEnable: '',
            popList: [],
            popData: {
              visible: false
            },
            pop: {
              left: 0,
              top: 0
            },
            editData: {},
        }
    },
    created() {
        this.queryDataReq();
    },
    methods: {
        activeTd(index,key) {
            this.closeAllPop()
            this.$set(this.popList[index], key, true)
        },
        openPop(row, key, $event) {
            if ($event.clientY > 650) {
            // 向上展示
                this.pop.top = $event.clientY - 187 - 30
            } else {
            // 向下展示
                this.pop.top = $event.clientY + 30
            }
            if ($event.clientX > 1686) {
            // 偏左展示
                this.pop.left = $event.clientX - 232
            } else {
            // 居中展示
                this.pop.left = $event.clientX - 232 / 2
            }
            this.popData.visible = true
            this.editData = {}
            this.editData = Object.assign({}, row)
            this.editData.key = key
        },
        // 关闭所有弹框，并清空弹框
        closeAllPop() {
          this.$set(this, 'popList', [])
          for(let i = 0; i<this.tableData.data.length; i++) {
            this.popList.push({taskCron: false})
          }
        },
        // 保存编辑
        saveEditPop(data) {
            this.$delete(data,'key')
            queryAllj(this.updateUrl, this.editData).then(res => {
                if (res.data.code == 0) {
                    this.$msg.success({
                        info: '保存成功 !'
                    })
                    this.popData.visible = false
                    this.queryDataReq()
                    // }
                } else {
                    this.$msg.error({
                        info: '保存失败 !'
                    })
                    this.closeAllPop()
                    this.popData.visible = false
                }
            }).catch(err => {
                this.$msg.error({
                    info: '请求异常 !'
                })
                this.closeAllPop()
                this.popData.visible = false
            })
        },
        //关闭编辑弹窗
        closeEditPop() {
          this.popData.visible = false
          this.editData = {}
        },
        switchHandle(row,index) {
            // 停用/启用的时候需要提示确认是否停用/启用？
            this.visibleEnable = true;
            this.dataEnable = row;
            this.infoEnable = row.startFlag == 1? '确认暂停此任务？' : '确认启用此任务？'
        },
        
        handleEnableClose() {
            this.visibleEnable = false;
        },
        handleEnable(row) {
            // 确认后请求接口改变状态；
            queryAllj('/scheduled/startOrStop', {
                taskKey: row.taskKey,
                startFlag: row.startFlag == 1? 0 : 1
            }).then(res => {
                if (res.data.code == 0) {
                    this.$msg.success({
                        info: '状态修改成功',
                    })
                    this.queryDataReq()
                } else if (res.data.code == 1) {
                    this.$msg.error({
                        info: res.data.msg
                    })
                } else {
                    this.$msg.error({
                        info: res.data.msg
                    })
                }
                
            }).catch(err => {
                this.$msg.error({
                    info: '请求异常 !'
                })
            })
            this.visibleEnable = false;
            
        },
        // 重启
        restartDetail(row) {
            queryAllj('/scheduled/restart', {
                taskKey: row.taskKey,
            }).then(res => {
                if (res.data.code == 0) {
                    this.$msg.success({
                        info: '状态重启成功'
                    })
                    this.queryDataReq()
                } else if (res.data.code == 1) {
                    this.$msg.error({
                        info: res.data.msg
                    })
                } else {
                    this.$msg.error({
                        info: res.data.msg
                    })
                }
                
            }).catch(err => {
                this.$msg.error({
                    info: '请求异常 !'
                })
            })        
        },
        // 查询
        queryDataReq() {
            this.getQueryData();
            this.loading = true;
            this.tableLoading = true;
            nopageQueryj(this.baseUrl, this.queryData).then(response => {
                if (response.data.code == 0) {
                    if (response.data.data.hasOwnProperty('rows')) {
                        this.tableData.data = response.data.data.rows;
                    } else {
                        this.tableData.data = response.data.data;
                    }
                } else {
                    this.$msg.error({
                        info: '获取列表数据失败 !',
                        tip: '请重新尝试 !'
                    })
                }
                this.$nextTick(()=>{
                    this.tableLoading = false;
                    this.loading = false;
                })
            }).catch(() => {
                this.tableLoading = false;
                this.loading = false;
            })
            this.closeAllPop()
        },
        // 获取查询参数
        getQueryData () {
            var data = {};
            this.queryParam.forEach(item => {
                if (!(item.hasOwnProperty('isHidden') && item.isHidden)) {
                    if (item.value === '') {
                        if (item.hasOwnProperty('key1') && item.hasOwnProperty('key2')) {
                            this.$set(data, item.key1, null)
                            this.$set(data, item.key2, null)
                        } else {
                            this.$set(data, item.key, null)
                        }
                    } else if (item.hasOwnProperty('key1') && item.hasOwnProperty('key2')) {
                        if (item.value) {
                            this.$set(data, item.key1, item.value[0])
                            this.$set(data, item.key2, item.value[1])
                        } else {
                            this.$set(data, item.key1, null)
                            this.$set(data, item.key2, null)
                        }
                    } else {
                        this.$set(data, item.key, item.value)
                    }
                }
            })
            this.queryData = data;
        },
        // 清空查询参数并发送查询请求
        cleanQueryData () {
            var data = this.queryParam
            this.queryParam.forEach((item, index) => {
                if (item.hasOwnProperty('defaultValue')) {
                    data[index].value = item.defaultValue
                } else {
                    if (typeof (item.value) == 'number') {
                        data[index].value = null
                    } else if (typeof (item.value) == 'string') {
                        data[index].value = null
                    } else if (typeof (item.value) == 'boolean') {
                        data[index].value = false
                    } else if (typeof (item.value) == 'undefined') {
                        data[index].value = item.value
                    } else {
                        data[index].value = null
                    }
                }
            })
            this.queryParam = data
            this.queryDataReqReset()
        },
        queryDataReqReset(){
            this.queryDataReq()
        },
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
        position: relative;
    }
    /deep/.el-table--border::after, .el-table--group::after, .el-table::before {
        z-index: 0;
    }
    .table-load-body {
        width: 100%;
        height: calc(100% - 85px);
        top: 85px;
        position: absolute;
    }
    .table-load{
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba($color: $white-shadow, $alpha: .1);
        z-index: 5;
        .icon-load{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            display: inline-block;
            $wh: 56px;
            width: $wh;
            height: $wh;
            background-image: url(~@img/load/bg_loading.png);
            box-shadow: 0 10px 30px rgba($color: $black-shadow, $alpha: .3);
            border-radius: 50%;
            .load-center {
                $whc: 30px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                width: $whc;
                height: $whc;
                background-image: url(~@img/load/icon_loading.png);
                animation-fill-mode: both;
                animation: rotate 1.5s 0s linear infinite;
            }
        }
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
            &.restart {
                background-image: url(~@icon/table/icon_restart.png);

                &:hover {
                    background-image: url(~@icon/table/icon_restart_hover.png);
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
            padding: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #3d424d;
            font-size: 15px;
            border-bottom: 1px solid $gray-border!important;
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
    .label-img {
        height: 48px;
        line-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        .label-img-inside {
            margin: 0 4px;
            padding: 0 15px;
            height: 30px;
            line-height: 30px;
            border-radius: 3px;
            &.label-img-active {
                background-color: #EAF4FF;
                color: #3392FF;
            }
            img {
                cursor: pointer;
                margin-left: 12px;
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
    /deep/.el-switch {
        height: 30px;
        line-height: 30px;
        .el-switch__core:after {
            width: 26px;
            height: 26px;
        }
        &.is-checked .el-switch__core::after {
            margin-left: -27px;
        }
    }
    
}
/deep/.counter-class {
  margin: 0 !important;
}
</style>


