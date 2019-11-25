<template>
    <div class="mesLogContent">
        <!-- <None :desc="description"></None> -->
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
                          <template v-if="item.key=='msgText'" >
                             <div @click="openDetail({type:'detail',row})" >{{row[item.key]}}</div>
                          </template>
                          <template v-else-if="item.key == 'index'">
                              <div>{{ index + (pageData.num - 1) * pageData.size + 1}} </div>
                          </template>
                          <template v-else-if="item.key=='createtime'">
                             <div class="img-label">
                                <img :src="require('../../../assets/img/icon/log/icon_send.png')" v-if="row[item.key] && row[item.key].includes('-')"/>
                                <span>{{formartValue(row,item)}}</span>
                             </div>
                          </template>
                          <template v-else-if="item.key=='readTime'|| item.key=='reciverTime'">
                             <div class="img-label">
                                <img :src="require('../../../assets/img/icon/log/icon_read.png')" v-if="row[item.key] && row[item.key].includes('-')"/>
                                <span>{{formartValue(row,item)}}</span>
                             </div>
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
        
    </div>
</template>
<script>
import None from'../../home/common/none'
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/MessageRecordDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'

import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'

import { queryAll, update } from '@/util/base'
import { dateFormat } from '@/util/util'

import _ from 'lodash'

export default {
    components: {
        // None
        QueryRow,
        Pagination,
        Toolbar,
        Tables,
        Detail,
        // ConfirmTip
    },
    mixins: [tableMixin, formMixin],
    data() {
        return {
            description: '',
            baseUrl:'',
            queryUrl:'/imMessage/messageDefineAction/queryMsgHistory',
            title:'消息记录',
            queryParam:[
                {
                    key: 'reciverName',
                    label: '接收者',
                    type: 'input',
                    width: 214
                 },

                {
                    key: 'sendName',
                    label: '发送者',
                    type: 'input',
                    width: 214
                 },
                  {
                    key: 'msgSubType',
                    label: '消息类型',
                    type: 'select',
                    width: 214,
                    enumKey: 'msgSubType',
                    itemValue: 'code',
                    itemLabel: 'name',
                    value: null,
                    class: 'mb14'
                 },
                 {
                    key: 'publishDate',
                    label: '发布日期',// 航班日期
                    type: 'elDate',
                    dateType: 'date',
                    format: 'yyyy-MM-dd',
                    valueFormat: 'yyyy-MM-dd',
                    defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                    clearable: false,
                    width: 214,
                    class: 'mb14'
                  },
                  {
                    key: 'startTime',
                    key1: 'startTime',
                    key2: 'endTime',
                    label: '发布时间',// todo 发布时间
                    type: 'elTimeRange',
                    dateType: 'timeRange',
                    format: 'HH:mm',
                    valueFormat: 'HH:mm',
                    defaultValue: [dateFormat(new Date(), 'HH:mm'),dateFormat(new Date(new Date().getTime() - 1800 * 1000) , 'HH:mm')],
                    clearable: false,
                    width: 300,
                    class: 'mb14'
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
                    key:'msgId',
                    column:[
                        //left
                        [
                            {key: 'index',  label: '序号', width: 80, type: 'slot'},
                            {key: 'sendName',  label: '发送者', width: 100},
                            {key:'reciverName', label:'接收者', width:150},
                            {key:'msgTypeCn', label:'消息类型', width:200},
                            {key:'msgTypeSubCn', label:'消息子类型', width:200},
                            {key: 'createtime',  label: '发布时间', width: 250,type:'slot'},
                            {key: 'readTime',  label: '已读时间', width: 250,type:'slot'},
                           // {key: 'reciverTime',  label: '已读时间', width: 300,type:'slot'},
                            {key: 'msgText',  label: '消息内容', width: 300,colClass: 'bold-underline',type: 'slot'},
                        ],
                        //center
                        [
                        ],
                        //righte
                        [
                             {label: '操作', type: 'opr', width: 100}
                        ]
                    ],
                    data:[]
            },
            permissions:{
                detail:true
            }

        }   
    },
    mounted(){
        //  this.tableData.data=[
        //      {sender:'胡玥',receiver:'dd,ff,gg',messageType:'行李',messageChlidType:'中转行李',sendTime:'2019-06-11 10:56',readTime:'2019-09-08 09:56',content:'只是一段文字'}
        //  ]
        this.queryParam.forEach(item => {
           if(item.key=='startTime'){
                let today = new Date()
                let today2 = new Date(new Date().getTime() - 1800 * 1000) // 半小时前
                let dateStr = `${this.addZero(today.getHours())}:${this.addZero(today.getMinutes())}`
                let dateStr2 = `${this.addZero(today2.getHours())}:${this.addZero(today2.getMinutes())}`
                item.value = [dateStr2, dateStr]
                item.defaultValue = [dateStr2, dateStr];

                this.$set(this.queryData, item.key1, dateStr2)
                this.$set(this.queryData, item.key2, dateStr)       
           }
           if(item.key=='publishDate'){
                let today = new Date()
                let dateStr = `${today.getFullYear()}-${this.addZero(today.getMonth() + 1)}-${this.addZero(today.getDate())}`
                item.value = dateStr;
                this.$set(this.queryData, item.key, item.value)
           }
        })
    },
    methods:{
        addZero (value) {
          if (value < 10) {
            return `0${value}`
          } else {
            return value
          }
        },
        formartValue(row,item){
          let value = row[item.key]
          if(row[item.key]!=null){
          value = value.substring(0,16)
            return value
          }else{
            return value
          }
        },
    }

}
</script>
<style lang="scss" scoped>
  .img-label {
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-right: 8px;
    width: 14px;
  }
};  
 div.query-top > div.toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 62px;
 };
 div.query-top > div.toolbar > button {
    height: 100%;
    line-height: 100%;
 };
.query-top >.toolbar > button:not(:last-child) {
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
.mesLogContent{
  height: calc(100%);
  display: flex;
  flex-direction: column
}
</style>


