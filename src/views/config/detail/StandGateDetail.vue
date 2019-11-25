<template>
  <detail class="log-audit-detail" v-bind="$attrs" :visible="visible" v-on="$listeners" :title="title" :type="type" :form="form">
       
  </detail>
</template>
<script>
import Detail from '@/views/home/common/Detail'
import utilMixin from '@mixin/utilMixin'
import { queryAll } from '@/util/base'
import _ from 'lodash'
import { type } from 'os';
import { watch } from 'fs'

export default {
    components:{
        Detail
    },
    mixins:[utilMixin],
    props:['data','type','visible'],
    data(){
        return {
            title:'登机口',
            form:{
                key:'gateId',
                loading: false,
                queryParam: {},
                detailColumn:[
                    [
                        {key:'gateNo',label:'登机口编号',span:'24'},
                    ],
                    [
                        {key:'remark',label:'备注',span:'24'}
                    ]
                ],
                column:[
                    {key:'gateNo',label:'登机口编号',type:'input',maxlength:4},
                    {key:'remark',label:'备注',type: 'textarea', rows: 2, maxlength: 100}
                ],
                rules:{
                    gateNo:[
                        {type: 'require', trigger: 'blur'}, 
                        {type: 'unique', url: '/base/gate', trigger: 'blur'},
                        {type: 'unique', url: '/base/gate', trigger: 'change'},
                        {type: 'regex', reg: /^[-a-zA-Z0-9]+$/, info: '必须由数字、字母或-(横杠)组成'},
                    ]
                },
                data:null
            }
        }
    },
    mounted(){

    },
    methods:{
        changeData () {
            this.$set(this.form,'data',this.data);

            }, 
    },
    watch:{
        data:{
            handler(data){
                this.changeData()
            },
            immediate:true
        },
        visible:{
            handler(visible){
                if(visible&&this.type=='insert'){
                    this.form.column.forEach((item,index) => {
                        this.$set(item, 'disabled', false)
                    })
                }
                if(visible&&this.type=='update'){
                    this.form.column.forEach((item,index)=>{
                        this.$delete(item,'defaultVal')
                        if(item.key=='gateNo'){
                             this.$set(item, 'disabled', true)
                        }else{
                            this.$set(item, 'disabled', false)
                        }
                    })
                }
            },
            immediate:true
        },
        type:{
            handler(type){
                if(type=='insert'){
                    this.form.column.forEach((item,index) => {
                        this.$set(item, 'disabled', false)
                    })
                }
                if(type=='update'){
                    this.form.column.forEach((item,index) => {
                        if(item.key=='gateNo'){
                             this.$set(item, 'disabled', true)
                        }
                    })
                }
            },
            immediate:true
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