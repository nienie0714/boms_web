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

                <!-- <div class="tableContent"></div> -->
                <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove" ref="tables">
                  <template v-slot:slot-body="{index, row, item}">
                    <template v-if="item.key=='msgTitle'">
                        <div @click="openDetail({type:'detail',row})">{{row[item.key]}}</div>
                      <!-- <div @click="showDetail(row)">{{row[item.key]}}</div> -->
                    </template>
                    <template v-else-if="item.key == 'index'">
                        <div>{{ index + (pageData.num - 1) * pageData.size + 1}} </div>
                    </template>
                    <template v-else-if="item.key=='msgPubStatusCn'" :permissions="permissions">
                        <div class="img-label">
                          <img :src="require('../../../assets/img/icon/log/icon_pubilshed.png')" v-if="row[item.key] && row[item.key].includes('已发布')"/>
                          <img :src="require('../../../assets/img/icon/log/icon_unpublished.png')" v-else-if="row[item.key] && row[item.key].includes('未发布')"/>
                          <span>{{row[item.key]}}</span>
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
                    </div>                
                </div>
            </div>
            <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>

        </div>
</template>
<script>
// import None from'../../home/common/none';
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'

import Tables from '@view/Table/Table'
import Detail from './detail/MessageNoticeRecordDetail'

import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'

import { queryAll, update,  flattenDeep ,getQueryAll} from '@/util/base'

import _ from 'lodash'

export default {
    components: {
        // None,
        QueryRow,
        Pagination,

        Tables,
        Detail,
    },
    mixins: [tableMixin, formMixin],
    data() {
        return {
            description: '',
            queryUrl:'/imMessage/messageTotice/queryNoticeByUser',
            // insertUrl:'/imMessage/messageTotice/noticeSave',
            // updateUrl:'/imMessage/messageTotice/updateNotice',
            // removeUrl:'/imMessage/messageTotice/deleteNotice',
            // detailUrl:'/imMessage/messageTotice/queryToticeDetail',

            title:'通知公告',
            queryParam:[
                  {
                    key: 'msgTitle',
                    label: '公告主题',
                    type: 'input',
                    width: 214
                 },
                 {
                    key: 'PublishDate',
                    key1: 'publishStartDate',
                    key2: 'publishEndDate',
                    label: '发布日期',
                    type: 'elDateRange',
                    dateType: 'daterange',
                    format: 'yyyy-MM-dd',
                    valueFormat: 'yyyy-MM-dd',
                    width: 390, 
                 },
                 {
                   key:'empName',
                   label:'发送人',
                   type:'input',
                   width:214
                 }
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
                    key:'noticeId',
                    column:[
                       // left
                        [
                            {key: 'index',  label: '序号', width: 80, type: 'slot'},
                            {key: 'msgTitle',  label: '公告标题', width: 220,colClass: 'bold-underline',type: 'slot'},
                            {key: 'sendName',  label: '发送人', width: 220},
                            {key: 'publishTime',  label: '发布日期', width: 200,format: [0, 16]},
                            {key: 'createtime',  label: '创建时间', width: 200,format: [0, 16]},
                            {key:'msgPubStatusCn',label:'发布状态',width:200, type: 'slot'},
                            // {key:'msgPubS',label:'发布公告',width:150,type: 'slot'},
                            {key:'msgText',label:'公告内容',width:460},
                        ],
                       // center
                        [
                        ],
                       // right
                        [
                            {label: '操作', type: 'opr', width: 100}
                        ],
                    ],
                    data:[]
         
            },
            permissions:{
               insert: false,
                update: false,
                remove: false,
                detail:true,
            }
        }
    },
mounted () {
  // this.tableData.data = [
  // {msgTitle:'测试',empName:'cwq',msgPubStatusCn:'已发布'}
  // ]
  },
methods: {

  },

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
    width: 19px;
  }
}

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
      // .col-pro {
      //   height: 100%;
      //   >div {
      //     &:first-child {
      //       height: 50%;
      //       line-height: 100%;
      //       padding: 0 12px;
      //       justify-content: space-between;
      //       align-items: center;
      //       .label {
      //         color: $gray-nd;
      //       }
      //     }
      //     &:last-child {
      //       position: relative;
      //       height: 50%;
      //     }
      //   }
      // }
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
   /deep/.right-table td {
      height: 49px !important;
    };

.noticeContent{
  height: calc(100%);
  display: flex;
  flex-direction: column
}
</style>


