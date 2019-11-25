<template>
    <div class="noticeContent">
        <!-- <None :desc="description"></None> -->
            <div class="query-top">
                <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
                <div class="toolbar">
                    <button type="info" @click="cleanQueryData">重置</button>
                    <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
               </div>

           </div>
           <div class="table-cont container cross">
                <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove">
                     <template v-slot:slot-body="{index, row, item}">
                          <template v-if="item.key=='msgTypeNo'">
                             <div @click="openDetail({type:'detail',row})">{{row[item.key]}}</div>
                          </template>
                          <template v-else>
                              <div>{{ index + (pageData.num - 1) * pageData.size + 1}} </div>
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
    </div>
</template>
<script>
// import None from'../../home/common/none'
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/MessageDefineDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'

import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'

import { queryAll, update } from '@/util/base'

import _ from 'lodash'
export default {
    components: {
        // None
        QueryRow,
        Pagination,
        Toolbar,
        Tables,
        Detail,
        ConfirmTip
    },
    mixins: [tableMixin, formMixin],
    data() {
        return {
            description: '',
            baseUrl:'',
            queryUrl:'/imMessage/messageDefineAction/queryMessageDefinetion',
            insertUrl:'/imMessage/messageDefineAction',
            updateUrl:'/imMessage/messageDefineAction',
            removeUrl:'/imMessage/messageDefineAction/deleteMsgDefinition',
            title:'消息定义',
            queryParam:[
                  {
                    key: 'msgTypeCn',
                    label: '消息类型',
                    type: 'input',
                    width: 214
                 },
                 {
                    key: 'msgTypeSubCn',
                    label: '消息子类型',
                    type: 'input',
                    width: 214
                 },
            ],
            pageData: {
              num: 1,
              size: 10,
              total: 0
            },
            tableData:{
                    height: 600,
                    multSelection: [],
                    loading: false,
                    key:'defineId',
                    column:[
                        //left
                        [
                            {key: 'index',  label: '序号', width: 100, type: 'slot'},
                            {key: 'msgTypeNo',  label: '消息类型编号', width: 300,colClass: 'bold-underline',type: 'slot'},
                            {key: 'msgTypeCn',  label: '消息类型名称', width: 300},
                            {key: 'msgTypeSubNo',  label: '消息子类型编号', width: 300},
                            {key:'msgTypeSubCn',label:'消息子类型名称',width:300},
                        ],
                        //center
                        [

                        ],
                        //right
                        [
                            {label: '操作', type: 'opr', width: 220}
                        ],
                        
                    ],
                    data:[],
            },
            permissions: {

                insert: true,
                update: true,
                remove: true,
                detail:true,
                import: true,


    },

        }   
    },
  mounted () {
      // this.tableData.data = [
      //     {messageTypeNo:'1029039093',messageTypeName:'行李',messageChildTypeNo:'237892173',messageChildTypeName:'破损',messagePublishType:'不知道',content:'破损啦啦啦啦'},
      //     {messageTypeNo:'1029039693',messageTypeName:'行李',messageChildTypeNo:'23f892173',messageChildTypeName:'破损',messagePublishType:'不知道',content:'破损啦啦啦啦'}
      // ]
  },
  methods: {

 handleRemove (row) {
    let data = { 
   msgTypeId:row.msgTypeId,

    }
    queryAll(this.removeUrl, data).then(res => {
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
 .query-top >.toolbar > button:not(:last-child) {
    margin-right: 10px;
};
 div.query-top > div.toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 62px;
 };
 div.query-top > div.toolbar > button {
    height: 100%;
    line-height: 100%;
 }
  .toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 80px;
    .tool-button {
      display: inline-flex;
      padding: 0 20px;
      font-size: 14px;
      cursor: pointer;
    }
  };
    .table-body {
      .center-table {
        table {
          margin-left: -1px;
        }
      }
      .col-pro {
        height: 100%;
        >div {
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
   }; 
   .insert{
      display: inline-flex;
      padding: 0 20px;
      font-size: 14px;
      cursor: pointer;
      margin: 6px;
    
    >.label {
            color: $blue;
          margin-left: 6px;
          };
    } ; 
.noticeContent{
  height: calc(100%);
  display: flex;
  flex-direction: column
}
</style>


