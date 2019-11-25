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
                    <template v-if="item.type=='slot'">
                      <template v-if="row.msgPubStatus&&row.msgPubStatus==='2'">
                        <div v-if="permissions.update" class="table-opr update" @click="openDetail({type:'update',row})"></div>
                        <div v-if="permissions.update" class="table-opr remove" @click="openRemove(row)"></div>
                        <div class="table-opr detail" @click="openDetail( {type:'detail',row})"></div>
                      </template>
                      <template v-if="row.msgPubStatus&&row.msgPubStatus==='1'">
                        <div v-if="permissions.update" class="table-opr update" @click="openDetail({type:'update',row})" style="visibility:hidden"></div>
                        <div v-if="permissions.update" class="table-opr remove" @click="openRemove(row)" style="visibility:hidden"></div>
                        <div class="table-opr detail" @click="openDetail( {type:'detail',row})"></div>
                      </template>
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
                        <div v-if="permissions.insert" class="tool-button insert" @click="openDetail({type:'insert'})">
                          <img src="~@icon/toolbar/icon_insert.png" width="20px" height="20px" />
                          <div class="label" style="font-weight:bolder">发布公告</div>
                        </div>
                    </div>                
                </div>
            </div>
            <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
            <confirm-tip :visible="remove.visible" :data="remove.data" @handleSubmit="handleRemove" @handleClose="handleRemoveClose"></confirm-tip>

        </div>
</template>
<script>
// import None from'../../home/common/none';
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import Detail from './detail/MessageNoticeDetail'
import ConfirmTip from '@/views/home/common/ConfirmTip'

import tableMixin from '@mixin/tableMixin'
import formMixin from '@mixin/formMixin'

import { queryAll, update,  flattenDeep ,getQueryAll} from '@/util/base'

import _ from 'lodash'

export default {
    components: {
        // None,
        QueryRow,
        Pagination,
      //  Toolbar,
        Tables,
        Detail,
        ConfirmTip
    },
    mixins: [tableMixin, formMixin],
    data() {
        return {
            description: '',
            queryUrl:'/imMessage/messageTotice/queryTotice',
            insertUrl:'/imMessage/messageTotice/noticeSave',
            updateUrl:'/imMessage/messageTotice/updateNotice',
            removeUrl:'/imMessage/messageTotice/deleteNotice',
            detailUrl:'/imMessage/messageTotice/queryToticeDetail',

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
                      key: 'msgPubStatus',
                      label: '发布状态',
                      type: 'select',
                      width: 214,
                      enumKey: 'msgPubStatus',
                      itemValue: 'code',
                      itemLabel: 'name',
                      value: null,
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
                    key:'noticeId',
                    column:[
                       // left
                        [
                            {key: 'index',  label: '序号', width: 80, type: 'slot'},
                            {key: 'msgTitle',  label: '公告标题', width: 220,colClass: 'bold-underline',type: 'slot'},
                            {key: 'empName',  label: '发送人', width: 150},
                            {key: 'publishTime',  label: '发布日期', width: 300,format: [0, 16]},
                            {key: 'createtime',  label: '创建时间', width: 300,format: [0, 16]},
                            {key:'msgPubStatusCn',label:'发布状态',width:300, type: 'slot'},
                            {key:'msgText',label:'公告内容',width:400},
                        ],
                       // center
                        [
                        ],
                       // right
                        [
                            {label: '操作', type: 'slot', width: 220}
                        ],
                    ],
                    data:[]
         
            },
            permissions:{
               insert: true,
                update: true,
                remove: true,
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
   update (data) {
      queryAll(this.updateUrl, data).then(res => {
        if (res.data.code == 0) {
          this.$msg.success({
            info: '保存成功 !'
          })
          this.handleClose()
          if (this.hasOwnProperty('queryDataReq')) {
            this.queryDataReq()
          }
        } else {
          this.$msg.error({
            info: '保存失败 !'
          })
        }
      }).catch(err => {
        this.$msg.error({
          info: '请求异常 !'
        })
      })
    },
      handleClose () {
      this.detail.visible = false
    },


  handleRemove (row) {
    let data = { 
   noticeId:row.noticeId,

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
    // openDetail ({type, row}) {
   
    //     // console.log({type, row})
    //     this.detail.type = type
    //     this.$set(this.detail, 'data', row || {})
    //     this.detail.visible = true
    //   },


  handleSubmit ({data, type, other}) {
      data = this.submitBefore(data, type)
      if (data.usersIdList && data.usersIdList.length > 0) {
        let arr = []
        data.usersIdList.forEach(val => {
          if (typeof val === 'string') {
            arr.push(val)
          }
        })
        data.usersIdList = arr

      }
      if(other=='publish') {
        this.$set(data, 'msgPubStatus', 1);


    //    console.log(data)
      } else {
        this.$set(data, 'msgPubStatus', 2);

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
          // margin-left: -1px;
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
.noticeContent{
  height: calc(100%);
  display: flex;
  flex-direction: column
}

</style>


