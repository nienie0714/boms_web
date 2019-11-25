<template>
    <div class="agency">
        <div class="query-top">
            <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
            <div class="toolbar">
                <button type="info" @click="cleanQueryData">重置</button>
                <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
            </div>
        </div> 
        <div class="table-cont container cross">

            <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove" ref="tables">
                <template v-slot:slot-body="{index, row, item}">

                    <template v-if="item.key == 'index'">
                        <div>{{ index + (pageData.num - 1) * pageData.size + 1}}</div>
                    </template>

                </template>

            </tables>
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
        <confirm-tip :visible="exportData.visible" :data="exportData.data"  @handleSubmit="handleExport" @handleClose="handleExportClose" :info="exportInfo" @customBeforExport="customBeforExport"></confirm-tip> 
    </div>

</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import formMixin from '@mixin/formMixin'
import tableMixin from '@mixin/tableMixin'
import { queryAll, update ,remove} from '@/util/base'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import Detail from './detail/StandGateDetail'
import _ from 'lodash'

export default {
    components:{
        QueryRow,
        Pagination,
        Toolbar,
        Tables,
        ConfirmTip,
        Detail,
    },
    mixins: [tableMixin, formMixin],
    data() {
        return {
            queryUrl: '/base/gate/pageQuery', // /',pageQuery
            exportUrl: '/base/gate/exportExcel',
            updateUrl:'/base/gate',
            insertUrl:'/base/gate',
            removeUrl:'/base/gate',
            title:'机位',
            exportInfo: '是否确认导出 0 条数据？',
            exportName:'登机口资源',
            pageData: {
              num: 1,
              size: 10,
              total: 0
            },
            permissions:{
               insert: true,
                update: true,
                remove: true,
                detail:true,
                export:true
            },
            queryParam:[
                {
                    key: 'gateNo',
                    label: '登机口编号',
                    type: 'input',
                    width: 214,
                },
            ],
            tableData:{
                    height: 600,
                    multSelection: [],
                    loading: false,
                    key:'gateId',
                    column:[
                        //left
                        [
                            {key: 'index',  label: '序号', width: 110, type: 'slot'},
                            {key:'gateNo',label:'登机口编号',width:220},
                            {key:'remark',label:'备注',width:800}
                        ],
                        //center
                        [

                        ],
                        //right
                        [
                            {label: '操作', type: 'opr', width: 220} 
                        ]
                    ],
                    data:null
            },
        }

    },
    mounted(){
        this.tableData.data = [
            {code:'102354',remark:'Ehuidhfoifyhduoidhfwuyfd98weudowehdkjwehduwedhwejhdejhdedh是,'}
        ]
 
    },
    methods:{
        customBeforExport() {
            this.exportInfo = `是否确认导出 ${this.pageData.total} 条数据？`
            return true
        },
        handleRemove (row) {
            let data = { 
               gateNo:row.gateNo,
            }
            remove (this.removeUrl, data).then(res => {
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
 div.query-top > div.toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 62px;
 };
 div.query-top > div.toolbar > button {
    height: 100%;
    line-height: 100%;
 };
div.query-top >.toolbar > button:not(:last-child) {
    margin-right: 10px;
};
  .toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 0;
    .tool-button {
      display: inline-flex;
      padding: 0 20px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  /deep/.right-table td {
  height: 49px !important;
};
.agency {
  height: calc(100%);
  display: flex;
  flex-direction: column
}
</style>