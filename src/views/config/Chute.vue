<template>
    <div class="chute">
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
            <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove" ref="tables">
                <template v-slot:slot-body="{index, row, item}">

                    <template v-if="item.key == 'index'">
                        <div>{{ index + (pageData.num - 1) * pageData.size + 1}}</div>
                    </template>
                    <template v-if="item.key == 'attr'">
                        <div>{{showAttrName(row,item)}}</div>
                    </template>
                    <template v-if="item.key == 'isUseable'">
                        <div>{{showName(row,item)}}</div>
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
import Detail from './detail/ChuteDetail'
import _ from 'lodash'

export default {
    components:{
        QueryRow,
        Pagination,
        Toolbar,
        Tables,
        ConfirmTip,
        Detail
    },
    mixins: [tableMixin, formMixin],
    data(){
        return {
            queryUrl: '/base/terminalResource/pageQuery', // /',pageQuery
            exportUrl: '/base/terminalResource/exportExcel',
            updateUrl:'/base/terminalResource',
            insertUrl:'/base/terminalResource',
            removeUrl:'/base/terminalResource',
            title:'机位',
            exportInfo: '是否确认导出 0 条数据？',
            exportName:'行李滑槽资源',
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
                    key: 'resourceNo',
                    label: '滑槽编号',
                    type: 'input',
                    width: 214
                 },
                {
                    key: 'attr',
                    label: '属性',
                    type: 'select',
                    width: 214,
                    enumKey: 'property',
                    itemValue: 'code',
                    itemLabel: 'name',
                    value: null,
                },
                {
                    key: 'terminalNo',
                    label: '所属航站楼',
                    type: 'select',
                    width: 214,
                    itemValue: 'terminalNo',
                    itemLabel: 'name',
                    url: '/base/terminal/queryAll',
                    class: 'mb14'
                }
            ],
            tableData:{
                    height: 600,
                    multSelection: [],
                    loading: false,
                    key:'chuteId',
                    column:[
                        //left
                        [
                            {key: 'index',  label: '序号', width: 80, type: 'slot'},
                            {key:'resourceNo',label:'滑槽编号',width:220},
                            {key:'attr',label:'属性',width:220,type:'slot'},
                            {key:'agencyCn',label:'地面代理',width:220},
                            {key:'terminalNo',label:'所属航站楼',width:220},
                            {key:'isUseable',label:'状态',width:220,type:'slot'},
                            {key:'remark',label:'备注',width:220}
                        ],
                        //center
                        [],
                        //right
                        [
                            {label: '操作', type: 'opr', width: 220} 
                        ]
                    ],
                    data:null
            }
        }
    },
    mounted(){
        this.customBeforExport()
        this.queryDataReq(2)

    },
    methods:{
        customBeforExport() {
            this.exportInfo = `是否确认导出 ${this.pageData.total} 条数据？`
            return true
        },
        customQueryBefore () {
          this.$set(this.queryData, 'resourceType','CHUTE')
        },
        handleRemove (row) {
            let data = { 
               resourceNo:row.resourceNo,
               terminalNo:row.terminalNo,
               resourceType:'CHUTE'
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
        showAttrName(row,item){
            let value 
            if(row[item.key] == 'M'){
                value = '混合'
            }
            if(row[item.key] == 'D'){
                value = '国内'
            }
            if(row[item.key] == 'I'){
                value = '国际'
            }
            if(row[item.key] == 'R'){
                value = '地区'
            }
            if(row[item.key] == null){
                value = '全部'
            }
           return value
        },
        showName(row,item){
            let value 
            if(row[item.key] == 'Y'){
                value = '开放'
            }
            if(row[item.key] == 'N'){
                value = '关闭'
            }
            return value
        },
        handleSubmit ({data, type, other}) {
            data = this.submitBefore(data, type)
            if(type=='insert'){
                this.$set(data,'resourceType','CHUTE')
            }
            if (data) {
                switch (type) {
                case 'insert': this.insert(data)
                break
                case 'update': this.update(data)
                break
                }

            }
        }
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
  height: 48px !important;
};
.chute {
  height: calc(100%);
  display: flex;
  flex-direction: column
}
</style>