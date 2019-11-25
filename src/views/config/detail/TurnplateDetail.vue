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
            title:'行李转盘',
            form:{
                key:'chuteId',
                loading: false,
                queryParam: {},
                detailColumn:[
                    [
                        {key:'resourceNo',label:'转盘编号',span:'12'},
                        {key:'attrCn',label:'属性',span:'12'},
                    ],
                    [
                        {key:'agencyCn',label:'地面代理',span:'8'},
                        {key:'terminalNo',label:'所属航站楼',span:'8'},
                        {key:'isUseableCn',label:'状态',span:'8'},
                    ],
                    [
                        {key:'remark',label:'备注',span:'24'}
                    ],

                ] ,
                column:[
                            {key:'resourceNo',label:'转盘编号',type:'input',maxlength:20},
                            {key:'attr',label:'属性',type:'select',enumKey: 'property1', itemValue: 'code', itemLabel: 'name'},
                            {key:'reserved2',label:'地面代理', type: 'select', itemValue: 'code', itemLabel: 'name', url: '/base/classifyCode/queryAll',param:{'classify':'地面代理'}},
                            {key:'terminalNo',label:'所属航站楼',type:'select',itemValue: 'terminalNo', itemLabel: 'name', itemLabel: 'name', url: '/base/terminal/queryAll',},
                            {key:'isUseable',label:'状态',type:'tab',enumKey: 'status1', itemValue: 'code', itemLabel: 'name',},
                            {key:'remark',label:'备注',type: 'textarea', rows: 2, maxlength: 100}
                ],
                rules:{
                    resourceNo:[
                        {type: 'require', trigger: 'blur'}, 
                        {type: 'unique', url: '/base/terminalResource', trigger: 'blur',resourceType:'BELT'},
                        {type: 'unique', url: '/base/terminalResource', trigger: 'change',resourceType:'BELT'},
                        {type: 'regex', reg: /^[-a-zA-Z0-9]+$/, info: '必须由数字、字母或-(横杠)组成'},
                    ],
                    // attr:[
                    //     {type: 'require', trigger: 'blur'}, 
                    // ],
                    terminalNo:[
                        {type: 'require', trigger: 'blur'}, 
                    ],
                    attr:[
                         {type: 'require', trigger: 'blur'}, 
                    ],
                    isUseable:[
                         {type: 'require', trigger: 'blur'}, 

                    ]
                },
                data:null
            },
        }
    },
    mounted(){

    },
    methods:{
        changeData () {
            this.$set(this.form,'data',this.data);

            }, 
        getName(value,callback){

        }
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
                this.form.column.forEach((item,index) => {
                    this.$set(item, 'disabled', false)
                })
                if(visible&&this.type=='insert'){
                    this.form.column.forEach((item,index) => {
                        this.$set(item, 'disabled', false)
                        if(item.key=='attr'){
                            this.$set(item,'defaultVal','D')
                        }
                        if(item.key=='isUseable'){
                            this.$set(item,'defaultVal','Y')
                        }
                        if(item.key=='terminalNo'){
                            this.$set(item, 'defaultVal', 'T3')
                        }
                    })
                }
                if(visible&&this.type=='update'){
                    this.form.column.forEach((item,index) => {
                         this.$delete(item,'defaultVal')
                        if(item.key=='resourceNo'){
                                this.$set(item, 'disabled', true)
                            }
                        if(item.key=='terminalNo'){
                            this.$set(item, 'disabled', true)
                            }
                    })
                }
                if(visible&&this.type=='detail'){
                    this.changeData()
                    var data = this.form.data
                  //  debugger
                    var detailColumn = this.form.detailColumn;
                    for(var i = 0;i<detailColumn.length;i++){
                    var detailArr =  detailColumn[i] 
                    for(var j = 0;j<detailArr.length;j++){
                        if(detailArr[j].key == 'attrCn'){
                            if(data.attr=='D'){
                                this.$set(data,'attrCn','国内')
                            }
                            if(data.attr=='M'){
                                this.$set(data,'attrCn','混合')
                            }   
                            if(data.attr=='I'){
                                this.$set(data,'attrCn','国际')
                            }  
                            if(data.attr=='R'){
                                this.$set(data,'attrCn','地区')
                            }                     
                        }
                        if(detailArr[j].key == 'isUseableCn'){
                            if(data.isUseable=='Y'){
                                this.$set(data,'isUseableCn','开放')
                            }
                            if(data.isUseable=='N'){
                                this.$set(data,'isUseableCn','关闭')
                            }
                        }
                    }
                        
                    }
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
                        
                        if(item.key=='resourceNo'){
                            this.$set(item, 'disabled', true)
                        }
                        if(item.key=='terminalNo'){
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