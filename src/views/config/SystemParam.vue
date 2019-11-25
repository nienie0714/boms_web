<template>
    <div class="system"> 
        <div class="table-cont container cross">
            <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" @openRemove="openRemove" ref="tables">
                <template v-slot:slot-body="{index, row, item}">
                    <template v-if="item.type=='slot'">
                        <div  class="table-opr update" @click="openDetail({type:'update',row})"></div>
                    </template>

                </template>
            </tables>

        </div>
        <detail :visible="detail.visible" :data="detail.data" :type="detail.type" @handleSubmit="handleSubmit" @handleClose="handleClose"></detail>
    </div>
</template>

<script>
import Tables from '@view/Table/Table'
import formMixin from '@mixin/formMixin'
import tableMixin from '@mixin/tableMixin'
import { queryAll, update ,postData} from '@/util/base'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import Detail from './detail/SystemParamDetail'
import _ from 'lodash'
export default {
    components:{
        Tables,
        Detail
    },
    mixins: [tableMixin, formMixin],
    data(){
        return {
            title:'系统参数设置',
            queryType: 'nopage',
            queryUrl: '/base/sysParam/querySysParamForUpdate',
            updateUrl:'/base/sysParam',
            permission:{
                update: true,
                remove:false,
                insert:false
            },
            tableData:{
                    multSelection: [],
                    loading: false,
                    key:'systemId',
                    column:[
                        //left
                        [
                           {key:'paramName',label:'参数代码',width:300},
                           {key:'paramValue',label:'参数值',width:300},
                           {key:'reserved1',label:'参数名称',width:300},
                           {key:'remark',label:'参数描述',width:700}
                        ],
                        //center
                        [],
                        //right
                        [
                            {label: '操作', type: 'slot', width: 100}
                        ]
                    ],
                    data:null
            }
        }
    },
    mounted(){
        // this.tableData.data =[
        //     {paramNo:'1245546542',paramName:'消息框显示数据条数',paramNum:'50',paramText:'消息悬浮框/APP消息列表：显示数据条数'}
        // ]
      // this.queryDataReq()
       this.initTableData()
    },
    created() {
     this.initTableData()
    // this.queryDataReq()
    },
    methods:{
      initTableData() {
        postData('/base/sysParam/querySysParamForUpdate', {}).then(response => {
          if(response.data.code == 0) {
            this.tableData.data = response.data.data
          } else {
            //无数据的情况
          }
        }).catch(err => {
          this.$msg.error({
            info: '请求异常 !',
            tip: err
          })
        })
      },
    update (data) {
        update(this.updateUrl, data).then(res => {
            if (res.data.code == 0) {
            this.$msg.success({
                info: '保存成功 !'
            })
            this.handleClose()
            
            if (this.hasOwnProperty('initTableData')) {
                this.initTableData()
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
        handleSubmit ({data, type}) {
            if (data) {
                this.update(data)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.table-opr {
      width: 24px;
      height: 24px;
      cursor: pointer;
        background-image: url(~@icon/table/icon_update.png);
}
       .table-opr:hover {
          background-image: url(~@icon/table/icon_update_hover.png);
        }
     
.system {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column
}     
</style>