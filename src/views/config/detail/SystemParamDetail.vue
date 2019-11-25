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
        return{
            title:'系统参数配置',
            form:{
                    key:'paramId',
                    loading: false,
                    queryParam: {},
                    column:[
                        {key:'paramName',label:'参数代码',type:'input',disabled:true},
                        {key:'paramValue',label:'参数值',type:'input'},
                        {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                        {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                    ],
                    rules:{
                        paramName:[
                            {type: 'require', trigger: 'blur'},
                        ],
                        paramValue:[
                            {type: 'require', trigger: 'blur'},
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
                if(visible){
                    this.form.column.forEach((item,index) => {
                        if(item.key=='paramName'){
                            this.$set(item, 'disabled', true)
                        }else{
                            this.$set(item, 'disabled', false)
                        }
                    })
                
                    this.changeData()
                    let data = this.data
                    if(data.paramName == 'default_password'){
                        this.form.column = [
                            {key:'paramName',label:'参数代码',type:'input',disabled:true},
                            {key:'paramValue',label:'参数值',type:'input',maxlength:20},
                            {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                            {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                        ]
                        this.form.rules = {
                            reserved1:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramName:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramValue:[
                                {type: 'require', trigger: 'blur'},
                                {type: 'regex', reg: /^[a-zA-Z0-9]{8,20}$/, info: '必须由数字、字母组成的8-20位组合'},
                            ]
                        }
                    }
                    if(data.paramName == 'sys_stat_time'){
                        this.form.column = [
                            {key:'paramName',label:'参数代码',type:'input',disabled:true},
                            {key:'paramValue',label:'参数值',type:'elTime'},
                            {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                            {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                        ]
                        this.form.rules = {
                            reserved1:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramName:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramValue:[
                                {type: 'require', trigger: 'blur'},
                            ]
                        }
                    }
                    if(data.paramName == 'sort_schedule_time'){
                        this.form.column = [
                            {key:'paramName',label:'参数代码',type:'input',disabled:true},
                            {key:'paramValue',label:'参数值',type:'elTime'},
                            {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                            {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                        ]
                        this.form.rules = {
                            reserved1:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramName:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramValue:[
                                {type: 'require', trigger: 'blur'},
                            ]
                        }
                    }
                    if(data.paramName == 'lug_guarantee'){
                        this.form.column = [
                            {key:'paramName',label:'参数代码',type:'input',disabled:true},
                            {key:'paramValue',label:'参数值',type:'elTime'},
                            {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                            {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                        ]
                        this.form.rules = {
                            reserved1:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramName:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramValue:[
                                {type: 'require', trigger: 'blur'},
                            ]
                        }
                    }
                    if(data.paramName == 'msg_record_size'){
                        this.form.column = [
                            {key:'paramName',label:'参数代码',type:'input',disabled:true},
                            {key:'paramValue',label:'参数值',type:'input'},
                            {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                            {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                        ]
                        this.form.rules = {
                            reserved1:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramName:[
                                {type: 'require', trigger: 'blur'},

                            ],
                            paramValue:[
                                {type: 'require', trigger: 'blur'},
                                {type: 'regex', reg:  /^(?:1|[1-9][0-9]?|100)$/, info: '必须为1-100的正整数'},
                            ]
                        }
                    }
                    if(data.paramName == 'default_pwd_error_count'){
                        this.form.column = [
                            {key:'paramName',label:'参数代码',type:'input',disabled:true},
                            {key:'paramValue',label:'参数值',type:'input'},
                            {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                            {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                        ]
                        this.form.rules = {
                            reserved1:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramName:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramValue:[
                                {type: 'require', trigger: 'blur'},
                                    {type: 'regex', reg:  /^(\d(\.\d)?|10)$/, info: '必须为0-10的正整数'},
                                
                            ]
                        }
                    }
                    if(data.paramName == 'max_online_count'){
                        this.form.column = [
                            {key:'paramName',label:'参数代码',type:'input',disabled:true},
                            {key:'paramValue',label:'参数值',type:'input'},
                            {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                            {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                        ]
                        this.form.rules = {
                            reserved1:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramName:[
                                {type: 'require', trigger: 'blur'},
                            ],
                            paramValue:[
                                {type: 'require', trigger: 'blur'},
                                {type: 'regex', reg:  /^([5-9]\d|[1-9]\d{2}|1000)$/, info: '必须为50-1000的正整数'},
                                
                            ]
                        }
                        }
                     if(data.paramName == 'app_online_heartbeat'){
                         this.form.column = [
                                {key:'paramName',label:'参数代码',type:'input',disabled:true},
                                {key:'paramValue',label:'参数值',type:'input'},
                                {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                                {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                         ]
                         this.form.rules = {
                                reserved1:[
                                    {type: 'require', trigger: 'blur'},
                                ],
                                paramName:[
                                    {type: 'require', trigger: 'blur'},
                                ],
                                paramValue:[
                                    {type: 'require', trigger: 'blur'},
                                   {type: 'regex', reg:  /^([1-4][0-9]{2}|500|[1-9]?[0-9])$/, info: '必须为0-500的正整数'},
                                    
                                ]
                         }
                     }
                     if(data.paramName == 'app_rfid_interval'){
                         this.form.column = [
                                {key:'paramName',label:'参数代码',type:'input',disabled:true},
                                {key:'paramValue',label:'参数值',type:'input'},
                                {key:'reserved1',label:'参数名称',type:'input',maxlength:30},
                                {key:'remark',label:'参数描述',type: 'textarea', rows: 6, maxlength: 100}
                         ]
                         this.form.rules = {
                                reserved1:[
                                    {type: 'require', trigger: 'blur'},
                                ],
                                paramName:[
                                    {type: 'require', trigger: 'blur'},
                                ],
                                paramValue:[
                                    {type: 'require', trigger: 'blur'},
                                   {type: 'regex', reg:  /^([1-4][0-9]{2}|500|[1-9]?[0-9])$/, info: '必须为0-500的正整数'},
                                    
                                ]
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
                        if(item.key=='paramName'){
                            this.$set(item, 'disabled', true)
                        }else{
                            this.$set(item, 'disabled', false)
                        }
                    })
                }

            },
            immediate:true
        }

    }

}
</script>