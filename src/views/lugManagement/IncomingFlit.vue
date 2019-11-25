<template>
    <div class="lugManaContent">
       <div class="query-top">
            <query-row :data="queryParam" @handleEnter="queryDataReq(2)"></query-row>
            <div class="toolbar">
                <button type="info" @click="cleanQueryData">重置</button>
                <button type="primary" :name="loading?'loading':''" @click="queryDataReq(2)">查询</button>
            </div>
       </div> 
       <div class="table-cont container cross">
           <!-- <div class="table-title">
                <div class="left">
                    <span class="label">查询结果</span>
                    <span class="info">共{{this.pageData.total}}条</span>                
                </div>
                <div class="right">
                    <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
                    <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail"></toolbar>                
                </div>             
           </div> -->
           <tables :permissions="permissions" :tableData="tableData" :loading="tableData.loading" @openDetail="openDetail" ref="tables">
               <template  v-slot:slot-body="{index, row, item}">
                    <template v-if="item.type=='slot'">
                      <div class="table-opr update" @click="showLugDetail(row)"></div>
                    </template>
                   <template v-if="item.key=='flightNo'">
                       {{flightNoAdd(row,item)}}
                   </template>
                   <template v-if="item.key=='ata'">
                       {{showTime(row,item)}}
                   </template>
                   <template  v-if="row.execDate ==dataStr +' 00:00:00'">
                      <template v-if="['loadAirAtTimeStart','loadAirAtTimeEnd','transportAtTimeStart','transportAtTimeEnd','unLoadCarAtTime','selfAtTime'].includes(item.key)">
                        <div v-if="row.mainTain===1&&row[item.key]==null">
                            <div class="label-img"  @click="activeTd(index, item.key)">                        
                              <div :class="['label-img-inside', popList[index][item.key] ? 'label-img-active' : '']">
                                <span>{{ formartValue(row,item)}}</span>
                                <img v-if="popList[index][item.key]" :src="require('../../assets/img/icon/toolbar/icon_row_edit.png')" @click="openPop(row, item.key,$event)">
                              </div>
                            </div>
                          </div> 
                          <div v-if="row.mainTain===1&&row[item.key]!=null">
                            <span>{{formartValue(row,item)}}</span>
                          </div> 
                          <div v-if="row.mainTain===0">
                            <div class="label-img"  @click="activeTd(index, item.key,)">                        
                              <div :class="['label-img-inside', popList[index][item.key] ? 'label-img-active' : '']">
                                <span>{{formartValue(row,item)}}</span>
                                <img v-if="popList[index][item.key]" :src="require('../../assets/img/icon/toolbar/icon_row_edit.png')" @click="openPop(row, item.key,$event)">
                              </div>
                            </div>
                          </div> 
                      </template>
                   </template>
                      <template v-if="row.execDate !=dataStr +' 00:00:00'">
                        <template v-if="item.key=='loadAirAtTimeStart'&&row[item.key]!=null">
                            <div v-if="row.loadAirAtTimeStartUser&&row.loadAirAtTimeStartUser=='1'">
                              <span>{{formartValue(row,item)}}</span>
                            </div>
                            <div v-if="row.loadAirAtTimeStartUser&&row.loadAirAtTimeStartUser=='0'">
                              <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                            </div>
                        </template>
                        <template v-if="item.key=='loadAirAtTimeEnd'&&row[item.key]!=null">
                            <div v-if="row.loadAirAtTimeEndUser&&row.loadAirAtTimeEndUser=='1'">
                              <span>{{formartValue(row,item)}}</span>
                            </div>
                            <div v-if="row.loadAirAtTimeEndUser&&row.loadAirAtTimeEndUser=='0'">
                              <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                            </div>
                        </template>
                        <template v-if="item.key=='transportAtTimeStart'&&row[item.key]!=null">
                            <div v-if="row.transportAtTimeStartUser&&row.transportAtTimeStartUser=='1'">
                              <span>{{formartValue(row,item)}}</span>
                            </div>
                            <div v-if="row.transportAtTimeStartUser&&row.transportAtTimeStartUser=='0'">
                              <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                            </div>
                        </template>
                        <template v-if="item.key=='transportAtTimeEnd'&&row[item.key]!=null">
                            <div v-if="row.transportAtTimeEndUser&&row.transportAtTimeEndUser=='1'">
                              <span>{{formartValue(row,item)}}</span>
                            </div>
                            <div v-if="row.transportAtTimeEndUser&&row.transportAtTimeEndUser=='0'">
                              <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                            </div>
                        </template>
                        <template v-if="item.key=='unLoadCarAtTime'&&row[item.key]!=null">
                            <div v-if="row.unLoadCarAtTimeUser&&row.unLoadCarAtTimeUser=='1'">
                              <span>{{formartValue(row,item)}}</span>
                            </div>
                            <div v-if="row.unLoadCarAtTimeUser&&row.unLoadCarAtTimeUser=='0'">
                              <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                            </div>
                         </template> 
                        <template v-if="item.key=='selfAtTime'&&row[item.key]!=null">
                            <div v-if="row.selfAtTimeUser&&row.selfAtTimeUser=='1'">
                              <span>{{formartValue(row,item)}}</span>
                            </div>
                            <div v-if="row.selfAtTimeUser&&row.selfAtTimeUser=='0'">
                              <span style="color:#899DB2">{{formartValue(row,item)}}</span>
                            </div>
                        </template>
                        <!-- <template v-else>
                          <span>{{formartValue(row,item)}}</span>
                        </template> -->
                      </template>
              </template>
           </tables>
           <div class="table-title">
                <div class="left">
                    <span class="label">查询结果</span>
                    <span class="info">共{{this.pageData.total}}条</span>              
                </div>
                <div class="right">
                    <pagination v-model="pageData.num" :size="pageData.size" :options="pageData.options" :total="pageData.total" @changeData="queryDataReq"></pagination>
                    <toolbar :permissions="permissions" @openExport="openExport" @openDetail="openDetail" style="font-weight:bolder"></toolbar>                
                </div>             
           </div>
       </div>
        <!-- 编辑时间小弹窗 -->
        <my-dialog :visible="popData.visible" :header="false" :footer="false" :position="'center'" :height="187" :width="232" class="td-popover" @handleClose="closeEditPop"
        :dialogClass="'pop-class'" :top="pop.top" :left="pop.left">
            <div class="td-popover counter-popover">
              <el-main>
                <el-form :model="editData" :label-position="'top'" ref="ruleForm" size="mini" class="edit-form">
                  <div class="pop-aircraft" style="margin-top:12px">进港航班时间节点编辑</div>
                  <el-time-picker  v-model="editData[editData.key]"  :picker-options="{ selectableRange:'00:00:00 - 23:59:59'}"  placeholder="选择时间" format="HH:mm" value-format="HH:mm" style="margin-top:10px" >
                  </el-time-picker> 
                </el-form>
              </el-main>
              <el-footer>
                <div class="footer-all" style="margin-top:3px">
                  <button type="info" @click="closeEditPop">取消</button>
                  <button type="primary" @click="handleSubmit()">确定</button>
                </div>
              </el-footer>
            </div>
        </my-dialog>
        <!-- 按行李查看详情表格 -->
        <inComingLug :visible="showTable.visible" :row="showTable.row" @handleClose="closeDialog" :pRow="pRow"></inComingLug>
        <confirm-tip :visible="exportData.visible" :data="exportData.data"  @handleSubmit="handleExport" @handleClose="handleExportClose" :info="exportInfo" @customBeforExport="customBeforExport"></confirm-tip> 
    </div>
