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
    // computed:{
    //      getTime(){
    //          debugger
    //          this.changeData()
    //          let data = this.data
    //          const time = data.nouseSTime
    //          const time1 = data.nouseETime
    //          console.log(time,time1)
    //          return time ,time1
    //      }
    // },
    data(){
        return {
            title:'机位',
            form:{
                key: 'terminalId',
                loading: false,
                queryParam: {},
                detailColumn:[
                   [ 
                        {key:'standNo',label:'机位编号',span:'12'},
                        {key:'attrCn',label:'属性',span:'12'},
                    ],
                    [
                        {key:'rank',  label:'机位等级', span:'12'},
                        {key:'terminalNo',label:'航站楼',span:'12'},
                    ],
                    [
                        {key:'standParent',label:'父机位',span:'12'},
                        {key:'standTypeCn',label:'机位类型',span:'12'},
                    ],

                    [
                        {key:'standGate',label:'登机口',span:'12'},
                        {key:'isUseableCn',label:'是否可用',span:'12'},
                    ],
                    [
                        
                        {key:'nouseSTime',label:'机位停用开始时间',span:'12'},
                        {key:'nouseETime',label:'机位停用结束时间',span:'12'},
                        // {key:'standOptions',label:'机位分类',span:'12'}
                    ],
                    [
                        {key: 'remark', label:'备注', span: '24'}
                    ]
                ],
                column:[
                    {key:'standNo',label:'机位编号',type:'input',maxlength:20},
                    {key:'attr',label:'属性',type:'select',enumKey: 'property1', itemValue: 'code', itemLabel: 'name',},
                    {key:'rank',label:'机位等级',type:'tab',enumKey: 'standlevel', itemValue: 'code', itemLabel: 'name',},
                     {key:'terminalNo',label:'所属航站楼',type:'select',itemValue: 'terminalNo', itemLabel: 'name', itemLabel: 'name', url: '/base/terminal/queryAll',},
                    {key:'standParent',label:'父机位', type: 'select', itemValue: 'standNo', itemLabel: 'name', url: '/base/aircraftStand/queryParentStand',param:{'standType':'P'}},
                    {key:'standGate',label:'登机口', type: 'select', itemValue: 'gateNo', itemLabel: 'gateNo', url: '/base/gate/queryAll',multiple: true,multipleLimit:5},
                    {key:'standType',label:'机位类型',type:'select',enumKey: 'standType', itemValue: 'code', itemLabel: 'name',},
                    {key:'isUseable',label:'是否可用',type:'tab',enumKey: 'isYOrN', itemValue: 'code', itemLabel: 'name'},
                    {key:'parkingTime',label:'机位停用时间',key1:'nouseSTime',key2:'nouseETime',type:'elDateTimeRange',dateType:'datetimerange',width: '594',paddingright:'0'},
                    
                    {key: 'remark', label: '备注', type: 'textarea', rows: 2, maxlength: 100},
                ],
                rules:{
                    standNo:[
                        {type: 'require', trigger: 'blur'}, 
                        {type: 'unique', url: '/base/aircraftStand', trigger: 'blur'},
                        {type: 'unique', url: '/base/aircraftStand', trigger: 'chnage'},
                        {type: 'regex', reg: /^[-a-zA-Z0-9]+$/, info: '必须由数字、字母或-(横杠)组成'},
                    ],
                    standType:[
                        {type: 'require', trigger: 'blur'}, 
                    ],
                    attr:[
                        {type: 'require', trigger: 'blur'}, 
                    ],
                    rank:[
                        {type: 'require', trigger: 'blur'},
                    ],
                    isUseable:[
                        {type: 'require', trigger: 'blur'},
                    ],
                    terminalNo:[
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
                        this.$set(item, 'disabled', false)
                    })
                }
                if(visible&&this.type=='insert'){
                    this.form.column.forEach((item,index) => {
                        
                        this.$set(item, 'disabled', false)
                        if(item.key=='attr'){
                            this.$set(item,'defaultVal','D')
                        }
                        if(item.key=='isUseable'){
                            this.$set(item,'defaultVal','Y')
                        }
                        if(item.key=='standParent'){
                            this.$set(item,'param',{'standType':'P'})
                        }
                          if(item.key=='terminalNo'){
                            this.$set(item, 'defaultVal', 'T3')
                        }
                        if(item.key=='standType'){
                            this.$set(item, 'defaultVal', 'N')
                        }
                        if(item.key=='rank'){
                            this.$set(item, 'defaultVal', 'D')
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
                                this.$set(data,'isUseableCn','是')
                            }
                            if(data.isUseable=='N'){
                                this.$set(data,'isUseableCn','否')
                            }
                        }
                        if(detailArr[j].key == 'standTypeCn'){
                            if(data.standType=='N'){
                                this.$set(data,'standTypeCn','普通机位')
                            }
                            if(data.standType=='P'){
                                this.$set(data,'standTypeCn','组合父机位')
                            }
                            if(data.standType=='C'){
                                this.$set(data,'standTypeCn','组合子机位')
                            }
                            if(data.standType=='H'){
                                this.$set(data,'standTypeCn','机库机位')
                            }
                            if(data.standType=='T'){
                                this.$set(data,'standTypeCn','临时机位')
                            }
                        }
                    }                      
                    }
                }
                if(visible&&this.type=='update'){
                     this.form.column.forEach((item,index) => {
                         this.$delete(item,'defaultVal')
                        if(item.key == 'parkingTime'){
                          //  debugger
                            this.changeData()
                            var data = this.data
                            if(data.parkTime==undefined){
                                if(data.nouseSTime!=null&&data.nouseETime!=null){
                                   this.$set(data,'parkingTime',[data.nouseSTime,data.nouseETime])
                                   }
                            }
                        }
                        if(item.key=='standGate'){
                            this.changeData()
                            var data = this.data
                            var gate = data.standGate
                            if(gate!=null&& typeof gate === 'string'){
                                gate = gate.split(',')
                            }
                            this.$set(data,'standGate',gate)
                        }
                        if(item.key=='standNo'){
                            this.$set(item, 'disabled', true)
                        }
                        if(item.key=='standParent'){
                            this.changeData()
                            var data = this.data
                            var stanNo = data.standNo
                            let paramP = {
                                'standType':'P',
                                'stanNo':stanNo
                            }
                            this.$set(item,'param',paramP)
                        }
                    })
                }
            },
            immediate:true
        },
        type:{
            handler(type){
                this.changeData()
                var data = this.data
                if(type=='insert'){
                    this.form.column.forEach((item,index) => {
                        this.$set(item, 'disabled', false)
                    })
                }
                if(type=='update'){
                    this.form.column.forEach((item,index) => {
                       if(item.key=='standNo'){
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