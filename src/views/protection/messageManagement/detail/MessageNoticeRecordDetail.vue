<template>
  <detail class="log-audit-detail" v-bind="$attrs" :visible="visible" v-on="$listeners" :title="title" :type="type" :form="form">
       
    <template v-slot:footer="{submit, closeDialog, submitDialog}">
      <button @click="closeDialog">取 消</button>
      <button v-if="submit" type="primary" @click="submitDialog('publish')">发 布</button>
      <button  v-if="submit" type="primary" @click="submitDialog">暂 存</button>

 
    </template>
  </detail>
</template>

<script>
import Detail from '@/views/home/common/Detail'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'
import { type } from 'os';

export default {
 components: {
    Detail
  },
  mixins:[utilMixin],
  props:['data','type','visible'],
  computed: {
     getSenderName () {
        const empName = localStorage.getItem('empName')
        return empName
    },
  },
  data(){
      return {
        title:'通知公告',
        form:{
        key: 'noticeId',
        loading: false,
        queryParam: {},
        detailColumn:[
            [  
            {key:'msgTitle',label:'公告标题',span:'12' },
            
            {key: 'sendName', label:'发布人', span: '12'}
            ],
            [
            {key: 'publishTime', label:'发布时间', span: '12', formatter: true},
            {key: 'createtime', label:'创建时间', span: '12', formatter: true},
            ],
            [
               {key:'tree',label:'接收对象',span:'24',type:'tree'}
            ],
            [
                {key: 'msgText', label:'公告内容', span: '24'}
            ]
        ],
        column:[
               {key:'msgTitle',label:'公告标题',type:'input',maxlength:50},
               {key:'empName',label:'发送人',type:'input',disabled: true,defaultVal:this.getSenderName,},
               {key:'msgReceiverFlag',label:'接收对象',type:'tab',enumKey: 'persOrAll', itemValue: 'code', itemLabel: 'name',},
              {key: 'msgText', label: '内容', type: 'textarea', rows: 2, maxlength: 100},
              {key:'usersIdList',label:'接收人员', type: 'tree', saveKey: 'usersIdList', itemValue: 'id', itemLabel: 'text', itemChild: 'children', url: '/organization/department/queyByDeptOrRole', urlType: 'post',isHidden: true,height:350,overflowy:'auto', },//todo: tree
        ],
        rules: {
          msgTitle:[
             {type: 'require', trigger: 'blur'},
          ],
          empName: [
            {type: 'require', trigger: 'blur'},
          ],
          msgReceiverFlag:[
              {type:'require',trigger:'blur'}
          ],
          msgText:[
              {type: 'require', trigger: 'blur'},
          ]

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

     },

  },
  watch:{
     data: {
      handler (data) {
        this.changeData()
      },
      immediate: true
    },
    visible: {
      handler (visible) {
        if (visible && this.type=='insert' ) {
        
            this.form.column.forEach((item, index) => {
              if (item.key == 'empName') {
                this.$set(item, 'defaultVal', this.getSenderName)
              } else if(item.key != 'empName'){
                  this.$set(item, 'disabled', false)
              }
              if(item.key=='msgReceiverFlag'){
                  this.$set(item,'defaultVal',2)
              //   this.$set(item, 'param', {}) 
              }
            })
        } else if(visible&&this.type=='update'){
             this.changeData()
             this.form.column.forEach((item,index) => {
          //   this.$set(item,'isHidden',true)
               if(item.key!='empName'){
                   this.$delete(item,'defaultVal')
                   this.$set(item, 'disabled', false)
               } else if(item.key=='empName'){
                 this.$delete(item,'defaultVal')
               }
              if(item.key=='msgReceiverFlag'){
                //  this.$set(item,'param',{msgReceiverFlag:this.data.msgReceiverFlag})               
                if (this.data[item.key]=='1') {             
                  this.$set(this.form.column[this.form.column.findIndex(val => val.key == 'usersIdList')],'isHidden',false)
                } else if (this.data[item.key]=='2') {
                  this.$set(this.form.column[this.form.column.findIndex(val => val.key == 'usersIdList')],'isHidden',true)
                }
              } else if (item.type=='tree') {
                this.$delete(item, 'options')
                console.log(this.data[item.key])   
              }
             })
          }
    },
    
      immediate:true,
  },

    type:{
     handler(type){
        if(type=='insert'){
          this.form.column.forEach((item,index) =>{
              if(item.key=='empName'){
                this.$set(item, 'defaultVal', this.getSenderName)
              } else if(item.key=='msgReceiverFlag'){
                this.$set(item,'defaultVal',2)
            //   this.$set(item, 'param', {}) 
             }
          })
        }else if (type == 'update') {
          
        this.form.column.forEach((item, index) => {
          if (item.key != 'empName') { 
                this.$set(item, 'disabled', false)
                this.$delete(item,'defaultVal')
              }else if(item.key == 'empName'){
                this.$delete(item,'defaultVal')
              }     
          })        
        }
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