</template>

<script>
import QueryRow from '@view/QueryRow/QueryRow'
import Pagination from '@view/Pagination/Pagination'
import Toolbar from '@view/Toolbar/Toolbar'
import Tables from '@view/Table/Table'
import tableMixin from '@mixin/tableMixin'
import ConfirmTip from '@/views/home/common/ConfirmTip'
import formMixin from '@mixin/formMixin'
import InputTag from '@view/InputTag/InputTag'
import inComingLug from './Detail/IncomingLug'
import { queryAll, download } from '@/util/base'
import { dateFormat } from '@/util/util'
import _ from 'lodash'

export default {
    components:{
        QueryRow,
        Pagination,
        Toolbar,
        Tables,
        ConfirmTip,
      //  InputTag,
        inComingLug
    },
    mixins:[tableMixin,formMixin],
    props:['selectKey'],
    data(){
        return {
            // 请求路径
            queryUrl: '/integrated/luggageSecurity/queryFlightInfo', // /',pageQuery
            exportUrl: '/integrated/luggageSecurity/exportExcel',
            updateUrl:'/integrated/luggageSecurity/editLugNodeInfo',
            // 菜单对应按钮权限
            permissions: {
                insert: false,
                export: true,
                detail:false,
                remove: false, 
                update: true 
            },
            pageData: {
                num: 1,
                size: 10,
                total: 0
            },
            exportInfo: '是否确认导出0条数据？', 
            today:null,
            showTable:{
              row:null,
              visible:false,
              url:'/integrated/luggageSecurity/queryLugByFlightId'
            }, 
            pRow: null,
            queryParam: [
                    {
                        key: 'flightNo',
                        label: '进港航班号',
                        type: 'input',
                        width: 214,
                        toUpper: true
                    }, 
                    {
                        key: 'flightDate',
                        label: '航班日期',
                        type: 'elDate',
                        dateType: 'date',
                        format: 'yyyy-MM-dd',
                        valueFormat: 'yyyy-MM-dd',
                        width: 214,
                        defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                        clearable: false,
                    }, 
            ],
            tableData: {
                    height: 600,
                    multSelection: [],
                    loading: false,
                    key: 'dynamicFlightId',
                    column:[
                        //left                  
                        [
                            {key:'flightNo',label:'进港航班号',width:100,colClass: 'bold-underline',clickMethod: this.showLugDetail,type:'slot'},
                            {key:'execDate',label:'航班日期',width:150,format: [0, 10]},
                            {key:'routeCn',label:'航线',width:150},
                        ],
                        //center
                        [
                            {key:'ata',label:'计划/预计/实际降落时间',width:180,type:'slot'},
                            {key:'beforeLoadAirNum',label:'前站装机数',width:80},
                            {key:'airNodeNum',label:'卸机数',width:80},
                            {key:'truckNodeNum',label:'卸车数',width:80},
                            {key:'airCostTime',label:'卸机耗时',width:80},
                            {key:'unCarCostTime',label:'卸车耗时',width:80},
                            {key:'loadAirEtTimeStart',label:'预计卸机开始时间',width:200,format: [11, 5]},
                            {key:'loadAirAtTimeStart',label:'实际卸机开始时间',width:200,type:'slot'},
                            {key:'loadAirEtTimeEnd',label:'预计卸机结束时间',width:200,format: [11, 5]},
                            {key:'loadAirAtTimeEnd',label:'实际卸机结束时间',width:200,type:'slot'},
                            {key:'transportEtTimeStart',label:'预计开始运输时间',width:200,format: [11, 5]},
                            {key:'transportAtTimeStart',label:'实际开始运输时间',width:200,type:'slot'},
                            {key:'transportEtTimeEnd',label:'预计运输结束时间',width:200,format: [11, 5]},
                            {key:'transportAtTimeEnd',label:'实际运输结束时间',width:200,type:'slot'},
                            {key:'unLoadCarEtTime',label:'预计卸车上转盘时间',width:200,format: [11, 5]},
                            {key:'unLoadCarAtTime',label:'实际卸车上转盘时间',width:200,type:'slot'},
                            {key:'selfEtTime',label:'预计提取核验时间',width:200,format: [11, 5]},
                            {key:'selfAtTime',label:'实际提取核验时间',width:200,type:'slot'},
                        ],
                        //right
                        [
                            {label: '操作', width: 80,type:'slot'} 
                        ]                    
                    ],
                    data:[]
            },
            popList: [],
            editData: {},
            popData: {
              visible: false
            },
            pop: {
              left: 0,
              top: 0
            },
            dataStr:null
        }
    },
    mounted() {
        // this.tableData.data = [
        //     {OutFlightNo:'111ff',flightDate:'2019-09-01',flightLine:'AAAAA',flightTime:'09:33',ladingTotail:'22',trafficNum:'22'}
        // ]
      this.queryParam.forEach(item => {
        if (item.key == 'flightDate') {
          let today = new Date()
          let dateStr = `${today.getFullYear()}-${this.addZero(today.getMonth() + 1)}-${this.addZero(today.getDate())}`
          item.value = dateStr;
          this.dataStr = dateStr;
          this.$set(this.queryData, item.key, item.value)
        }
      })
      this.queryDataReq()
    },
    methods: {
        customQueryBefore () {
          this.$set(this.queryData, 'inOutFlag', this.selectKey)
        },
        customBeforExport() {
            this.exportInfo = `是否确认导出 ${this.pageData.total} 条数据？`
            return true
        },
        //导出
        handleExport (total) {
          let sum = this.pageData ? this.pageData.total : 1
          if(sum){
            download(this.exportUrl, this.queryData, sum).then(response => {
              let today = new Date()
              let dateStr = `${today.getFullYear()}${this.addZero(today.getMonth() + 1)}${this.addZero(today.getDate())}${this.addZero(today.getHours())}${this.addZero(today.getMinutes())}${this.addZero(today.getSeconds())}`
              this.today = dateStr
              console.log(this.today)
              this.downFile(response, `行李保障信息录入-进港 ${this.today}`)
              this.$msg.success({
                info: '导出成功 !'
              })
              this.handleExportClose()
            })
          }else {
            this.$msg.error({
              info: '导出失败，当前导出结果为空 !'
            })
          }
        },
        customAfterQuery () {
          this.closeAllPop()
        },
        //添加时间00
        addZero (value) {
          if (value < 10) {
            return `0${value}`
          } else {
            return value
          }
        },
        activeTd(index,key){
          this.closeAllPop()
          this.popList[index][key] = true
          this.$set(this.popList[index], key, this.popList[index][key]) 
        },
         // 并清空弹框
        closeAllPop() {
          this.$set(this, 'popList', [])
          for(let i = 0; i<this.tableData.data.length; i++) {
            this.popList.push({loadAirAtTimeStart: false, loadAirAtTimeEnd: false, transportAtTimeStart: false, transportAtTimeEnd: false,unLoadCarAtTime:false,selfAtTime:false})
          }

        },
        openPop(row, key, $event) {
          if ($event.clientY > 650) {
            // 向上展示
            this.pop.top = $event.clientY - 187 - 30
          } else {
            // 向下展示
            this.pop.top = $event.clientY + 30
          }
          if ($event.clientX > 1686) {
            // 偏左展示
            this.pop.left = $event.clientX - 232
          } else {
            // 居中展示
            this.pop.left = $event.clientX - 232 / 2
          }
          this.popData.visible = true
          this.editData = {}
          this.editData = Object.assign({}, row)
          this.editData.key = key
        },
        closeEditPop() {
          this.popData.visible = false
          this.editData = {}
        },
         //过滤截取时间
        formartValue(row,item){
         // debugger
          let value = row[item.key]
          if(row[item.key]!=null){
          value = value.substring(11,16)
            return value
          }else{
            return value
          }
        },
        //拼接航班号
        flightNoAdd(row,item){
          let value
          if(row[item.key]!=null){
             value = row.airline+row[item.key]
             return value
          }else{
            return value
          }
        },
        //展示计划/预计/实际起飞时间
        showTime(row,item){
          let value = row[item.key]
          let value1 = row.eta
          let value2 =  row.sta
          if(value!=null){
              value = value.substring(11,16)
          }else{
            value = ' '
          }
          if(value1!=null){
            value1 = value1.substring(11,16)
          }else{
            value1 = ' '
          }
          if(value2!=null){
            value2 = value2.substring(11,16)
          }else{
            value2 = ' '
          }
           return value2 + '/' + value1 + '/' +value
        },
        //打开行李表格
       showLugDetail (row) {
         this.pRow = row;
          let idObj = {
              dynamicFlightId:row['dynamicFlightId'],
              flightDate:this.queryParam[1].value
          }
          
          let url = this.showTable.url;
          queryAll(url, idObj).then(res => {
            if (res.data.code == 0) {
              this.showTable.visible = true
             // let data = res.data.data 
               this.showTable.row = res.data.data
            //   this.showTable.row = _.assign(row, data)
            } else {
              this.$msg.error({
                info: '获取行李信息详情失败 !',
                tip: res.data.msg
              })
            }
          })
        },
        
        handleSubmit(){
          let data = this.editData
          for (let editItem of Object.keys(this.editData)) {
            if (editItem == this.editData.key) {
              if(this.editData[editItem].length<=5){
                  data[editItem] =this.queryParam[1].value +' '+ this.editData[editItem]+':00'
                }else{
                  data[editItem] = this.editData[editItem]
                }
            }
          }
          this.$set(data,'editFlag','flight')
          this.$delete(data,'key')
          queryAll(this.updateUrl, data).then(res => {
            if (res.data.code == 0) {
              this.$msg.success({
                  info: '保存成功 !'
                })
                this.popData.visible = false
              // if (this.hasOwnProperty('queryDataReq')) {
                this.queryDataReq()
              // }
            } else {
              this.$msg.error({
                info: '保存失败 !'
              })
              this.popData.visible = false
            }
          }).catch(err => {
            this.$msg.error({
              info: '请求异常 !'
            })
            this.popData.visible = false
          })
        },
        closeDialog(){
            this.showTable.visible = false
        }
    }
}
</script>

