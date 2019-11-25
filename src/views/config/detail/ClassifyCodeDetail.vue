<template>
  <detail class="log-audit-detail" v-bind="$attrs" :visible="visible" v-on="$listeners" :title="title" :type="type" :form="form" ref="classifyCodeDetail">
       
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
            title:'分类信息',
            form:{
                key:'classifyId',
                loading: false,
                queryParam: {},
                detailColumn:[
                    [
                        {key:'code',label:'代码',span:'8'},
                        {key:'classify',label:'类别',span:'8'},
                        {key:'name',label:'名称',span:'8'},
                    ],
                    [
                        {key:'remark',label:'备注',span:'24'}
                    ]
                ],
                column:[
                    {key:'code',label:'代码',type:'input'},
                    {key:'classify',label:'类别',type:'input'},
                    {key:'name',label:'名称',type:'input'},
                    {key:'remark',label:'备注',type: 'textarea', rows: 2, maxlength: 100}
                ],
                rules:{
                    name:[
                        {type: 'require', trigger: 'blur'}, 
                        {type: 'method', method: this.checkName}
                    ],
                    classify:[
                        {type: 'require', trigger: 'blur'}, 
                        {type: 'method', method: this.checkClassify},
                    ],
                    code:[
                        {type: 'require', trigger: 'blur'}, 
                        {type: 'method', method: this.checkCode},
                        
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
        checkName(val, callback) {
            this.checkUnique(callback);
        },
        checkClassify(val, callback) {
            this.checkUnique(callback);
        },
        checkCode(val, callback) {
            this.checkUnique(callback);
        },
        checkUnique(callback) { 
            let tip = '';
            if(!this.$refs.classifyCodeDetail.data.code || !this.$refs.classifyCodeDetail.data.classify || !this.$refs.classifyCodeDetail.data.name) {
                return callback(tip);
            }
            if(this.$refs.classifyCodeDetail.data.code == this.form.data.code && this.$refs.classifyCodeDetail.data.classify == this.form.data.classify && this.$refs.classifyCodeDetail.data.name == this.form.data.name) {
                return callback(tip);
            }
            let url = '/base/classifyCode/checkExist';
            let data = {
                code: this.$refs.classifyCodeDetail.data.code,
                classify: this.$refs.classifyCodeDetail.data.classify,
                name: this.$refs.classifyCodeDetail.data.name,
            };

            queryAll(url, data).then(res => {
                if (res.data.code == 0 && res.data.data.hasOwnProperty('exist')) {
                    tip = '数据已存在';
                    return callback(tip);
                } else {
                    return callback(tip);
                }
            }).catch(err => {
                this.$msg.error({
                    info: '请求异常 !',
                    tip: err
                })
            })
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
                    })
                }
                if(visible&&this.type=='update'){
                    this.form.column.forEach((item,index) => {
                        if(item.key=='code'){
                            this.$set(item, 'disabled', true)
                        }
                        if(item.key=='name'){
                            this.$set(item, 'disabled', true)
                        }
                        if(item.key=='classify'){
                            this.$set(item, 'disabled', true)
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
                        if(item.key=='code'){
                            this.$set(item, 'disabled', true)
                        }
                        if(item.key=='name'){
                            this.$set(item, 'disabled', true)
                        }
                        if(item.key=='classify'){
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