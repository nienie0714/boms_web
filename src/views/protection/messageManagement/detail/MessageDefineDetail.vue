<template>
  <detail class="log-audit-detail" v-bind="$attrs" :visible="visible" v-on="$listeners" :title="title" :type="type" :form="form">

  </detail>
</template>

<script>

import Detail from '@/views/home/common/Detail'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'
export default {
    components:{
        Detail
    },
  mixins:[utilMixin],
  props:['data','type','visible'],
  data(){
      return {
          title:'消息定义',
          form:{
            key: 'msgTypeId',
            loading: false,
            queryParam: {},
            detailColumn:[
               [
                   {key:'msgTypeNo',label:'消息类型编号',span:6},
                   {key:'msgTypeCn',label:'消息类型名称',span:6},
                   {key:'msgTypeSubNo',label:'消息子类型编号',span:6},
                   {key:'msgTypeSubCn',label:'消息子类型名称',span:6}
               ],
               [
                   {key:'remark',label:'备注',span:24}
               ]
            ],
            column:[
                    // {key: 'msgTypeId',  label: '消息绑定Id', type: 'input', isHidden: true},
                    // {key: 'msgTypeNo',  label: '消息类型编号', type:'input'},
                    // {key: 'msgTypeCn',  label: '消息类型名称', type:'input'},
                    // {key: 'msgTypeSubNo',  label: '消息子类型编号',  type:'input'},
                    // {key:'msgTypeSubCn',label:'消息子类型名称', type:'input'},
                    // {key:'REMARK',label:'内容', type: 'textarea', rows: 2, maxlength: 100},
                    // {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
                    // {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
                    // {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
                    // {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
            ],
            rules:{
                msgTypeNo:[
                    {type: 'require', trigger: 'blur'},
                    {type: 'regex', reg: /^[-_a-zA-Z0-9]+$/, info: '必须由数字、字母或-(横杠)_（下划线）组成'},
                ],
                msgTypeCn:[
                    {type: 'require', trigger: 'blur'},
                    {type: 'regex', reg: /^[\u4e00-\u9fa5]+$/, info: '必须由汉字组成'},
                ],
                msgTypeSubNo:[

                     {type: 'require', trigger: 'blur'},
                     {type: 'regex', reg: /^[-_a-zA-Z0-9]+$/, info: '必须由数字、字母或-(横杠)_（下划线）组成'},
                ],
                msgTypeSubCn:[
                    {type: 'require', trigger: 'blur'},
                    {type: 'regex', reg: /^[\u4e00-\u9fa5]+$/, info: '必须由汉字组成'},
               
                ],
                
            },
            data:null,
          }
      }
  },
  mounted(){

  },
  methods: {
   changeData () {
      this.$set(this.form,'data',this.data);
     }
  },
  watch:{
     data: {
      handler (data) {
        this.changeData()
      },
      immediate: true
    },
    visible:{
     handler(visible){       
         if(visible &&this.type=='insert'){
             this.form.column=[

                    {key: 'msgTypeNo',  label: '消息类型编号', type:'input',maxlength:20},
                    {key: 'msgTypeCn',  label: '消息类型名称', type:'input',maxlength:20},
                    {key: 'msgTypeSubNo',  label: '消息子类型编号',type:'input',maxlength:20},
                    {key:'msgTypeSubCn',label:'消息子类型名称', type:'input',maxlength:20},
                    {key:'remark',label:'备注', type: 'textarea', rows: 6, maxlength: 1000},
                    {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
                    {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
                    {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
                    {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
             ];
         }else if(visible &&this.type=='update'){
             this.form.column=[
                    {key: 'msgTypeNo',  label: '消息类型编号', type:'input',disabled: true,},
                    {key: 'msgTypeCn',  label: '消息类型名称', type:'input',maxlength:20},
                    {key: 'msgTypeSubNo',  label: '消息子类型编号',  type:'input',disabled: true,},
                    {key:'msgTypeSubCn',label:'消息子类型名称', type:'input',maxlength:20},
                    {key:'remark',label:'备注', type: 'textarea', rows: 6, maxlength: 1000},
                    {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
                    {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
                    {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
                    {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
             ];        
         }
       }
    
    },
    type:{
     handler(type){
         this.form.column.forEach((item,index)=>{
           if(type=='insert'){
              this.$set(item, 'disabled', false) ;
           }else if (type=='update'){
              if(item.key=='msgTypeNo'){
                this.$set(item, 'disabled', true) ;
              }
              if(item.key=='msgTypeSubNo'){
                this.$set(item, 'disabled', true) ;
              }
           }
         })
     },
      immediate: true
    }   
  }
}
</script>

<style lang="scss" scoped>
$bodyHead: 32px;
.dialog {
  width: 30px;
  height: 50px;
}
</style>
