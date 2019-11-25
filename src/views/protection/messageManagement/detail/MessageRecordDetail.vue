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
        Detail,
    },
  mixins:[utilMixin],
  props:['data','type','visible'],
  data(){
      return {
          title:'消息记录',
          form:{
            key: 'msgId',
            loading: false,
            queryParam: {},
            detailColumn:[
               [
                   {key:'sendName',label:'发送人',span:12},
                   {key:'reciverName',label:'接收者',span:12}
               ],
               [
                   {key:'msgTypeCn',label:'消息类型',span:12},
                   {key:'msgTypeSubCn',label:'消息子类型',span:12}
               ],
               [
                   {key:'createtime',label:'发送时间',span:12, formatter: true},
                   {key:'readTime',label:'已读时间',span:12, formatter: true},
               ],
               [
                   {key: 'msgText', label:'消息内容', span:24}
               ]
            ],
            column:[

                {key: 'sendName',  label: '发送者', type: 'input'},
                {key:'reciverName', label:'接受者', type: 'input'},
                {key:'msgTypeCn', label:'消息类型',type: 'input'},
                {key:'msgTypeSubCn', label:'消息子类型', type: 'input'},
                {key: 'createtime',  label: '发布时间', type: 'input'},
                {key: 'readTime',  label: '已读时间', type: 'input'},
                {key: 'msgText',  label: '消息内容', type: 'input'},
                // {key: 'createtime',  label: '创建时间', type: 'input', disabled: true, isHidden: true},
                // {key: 'createby',  label: '创建人', type: 'input', disabled: true, isHidden: true},
                // {key: 'updatetime',  label: '修改时间', type: 'input', disabled: true, isHidden: true},
                // {key: 'updateby',  label: '修改人', type: 'input', disabled: true, isHidden: true}
            ],
            rules:{

            },
            data:null
          }
      }
  },
  mounted(){
    window.onresize = () => {
      this.$nextTick(() => {
        return (() => {
          this.changeWindowSize()
        })()
      })
    }
  },
  methods: {
  //  changeData () {
  //     this.$set(this.form,'data',this.data);
  //    }  ,
   changeData () {
      this.$nextTick(() => {
        this.changeWindowSize()
      })
      this.form.data = this.data
    }
  },
  watch: {
    data: {
      handler (data) {
        this.changeData()
      },
      immediate: true
    },
    type: {
      handler (type) {
        this.form.column.forEach((item, index) => {
          this.$set(item, 'disabled', false) ;
           if(type=='detail'){       
            if(item.key=='receiverTime'){
              if(this.data[item.key]==null){
                this.$set(item,'key','readTime')
              }
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