<style lang="scss" scoped>
 div.query-top > div.toolbar {
    height: 38px;
    align-self: flex-start;
 };
 div.query-top > div.toolbar > button {
    height: 100%;
    line-height: 100%;
 };
div.query-top >.toolbar > button:not(:last-child) {
    margin-right: 10px;
};
  .toolbar {
    height: 38px;
    align-self: flex-start;
    min-width: 0;
    .tool-button {
      display: inline-flex;
      padding: 0 20px;
      font-size: 14px;
      cursor: pointer;
    }
  }
    >div>.table {
    .table-header {
      .row_height_2 {
        $rowHeight: 66px;
        max-height: $rowHeight !important;
        height: $rowHeight !important;
        line-height: $rowHeight !important;
      }
    }
    .table-body {
      .center-table {
        table {
          margin-left: -1px;
        }
      }
      td {
        height: 50px
      }
    }
  }
  /deep/.left-table td {
  // height: 50px !important;
};
  /deep/.center-table td {
  // height: 50px !important;
};
  /deep/.right-table td {
  // height: 50px !important;
};

.label-img {
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  .label-img-inside {
    margin: 0 4px;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
    &.label-img-active {
      background-color: #EAF4FF;
      color: #3392FF;
    }
    img {
      cursor: pointer;
      margin-left: 12px;
    }
  }
} 
/deep/.pop-class {
  margin:0 !important;
}

</style>
<style lang="scss">
.lugManaContent{
  height: calc(100%);
  display: flex;
  flex-direction: column
}
</style>