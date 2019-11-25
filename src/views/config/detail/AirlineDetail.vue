<template>
  <detail class="log-audit-detail" v-bind="$attrs" :visible="visible" v-on="$listeners" :title="title" :type="type" :form="form" ref='airlineDetail'>
       
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
            title:'航空公司',
            form:{
                key:'airlineId',
                loading: false,
                queryParam: {},
                detailColumn:[
                    [
                        {key:'airlineIata',label:'IATA码',span:'12'},
                        {key:'airlineIcao',label:'ICAO码',span:'12'},
                    ],
                    [
                        {key:'agencyCn',label:'航空公司所属地面代理',span:'8'},
                        {key:'reserved1',label:'所属航站楼',span:'8'},
                        {key:'attrCn',label:'属性',span:'8'},
                    ],
                    [
                        {key:'briefC',label:'中文简称',span:'12'},
                        {key:'nameC',label:'中文名称',span:'12'},
                    ],
                    [
                        {key:'briefE',label:'英文简称',span:'12'},
                        {key:'nameE',label:'英文名称',span:'12'},
                    ]
                ],
                column:[
                        {key:'airlineIata',label:'IATA码',type:'input',maxlength: 2,disabled:true},
                        {key:'airlineIcao',label:'ICAO码',type:'input',maxlength: 3},
                        {key:'briefC',label:'中文简称',type:'input',maxlength:20},
                        {key:'nameC',label:'中文名称',type:'input',maxlength:20},
                        {key:'briefE',label:'英文简称',type:'input',maxlength:20},
                        {key:'nameE',label:'英文名称',type:'input',maxlength:20},

                        {key:'reserved2',label:'地面代理', type: 'select', itemValue: 'code', itemLabel: 'name', url: '/base/classifyCode/queryAll',param:{'classify':'地面代理'}},
                        {key:'reserved1',label:'所属航站楼',type:'select',itemValue: 'terminalNo', itemLabel: 'name', itemLabel: 'name', url: '/base/terminal/queryAll',},
                        {key:'attr',label:'属性',label:'属性',type:'select',enumKey: 'property1', itemValue: 'code', itemLabel: 'name',},
                ],
                rules:{
                    airlineIata:[
                        {type: 'require', trigger: 'blur'}, 
                        {type: 'regex', reg: /^[a-zA-Z0-9]{2}$/, info: '必须由2位数字或字母组成'},
                        {type: 'unique', url: '/base/airline', trigger: 'blur'},
                         {type: 'unique', url: '/base/airline', trigger: 'change'},
                    ],
                    airlineIcao:[
                        {type: 'require', trigger: 'blur'},
                        {type: 'regex', reg: /^[a-zA-Z0-9]{3}$/, info: '必须由3位数字或字母组成'}, 
                    ],
                    briefC:[
                        {type: 'require', trigger: 'blur'}, 
                    ],
                    attr:[
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
                if(visible && this.type=='insert'){
                    this.form.column.forEach((item,index) => {
                        this.$set(item, 'disabled', false)
                       if(item.key=='attr'){
                           this.$set(item,'defaultVal','D')
                       }
                    })
                }
                if(visible&&this.type=='update'){
                     this.form.column.forEach((item,index) => {
                         this.$delete(item,'defaultVal')
                         if(item.key == 'airlineIata'){
                             this.$set(item, 'disabled', true)
                         }else{
                             this.$set(item, 'disabled', false)
                         }
                     })
                }
                if(visible&&this.type=='detail'){
                    this.changeData()
                    var data = this.form.data
                    var detailColumn = this.form.detailColumn
                    for(var i=0;i<detailColumn.length;i++){
                        var detailArr = detailColumn[i]
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
                          if(item.key == 'airlineIata'){
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